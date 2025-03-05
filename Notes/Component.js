// Component represent a part of User Interface 
// Component describe a part of the user interface 
// They are reusable and can be nested into other components 


// There are two Types of component 

// 1)Stateless Functional Componenet

// They are simpply contain a javascript simple functions 

// 2) Stateful class Component 

// class extending Componennt class render methods Returning html ÷ 

// In functional compoenents it take properties as props and it returns a html 

// In Class Components it also take properties as props and it return a html and it does also have power to maintain it interal state 

// One thing very important regarding to import and export

// if you write export along with funnction then you have to import in other file with exact name inside a curly brace {}

// if you write in the end of the  file by writing export default then you can write it with any other name during import times 

// WHAT IS AN JSX ??

// JAVASCRIPT XML - EXTENSION TO THE JAVASCRIPT LANGUAGE SYNTAX 
// WRITE A XML - LIKE CODE FOR ELEMENTS AND COMPONENTS 
// JSX TAGS HAVE A TAG NAME ATTRIBUTES AND CHILDREN  
// JSX IS NOT A NECESSITY TO WRITE REACT APPLICATIONS 
// JSX MAKE YOUR REACT CODE SIMPLER AND AGENT 
// JSX ULITMATELY TRANSPILES TO PURE JAVASCRIPT WHICH IS UNDERSTOOD BY THE BROWSERS


// PROPS ARE IMMUTABLE 

// WHAT ARE PROPS 
// WITH PROPS PARENT COMPONENT CAN CONTROL HOW CHILD COMPONENT SHOULD LOOKS LIKE 
// ANYTHING CAN BE PASSED AS AN PROPS : SINGLE VALUE , ARRAYS , OBJECTS , FUNCTIONS , EVEN OTHER COMPONENTS
// PROPS ARE IMMUTABLE THEY ARE READ-ONLY THIS IS ONE OF THE STRICT RULES
//IF YOU NEED TO MUTATE PROPS THEN YOU ACTUALLY NEED STATE

// WHY NOT TO MUTATE PROPS
//MUTATING PROPS WOULD AFFECT PARENTS CREATING SIDE EFFECTS (NOT PURE)
//COMPONENTS HAVE TO BE PURE IN TERMS OF PROPS AND STATE
// THIS ALLOWS REACT TO OPTIMIZE APP AND AVOID BUGS MAKE APPS PREDICTABLE

