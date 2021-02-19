import React, { Component } from 'react';
import * as d3 from 'd3';

import styles from './dashboard.module.css';

export default class SunLineChart extends Component{

    constructor(props) {
        super(props);
        this.lineChartRef = React.createRef();
        this.state = {
            height: 300,
            width: 600,
            margin: { top: 50, right: 0, bottom: 5, left: 0, between: 20, yaxisMargin: 25 },
            data: []
        }

        this.xScale = d3.scaleLinear()
            .range([0, 600])
            .domain([0, 24]);
        
        this.yScale = d3.scaleLinear()
            .range([(this.state.height - (this.state.margin.top + this.state.margin.bottom)), 0])
            .domain([0, 24]);

        this.yScale2 = d3.scaleLinear()
            .range([(this.state.height - (this.state.margin.top + this.state.margin.bottom)), 0])
            .domain([24, 0]);

        this.xAxis = d3.axisBottom();//.tickFormat(d3.timeFormat("%d %b"));

        this.yAxis = d3.axisLeft(this.yScale).ticks(12);


        this.drawChart = this.drawChart.bind(this);
    }

    //lineChartRef = React.createRef();

    componentDidMount() {
        console.log("SunLineChart componentDidMount");
        //console.log();
        var data = [];

          for(var i =1; i<=24; i++){

            var obj = {};
            obj.x = i;
            obj.y = i;
            data.push(obj);
          }

        this.setState({
            width: this.lineChartRef.current.offsetWidth,
            data: data
          });

        this.drawChart();

    }


    drawChart() {
        console.log("drawChart() called");

        var data = [];
        // var c = 0.142294;
        // var c4 = 0.000709837;
        // var c3 = 0.0340722;
        // var c2 = 0.429864;
        // var c1 = 0.50396;

       
        var c4 = 0.0014518;
        var c3 = 0.0696863;
        var c2 = 0.881758;
        var c1 = 1.09254;
        var c = 0.210586;
        
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


        var d = new Date();
        var hrs = d.getHours();
        var mins = d.getMinutes();
        var minhrs = mins/60;
        var time = hrs + minhrs;
        time = 20.0

        var timeY = (c4 * Math.pow(time,4)) 
                    - (c3 * Math.pow(time,3)) 
                    + (c2 * Math.pow(time,2)) 
                    - (c1*time) + c;



        let xScale = this.xScale;
        let yScale = this.yScale;
        let yScale2 = this.yScale2;
        let xAxis = this.xAxis.scale(xScale);
        let yAxis = this.yAxis;
        var height = this.state.height;// - this.state.margin.top - this.state.margin.bottom;

        var svgDoc = d3.select('svg#linechartsvg')
            .attr("height", this.state.height)
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

            svgDoc.select("g.sunpath")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + ",25)")
                .append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", assistsL)
                .style("fill", "none")
                .style("stroke", "white")
                .style("stroke-width", "1.0px")

            svgDoc.select("g.sunposition")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + ",25)")
                .append("circle")
                .attr("r", 8.0)
                .attr("cx", function(){ return xScale(time)})
                .attr("cy", function(){ return yScale(timeY)})
                .style("fill", "white")
                .style("stroke", "white")
                .style("stroke-width", "1px")

            svgDoc.select("g.sunpositionnight")
                .attr("transform", "translate(" + this.state.margin.yaxisMargin + ",25)")
                    .append("circle")
                    .attr("r", 8.0)
                    .attr("cx", function(){ return xScale(time)})
                    .attr("cy", function(){ return yScale(timeY)})
                    .style("fill", "none")
                    .style("stroke", "white")
                    .style("stroke-width", "3px")

            svgDoc.select("g.sunriseset")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + ",25)")
            .append("line")
            .attr("x1", function(){ return xScale(0)})
            .attr("y1", function(){ return yScale(8)})
            .attr("x2", function(){ return xScale(24)})
            .attr("y2", function(){ return yScale(8)})
            .style("stroke", "white")
            .style("stroke-width", "1px")

            svgDoc.select("g.nightblock")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + ",25)")
            .append("rect")
            .attr("x", function(){ return xScale(0)})
            .attr("y", function(){ return yScale(8)})
            .attr("width", function(){ return xScale(24)})
            .attr("height", function(){ return yScale(8)})
            .style("fill", "grblackey")


    }

    render() {
        return(
            <div ref={this.lineChartRef}>
            <svg id="linechartsvg" width={this.state.width} >
                <g className="x axis"></g>

                <g className="y axis"></g>

                <g className="sunposition"></g>

                <g className="nightblock"></g>

                <g className="sunpositionnight"></g>

                <g className="sunpath"></g>

                

                <g className="sunriseset"></g>
            </svg>
        </div>
        )
    }



}
