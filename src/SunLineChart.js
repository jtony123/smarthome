import React, { Component } from 'react';
import * as d3 from 'd3';

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    
    svgContainer: {
        marginTop: '-200px'
    },
    svgContent: {
        display: 'inlineBlock',
        position: 'absolute',
        top: 0,
        left: 0,
    }
  });

// const c4 = 0.0014518;
// const c3 = 0.0696863;
// const c2 = 0.881758;
// const c1 = 1.09254;
// const c = 0.210586;

// const c4 = 0.000277249;
// const c3 = 0.014417;
// const c2 = 0.203168;
// const c1 = 0.409441;
// const c = 0.773985;


const c4 = 0.000372911;
const c3 = 0.0193914;
const c2 = 0.272268;
const c1 = 0.524676;
const c = 0.788775;



const data = () => {

    var d = new Date();
        var hrs = d.getHours();
        var mins = d.getMinutes();
        var minhrs = mins/60;
        var time = hrs + minhrs;

    var data = [];
    // var obj = {};
    // obj.x = 0;
    // obj.y = 0;
    // data.push(obj);

      for(var i = (time - 1); i<(time + 24); i++){
        var obj = {};
        obj.x = i;
        var modi = i % 24;
        var i4 = Math.pow(modi,4);
        var i3 = Math.pow(modi,3);
        var i2 = Math.pow(modi,2);
        obj.y = (c4*i4) - (c3*i3) + (c2*i2) - (c1*(i%24)) + c;
        data.push(obj);
      }

      return data;
}


class SunLineChart extends Component{

    constructor(props) {
        super(props);
        this.lineChartRef = React.createRef();
        this.state = {
            height: 300,
            width: 600,
            margin: { top: 50, right: 0, bottom: 5, left: 0, between: 20, yaxisMargin: 25 },
            timerInterval: null,
            
            
            data: data,
            time: 0.0,
            timeY: 0.0
        }

        var d = new Date();
        var hrs = d.getHours();
        var mins = d.getMinutes();
        var minhrs = mins/60;
        var time = hrs + minhrs;

        this.xScale = d3.scaleLinear()
            .range([0, this.state.width])
            .domain([time, (time + 24)]);
        
        this.yScale = d3.scaleLinear()
            .range([(this.state.height), 0])
            .domain([0, 12]);


        this.xAxis = d3.axisBottom();

        this.yAxis = d3.axisLeft(this.yScale).ticks(12);


        this.drawChart = this.drawChart.bind(this);

        this.getTimeDecimal = this.getTimeDecimal.bind(this);
        this.getTimeY = this.getTimeY.bind(this);
        this.getTimeFactor = this.getTimeFactor.bind(this);
    }

    lineChartRef = React.createRef();

   

    componentDidMount() {

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

        //return 13;
        return time;
      }

      getTimeY(time){

        var timeY = (c4 * Math.pow(time,4)) 
        - (c3 * Math.pow(time,3)) 
        + (c2 * Math.pow(time,2)) 
        - (c1*time) + c;
        return timeY;
      }

      getTimeFactor(time){

        var factor = 0.0;
        if(time < 13){
            var max = Math.max(0.0, (time - 8));
            factor = max;
        } else {
            var max = Math.max(0.0, ((time * -1) + 19));
            factor = max;
        }
        return factor * 51;
      }


    redrawChart() {

        //console.log("redrawChart() called ");

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

        var factor = this.getTimeFactor(time);

        svgDoc.select("#stop1")
            .attr("style", "stop-color:rgb(255," + (factor) +","+ (factor) +");stop-opacity:1")

        svgDoc.select("#stop2")
            .attr("style", "stop-color:rgb(255,255,"+ (factor) +");stop-opacity:1")

        svgDoc.select("#stop3")
            .attr("style", "stop-color:rgb(0,0,0);stop-opacity:1")
    }


    drawChart() {

        console.log("drawChart() called ");
        let data = this.state.data;
        
        var time = this.getTimeDecimal();
        var timeY = this.getTimeY(time);

        let xScale = this.xScale;
        let yScale = this.yScale;
        let xAxis = this.xAxis.scale(xScale);
        let yAxis = this.yAxis;
        var height = this.state.height;

        let st = styles.svgContent;
        var svgDoc = d3.select('svg#linechartsvg')
            //.attr("height", this.state.height)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 600 500")
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
                .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + this.state.margin.top + ")");

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
                .style("filter", "url(#glow)")

            var sunPosition = svgDoc.select("g.sunposition")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + this.state.margin.top + ")");

            let defsSunPosition = sunPosition.append("defs");
            
            var radialGradient = defsSunPosition.append("radialGradient")
                .attr("id","sunglow")
                .attr("cx", "50%")
                .attr("cy", "50%")
                .attr("r", "40%")
                ;

            var factor = this.getTimeFactor(time);

            radialGradient.append("stop")
                .attr("id", "stop1")
                .attr("offset","0%")
                .attr("style", "stop-color:rgb(255," + (factor) +","+ (factor) +");stop-opacity:1")
                ;

            radialGradient.append("stop")
            .attr("id", "stop2")
                .attr("offset","5%")
                .attr("style", "stop-color:rgb(255,255,"+ (factor) +");stop-opacity:1")
                ;

            radialGradient.append("stop")
            .attr("id", "stop3")
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
                .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + this.state.margin.top + ")")
                    .append("circle")
                    .attr("class", "sunpositionnightCircle")
                    .attr("r", 8.0)
                    .attr("cx", function(){ return xScale(time)})
                    .attr("cy", function(){ return yScale(timeY)})
                    .style("fill", "none")
                    .style("stroke", "white")
                    .style("stroke-width", "3px")

            svgDoc.select("g.sunriseset")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + this.state.margin.top + ")")
            .append("line")
            .datum(data)
            .attr("x1", function(data){ return xScale(data[0].x)})
            .attr("y1", function(){ return yScale(5)})
            .attr("x2", function(data){ return xScale(data[data.length -1].x)})
            .attr("y2", function(){ return yScale(5)})
            .style("stroke", "white")
            .style("stroke-width", "1px")

            svgDoc.select("g.nightblock")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + this.state.margin.top + ")")
            .append("rect")
            .datum(data)
            .attr("x", function(data){ return xScale(data[0].x)})
            .attr("y", function(){ return yScale(5)})
            .attr("width", function(data){ return xScale(data[data.length -1].x)})
            .attr("height", function(){ return yScale(5)})
            .style("fill", "grblackey")


    }

    render() {
        console.log("rendering");

        const { classes } = this.props;

        return(
            <div className={classes.svgContainer} ref={this.lineChartRef}>
                
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

export default withStyles(styles, { withTheme: true })(SunLineChart);
