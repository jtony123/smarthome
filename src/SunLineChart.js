import React, { Component } from 'react';
import * as d3 from 'd3';

import styles from './dashboard.module.css';

const c4 = 0.0014518;
const c3 = 0.0696863;
const c2 = 0.881758;
const c1 = 1.09254;
const c = 0.210586;


const data = () => {

    var data = [];
    
    var obj = {};
    obj.x = 0;
    obj.y = 0;
    data.push(obj);

      for(var i =1; i<=24; i++){

        var obj = {};
        obj.x = i;

        var i4 = Math.pow(i,4);
        var i3 = Math.pow(i,3);
        var i2 = Math.pow(i,2);


        obj.y = (c4*i4) - (c3*i3) + (c2*i2) - (c1*i) + c;
        data.push(obj);
      }

      return data;
}


export default class SunLineChart extends Component{

    constructor(props) {
        super(props);
        this.lineChartRef = React.createRef();
        console.log(this.props.parentWidth);
        this.state = {
            height: 300,
            width: 600,
            margin: { top: 50, right: 0, bottom: 5, left: 0, between: 20, yaxisMargin: 0 },
            timerInterval: null,
            c4 : 0.0014518,
            c3 : 0.0696863,
            c2 : 0.881758,
            c1 : 1.09254,
            c : 0.210586,
            data: data,
            time: 0.0,
            timeY: 0.0
        }

        this.xScale = d3.scaleLinear()
            .range([0, this.state.width])
            .domain([0, 24]);
        
        this.yScale = d3.scaleLinear()
            .range([(this.state.height - (this.state.margin.top + this.state.margin.bottom)), 0])
            .domain([0, 24]);


        this.xAxis = d3.axisBottom();

        this.yAxis = d3.axisLeft(this.yScale).ticks(12);


        this.drawChart = this.drawChart.bind(this);

        this.getTimeDecimal = this.getTimeDecimal.bind(this);
        this.getTimeY = this.getTimeY.bind(this);
    }

    lineChartRef = React.createRef();

   

    componentDidMount() {
        console.log("SunLineChart componentDidMount ");

        let timerInterval = setInterval(()=>{
            var time = this.getTimeDecimal();
            var timeY = this.getTimeY(time);
            this.setState({ time: time, timeY: timeY });
            this.redrawChart();
        }, 5000);
        this.setState({ timerInterval: timerInterval });
        this.drawChart();

    }

    componentWillUnmount() {
        clearInterval(this.state.timerInterval);
      }



      getTimeDecimal(){

        var d = new Date();
        var hrs = d.getHours();
        var mins = d.getMinutes();
        var minhrs = mins/60;
        var time = hrs + minhrs;

        return time;
      }

      getTimeY(time){

        var timeY = (c4 * Math.pow(time,4)) 
        - (c3 * Math.pow(time,3)) 
        + (c2 * Math.pow(time,2)) 
        - (c1*time) + c;
        return timeY;
      }


    redrawChart() {

        console.log("redrawChart() called ");

        var time = this.state.time;
        var timeY = this.state.timeY;

        let xScale = this.xScale;
        let yScale = this.yScale;
        var svgDoc = d3.select('svg#linechartsvg');

        svgDoc.select("sunpositionGlow")
        .attr("cx", function(){ return xScale(time)})
        .attr("cy", function(){ return yScale(timeY)})

        svgDoc.select("sunpositionCircle")
            .attr("cx", function(){ return xScale(time)})
            .attr("cy", function(){ return yScale(timeY)})

        svgDoc.select("sunpositionnightCircle")
                .attr("cx", function(){ return xScale(time)})
                .attr("cy", function(){ return yScale(timeY)})


    }


