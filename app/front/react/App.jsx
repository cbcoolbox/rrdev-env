import React from 'react';
import ReactDOM from 'react-dom';
import template from './template.jsx';


class App extends React.Component {
            componentDidMount() {

            }

           	componentWillMount() {
          		this.render = template;
          	}
            
            render() { return <div /> }
}

ReactDOM.render(<App pictures={new AppModel()} />, document.getElementById('app'));
