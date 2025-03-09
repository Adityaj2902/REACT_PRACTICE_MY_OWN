import React,{use, useState , useRef } from "react";



function Useref() {
     const [counter,setCounter] = useState(0);

     let val=useRef(0);

     function handleCounter(){
        setCounter(counter+1);
    }

    function handCounterRef(){
        val.current=val.current+1;
        console.log(val.current);
    }

    return (
        <div>
            <h1>{counter}</h1>
            <h1>{val.current}</h1>
            <button onClick={handleCounter}>Click on me </button>
            <button onClick={handCounterRef}>Ref Wala Click </button>
        </div>
    )
}

export default Useref
