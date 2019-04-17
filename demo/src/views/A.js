import React, {useState, useEffect} from 'react';
import {useKeepAliveEffect} from '../../../es';

function Test() {
  const [index, setIndex] = useState(0);
  useKeepAliveEffect(() => {
    console.log('activated', index);
    const i = 0;

    return () => {
      console.log('unactivated', index, i);
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
