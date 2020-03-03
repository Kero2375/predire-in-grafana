import { PanelProps, GraphSeriesXY } from '@grafana/data';
import { Graph } from '@grafana/ui';

import React, { PureComponent } from 'react';
import { SimpleOptions } from 'types';
import { BaseGraph } from 'baseGraph';

interface Props extends PanelProps<SimpleOptions> { }

export class Panel extends PureComponent<Props> {
    series: number[][] = []; //data buffer 
    /* example:
    [
        [time, val0, val1]
        [time, val0, val1]
        ...
    ]
    */

    /** Returns data received from query and save it in this.series */
    getData() {
        const { series } = this.props.data; //get series from prop

        const time = series[0].fields[1].values.toArray();
        const value0 = series[0].fields[0].values.toArray();
        const value1 = series[1].fields[0].values.toArray();
        const data = [];

        for (const i of time.keys()) {
            if (value0[i] && value1[i])
                data.push([time[i], value0[i], value1[i]]);
        }
        this.series = data;

        return this.series;
    }

    makeFunction() {
        const { options } = this.props;
        const m = this.parseJSON(options.text)[0];
        const q = this.parseJSON(options.text)[1];
        return (x: number) => x * m + q;
    }

    /** Returns array with json data (for RL only) */
    parseJSON(text: string) {
        const field = ",";
        const result: number[] = [];

        text
            .trim()
            .split(field)
            .forEach((element) => {
                result.push(parseFloat(element));
            });
        return result;
    }

    /** Returns for each measure, time and ratio of real x and y */
    ratio(data: number[][]) {
        let rat: number[][] = [];
        data.forEach((element) => {
            const time = element[0];
            const xReal = element[1];
            const yReal = element[2] || NaN;
            rat.push([time, xReal / yReal]);
        });
        return rat;
    }

    /** Returns for each measure, time and ratio of real x and predicted y */
    predicted(data: number[][]) {
        const fun = this.makeFunction();

        let pred: number[][] = [];
        data.forEach((element) => {
            const time = element[0];
            const xReal = element[1];
            const yPred = fun(element[1]); //y predicted starting from the x (y=xm+q)
            pred.push([time, xReal / yPred]);
        });
        return pred;
    }

    /** Returns difference between latest real and predicted ratios */
    lastDiff(data: number[][]) {
        const ratio = this.ratio(data);
        const predicted = this.predicted(data);

        const last = ratio.length - 1;
        const diff = ratio[last][1] - predicted[last][1];

        return Math.abs(diff) || "Predictor not found!";
    }

    /** Ract render method */
    render() {
        const graphs: GraphSeriesXY[] = [
            {  // Real ratio
                ...BaseGraph.graph,
                color: "grey",
                data: this.ratio(this.getData()),
                label: "Real ratio",
                seriesIndex: 0
            },
            {  // Predicted ratio
                ...BaseGraph.graph,
                color: "green",
                data: this.predicted(this.getData()),
                label: "Predicted ratio",
                seriesIndex: 1
            },
        ];

        return (
            <div>
                <span className="title"> {this.props.data.series[0].name + " / " + this.props.data.series[1].name} </span>
                <Graph series={graphs} width={this.props.width} height={200} timeRange={this.props.timeRange} />
                <input contentEditable={false} className="diff" type="text" value={this.lastDiff(this.getData())} />
            </div>
        );
    }
}
