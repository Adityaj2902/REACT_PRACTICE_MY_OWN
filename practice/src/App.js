import './App.css';
import Greet from  './component/GreetByFunctionComponent'
import Welcome from './component/GreetByClassComponent'
import Message from './component/Message';
import Counter from './component/Counter';
import ClickCounter from './component/ClickCounter';
import HoverCounter from './component/HoverCounter';
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


    </div>
  );
}

export default App;
