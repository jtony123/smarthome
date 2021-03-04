import React, { Component } from 'react';
import * as d3 from 'd3';

import { withStyles } from "@material-ui/core/styles";
import WeatherIconDefs from './WeatherIconDefs.js';

const styles = theme => ({
    
    svgContainer: {
        marginTop: '-75px'
    },
    svgContent: {
        display: 'inlineBlock',
        position: 'absolute',
        top: 0,
        left: 0,
    },

  });



const c4 = 0.000372911;
const c3 = 0.0193914;
const c2 = 0.272268;
const c1 = 0.524676;
const c = 0.788775;



let data = () => {

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

      for(var i = (time - 3); i<(time + 21); i++){
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
            margin: { top: 0, right: 0, bottom: 5, left: 0, between: 20, yaxisMargin: 15 },
            timerInterval: null,
            weatherTimerInterval: null,
            data: data,
            //rainData: [],
            //tempData: [],
            weatherData: [],//[{"time": 0, "temperature": 0}],
            time: 0.0,
            timeY: 0.0
        }

        var d = new Date();
        var ts1 = d.getTime() - (1000 * 60 *60 * 3);
        var ts2 = d.getTime() + (21 * 60 * 60 * 1000);
        var hrs = d.getHours();
        var mins = d.getMinutes();
        var minhrs = mins/60;
        var time = hrs + minhrs;

        this.xScale = d3.scaleLinear()
            .range([0, this.state.width])
            .domain([(time - 3), (time + 21)]);

        // this.xScale2 = d3.scaleLinear()
        //     .range([0, this.state.width])
        //     .domain([ts1,ts2]);
        
        this.yScale = d3.scaleLinear()
            .range([(this.state.height), 0])
            .domain([0, 10]);

        this.yTempScale = d3.scaleLinear()
            .range([200, 0])
            .domain([0, 25]);

        var colors = ["#a50026","#a70226","#a90426","#ab0626","#ad0826","#af0926","#b10b26",
        "#b30d26","#b50f26","#b61127","#b81327","#ba1527","#bc1727","#be1927","#c01b27",
        "#c21d28","#c41f28","#c52128","#c72328","#c92529","#cb2729","#cc2929","#ce2b2a",
        "#d02d2a","#d12f2b","#d3312b","#d4332c","#d6352c","#d7382d","#d93a2e","#da3c2e",
        "#dc3e2f","#dd4030","#de4331","#e04532","#e14733","#e24a33","#e34c34","#e44e35",
        "#e55136","#e75337","#e85538","#e95839","#ea5a3a","#eb5d3c","#ec5f3d","#ed613e",
        "#ed643f","#ee6640","#ef6941","#f06b42","#f16e43","#f17044","#f27346","#f37547",
        "#f37848","#f47a49","#f57d4a","#f57f4b","#f6824d","#f6844e","#f7864f","#f78950",
        "#f88b51","#f88e53","#f89054","#f99355","#f99557","#f99858","#fa9a59","#fa9c5b",
        "#fa9f5c","#fba15d","#fba35f","#fba660","#fba862","#fcaa63","#fcad65","#fcaf66",
        "#fcb168","#fcb369","#fcb56b","#fdb86d","#fdba6e","#fdbc70","#fdbe72","#fdc073",
        "#fdc275","#fdc477","#fdc678","#fdc87a","#fdca7c","#fecc7e","#fecd80","#fecf81",
        "#fed183","#fed385","#fed587","#fed689","#fed88a","#feda8c","#fedb8e","#fedd90",
        "#fede92","#fee094","#fee196","#fee397","#fee499","#fee69b","#fee79d","#fee89f",
        "#feeaa1","#feeba3","#feeca4","#feeda6","#feeea8","#fef0aa","#fef1ac","#fdf2ae",
        "#fdf2b0","#fdf3b2","#fdf4b4","#fcf5b6","#fcf6b8","#fbf6ba","#fbf7bc","#faf7be",
        "#faf8c0","#f9f8c2","#f9f8c4","#f8f9c6","#f7f9c8","#f7f9ca","#f6f9cc","#f5f9ce",
        "#f4f9d0","#f3f9d2","#f2f9d4","#f1f8d6","#f0f8d8","#eff8da","#edf8dc","#ecf7dd",
        "#ebf7df","#eaf6e1","#e8f6e2","#e7f5e4","#e6f5e5","#e4f4e7","#e3f3e8","#e1f3e9",
        "#e0f2ea","#def1eb","#dcf1ec","#dbf0ed","#d9efed","#d7eeee","#d5eeee","#d4edef",
        "#d2ecef","#d0ebef","#ceeaef","#cce9ef","#cae8ef","#c8e7ef","#c6e6ef","#c5e5ef",
        "#c3e4ee","#c0e3ee","#bee2ee","#bce1ed","#bae0ed","#b8deec","#b6ddeb","#b4dceb",
        "#b2dbea","#b0d9e9","#aed8e9","#acd7e8","#aad5e7","#a7d4e6","#a5d2e6","#a3d1e5",
        "#a1d0e4","#9fcee3","#9dcde2","#9bcbe1","#99c9e1","#96c8e0","#94c6df","#92c4de",
        "#90c3dd","#8ec1dc","#8cbfdb","#8abeda","#88bcd9","#86bad8","#84b8d7","#82b6d6",
        "#7fb5d5","#7db3d4","#7bb1d3","#79afd2","#77add1","#75abd0","#73a9cf","#71a7ce",
        "#6fa5cd","#6da3cc","#6ca1cb","#6a9fca","#689dc9","#669bc8","#6499c7","#6297c5",
        "#6094c4","#5f92c3","#5d90c2","#5b8ec1","#598cc0","#5889bf","#5687be","#5485bc",
        "#5383bb","#5180ba","#507eb9","#4e7cb8","#4d7ab7","#4c77b5","#4a75b4","#4973b3",
        "#4870b2","#466eb1","#456cb0","#4469ae","#4367ad","#4264ac","#4162ab","#4060aa",
        "#3f5da8","#3e5ba7","#3d58a6","#3c56a5","#3b54a4","#3a51a2","#394fa1","#384ca0",
        "#374a9f","#37479e","#36459c","#35429b","#34409a","#333d99","#333b97","#323896",
        "#313695"]

        var colorsReversed = colors.reverse();

        this.colorScale = d3.scaleQuantize()
            .domain([-5,20])
            .range(colorsReversed);


this.xAxis = d3.axisBottom().tickFormat(function(d) { return (d % 24)+":00"});//.ticks(5);;

        this.yAxis = d3.axisLeft(this.yScale).ticks(12);


        this.drawChart = this.drawChart.bind(this);

        this.getTimeDecimal = this.getTimeDecimal.bind(this);
        this.getTimeY = this.getTimeY.bind(this);
        this.getTimeFactor = this.getTimeFactor.bind(this);
        this.updateData = this.updateData.bind(this);
        this.getWeather = this.getWeather.bind(this);
    }

    lineChartRef = React.createRef();

   

    componentDidMount() {

        let timerInterval = setInterval(()=>{
            var time = this.getTimeDecimal();
            var timeY = this.getTimeY(time);
            this.setState({ time: time, timeY: timeY });
            this.updateData();
            this.redrawChart();
        }, 5000);

        let weatherTimerInterval = setInterval(()=>{
            this.getWeather();
        }, 3600000); // 60 * 60 * 1000 every 30 minutes

        this.setState({ timerInterval: timerInterval,
            weatherTimerInterval, weatherTimerInterval});

        this.getWeather();
        this.drawChart();
    }

    componentWillUnmount() {
        clearInterval(this.state.timerInterval);
        clearInterval(this.state.weatherTimerInterval);
        
      }

    getWeather() {
        console.log("fetching weather");
        fetch("http://192.168.0.30:8090/weather")
            .then(res => res.text())
            .then(res => {
                var data = JSON.parse(res);
                //console.log( data);
                var extractedData = {};
                var rainData = [];
                var tempData = [];
                var timeArray = data.weatherdata.product.time;

                var today = new Date();
                var todayDate = today.getUTCDate();

                var objMap = new Map();

                
                timeArray.forEach(el => {
                    //console.log(el);

                    var d = new Date(el.from);
                    var dDate = d.getUTCDate();
                    var hrs = d.getHours();
                    var mins = d.getMinutes();
                    var minhrs = mins/60;
                    var time = hrs + minhrs;
                    var diff = (dDate - todayDate);
                    // accounting for change of month
                    if(diff < 0){
                        diff = 1;
                    }
                    time += diff * 24;

                    if((time % 2) === 0){
                       
                        var from = new Date(el.from);
                        el.fromUTC = from.getTime();
                        var to = new Date(el.to);
                        el.toUTC = to.getTime();
                        var location = el.location;
    
                        var obj = {};
                        
                        if(el.location.hasOwnProperty('temperature')) {
                            // temperature data
                            var temperature = el.location.temperature;
                            var cloudiness = el.location.cloudiness;
                            var o = {};
                            o.x = el.toUTC;
                            o.time = time;
                            o.date = el.to;
                            o.temperature = parseFloat(temperature.value);
                            o.cloudiness = parseFloat(cloudiness.percent);
                            tempData.push(o);
    
                            obj.x = el.fromUTC;
                            obj.x1 = el.toUTC;
                            obj.time = time;
                            obj.from = el.from;
                            obj.to = el.to;
                            obj.temperature = parseFloat(temperature.value);
                            obj.cloudiness = parseFloat(cloudiness.percent);
                        } 
                        
                        if(el.location.hasOwnProperty('precipitation')) {
                            var precipitation = el.location.precipitation;
                            var o = {};
                            o.x = el.toUTC;
                            o.time = time;
                            o.date = el.to;
                            
                            o.value = parseFloat(precipitation.value);
                            o.minValue = parseFloat(precipitation.minvalue);
                            o.maxValue = parseFloat(precipitation.maxvalue);
                            o.probability = parseFloat(precipitation.probability);
                            rainData.push(o);
    
                            obj.x = el.fromUTC;
                            obj.x1 = el.toUTC;
                            obj.time = time;
                            obj.from = el.from;
                            obj.to = el.to;
                            var rain = {};
                            rain.value = parseFloat(precipitation.value);
                            rain.minValue = parseFloat(precipitation.minvalue);
                            rain.maxValue = parseFloat(precipitation.maxvalue);
                            rain.probability = parseFloat(precipitation.probability);
                            obj.rain = rain;
                        }
    
                        if(objMap.has(el.from)){
                            var first = objMap.get(el.from);
                            let merged = {...first, ...obj};
                            objMap.set(el.from, merged);
                        } else {
                            obj = objMap.set(el.from, obj);
                        }
                    }
                    
                   

                });
                var dataArray = Array.from(objMap.values());
                return dataArray;
                
            })
            .then(dataArray => {
                //console.log(dataArray);
                this.setState({ weatherData: dataArray
                }); 
            })
            .catch(err => console.log(err));
    }


      updateData(){

        var d = new Date();
        var hrs = d.getHours();
        var mins = d.getMinutes();
        var minhrs = mins/60;
        var time = hrs + minhrs;

    var data = [];

      for(var i = (time - 3); i<(time + 21); i++){
        var obj = {};
        obj.x = i;
        var modi = i % 24;
        var i4 = Math.pow(modi,4);
        var i3 = Math.pow(modi,3);
        var i2 = Math.pow(modi,2);
        obj.y = (c4*i4) - (c3*i3) + (c2*i2) - (c1*(i%24)) + c;
        data.push(obj);
      }
       this.setState((state) => ({data: data}));

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

        console.log("redrawChart() called ");

        let data = this.state.data;
        let weatherData = this.state.weatherData;

        var time = this.state.time;
        var timeY = this.state.timeY;

        let xScale = this.xScale.domain([(time - 3), (time + 21)]);
        let yScale = this.yScale;
        let yTempScale = this.yTempScale.domain([0, 25]);
        let colorScale = this.colorScale;

        let xAxis = this.xAxis.scale(xScale);

        var svgDoc = d3.select('svg#linechartsvg');

        

        svgDoc.select("g.x.axis").call(xAxis);

        svgDoc.select(".sunpositionGlow")
        .attr("cx", function(){ return xScale(time)})
        .attr("cy", function(){ return yScale(timeY)})

        svgDoc.select(".sunpositionCircle")
            .attr("cx", function(){ return xScale(time)})
            .attr("cy", function(){ return yScale(timeY)})

        svgDoc.select(".sunpositionnightCircle")
                .attr("cx", function(){ return xScale(time)})
                .attr("cy", function(){ return yScale(timeY)})


        let sunpathLine = d3.line()
            .curve(d3.curveNatural)
            .x(function (d) { return xScale(d.x); })
            .y(function (d) { return yScale(d.y); });

        let sunpath = svgDoc.select("g.sunpath");

            sunpath.selectAll(".line")
                .datum(data)
                .attr("d", sunpathLine)
                
        let sunpathNight = svgDoc.select("g.sunpathNight");

            sunpathNight.selectAll(".line")
            .datum(data)
            .attr("d", sunpathLine)


        
        let tempGroup = svgDoc.select("g.temperature");
        tempGroup.selectAll('circle')
                .data(weatherData.filter(function(d){ 
                    return d.hasOwnProperty("time") 
                           && d.hasOwnProperty("temperature") ; }))
                .join('circle')
                .attr("class", "tempCircle")
                .attr("cx", function(d) { return xScale(d.time); })
                .attr("cy", function(d) { return yScale(4); })
                .attr("r", 13)
                .style("stroke", function(d){ return colorScale(d.temperature);})
                .style("stroke-width", "1.5px")
                .style("stroke-dasharray", "none")

            tempGroup.selectAll('text')
                .data(weatherData.filter(function(d){ 
                         return d.hasOwnProperty("time") &&
                                 d.hasOwnProperty("temperature"); }))
                .join('text')
                .attr("class", "tempText")
                .attr("x", function(d) { return xScale(d.time); })
                .attr("y", function(d) { return yTempScale(2.4); })
                .text(function(d){ return (d.temperature).toFixed(1)})
                .attr("fill", function(d){ return colorScale(d.temperature);})
                .attr("dy", "2")
                .attr("font-weight", "bold")
                .attr("text-anchor", "middle")
                .style("font-size", "12")

        let rainGroup = svgDoc.select("g.rain");
            // rainGroup.selectAll('rect')
            //     .data(weatherData.filter(function(d){ 
            //         return d.hasOwnProperty("time") 
            //                && d.hasOwnProperty("rain") 
            //                && d.rain.probability > 0
            //                ; }))
            //     .join('rect')
            //     .attr("class", "rainRect")
            //     .attr("x", function(d) { return xScale(d.time) - 9; })
            //     .attr("y", function(d) { return yTempScale(5); })
            //     .attr("width", function(d) { return 18; })
            //     .attr("height", 40)
            //     .attr("rx", 9)
            //     .style("stroke", "silver")
            //     .style("stroke-width", "0.5px")
            //     .style("stroke-dasharray", "none")

            // rainGroup.selectAll('text')
            //     .data(weatherData.filter(function(d){ 
            //              return d.hasOwnProperty("time") &&
            //                      d.hasOwnProperty("rain"); }))
            //     .join('text')
            //     .attr("class", "rainText")
            //     .attr("x", function(d) { return xScale(d.time); })
            //     .attr("y", function(d) { return yTempScale(2); })
            //     .text(function(d){ return (d.rain.probability)})
            //     .attr("fill", "blue")
            //     .attr("dy", "2")
            //     .attr("font-weight", "bold")
            //     .attr("text-anchor", "middle")
            //     .style("font-size", "10")



            // TODO *************
            // place rain probability on top of cloud :)


        let symbolGroup = svgDoc.select("g.symbols");
                
                symbolGroup.selectAll("use")
                .data(weatherData.filter(function(d){ 
                    return d.hasOwnProperty("time") 
                           && d.hasOwnProperty("rain"); }))
                .join("use")
                //.append("use")
                .attr("class", "symbols")
                .attr("x", function(d) { return xScale(d.time) - 30; })
                .attr("y", function(d) { return yTempScale(5); })
                .attr("xlink:href", function(d){
                    var n = d.time % 24;
                    console.log(n);
                    if(n < 7 || n > 21 ){

                        // TODO: map the expected rainfall values 
                        // to rainy_* 
                        if(d.cloudiness > 80){
                            return "#cloudy-night-3";

                        }
                        if(d.cloudiness > 60){
                            return "#cloudy-night-2";
                        }
                        if(d.cloudiness > 40){
                            return "#cloudy-night-1";
                        }
                        return "#night";
                    } else {
                        if(d.cloudiness > 80){
                            return "#cloudy";
                        }
                        if(d.cloudiness > 60){
                            return "#cloudy-day-3";
                        }
                        if(d.cloudiness > 40){
                            return "#cloudy-day-2";
                        }
                        if(d.cloudiness > 20){
                            return "#cloudy-day-1";
                        }
                        return "#day";

                    }
                }
                )
                    
                    


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
        let weatherData = this.state.weatherData;
        
        var time = this.getTimeDecimal();
        var timeY = this.getTimeY(time);

        let xScale = this.xScale;
        let yScale = this.yScale;
        let yTempScale = this.yTempScale;
        let xAxis = this.xAxis.scale(xScale);
        let yAxis = this.yAxis.scale(yScale);
        var height = this.state.height;

        let st = styles.svgContent;
        var svgDoc = d3.select('svg#linechartsvg')
            //.attr("height", this.state.height)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 600 600")
            .classed(st, true);
            ;

            //svgDoc.select("g.y.axis").attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + 0 + ")").call(yAxis);

            let assistsGroup = svgDoc.select('g.sunpath');

            let sunpathLine = d3.line()
            .curve(d3.curveNatural)
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
                .attr("d", sunpathLine)
                .style("fill", "none")
                .style("stroke", "white")
                .style("stroke-width", "2.0px")


            let sunpathNight = svgDoc.select("g.sunpathNight")
                .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + this.state.margin.top + ")");
            
            sunpathNight.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", sunpathLine)
                .style("fill", "none")
                .style("stroke", "white")
                .style("stroke-width", "0.5px")
                .style("stroke-dasharray", ("3,3"))

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
                .style("fill", "url(#sunglow)")
                .style("stroke", "white")
                .style("stroke-width", "0px")

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
                    .attr("r", 7.5)
                    .attr("cx", function(){ return xScale(time)})
                    .attr("cy", function(){ return yScale(timeY)})
                    .style("fill", "none")
                    .style("stroke", "white")
                    .style("stroke-width", "3px")
                    .style("stroke-dasharray", "2 3")

            svgDoc.select("g.sunriseset")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + this.state.margin.top + ")")
            .append("line")
            .datum(data)
            .attr("x1", function(data){ return xScale(data[0].x)})
            .attr("y1", function(){ return yScale(4)})
            .attr("x2", function(data){ return xScale(data[data.length -1].x)})
            .attr("y2", function(){ return yScale(4)})
            .style("stroke", "silver")
            .style("stroke-width", "1px")

            svgDoc.select("g.nightblock")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + this.state.margin.top + ")")
            .append("rect")
            .datum(data)
            .attr("x", function(data){ return xScale(data[0].x)})
            .attr("y", function(){ return yScale(4)})
            .attr("width", function(data){ return xScale(data[data.length -1].x)})
            .attr("height", function(){ return yScale(4)})
            .style("fill", "grblackey")

            

            svgDoc.select("g.x.axis")
            .attr("stroke", "white")
            .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + 150 + ")")
            .attr("stroke", "silver")
            .call(xAxis)
            .selectAll("text")
            .attr("font-size", 10)
            ;


            let tempCircles = svgDoc.select("g.temperature")
                .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + 26 + ")")
                .selectAll("circle")
                .data(weatherData.filter(function(d){ 
                    return d.hasOwnProperty("time") 
                           && d.hasOwnProperty("temperature"); }))
                .enter()
                .append("circle")
                .attr("class", "tempCircle")
                .attr("cx", function(d) { return xScale(d.time); })
                .attr("cy", function(d) { return yScale(4); })
                .attr("r", 10)
                .style("stroke", "silver")
                .style("stroke-width", "1px")
                .style("stroke-dasharray", "none")

                // let rainRects = svgDoc.select("g.rain")
                // .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + 50 + ")")
                // .selectAll("rect")
                // .data(weatherData.filter(function(d){ 
                //     return d.hasOwnProperty("time") 
                //            && d.hasOwnProperty("rain"); }))
                // .enter()
                // .append("rect")
                // .attr("class", "rainRect")
                // .attr("x", function(d) { return xScale(d.time); })
                // .attr("y", function(d) { return yTempScale(5); })
                // .attr("width", 11)
                // .attr("height", 2)
                // .style("stroke", "blue")
                // .style("stroke-width", "2.0px")
                // .style("stroke-dasharray", "none")

                let symbols = svgDoc.select("g.symbols")
                .attr("transform", "translate(" + this.state.margin.yaxisMargin + "," + 70 + ")")
                .selectAll("use")
                .data(weatherData.filter(function(d){ 
                    return d.hasOwnProperty("time") 
                           && d.hasOwnProperty("rain"); }))
                .enter()
                .append("use")
                .attr("class", "symbols")
                .attr("x", function(d) { return xScale(d.time) -30; })
                .attr("y", function(d) { return yTempScale(5); })
                .attr("xlink:href", "#rainy-1")


   
        }

    render() {
        console.log("rendering");

        const { classes } = this.props;

        return(
            <div className={classes.svgContainer} ref={this.lineChartRef}>
                
            <svg id="linechartsvg" >
                
                <WeatherIconDefs/>

                
            
                <g className="sunposition"></g>

                <g className="sunpath"></g>

                <g className="nightblock"></g>

                <g className="sunpositionnight"></g>

                

                <g className="sunpathNight"></g>

                <g className="x axis"></g>

                <g className="y axis"></g>

                <g className="sunriseset"></g>

                <g className="temperature"></g>

                <g className="rain"></g>

                <g className="symbols"></g>
            </svg>
        </div>
        )
    }



}

export default withStyles(styles, { withTheme: true })(SunLineChart);
