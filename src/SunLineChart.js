import React, { Component } from 'react';
import * as d3 from 'd3';

import styles from './dashboard.module.css';

export default class SunLineChart extends Component{

    constructor() {
        super();
        this.lineChartRef = React.createRef();
        this.state = {
            height: 300,
            width: 600,
            margin: { top: 45, right: 0, bottom: 5, left: 0, between: 20, yaxisMargin: 50 },
        }

        this.xScale = d3.scaleLinear()
            .range([0, 600])
            .domain([0, 24]);
        
        this.yScale = d3.scaleLinear()
            .range([(this.state.height - (this.state.margin.top + this.state.margin.bottom)), 0])
            .domain([24, 0]);

        this.xAxis = d3.axisBottom();//.tickFormat(d3.timeFormat("%d %b"));

        this.yAxis = d3.axisLeft(this.yScale).ticks(12);


        this.drawChart = this.drawChart.bind(this);
    }

    //lineChartRef = React.createRef();

    componentDidMount() {


        this.drawChart();

    }


    drawChart() {
        console.log("drawChart() called");

        // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
        var dataset = d3.range(24).map(function(d) { return {"y": d3.randomUniform(1)() } })
        console.log(dataset);

        let xScale = this.xScale;
        let yScale = this.yScale;
        let xAxis = this.xAxis.scale(xScale);
        let yAxis = this.yAxis;
        var height = this.state.height - this.state.margin.top - this.state.margin.bottom;

        var svgDoc = d3.select('svg#linechartsvg')
            .attr("height", this.state.height)
            ;

            svgDoc.select("g.x.axis")
            .attr("stroke", "white")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + height + ")")
            //.class("domain")
            .attr("stroke", "white")
            .call(xAxis)
            .selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");

            svgDoc.select("g.y.axis").attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + 0 + ")").call(yAxis);


    }

    render() {
        return(
            <div ref={this.lineChartRef}>
            <svg id="linechartsvg" width={this.state.width} >
                <g className="x axis">

                </g>
                <g className="y axis">

                </g>
            </svg>
        </div>
        )
    }



}
