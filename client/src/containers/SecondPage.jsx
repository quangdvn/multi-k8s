import React from 'react';
import { Link } from 'react-router-dom';

const SecondPage = () => {
  return (
    <div>
      Im in 2nd space
      <Link to='/'>Back home</Link>
    </div>
  );
};

export default SecondPage;
