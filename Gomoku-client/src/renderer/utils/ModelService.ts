import axios from 'axios';

export default class ModelService {
  Config: any;

  // HTTP GET request to get image detection results
  async getImage(params = {}) {
    console.log('Calling service for image detection results');
    const config = {
      ...this.Config,
      ...{
        method: 'get',
        url: 'http://127.0.0.1:5000/get',
        params,
      },
    };
    return axios(config);
  }

  // HTTP POST request to post annnotation changes to backend
  async postmodel(data = {}) {
    console.log('Calling service for post model file path');
    const config = {
      ...this.Config,
      ...{
        method: 'post',
        url: 'http://127.0.0.1:5000/upload',
        data,
      },
    };
    return axios(config);
  }

  // HTTP POST request for user signup
  async postSignup(data) {
    console.log('Calling service signup');
    const config = {
      ...this.Config,
      ...{
        method: 'post',
        url: 'http://127.0.0.1:5000/signup',
        data,
      },
    };
    return axios(config);
  }

  // HTTP POST request for user login
  async postLogin(data) {
    console.log('Calling service login');
    const config = {
      ...this.Config,
      ...{
        method: 'post',
        url: 'http://127.0.0.1:5000/upload',
        data,
      },
    };
    return axios(config);
  }
}
