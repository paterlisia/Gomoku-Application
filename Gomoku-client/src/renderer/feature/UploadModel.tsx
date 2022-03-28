import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Upload, Button } from 'antd';

export default function UploadModel() {
  const [antPics, setAntPics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);

  const handleAnt = (e) => {
    console.log(e.file.originFileObj);
    setAntPics(e.file.originFileObj);
  };

  // TODO: POST here
  const sendAnt = async (e) => {
    setLoading(true);
    console.log('uploading...');
  };

  return (
    <div style={{ width: 256 }}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          Upload your model
          <Upload onChange={handleAnt}>
            <Button>Select file</Button>
          </Upload>
          <Button onClick={sendAnt}>Submit</Button>
          <ul>
            {urls.map((url, index) => {
              return (
                <li key={index}>
                  <a href={url}>{url}</a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
