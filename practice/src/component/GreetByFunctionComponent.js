import React from "react";

// function Greet(){
//     return <h1> Hello Vishwas </h1>
// }

const Greet=(props)=>{

return (
 <>
<h1>Hello {props.name} !!! Also Know As {props.heroname}</h1>
{props.children}
</>
)
}

export default Greet;



