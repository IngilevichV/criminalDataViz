import React, {Component} from 'react';
import * as d3 from "d3";

class HeatMap extends Component {
    constructor() {
        super();
        this.state = {
            data: null,
            mouseX: 0,
            mouseY: 0
        };
        this.mouseEnterHandle = this.mouseEnterHandle.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this.mouseLeaveHandle = this.mouseLeaveHandle.bind(this);
    }

    componentWillMount() {
        d3.queue()
            .defer(d3.csv, './data/robbery.csv')
            .await((error, robberies) => {
                this.setState({
                    data: robberies
                });
            })
    }

    mouseEnterHandle(d){
        if(this.state.mouseX > 0 && this.state.mouseY > 0) {
            d3.select('.tooltip')
                .style("left", this.state.mouseX - 10 + "px")
                .style("top", this.state.mouseY + 20 + "px")
                .style("display", "inline-block")
                .html("<span>" + d.value + "</span>");
        }
    }
    mouseLeaveHandle(){
        d3.select('.tooltip')
            .style("display", "none");
    }
    _onMouseMove(e) {
        // d3.select(this)
        //     .transition().duration(300).style("fill", 'red');
        this.setState({ mouseX: e.screenX, mouseY: e.screenY });
    };

    render() {
        const colors = ["#ffffd9","#edf8b1",'#cef2ba',"#c7e9b4","#7fcdbb","#41b6c4","#1d91c0",'#2973ce',"#225ea8","#253494","#081d58",'#020c26'], // alternatively colorbrewer.YlGnBu[9]
            days = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"],
            hours = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
            gridSize = Math.floor(500 / 24),
            margin = { top: 50, right: 0, bottom: 50, left: 30 },
            width = 550 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        if (this.state.data) {
            let colorScale = d3.scaleQuantile()
                .domain([d3.min(this.state.data, function (d) { return d.value; }) - 550,  d3.max(this.state.data, function (d) { return d.value; })])
                .range(colors);
            const DayLabels = days.map((day, i) => {
                return(
                    <text x={0} y={i*gridSize} transform={"translate(0," + gridSize*2.4  + ")"} key={i} className={((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis")}>{day} </text>
                )
            });

            const TimeLabels=hours.map((hour, i) => {
                return(
                    <text x={i*gridSize} y={0} transform={"translate(" + gridSize*1.8  + ",30)"} key={i} className={((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis")}>{hour} </text>
                )
            });

            const HeatMapRect = this.state.data.map( (d, i) =>
                {
                    return (
                        <g className="legend" key={i} transform={"translate(30, 35)"}>
                            <rect x={(d.hour) * gridSize} y={(d.day-1) * gridSize} width={gridSize} height={gridSize}
                                  style={{
                                      fill: colorScale(d.value),
                                      opacity: 1,
                                      stroke: "white",
                                      "strokeWidth": "2px"}}
                                  rx={4} ry={4}
                                  onMouseMove={this._onMouseMove}
                                  onMouseEnter={() => this.mouseEnterHandle(d)}
                                  onMouseLeave={this.mouseLeaveHandle}
                                  />
                        </g>
                    )
                }
            );

            return(
                <svg width = {width} height={height}>
                    {DayLabels}
                    {TimeLabels}
                    {HeatMapRect}
                </svg>
            )
        } else {
            return null;
        }
    }
}

export default HeatMap;