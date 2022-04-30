import axios from 'axios';

export default class ModelService {
  Config: any;

  // HTTP GET request to start the game
  async startPlay(params = {}) {
    console.log('Calling service to start the game');
    const config = {
      ...this.Config,
      ...{
        method: 'get',
        url: 'http://localhost:5000/start',
        params,
      },
    };
    return axios(config);
  }

  // HTTP GET request to get AI model actions and update the game board
  async getAction(params = {}) {
    console.log('Calling service for AI model actions');
    const config = {
      ...this.Config,
      ...{
        method: 'get',
        url: 'http://127.0.0.1:5000/action',
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
