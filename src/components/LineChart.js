import React, {Component} from 'react';
import * as d3 from "d3";

class LineChart extends Component {
    constructor() {
        super();
        this.state = {
            data: null
        };
        this.drawLine = this.drawLine.bind(this);
    }

    componentWillMount() {
        d3.queue()
            .defer(d3.tsv, './data/robbery_month_count.tsv')
            .await((error, robbery_month_count) => {
                this.setState({
                    data: robbery_month_count
                });
                this.drawLine();
            })
    }

    drawLine() {
        const margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 830 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;
        const parseTime = d3.timeParse("%m.%Y"),
            bisectDate = d3.bisector(function (d) {
                return d.day;
            }).left,
            formatTime = d3.timeFormat("%B, %Y"),
            x = d3.scaleTime().range([0, width - 150]),
            y = d3.scaleLinear().range([height, 0]),
            valueline = d3.line()
                .x(function(d) { return x(d.day); })
                .y(function(d) { return y(d.value); });
        if(this.state.data) {
            this.state.data.forEach(function(d) {
                d.day = parseTime(d.day);
                d.value = +d.value;
            });
            let data = this.state.data;

            x.domain(d3.extent(this.state.data, function(d) {
                return d.day;
            }));
            y.domain([2800, d3.max(this.state.data, function(d) { return d.value; })]);

            let svg = d3.select(this.refs.anchor);

            svg.append("path")
                .attr("transform", "translate(50,50)")
                .data([this.state.data])
                .attr("class", "line")
                .attr("d", valueline);

            svg.append("g")
                .attr("transform", "translate(50," + 200 + ")")
                .call(d3.axisBottom(x));

            svg.append("g")
                .attr("transform", "translate(50,50)")
                .call(d3.axisLeft(y).ticks().tickFormat(function(d) { return parseInt(d); }));

            let curtain = svg.append('rect')
                .attr('x', -1 * (width-50))
                .attr('y', -1 * height)
                .attr('height', height)
                .attr('width', (width-50))
                .attr('transform', 'rotate(180)')
                .style('fill', '#ffffff');
            curtain.transition()
                .duration(2000)
                .attr('x', -2 * (width-50));

            let tip = svg.append("g")
                .attr("class", "focus")
                .style("display", "none");
            tip.append("line")
                .attr("class", "x-hover-line hover-line")
                .attr("y1", 0)
                .attr("y2", 200);

            tip.append('circle')
                .attr('r', 7.5)
                .style('fill', '#e0553c')
                .style('stroke', '#4d88d6')
                .style('stroke-width', '5px');
            tip.append('g')
                .append('rect')
                .attr('rx', 6)
                .attr('ry', 6)
                .attr('y', -14)
                .attr('x', 13)
                .attr('width', 190)
                .attr('height', 25)
                .style('fill', '#66bddd')
                .style('opacity', '0.3')

            tip.select('g').append('text')
                .attr('x', 17)
                .attr('dy', '.31em')
                .style('font-family', 'Verdana, Geneva, sans-serif');

            function mousemove() {
                let x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d;
                if(d1) {
                    d = x0 - d0.day > d1.day - x0 ? d1 : d0;
                } else {
                    d = d0
                }

                let transX = x(d.day) + 50;
                let transY = y(d.value) + 50;
                tip.attr("transform", "translate(" + transX +  "," + transY + ")");
                tip.select("text").text(function() { return formatTime(d.day) + ':' + d.value; });
                tip.select(".x-hover-line").attr("y2", height - y(d.value));
                tip.select(".y-hover-line").attr("x2", width-50 + width-50);
            }

            svg.append("rect")
                .attr("class", "overlay")
                .attr("transform","translate(50,0)")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() { tip.style("display", 'block'); })
                .on("mouseout", function() { tip.style("display", "none"); })
                .on("mousemove", mousemove);
        }
    }

    render() {
        return(
            <svg ref="anchor" width={800} height={250}/>
        )
    }
}

export default LineChart;