    drawChart() {

        console.log("drawChart() called " + this.props.parentWidth);
        let data = this.state.data;
        
        // var d = new Date();
        // var hrs = d.getHours();
        // var mins = d.getMinutes();
        // var minhrs = mins/60;
        // var time = hrs + minhrs;
        // //time = 20.0

        // var timeY = (c4 * Math.pow(time,4)) 
        //             - (c3 * Math.pow(time,3)) 
        //             + (c2 * Math.pow(time,2)) 
        //             - (c1*time) + c;

        var time = this.getTimeDecimal();
        var timeY = this.getTimeY(time);

        let xScale = this.xScale;
        let yScale = this.yScale;
        let xAxis = this.xAxis.scale(xScale);
        let yAxis = this.yAxis;
        var height = this.state.height;// - this.state.margin.top - this.state.margin.bottom;

        let st = styles.svgContent;
        var svgDoc = d3.select('svg#linechartsvg')
            //.attr("height", this.state.height)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 600 600")
            .classed(st, true);
            ;

            // svgDoc.select("g.x.axis")
            // .attr("stroke", "white")
            // .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + height + ")")
            // //.class("domain")
            // .attr("stroke", "white")
            // .call(xAxis)
            // .selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");

            //svgDoc.select("g.y.axis").attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + 0 + ")").call(yAxis);

            let assistsGroup = svgDoc.select('g.sunpath');

            let assistsL = d3.line()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return xScale(d.x); })
            .y(function (d) { return yScale(d.y); });

            let sunpath = svgDoc.select("g.sunpath")
                .attr("transform", "translate(" + this.state.margin.yaxisMargin + ",200)");

            let defsSunpath = sunpath.append("defs");
            var filter = defsSunpath.append("filter")
                .attr("id","glow");

                filter.append("feGaussianBlur")
		        .attr("class", "blur")
		        .attr("stdDeviation","2")
                .attr("result","coloredBlur");
        
            var feMerge = filter.append("feMerge");
	            feMerge.append("feMergeNode")
                .attr("in","coloredBlur");
                
	            feMerge.append("feMergeNode")
		        .attr("in","SourceGraphic");

                sunpath.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", assistsL)
                .style("fill", "none")
                .style("stroke", "white")
                .style("stroke-width", "1.0px")
                //.style("fill-opacity", 0)
                .style("filter", "url(#glow)")

            var sunPosition = svgDoc.select("g.sunposition")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + ",200)");

            let defsSunPosition = sunPosition.append("defs");
            
            var radialGradient = defsSunPosition.append("radialGradient")
                .attr("id","sunglow")
                .attr("cx", "50%")
                .attr("cy", "50%")
                .attr("r", "40%")
                ;

            // var stop1 = radialGradient.append("stop")
            //     .attr("offset","0%")
            //     .attr("style", "stop-color:rgb(255,255,255);stop-opacity:1")
            //     ;

            // var stop2 = radialGradient.append("stop")
            //     .attr("offset","5%")
            //     .attr("style", "stop-color:rgb(255,255,255);stop-opacity:1")
            //     ;

            // var stop3 = radialGradient.append("stop")
            //     .attr("offset","100%")
            //     .attr("style", "stop-color:rgb(0,0,0);stop-opacity:1")
            //     ;

            var stop1 = radialGradient.append("stop")
                .attr("offset","0%")
                .attr("style", "stop-color:rgb(255,0,0);stop-opacity:1")
                ;

            var stop2 = radialGradient.append("stop")
                .attr("offset","5%")
                .attr("style", "stop-color:rgb(255,255,0);stop-opacity:1")
                ;

            var stop3 = radialGradient.append("stop")
                .attr("offset","100%")
                .attr("style", "stop-color:rgb(0,0,0);stop-opacity:1")
                ;
            

           

            sunPosition.append("circle")
                .attr("class", "sunpositionGlow")
                .attr("r", 100.0)
                .attr("cx", function(){ return xScale(time)})
                .attr("cy", function(){ return yScale(timeY)})
                //.style("fill", "white")
                .style("fill", "url(#sunglow)")
                .style("stroke", "white")
                .style("stroke-width", "0px")
                //.style("filter", "url(#sunglow)")

            sunPosition.append("circle")
                .attr("class", "sunpositionCircle")
                .attr("r", 8.0)
                .attr("cx", function(){ return xScale(time)})
                .attr("cy", function(){ return yScale(timeY)})
                .style("fill", "white")
                .style("stroke", "white")
                .style("stroke-width", "2px")

            svgDoc.select("g.sunpositionnight")
                .attr("transform", "translate(" + this.state.margin.yaxisMargin + ",200)")
                    .append("circle")
                    .attr("class", "sunpositionnightCircle")
                    .attr("r", 8.0)
                    .attr("cx", function(){ return xScale(time)})
                    .attr("cy", function(){ return yScale(timeY)})
                    .style("fill", "none")
                    .style("stroke", "white")
                    .style("stroke-width", "3px")

            svgDoc.select("g.sunriseset")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + ",200)")
            .append("line")
            .attr("x1", function(){ return xScale(0)})
            .attr("y1", function(){ return yScale(8)})
            .attr("x2", function(){ return xScale(24)})
            .attr("y2", function(){ return yScale(8)})
            .style("stroke", "white")
            .style("stroke-width", "1px")

            svgDoc.select("g.nightblock")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + ",200)")
            .append("rect")
            .attr("x", function(){ return xScale(0)})
            .attr("y", function(){ return yScale(8)})
            .attr("width", function(){ return xScale(24)})
            .attr("height", function(){ return yScale(8)})
            .style("fill", "grblackey")


    }

    render() {
        console.log("rendering");
        return(
            <div className={styles.svgContainer} ref={this.lineChartRef}>
            <svg id="linechartsvg" >
            
                <g className="x axis"></g>

                <g className="y axis"></g>

                <g className="sunposition"></g>

                <g className="nightblock"></g>

                <g className="sunpositionnight"></g>

                <g className="sunpath">

                </g>

                

                <g className="sunriseset"></g>
            </svg>
        </div>
        )
    }



}
