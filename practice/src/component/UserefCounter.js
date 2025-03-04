import { useRef, useState } from "react";

function Counter() {
  const countRef = useRef(0);
  const [stateCount, setStateCount] = useState(0);

  console.log(countRef);

  const incrementRef = () => {
    countRef.current += 1;
    console.log("Ref Count:", countRef.current);
  };

  const incrementState = () => {
    setStateCount((prev) => prev + 1);
  };

  return (
    <div>
      <p>State Count: {stateCount}</p>
      <button onClick={incrementState}>Increment State</button>
      
      <p>Ref Count: {countRef.current}</p>
      <button onClick={incrementRef}>Increment Ref</button>
    </div>
  );
}


export default Counter;