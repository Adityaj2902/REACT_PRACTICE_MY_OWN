import { useEffect, useReducer } from 'react'
import Header from './components/Header'
import Main from './components/Main'

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

  const [state, dispatch] = useReducer(reducer, intialState)

  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ ...state, type: 'dataRecieved', payload: data }))
      .catch((err) => dispatch({...state,type:'dataFailed',payload:err}))
  })

  return (
    <div className='app'>
      <Header />
      <Main>
        <p>1/15</p>
        <p>Question ?</p>
      </Main>
    </div>
  );
}

export default App;
