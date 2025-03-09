import react,{createContext} from 'react'
import {useState} from 'react'
// import ChildA from './component/childA'
// import UseRef from './component/Useref'
// import UseMemoOperation from './component/useMemo';
import UseCallbackOperation from './component/Callback';
import ChildMemo from './component/ChildMemo';

const UserContext=createContext();

const App=()=> {
   
  const [user,setUser]=useState({name:'Aditya'})

  
  return (
      <>
      <UseCallbackOperation/>
      </>
  )
}

export default App

export {UserContext}