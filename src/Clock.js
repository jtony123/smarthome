import logo from './logo.svg';
//import './App.css';
import React, { Component } from 'react';

import moment from 'moment';
import styles from './dashboard.module.css';


export default class Clock extends Component {
	
	constructor() {
        super()
        this.state = {
			//time: moment().format('hh') + '.' + moment().format('mm'),
			hour: moment().format('hh'),
			colon: ':',
			minute: moment().format('mm')
			}
			//this.clicked = this.clicked.bind(this)
    }
    
    	componentDidMount() {
		setInterval(()=>{
			
				this.setState({
					//time: moment().format('hh') + '.' + moment().format('mm'),
					hour: moment().format('hh'),
					colon: ':',
					minute: moment().format('mm')
				})
			
		},1000)
	}
	
	
	
	render() {
		return(
			<div id="clock" style={this.state.background} onClick={this.clicked}>
				<h1 className={styles.dashboardClockFont}>{this.state.hour}<span className={styles.dashboardClockTick}>{this.state.colon}</span>{this.state.minute}</h1>
			</div>
		)
	}
	
	
	
	
}
