import 'fontsource-roboto';
import React, { Component } from 'react';
import Clock from './Clock';
import SunLineChart from './SunLineChart';
import { withStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

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
    marginBottom: '200px'
  },
  svgContainer: {
},
svgContent: {
    display: 'inlineBlock',
    position: 'absolute',
    top: 0,
    left: 0,
},
dashboardTempFont: {
	color: 'white',
	fontSize: '4.0em',
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

        this.handleClick=this.handleClick.bind(this);

    }

    

    callAPI() {

      fetch("http://192.168.0.30:8090")
          .then(res => res.text())
          .then(res => this.setState({ apiResponse: res }))
          .catch(err => err);
    }

    getWeather() {

      fetch("http://192.168.0.30:8090/weather")
          .then(res => res.text())
          .then(res => console.log(res))
          .catch(err => err);
  }


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

      let apiWeatherReqTimer = setInterval(()=>{
                        this.callAPI();
                    },3600000)
      
      this.setState({ apiTempReqTimer: apiTempReqTimer,
        apiWeatherReqTimer: apiWeatherReqTimer
                    });

      Events.scrollEvent.register('begin', function(to, element) {
        console.log('begin', arguments);
      });

      Events.scrollEvent.register('end', function(to, element) {
        console.log('end', arguments);
      });

      scrollSpy.update();
    }
    
    
    componentWillUnmount(){
      console.log("App componentWillUnmount");
      clearInterval(this.state.apiTempReqTimer);
      clearInterval(this.state.apiWeatherReqTimer);
      window.removeEventListener("resize", this.handleResize);
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    }

    render() {

      const { classes } = this.props;

      var s1 = this.state.apiResponse;
      var s2 = String.fromCharCode(176);

      const bufferTemp = s1.concat(s2);
      
        return (


          <div className={classes.root}>
      <Grid className={classes.dashboard} container spacing={2}>
        <Grid item xs={12} sm={8}>
        <Grid item xs={12}>
            <Clock/>
            <SunLineChart/>
        </Grid>
        </Grid>
        <Grid item xs={12} sm={4}>
          <p className = {classes.dashboardTempFont}>{this.state.apiResponse}&#176;</p>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>Lots more to come</Paper>
          
        </Grid>
      </Grid>
      <ReactPlayer url="../videos/mov_bbb.mp4" width='100%' playing={true} loop={true} volume={0} playsinline={true}/>
      
    </div>


        );
    }
}

export default withStyles(styles, { withTheme: true })(App);
