import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);

  const testDownload = async () => {
    const imageUrl = "https://res.cloudinary.com/drmaunxsy/raw/upload/v1746515017/0b3ce99faeda636f66274d1f82ac4146_Abnormal_copy_ivax6w.dicom";
    const expectedSizeBytes = 9.8441632 * 1024 * 1024; // Expected size in bytes
    const start = Date.now();
    const response = await fetch(imageUrl, { cache: "no-store" });

    if (!response.ok) {
        console.error("Failed to fetch image:", response.status);
        return;
    }

    const contentLengthHeader = response.headers.get('Content-Length');
    if (!contentLengthHeader) {
        console.warn("Content-Length header not found. Cannot verify full download reliably.");
    } else {
        const contentLength = parseInt(contentLengthHeader, 10);
        console.log("Content-Length (bytes):", contentLength);
        console.log("Expected Size (bytes):", expectedSizeBytes);
        console.log(contentLength - expectedSizeBytes);
    }

    const blobData = await response.blob(); 
    const actualSizeBytes = blobData.size;
    console.log("Actual Downloaded Size (bytes):", actualSizeBytes);

    if (contentLengthHeader && actualSizeBytes !== parseInt(contentLengthHeader, 10)) {
        console.warn("Partial download likely! Downloaded size does not match Content-Length.");
        return; // Or handle the partial download as needed
    }

    const duration = (Date.now() - start) / 1000;
    console.log("Start:", start);
    console.log("Duration:", duration);
    console.log("End:", Date.now());
    console.log("Image URL:", imageUrl);
    console.log("Download time:", duration);

    const sizeMB = actualSizeBytes / (1024 * 1024); // Use actual downloaded size
    const speed = (sizeMB * 8) / duration;
    setDownloadSpeed(speed.toFixed(2));
};

  const testUpload = async () => {
    const sizeMB = 200;
    const blob = new Blob([new Uint8Array(sizeMB * 1024 * 1024)]);
    const formData = new FormData();
    formData.append("file", blob, "upload.dat");

    const response = await axios.post("http://localhost:8000/upload-speed", formData);
    setUploadSpeed(response.data.upload_speed_mbps.toFixed(2));
  };

  return (
    <div className="App">
      <h1>Internet Speed Test</h1>
      <button onClick={testDownload}>Test Download Speed</button>
      {downloadSpeed && <p>Download: {downloadSpeed} Mbps</p>}
      <button onClick={testUpload}>Test Upload Speed</button>
      {uploadSpeed && <p>Upload: {uploadSpeed} Mbps</p>}
    </div>
  );
};

export default App;
