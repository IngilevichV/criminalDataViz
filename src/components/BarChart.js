import React, {Component} from 'react';
import * as d3 from 'd3';
import ReactTransitionGroup from 'react-addons-transition-group';
import Bar from "./Bars";

class BarChart extends React.Component {
    constructor() {
        super();
        this.state = {
            robbery_types_city: null,
            robbery_types_areas: null,
            data: null
        };
        this.createBarChart = this.createBarChart.bind(this);
    }

    componentWillMount(){
        d3.queue()
            .defer(d3.json, './data/robbery_types_city.json')
            .defer(d3.json, './data/robbery_types_areas.json')
            .await((error, robbery_types_city, robbery_types_areas) => {
                let data = robbery_types_city.sort(function(a, b) { return a.value - b.value; });
                this.setState({
                    robbery_types_city: robbery_types_city,
                    robbery_types_areas: robbery_types_areas,
                    data: data
                });
                this.createBarChart();
            })
    }


    createBarChart() {
        const margin = {top: 20, right: 20, bottom: 30, left: 350},
            width = this.props.width - margin.left - margin.right,
            height = this.props.height - margin.top - margin.bottom;

        let x = d3.scaleLinear().range([0, width]);
        let y = d3.scaleBand().range([height, 0]);
        if(this.state.data) {
            x.domain([0, d3.max(this.state.data, function(d) { return d.value; })]);
            y.domain(this.state.data.map(function(d) { return d.type; }))
                .paddingInner(0.1);
            if(this.refs.y) {
                let g = d3.select(this.refs.y);
                g.attr("class", "y_axis_bc")
                    .style('opacity', 1)
                    .call(d3.axisLeft(y));
            }
        }


    }

    render () {
        const { robbery_types_city, robbery_types_areas, data} = this.state;
        if(data) {
            const margin = {top: 20, right: 20, bottom: 30, left: 350},
                width = this.props.width - margin.left - margin.right,
                height = this.props.height - margin.top - margin.bottom;

            let x = d3.scaleLinear().range([0, width]);
            let y = d3.scaleBand().range([height, 0]);

            x.domain([0, d3.max(data, function(d) { return d.value; })]);
            y.domain(data.map(function(d) { return d.type; }))
                .paddingInner(0.1);


            if (!robbery_types_city || !robbery_types_areas ) {
                return null;
            }
            return (
                <svg width = {this.props.width-150} height={this.props.height}>
                    <g className='barChart' transform={"translate(" + margin.left + "," + margin.top + ")"} ref="anchor">
                        {data.map((d, i) => (
                            <Bar i={i} key={`key-${i}`} x={0} y={y(d.type)} width={x(d.value)} height={y.bandwidth()-1} zeroPozY={y(0)}
                            zeroPosWidth={x(0)} d = {d}/>
                        ))}
                    </g>
                    <g ref="y" transform={"translate(" + margin.left + "," + margin.top + ")"}/>
                </svg>
            );
        } else {
            return null;
        }

    }

}

export default BarChart;