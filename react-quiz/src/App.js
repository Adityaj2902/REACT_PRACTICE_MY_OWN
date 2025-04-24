import { useEffect, useReducer } from 'react'
import Header from './components/Header'
import Loader from './components/Loader'
import Error from './components/Error'
import Main from './components/Main'
import StartScreen from './components/StartScreen'
import Question from './components/Question'
const intialState = {
  questions: [],


  //'loading','error,'ready','active','finished'

  status: "loading",
}

function reducer(state, action) {
  switch (action.type) {
    case 'dataRecieved':
      return {
        ...state,
        questions: action.payload,
        status:"ready"
      }
      case 'dataFailed':
        return {...state,status:"error"}
    default: throw new Error('Action Unknown ')
  }
}

function App() {

  const [{questions,status}, dispatch] = useReducer(reducer, intialState)

  const numQuestions=questions.length

  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({type: 'dataRecieved', payload: data }))
      .catch((err) => dispatch({type:'dataFailed',payload:err}))
  },[])

  return (
    <div className='app'>
      <Header />
      <Main> 
      {status === "loading" && <Loader/>}
      {status === "error" && <Error/>}
      {status === "ready" && <StartScreen numQuestions={numQuestions}/>}
      {status === "active" && <Question/>}
      </Main>
    </div>
  );
}

export default App;
