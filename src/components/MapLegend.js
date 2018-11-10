import React, {Component} from 'react';

class MapLegend extends Component {
    constructor() {
        super();
        this.state = {
            legendDomain: [0, 2364, 4041, 5150, 6873, 8437, 9025, 10640, 11569, 12602, 13998, 15734],
            legendLabels: ["< 170", "2300+", "4000+", "5000+", "6000+", "8000+", "9000+", "10000+", "11000+", "12000+", "13000+", "> 15000"]
        };
    }

    render() {
        let legendWidth = 20, legendHeight = 20;
        const LegendCard = this.state.legendDomain.map( (elem, i) =>
            {
                return (
                    <g className="legend" key={i}>
                        <rect x={20} y={((i)*legendHeight) + 5*legendHeight+i*4} width={legendWidth} height={legendHeight} style={{fill: this.props.color(elem), opacity: 0.8}}
                        rx={4} ry={4}/>
                        <text x={50} y={((i)*legendHeight) + 5.9*legendHeight + i*3.8}>
                            {this.state.legendLabels[i]}
                        </text>
                    </g>
                )
            }
        );

        return(
            <g>{LegendCard}</g>
        )
    }
}

export default MapLegend;