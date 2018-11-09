import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapComponent from './components/Map';

class App extends Component {
    constructor() {
        super();
        this.state = {
            chart_width: document.body.clientWidth
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    updateDimensions() {
        this.setState({ chart_width: document.body.clientWidth});
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    render() {
        return (
            <div className="main_page_wrapper">
                <div id="id_map">
                    <MapComponent width={this.state.chart_width/2} height={700}/>
                </div>
                {/*<div id="id_barChart">*/}
                    {/*<BarChart width={this.state.chart_width/2} height={700}/>*/}
                {/*</div>*/}

            </div>

        );
    }
}

export default App;
