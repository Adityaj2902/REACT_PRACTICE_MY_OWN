import './App.css';
import Greet from  './component/GreetByFunctionComponent'
import Welcome from './component/GreetByClassComponent'
import Message from './component/Message';
import Counter from './component/Counter';
import ClickCounter from './component/ClickCounter';
import HoverCounter from './component/HoverCounter';
import UserefCounter from './component/UserefCounter';
import ClassCounter from './component/ClassCouter';
function App() {
  return (
    <div className="App">
   
    {/* FUNCTIONAL COMPONENTS SECTION  */}

      <Greet name="Vivek" heroname="Brahman">
        <p>Hello To the World of Children Concept</p> 
        {/* to look here it can be able to get this <P></P> tag using special keyword knows as "children" */}
      </Greet>
      <Greet name="Ankit" heroname="Badmash"/>
      <Greet name="Aditya" heroname="Radhe Radhe"/>

    {/* CLASS COMPONENTS SECTION  */}

      <Welcome name="Vineet" heroname="TopiBazz"/>
      <Welcome name="Dipin" heroname="padhaku"/>
      <Welcome name="Ajitesh" heroname="Serious">
        <button text="Click Me "></button>
      </Welcome>

      <Message/>
      <Counter/>

    <ClickCounter/>
    <HoverCounter/>
    <UserefCounter/>

    </div>
  );
}

export default App;

// how is decrorator deifferenet from HOC
// What are similar libray that can you use any other way 
//LIFE CYCLE WALA VIDEO PURA REFER KR LO 
// 