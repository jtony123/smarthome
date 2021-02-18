import logo from './logo.svg';
import 'fontsource-roboto';
//import './App.css';
import React, { Component } from 'react';
import Clock from './Clock';
import SunLineChart from './SunLineChart';

import styles from './dashboard.module.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: '',
                        apiTempReqTimer: null
                        };
    }

    callAPI() {
        fetch("http://192.168.0.30:8080")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    componentDidMount() {
      console.log("App componentDidMount");
        this.callAPI();
        let apiTempReqTimer = setInterval(()=>{
                            this.callAPI();
                        },30000)
        this.setState({ apiTempReqTimer: apiTempReqTimer })
    }
    
    
    componentWillUnmount(){
        console.log("App componentWillUnmount");
        clearInterval(this.state.apiTempReqTimer)
    }

    render() {
        //console.log(this.state.apiResponse);
        return (
        <div className={styles.dashboardBackground}>
        <div className={styles.dashboardRow}>
            <div className={styles.dashboardColumnLeft}>
                <Clock/>
                <SunLineChart/>
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
