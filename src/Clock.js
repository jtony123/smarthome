import React, { Component } from 'react';

import moment from 'moment';

import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
    
    dashboardClockAlign: {
		textAlign: 'center',
		backgroundColor: 'rgba(0 0 0 /0%)',
		position: 'absolute',
		left: '10vw',
		zIndex: 10,
	},
	dashboardClockTick: {
		color: 'white',
		fontWeight: 300,
		animationName: '$ticking',
		animationDuration: '1s',
		animationIterationCount: 'infinite',
	},
	dashboardClockFont: {
		color: 'silver',
		//fontSize: '120px',
		//fontSize: '12.0em',
		fontSize: '30vh',
		fontWeight: 500,
		margin: 0,
		paddingLeft: '30px',
	},

	"@keyframes ticking": {
		from: {opacity:'0.8'},
		to: {opacity:'0.5'}
	}
  });

class Clock extends Component {
	
	constructor() {
        super()
        this.state = {
			hour: moment().format('hh'),
			colon: ':',
			minute: moment().format('mm'),
			timerInterval: null
			}
    }
    
    	componentDidMount() {
		let timerInterval = setInterval(()=>{
				this.setState({
					hour: moment().format('hh'),
					colon: ':',
					minute: moment().format('mm')
				})
			
		},1000)
		this.setState({timerInterval: timerInterval});
	}
	
	componentWillUnmount(){
        console.log("Clock componentWillUnmount");
        clearInterval(this.state.timerInterval)
    }
	
	
	
	render() {
		const { classes } = this.props;
		return(
			<div id="clock" className={classes.dashboardClockAlign} style={this.state.background} onClick={this.clicked}>
				<h1 className={classes.dashboardClockFont}>{this.state.hour}<span className={classes.dashboardClockTick}>{this.state.colon}</span>{this.state.minute}</h1>
			</div>
		)
	}
	
	
	
	
}
export default withStyles(styles, { withTheme: true })(Clock);