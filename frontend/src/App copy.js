import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@material-tailwind/react";
function App() {
  //const [data, setData] = useState('');

  //useEffect(() => {
  //  axios.get('http://localhost:5000/api/data')
  //    .then(response => {
  //      setData(response.data.message);
  //    })
  //    .catch(error => {
  //      console.error('エラーが発生しました:', error);
  //    });
  //}, []);

  return (
    <div className="flex justify-center items-center h-screen bg-blue-500">
      <h1 className="text-4xl text-white font-bold">
        Hello, Tailwind CSS!
      </h1>
    </div>
  );
}


export default App;
