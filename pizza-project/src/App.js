import './App.css';
import React from 'react';

const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];

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

  const pizzasNum= pizzaData.length;
  return (
    <main className="menu">
      <h2>Menu</h2>
      <div>
      {pizzasNum >0  ? (
        <ul className='pizzas'>  
        {/* we cant be able to use if else here because in jsx inside the curly braces we can only write something that a return a new value  */}
          {pizzaData.map((pizza) => {
            return <Pizza pizzaobj={pizza} key={pizza.name} />;
          })}
        </ul>
      ):<p> We Are Still Working on Our Menu . Please Come Back Later </p>}
       
      </div>
    </main>
  );
}

const Pizza = (props) => {
  return (
    <div className='pizza'>
      <img src={props.pizzaobj.photoName} alt={props.name} />
      <li>
        <h3>{props.pizzaobj.name}</h3>
        <p>{props.pizzaobj.ingredients}</p>
        <span>{props.pizzaobj.price}</span>
      </li>
    </div>
  );
}

const Header = () => {
  return (
    <header className='header'>
      <h1>Fast React Pizza Company</h1>
    </header>
  );
}

const Footer = () => {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour > openHour && hour < closeHour;

  console.log(`Current hour: ${hour}`);
  console.log(`Is open: ${isOpen}`);

  return (
    <footer className='footer'>
      {isOpen ? (
        <div className="order">
          <p>
            We are Open Until {closeHour}:00 PM Come Visit us or Order Us Online
          </p>
          <button className='btn'>Order Now</button>
        </div>
      ) : (
        <p>Sorry, we are closed now. Please visit us between {openHour}:00 and {closeHour}:00.</p>
      )}
    </footer>
  );
}

export default App;