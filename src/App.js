import logo from './logo.svg';
import 'fontsource-roboto';
//import './App.css';
import React, { Component } from 'react';
import Clock from './Clock';

import styles from './dashboard.module.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: '' };
    }

    callAPI() {
        fetch("http://192.168.0.30:8080")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    componentDidMount() {
      console.log("componentDidMount");
        this.callAPI();
        //console.log(this.state.apiResponse);
    }

    render() {
        console.log(this.state.apiResponse);
        return (
        <div className={styles.dashboardBackground}>
        <div className={styles.dashboardRow}>
            <div className={styles.dashboardColumnLeft}>
                <Clock/>
            </div>
            
            <div className={styles.dashboardColumnRight}>
                <p className = {styles.dashboardTempFont}>{this.state.apiResponse}&#176;</p>
            </div>
          
          </div>
        </div>
        );
    }
}

export default App;

//function App() {
  //return (
    //<div className="App">
      //<header className="App-header">
        //<img src={logo} className="App-logo" alt="logo" />
        //<p>
          //Edit <code>src/App.js</code> and save to reload.
        //</p>
        //<a
          //className="App-link"
          //href="https://reactjs.org"
          //target="_blank"
          //rel="noopener noreferrer"
        //>
          //Learn React
        //</a>
      //</header>
    //</div>
  //);
//}

//export default App;
