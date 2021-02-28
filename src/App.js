import 'fontsource-roboto';
import React, { Component } from 'react';
import Clock from './Clock';
import SunLineChart from './SunLineChart';
import { withStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import ReactPlayer from 'react-player/lazy';
import * as Scroll from 'react-scroll';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
 




const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    //padding: theme.spacing(2),
    //textAlign: 'center',
    //color: 'black',
  },
  dashboard: {
    backgroundColor: 'black',
    //marginBottom: '200px',
    //height: '110vh'
  },
  svgContainer: {
    //marginTop: '-200px'
},
svgContent: {
    display: 'inlineBlock',
    position: 'absolute',
    top: 0,
    left: 0,
},
dashboardTempFont: {
	color: 'white',
	fontSize: '10vh',
	textAlign: 'center',
	margin: 0,
	paddingTop: '25px',
	
},
chip: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  tempSymbol:'&#176;'

}
});



class App extends Component {

    constructor(props) {
        super(props);
        this.parentDivRef = React.createRef();
        this.state = { apiResponse: '',
                        apiTempReqTimer: null,
                        apiWeatherReqTimer: null,
                        elwidth: 600, // default width
                        windowSize: "",
                        };

        this.handleClick = this.handleClick.bind(this);
        //this.getWeather = this.getWeather.bind(this);
        //this.openFullscreen = this.openFullscreen.bind(this);

    }


    

    callAPI() {

      fetch("http://192.168.0.30:8090")
          .then(res => res.text())

          .then(res => {
            var temps = JSON.parse(res);
            this.setState({ apiResponse: temps})
          })
          .catch(err => err);
    }

  //   getWeather() {

  //     fetch("http://192.168.0.30:8090/weather")
  //         .then(res => res.json())
  //         .then(data => {return data;})
  //         .catch(err => err);
  // }


    handleResize = e => {
        console.log("resizing");
        const windowSize = window.innerWidth;
        this.setState(prevState => {
          return {
            windowSize
          };
        });
      };

      handleClick = e => {
        console.log("clicking");
        
      };

    componentDidMount() {


      const windowSize = window.innerWidth;
      window.addEventListener("resize", this.handleResize);

      this.setState({
        windowSize: windowSize,
        //elwidth: elwidth
      });


      this.callAPI();
      let apiTempReqTimer = setInterval(()=>{
                          this.callAPI();
                      },30000)

      // let apiWeatherReqTimer = setInterval(()=>{
      //                   this.getWeather();
      //               },3600000)
      
      this.setState({ apiTempReqTimer: apiTempReqTimer,
        //apiWeatherReqTimer: apiWeatherReqTimer
                    });

    }
    

    openFullscreen() {


      var elem = document.getElementById("root");


      try {
        if (elem.mozRequestFullscreen) { /* firefox */
          elem.mozRequestFullscreen();
          return;
        }
      } catch(err) {
        console.log(err);
      }
      try {
        if (elem.requestFullscreen) { /* chrome */
          elem.requestFullscreen();
          return;
        }
      } catch(err) {
        console.log(err);
      }

      try {
        if (elem.webkitRequestFullscreen) { /* Safari */
          elem.webkitRequestFullscreen();
          return;
        }
      } catch(err) {
        console.log(err);
      }
    return;
    }


    componentWillUnmount(){
      console.log("App componentWillUnmount");
      clearInterval(this.state.apiTempReqTimer);
      clearInterval(this.state.apiWeatherReqTimer);
      window.removeEventListener("resize", this.handleResize);
    }

    render() {

      const { classes } = this.props;

      var sA = this.state.apiResponse.sensorA;
      var sB = this.state.apiResponse.sensorB;

      
        return (


          <div className={classes.root}>
      <Grid className={classes.dashboard} container spacing={2}>
        <Grid item xs={12} sm={9}>
              <Clock/>
        </Grid>
        <Grid item xs={12} sm={3}>
            <p className = {classes.dashboardTempFont}>{sA}&#176;</p>
          
            <p className = {classes.dashboardTempFont}>{sB}&#176;</p>
          
        </Grid>
      </Grid>
      <Grid className={classes.dashboard} container spacing={2}>
        <Grid item xs={12} sm={12}>
          <SunLineChart/>

        </Grid>
        </Grid>
        
      

      <Button size="large" fullWidth={true} onClick={() => this.openFullscreen()}>Full Sceen Mode</Button>

      <ReactPlayer url="../videos/mov_bbb.mp4" width='100%' playing={true} loop={true} volume={0} playsinline={true}/>
      
    </div>


        );
    }
}

export default withStyles(styles, { withTheme: true })(App);
