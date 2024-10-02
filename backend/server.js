const express = require('express');
const multer = require('multer');
const fs = require('fs');
const exifParser = require('exif-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const serviceAccount = require('./imageguard-b77a9-firebase-adminsdk-f012h-8d36f8b7a1.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const port = 3001;

// Middleware for parsing JSON and enabling CORS
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static('public')); 

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Image upload
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const imageBuffer = fs.readFileSync(filePath);

        const parser = exifParser.create(imageBuffer);
        const metadata = parser.parse();

        console.log('Metadata before cleaning:', metadata);

        // Clean up metadata
        const cleanedMetadata = {};
        for (const key in metadata) {
            if (typeof metadata[key] !== 'function' && metadata[key] !== undefined) {
                if (typeof metadata[key] === 'object' && metadata[key] !== null) {
                    cleanedMetadata[key] = JSON.stringify(metadata[key]); // Convert objects to strings
                } else {
                    cleanedMetadata[key] = metadata[key];
                }
            }
        }

        
        const classification = classifyImage(cleanedMetadata);

        // Save metadata to Firestore
        await db.collection('images').add({
            classification,
            metadata: cleanedMetadata,
            uploadTime: new Date(),
        });

        // Return in JSON format
        res.json({
            message: 'Image uploaded and metadata saved successfully!',
            classification,
            metadata: cleanedMetadata,
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading image: ' + error.message });
    }
});

// Function to classify the image based on metadata
function classifyImage(metadata) {
    if (metadata.tags && Array.isArray(metadata.tags)) {
        if (metadata.tags.includes('AI')) {
            return 'AI Generated';
        } else if (metadata.tags.includes('Edited')) {
            return 'Edited';
        }
    }
    return 'Real';
}

//Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});