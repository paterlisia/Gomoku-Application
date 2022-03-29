import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Upload, Button, message } from 'antd';

// console output in the chrome
// import log from 'electron-log';
// service to call api
import ModelService from '../utils/ModelService';

export default function UploadModel() {
  const re = /(?:\.([^.]+))?$/; // regression for match extension
  const [modelsList, setModelsList] = useState([]);
  const [loading, setLoading] = useState(false);
  // model1 and model2 hooks
  const [model1, setModel1] = useState('');
  const [model2, setModel2] = useState('');

  // upload message notification
  const success = () => {
    message.success('Successfully upload your models!');
  };

  const error = () => {
    message.error('Upload failed.');
  };

  const warning = () => {
    message.warning(
      'Invalid model, please upload file with exstension of pth or model'
    );
  };

  // handle upload models with setting hooks
  const handleUpload1 = (e) => {
    console.log(e.file.originFileObj);
    if (e.file.originFileObj !== null) {
      const ext = e.file.originFileObj.name.split('.').pop();
      console.log(ext);
      if (ext === 'pth' || ext === 'model') {
        setModel1(e.file.originFileObj.name);
      } else {
        warning();
      }
    }
  };

  const handleUpload2 = (e) => {
    console.log(e.file.originFileObj);console.log(e.file.originFileObj);
    if (e.file.originFileObj !== null) {
      const ext = e.file.originFileObj.name.split('.').pop();
      if (ext === 'pth' || ext === 'model') {
        setModel2(e.file.originFileObj.name);
      } else {
        warning();
      }
    }
  };

  // TODO: POST here
  const postModel = async (e) => {
    setLoading(true);
    // call API to post model url
    const service = new ModelService();
    const rsp = service.postmodel({ model1, model2 });
    console.log('uploading...');

    rsp
      .then((response) => {
        const { res } = response.data;
        console.log('res:', res);
        if (res === 'success') {
          success();
        } else {
          error();
        }
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ width: 256 }}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          Upload your model
          <Upload onChange={handleUpload1}>
            <Button>Select your model</Button>
          </Upload>
          <Upload onChange={handleUpload2}>
            <Button>Select your model</Button>
          </Upload>
          <Button onClick={postModel}>Submit</Button>
          <ul>
            {modelsList.map((url, index) => {
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
