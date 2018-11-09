import React, {Component} from 'react';
import * as d3 from 'd3';
import topojson from 'topojson';
import queue from 'queue';
// import * as queue from "d3-queue";

class MapComponent extends Component {
    constructor() {
        super();
        this.state = {
            SP_boundaries: null,
            robberies: null
        };
    }


    componentWillMount() {
        queue().defer(d3.csv, './public/robberies.csv')
            .defer(d3.json, './public/SP_boundaries.topojson')
            // .defer(d3.json, "robbery_types_city.json")
            // .defer(d3.json, "robbery_types_areas.json")
            .await((error, SP_boundaries, robberies) => {
                // console.info(1)
                this.setState({
                    SP_boundaries,
                    robberies
                });
                // console.info(this.state.robberies);
            })

    }

    componentDidUpdate() {
        const svg = d3.select(this.refs.anchor);

        const color_domain = [166, 2364, 4041, 5150, 6873, 8437, 9025, 10640, 11569, 12602, 13998, 15734];

        const color = d3.scaleThreshold()
            .domain(color_domain)
            .range(["#ffffd9",'#b7d6a7',"#d1db9d","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0",'#2973ce',"#225ea8","#1e5599","#112f84", '#081d59','#000207']);

        const projection = d3.geoAlbers()
            .rotate([-2927, 0])
            .center([-377.17, 59.91])
            .parallels([59, 64])
            .scale(35990)
            .translate([300 / 2, 500 / 2]);

        const path = d3.geoPath()
            .projection(projection);

        var crime = {};
        this.state.robberies.forEach(function(d) {
            crime[d.Name ] = +d.NUMPOINTS;
        });
        var geojson = topojson.feature(this.state.SP_boundaries, this.state.SP_boundaries.objects.SP_boundaries);
        svg.append('g')
            .attr("class", "map")
            .selectAll("path")
            .attr('class', 'map_path')
            .data(geojson.features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) {
                return color(crime[d.properties.Name ]);
            })
            .style("opacity", 0.8)

    }

    render () {
        const { SP_boundaries, robberies} = this.state;

        if (!SP_boundaries || !robberies ) {
            return null;
        }
        return (
            <svg width = {this.props.width} height={this.props.height} ref="anchor"/>
        );
    }
}

export default MapComponent;