/* eslint-disable no-unused-vars */
import React from 'react';
import regression from 'regression';
import './App.css';
import { saveAs } from 'file-saver';
import { ScatterChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Scatter, ComposedChart, Bar } from 'recharts';


export default class App extends React.Component {

    /* state (set of variables): the render will refresh every time the state has changed */
    state = { data: [], graphPt: [], equation: [] }

    /** Load file and save it in data */
    upload(input) {
        const reader = new FileReader(); // declare file reader
        reader.readAsText(input.files[0]); // read file
        reader.onload = (event) => { // when loaded (async?)
            this.setState({ data: App.parseCSV(event.target.result.toString()) }); // set data field
            this.setState({ graphPt: App.setChartData(this.state.data) }); // set point field
        };
    }

    /** Data parsed from string to DataPoint */
    static parseCSV(text) {
        /* csv delimiters */
        let row = "\n";
        let field = ",";
        let result = []; //output

        text
            .trim() //remove white spaces
            .split(row) //separate rows
            .forEach((element) => {
                let sPoint = element.split(field);
                let point = [];
                sPoint.forEach((e) => { point.push(parseInt(e)); })
                result.push(point);
            });
        return result;
    }

    /** Data parsed from Datapoint to point of the graph */
    static setChartData(data) {
        let pt = [];
        let j = 0;
        data.forEach((couple) => {
            pt.push({ "x": couple[j], "y": couple[j + 1] });
        });
        return pt;
    }

    /** Return single point in html */
    printPoint(element) {
        const point = [];
        element.forEach((e) => { point.push(<td>{e}</td>); });
        return point;
    }

    /** Return data formatted for html table */
    printData(data) {
        const table = [];
        data.forEach((element) => {
            table.push(
                <tr>
                    {this.printPoint(element)}
                </tr>,
            );
        });
        return table;
    }

    /** Save the predictor in function */
    train(data) {
        this.setState({ predictor: regression.linear(data) });
        this.setState({ equation: regression.linear(data).equation });
    }

    /** Return predictor function as string */
    printPredictor() {
        return this.state.predictor ? this.state.predictor.string : '';
    }

    /** Data parsed from DataPoint to point of a straight line of a graph */
    Line() {
        let line = [];
        this.state.data.forEach((element) => {
            line.push({ "x": element[0], "y": ((this.state.equation[0] * element[0]) + this.state.equation[1]) });
        });
        return line;
    }

    /** Download predictor as JSON */
    downloadJSON() {
        const { equation } = this.state.predictor; // get equation
        const FileSaver = require('file-saver'); // import file saver
        const text = `${equation[0]}, ${equation[1]}`; // string output
        const file = new File([text], 'Training.json', { type: 'text/json;charset=utf-8' });
        FileSaver.saveAs(file); // download
    }

    /* HTML RENDER FOR REACT */
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>Training Module</h1>
                </header>
                <main>
                    <input
                        type="file"
                        name="data"
                        id="data"
                        onChange={(event) => { this.upload(event.target); }}
                    />

                    <table>
                        <thead>
                            <tr>
                                <th>X</th>
                                <th>Y</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.printData(this.state.data)}
                        </tbody>
                    </table>

                    <ComposedChart width={730} height={250} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="x" />
                        <YAxis type="number" dataKey="y" />
                        <Tooltip />
                        <Legend />
                        <Scatter name="Punti" data={this.state.graphPt} fill="#8884d8" />
                        <Scatter name="Retta" data={this.Line()} fill="#ff7300" line />
                    </ComposedChart>

                    <input
                        type="button"
                        value="Train 🚂"
                        onClick={(event) => { this.train(this.state.data); }}
                    />

                    <p>
                        Function:
              {this.printPredictor(this.state.predictor)}
                    </p>

                    <input
                        type="button"
                        value="Download JSON"
                        onClick={() => { this.downloadJSON(this.state.predictor); }}
                    />
                </main>
            </div>
        );
    }
}
