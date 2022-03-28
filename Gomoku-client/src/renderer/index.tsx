import { render } from 'react-dom';
import App from './App';
// import 'fomantic-ui-css/semantic.css';

render(<App />, document.getElementById('root'));

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.myPing();
