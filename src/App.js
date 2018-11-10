import React, { Component } from 'react';
import logo from './mvd_logo.png';
import './App.css';
import MapComponent from './components/Map';
import BarChart from './components/BarChart';
import HeatMap from './components/HeatMap';
import LineChart from './components/LineChart';

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
                <div className="header">
                    <div className="image" style={{width: 110, height: 70}}>
                        <img src={logo}/>
                    </div>
                    <div className="spans">
                        <span className="title">
                            Преступления Санкт-Петербурга
                        </span>
                        <span>данные предоставлены МВД РФ</span>
                    </div>
                </div>

                <div id="id_map">
                    <span className="mapHelp">*чтобы увидеть количество преступлений в районе, наведите на карту</span>
                    <MapComponent width={this.state.chart_width/2} height={450}/>
                    <div className="tooltipMap" style={{display: "none"}}/>
                </div>
                <div id="id_barChart">
                    <BarChart width={this.state.chart_width/2} height={500}/>
                    <div className="tooltip" style={{display: "none"}}/>
                </div>

                <div id="lineChart">
                    <span>Количество преступлений за период Январь 2014 - Февраль 2017</span>
                    <LineChart/>
                </div>
                <div id="heatMap">
                    <span>Количество преступлений в течение дня</span>
                    <HeatMap/>
                    <div className="tooltip" style={{display: "none"}}/>
                </div>
            </div>

        );
    }
}

export default App;
