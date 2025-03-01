import './App.css';
import React from 'react';

// const pizzaData = [
//   {
//     name: "Focaccia",
//     ingredients: "Bread with italian olive oil and rosemary",
//     price: 6,
//     photoName: "pizzas/focaccia.jpg",
//     soldOut: false,
//   },
//   {
//     name: "Pizza Margherita",
//     ingredients: "Tomato and mozarella",
//     price: 10,
//     photoName: "pizzas/margherita.jpg",
//     soldOut: false,
//   },
//   {
//     name: "Pizza Spinaci",
//     ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
//     price: 12,
//     photoName: "pizzas/spinaci.jpg",
//     soldOut: false,
//   },
//   {
//     name: "Pizza Funghi",
//     ingredients: "Tomato, mozarella, mushrooms, and onion",
//     price: 12,
//     photoName: "pizzas/funghi.jpg",
//     soldOut: false,
//   },
//   {
//     name: "Pizza Salamino",
//     ingredients: "Tomato, mozarella, and pepperoni",
//     price: 15,
//     photoName: "pizzas/salamino.jpg",
//     soldOut: true,
//   },
//   {
//     name: "Pizza Prosciutto",
//     ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
//     price: 18,
//     photoName: "pizzas/prosciutto.jpg",
//     soldOut: false,
//   },
// ];



function App() {
  return (
    <div>
    <Header/>
      <h1>Hello World</h1>
      <div style={{textDecorationColor:'blue'}}>Testing</div>
      <Pizza/>
      <Menu/>
      <Footer/>
    </div>
    
  );
}

const Pizza=()=>{
  return(
    <div>
      <h1>Pizza</h1>
    </div>
  ) 
}

const Menu=()=>{
  return(
    <div>
      <h1>Menu</h1>
    </div>
  )
}

const Header=()=>{
  return(
    <div>
    <img src='./../public/pizza.jpg' alt='pizza'/>
      <h1>Fast React Pizza Company</h1>
    </div>
  )
}

const Footer=()=>{
  return React.createElement('footer',null,"We are Currently Open");
}

export default App;
