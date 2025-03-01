import React ,{Component} from 'react';


class Welcome extends Component{
    render(){
        return <h1>Class Component {this.props.name} aka {this.props.heroname} {this.props.children}</h1>
    }
}

export default Welcome;