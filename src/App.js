import 'fontsource-roboto';
import React, { Component } from 'react';
import Clock from './Clock';
import SunLineChart from './SunLineChart';
import { withStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import ReactPlayer from 'react-player/lazy'


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
                        elwidth: 600, // default width
                        windowSize: "",
                        };

        this.handleClick=this.handleClick.bind(this);

        
    }

    

    callAPI() {
        fetch("http://192.168.0.30:8080")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    getWeather() {

      const headers = new Headers({
        "Content-Type": "application/json"
    })

      const options = {
        method: "GET",
        mode: "cors",
        headers: headers
    }
    
      fetch("http://192.168.0.30:8090/weather", options)
          .then(res => res.text())
          .then(res => console.log(res))
          .catch(err => err);
  }


    handleResize = e => {
        console.log("resizing");
        const windowSize = window.innerWidth;
        //const elwidth = this.parentDivRef.current.clientWidth;
        this.setState(prevState => {
          return {
            windowSize,
            //elwidth
          };
        });
      };

      handleClick = e => {
        console.log("clicking");
        
      };

    componentDidMount() {
      if ('wakeLock' in navigator) {
        //isSupported = true;
        console.log('Screen Wake Lock API supported!');
      } else {
        console.log('Wake lock is not supported by this browser.');
      }
      console.log("App componentDidMount here");


      const windowSize = window.innerWidth;
      window.addEventListener("resize", this.handleResize);

      //const elwidth = this.parentDivRef.current.clientWidth;

      //console.log(elwidth);

      this.setState({
        windowSize: windowSize,
        //elwidth: elwidth
      });

      this.getWeather();

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
          <Chip className={classes.chip} size="medium" avatar={<Avatar>Buffer</Avatar>} label={bufferTemp} onClick={this.handleClick} />
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
