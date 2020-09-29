import React from 'react';
import '../styles/App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SecondPage from './SecondPage';
import Fibonacci from '../components/Fibonacci';

function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>Welcome to the k8s world</h1>
          <Link to='/'>Home</Link>
          <Link to='/other'>2nd Page</Link>
        </header>
        <div>
          <Route exact path='/' component={Fibonacci} />
          <Route path='/other' component={SecondPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
