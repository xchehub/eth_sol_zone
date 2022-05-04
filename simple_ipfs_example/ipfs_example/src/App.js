import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { create } from 'ipfs-http-client';

const client = create('https://ipfs.infura.io:5001/api/v0/');

function App() {
  const [fileUrl, updateFileUrl] = useState('');
  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added =  await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      updateFileUrl(url);      
    } catch (error) {
      console.log('Error upload file: ', error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <h1>IPFS Example</h1>
      <input
        type="file"
        onChange={onChange}
      />
      {
        fileUrl && (
          <img src={fileUrl} width="600px"/>
        )
      }
    </div>
  );
}

export default App;
