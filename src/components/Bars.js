import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

class Bar extends Component {
    constructor() {
        super();
        this.state = {
            x: null,
            y: null,
            height: 30,
            width: null,
            fillOpacity: 1,
            className: "enter",
            fill: '#1e5599',
            mouseX: 0,
            mouseY: 0
        };
        this.mouseOverHandle = this.mouseOverHandle.bind(this);
    }

    transition = d3.transition()
        .duration(750)
        .ease(d3.easeCubicInOut);

    componentWillEnter(callback) {
        // start enter transition, then callback()
        let node = d3.select(ReactDOM.findDOMNode(this));
        this.setState({x: this.props.x});
        this.setState({y: this.props.y});
        this.setState({width: this.props.width});
        this.setState({height: this.props.height});
        node.transition(this.transition)
            .attr('y', this.props.y)
            .attr('width', this.props.width)
            .attr('height', this.props.height)
            .style('fill-opacity', 1)
            .on('end', () => {
                this.setState({y: this.props.y, x: this.props.X, width: this.props.width, height: this.props.height, fillOpacity: 1});
                callback()
            });
    }
    componentWillLeave(callback) {
        // start exit transition, then callback()
        let node = d3.select(ReactDOM.findDOMNode(this));
        this.setState({className: 'exit'});

        node.transition(this.transition)
            .attr('y', this.props.zeroPozY)
            .attr('width', this.props.width)
            .style('fill-opacity', 1)
            .on('end', () => {
                this.setState({x: this.props.X, y: this.props.y, width: this.props.width, fillOpacity: 1});
                callback()
            });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.i !== nextProps.i) {
            let node = d3.select(ReactDOM.findDOMNode(this));

            this.setState({className: 'update'});
            node.transition(this.transition)
                .attr('y', this.props.y)
                .attr('width', this.props.width)
                .on('end', () => this.setState({y: this.props.y, width: this.props.width}));
        }
    }
    mouseOverHandle(){
        d3.select('.tooltip')
            .style("left", this.state.mouseX - 30 + "px")
            .style("top", this.state.mouseY - 80 + "px")
            .style("display", "inline-block")
            .html((this.props.d.type) + "<br>"  + (this.props.d.value));
    }
    mouseLeaveHandle(){
        d3.select('.tooltip')
            .style("display", "none");
    }
    _onMouseMove(e) {
        this.setState({ mouseX: e.screenX, mouseY: e.screenY });
        d3.select('.tooltip')
            .style("left", this.state.mouseX - 30 + "px")
            .style("top", this.state.mouseY - 80 + "px")
            .style("display", "inline-block")
            .html((this.props.d.type) + "<br>"  + (this.props.d.value));
    };

    render() {
        return(
            <Fragment>
                <rect
                    onMouseEnter={this.mouseOverHandle}
                    onMouseMove={this._onMouseMove.bind(this)}
                    onMouseLeave={this.mouseLeaveHandle.bind(this)}
                    y={this.props.y}
                    x={this.props.x}
                    height={this.props.height}
                    width={this.props.width}
                    className={this.state.className}
                    style={{fillOpacity: this.state.fillOpacity, fill: this.state.fill}}/>
            </Fragment>
        )
    }
}

export default Bar;