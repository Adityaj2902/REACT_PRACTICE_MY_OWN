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
    <div className='container'>
      <Header />
      <Menu />
      <Footer />
    </div>

  );
}

const Menu = () => {
  return (
    <main className="menu">
      <h2>Menu</h2>
      <Pizza name="Pizza Spinaci"  ingredients="Tomato , mozarella , spinach and ricotta cheese" photoName="./../pizzas/spinaci.jpg"/>
    </main>
  )
}

const Pizza = (props) => {
  return (
    <div>
      <img src={props.photoName}alt='pizza' />
      <h3>{props.name}</h3>
      <p>{props.ingredients} </p>
    </div>
  )
}



const Header = () => {
  return (
    <header className='header'>
      <h1>Fast React Pizza Company</h1>
    </header>
  )
}

const Footer = () => {
  const hour=new Date().getHours();

  const openHour=12; 
  const closeHour=22;
  
  if(hour<openHour || hour>=closeHour){
    return <footer className='footer'>Sorry, we are closed</footer>
  }
  else{
    return <footer className='footer'>We are open</footer>
  }



  
}

export default App;
