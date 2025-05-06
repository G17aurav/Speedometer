import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);

  const testDownload = async () => {
    const imageUrl = "https://speed.hetzner.de/10MB.bin"; // large file
    const start = Date.now();
    await fetch(imageUrl, { cache: "no-store" });
    const duration = (Date.now() - start) / 1000;
    const sizeMB = 10;
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
