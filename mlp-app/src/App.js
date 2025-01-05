import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Placeholder App</h1>
        <p>This is a React-based placeholder app for your CI/CD pipeline.</p>
      </header>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export default App;
