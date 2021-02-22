import 'fontsource-roboto';
import React, { Component } from 'react';
import Clock from './Clock';
import SunLineChart from './SunLineChart';
import StayAwake from 'stayawake.js';

//import styles from './dashboard.module.css';

import { withStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';


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
    //display: 'inline-block',
    //position: 'absolute',
    //top: 0,
    //left: 0,
    //width: '100%',
    //paddingBottom: '100%',
    //verticalAlign: 'top',
    //overflow: 'hidden',
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
                        isAwake : false
                        };

        this.handleKeepAwake=this.handleKeepAwake.bind(this);
        this.handleClick=this.handleClick.bind(this);

        
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
      console.log("App componentDidMount");

      StayAwake.init();

      const windowSize = window.innerWidth;
      window.addEventListener("resize", this.handleResize);

      //const elwidth = this.parentDivRef.current.clientWidth;

      //console.log(elwidth);

      this.setState({
        windowSize: windowSize,
        //elwidth: elwidth
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
    </div>


        );
    }
}

export default withStyles(styles, { withTheme: true })(App);
