document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);
    console.log('Form data ready to be sent:', formData); 

    try {
        const response = await fetch('http://localhost:3001/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        console.log('Response from server:', result); 

        if (response.ok) {
            displayResult(result);
        } else {
            throw new Error(result.message || 'Error uploading image');
        }
    } catch (error) {
        alert('Error uploading image: ' + error.message);
        console.error('Error details:', error); 
    }
});

function formatDate(timestamp) {
    if (!timestamp) return 'Information Unavailable';
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    return date.toISOString().replace('T', ' ').split('.')[0]; // Format as 'YYYY-MM-DD HH:mm:ss'
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    // Parse the metadata
    const metadata = result.metadata || {};
    const tags = metadata.tags ? JSON.parse(metadata.tags) : {};

    // Extract metadata values or use default if unavailable
    const cameraMake = tags.Make || "Information Unavailable";
    const cameraModel = tags.Model || "Information Unavailable";
    const dateTime = tags.DateTimeOriginal ? formatDate(tags.DateTimeOriginal) : "Information Unavailable";

    // Display the classification and metadata
    resultDiv.innerHTML = `
        <h2>Upload Result</h2>
        <p><strong>Classification:</strong> ${result.classification}</p>
        <div class="metadata">
            <h2>Metadata:</h2>
            <ul>
                <li><strong>Camera Make:</strong> ${cameraMake}</li>
                <li><strong>Camera Model:</strong> ${cameraModel}</li>
                <li><strong>Date & Time:</strong> ${dateTime}</li>
                <li><strong>Tags:</strong> ${JSON.stringify(tags, null, 2)}</li>
            </ul>
        </div>
        <div class="metadata-info">
            <h2>Metadata Information</h2>
            <p><strong>Camera Make:</strong> The brand of the camera that took the image.</p>
            <p><strong>Camera Model:</strong> The model of the camera that took the image.</p>
            <p><strong>Date & Time:</strong> The time the image was originally captured. (Format: YYYY-MM-DD HH:mm:ss)</p>
            <p><strong>Tags:</strong> These are descriptors associated with the image for classification.</p>
        </div>
    `;
}
