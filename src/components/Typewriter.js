import React, { useState, useEffect } from 'react';

const Typewriter = ({ texts, delay = 2000 }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length); // Loop back to 0 when reaching the end of the texts array
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 200 : subIndex === texts[index].length ? 500 : 400);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);

    return () => clearTimeout(timeout2);
  }, [blink]);

  return (
    <h1>
      {`${texts[index].substring(0, subIndex)}${subIndex+1!==texts[index].length? blink ? '|' : ' ' : ''}`}
    </h1>
  );
};

export default Typewriter;