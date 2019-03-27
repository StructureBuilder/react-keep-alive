import React, {useState} from 'react';
import {useKeepAliveEffect} from '../../../es';

function Test() {
  const [index, setIndex] = useState(0);
  useKeepAliveEffect(() => {
    console.log('activated');

    return () => {
      console.log('unactivated');
    };
  });
  return (
    <div>
      <div>This is a.</div>
      <button onClick={() => setIndex(index + 1)}>click me({index})</button>
    </div>
  );
}

export default Test;
