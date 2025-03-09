import { useCallback, useState } from "react"
import ChildMemo from "./ChildMemo";



function CallbackOperation() {
    
    const [counter,setCounter]=useState(0);

    const handleCounter = useCallback(()=>{
        setCounter(counter+1);
    }, [])

    return (
        <>
        <div>{counter}</div>
        <div>
            <button onClick={()=>setCounter(counter+1)}>Sortest Fuction Counter </button>
        </div>
        <div>
            {/* <ChildMemo buttonname="Ye child Wala button hai " handleClick={()=>setCounter(prev => prev + 1)}/> */}
            <ChildMemo buttonname="Ye child Wala button hai " handleClick={handleCounter}/>
        </div>

        </>
    )
}

export default CallbackOperation;

