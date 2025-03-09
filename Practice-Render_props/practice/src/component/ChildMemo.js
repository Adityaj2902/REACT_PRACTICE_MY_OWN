import React from "react"



const ChildMemo =React.memo((props) => {
    console.log("Child Component Rendered");
    return (
        <>
        <div>
            <h1>Child Component</h1>
            <button onClick={props.handleClick}>{props.buttonname}</button>
        </div>
        </>
    )
})

export default ChildMemo


