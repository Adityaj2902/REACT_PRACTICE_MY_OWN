import react from 'react';

const updatedContent=OriginalComponent=>{
    class NewComponent extends react.Component{
        constructor(props) {
            super(props)
    
            this.state = {
                count: 0
            }
        }
    
        incrementCount=()=>{
            this.setState(prevState => {
                return {count: prevState.count + 1}
            })
        }
        render(){
            return <OriginalComponent count={this.state.count} incrementCount={this.incrementCount} />
        }
    }
    return NewComponent;
}

export default updatedContent;