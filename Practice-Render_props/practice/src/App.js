import './App.css';
import {useState,createContext} from 'react';
// import {createContext} from 'react';
import ChildA from './component/childA';


const UserContext=createContext();

function App() {
  const [user,setUser]=useState({name:'Aditya'});
  return (
    <>

    
    <UserContext.Provider value={user}> 

    <ChildA/>
    <UserContext.Provider/>
       


    </>
  );
}

export default App;
