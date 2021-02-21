import logo from './logo.svg';
import 'fontsource-roboto';
//import './App.css';
import React, { Component } from 'react';
import Clock from './Clock';
import SunLineChart from './SunLineChart';
import StayAwake from 'stayawake.js';

import styles from './dashboard.module.css';



class App extends Component {
    constructor(props) {
        super(props);
        this.parentDivRef = React.createRef();
        this.state = { apiResponse: '',
                        apiTempReqTimer: null,
                        elwidth: 600, // default width
                        windowSize: "",
                        isAwake : false
                        };

        this.handleKeepAwake=this.handleKeepAwake.bind(this);

    }

    callAPI() {
        fetch("http://192.168.0.30:8080")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    handleKeepAwake = e => {
      e.preventDefault();
      console.log("handleKeepAwake");
      if(this.state.isAwake){
        StayAwake.disable();
      } else {
        StayAwake.enable();
      }

      this.setState(state => ({
        isAwake: !state.isAwake
      }));

      

    }

    handleResize = e => {
        console.log("resizing");
        const windowSize = window.innerWidth;
        const elwidth = this.parentDivRef.current.clientWidth;
        this.setState(prevState => {
          return {
            windowSize,
            elwidth
          };
        });
      };

    componentDidMount() {
      console.log("App componentDidMount");

      StayAwake.init();

      const windowSize = window.innerWidth;
      window.addEventListener("resize", this.handleResize);

      const elwidth = this.parentDivRef.current.clientWidth;

      console.log(elwidth);

      this.setState({
        windowSize: windowSize,
        elwidth: elwidth
      });
        this.callAPI();
        let apiTempReqTimer = setInterval(()=>{
                            this.callAPI();
                        },30000)
        this.setState({ apiTempReqTimer: apiTempReqTimer });

    }
    
    
    componentWillUnmount(){
        console.log("App componentWillUnmount");
        clearInterval(this.state.apiTempReqTimer);
        window.removeEventListener("resize", this.handleResize);
        StayAwake.disable();
    }

    render() {
      
        return (
        <div className={styles.dashboardBackground}>
        <div className={styles.dashboardRow}>
        {/* <button onClick={this.handleKeepAwake}>
              {this.state.isAwake ? 'AWAKE' : 'SLEEP'}
            </button> */}
            <div className={styles.dashboardColumnLeft} ref={this.parentDivRef}>
                <Clock/>
                <SunLineChart/>
            </div>
            
            <div className={styles.dashboardColumnRight}>
                <p className = {styles.dashboardTempFont}>{this.state.apiResponse}&#176;</p>
            </div>

            <div>
            

            </div>
          
          </div>
        </div>
        );
    }
}

export default App;
