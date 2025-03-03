import react from 'react';

const updatedContent=OriginalComponent=>{
    class NewComponent extends react.Component{
        render(){
            return <OriginalComponent name="Vishwas" />
        }
    }
    return NewComponent;
}

export default updatedContent;