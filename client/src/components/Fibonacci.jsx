import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Fibonacci = () => {
  const [seenIndexes, setSeendIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [curIndex, setIndex] = useState('');

  const fetchValues = useCallback(async () => {
    const { data } = await axios.get('/api/values/current');
    setValues(data);
    console.log('current', data);
  }, []);

  const fetchIndexes = useCallback(async () => {
    const { data } = await axios.get('/api/values/all');
    setSeendIndexes(data);
    console.log('all', data);
  }, []);

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, [fetchIndexes, fetchValues]);

  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(', ');
  };

  const renderCalculatedValues = () => {
    const entries = [];
    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }
    return entries;
  };

  const handleChange = (event) => {
    setIndex(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('/api/values', { index: curIndex });
    setIndex('');
    fetchValues();
    fetchIndexes();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input value={curIndex} onChange={handleChange} />
        <button>Submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}
      <h3>Calculated Values</h3>
      {renderCalculatedValues()}
    </div>
  );
};

export default Fibonacci;
