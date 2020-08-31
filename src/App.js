import React from 'react';
import './App.css';
import Routes from './Components/Routes';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    
      <BrowserRouter>
        <div className="App">
          <Routes/>
        </div>
      </BrowserRouter>
  );
}

export default App;
