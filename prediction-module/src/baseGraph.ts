import { FieldType, ArrayVector, GraphSeriesXY } from '@grafana/data';

export class BaseGraph{
    static graph: GraphSeriesXY = {
        label: "",
        data: [],
        color: "white",
        isVisible: true,
        timeStep: 3600000,
        seriesIndex: 0,
        timeField: {
            name: 'time',
            type: FieldType.time,
            values: new ArrayVector(),
            config: {}
        },
        valueField: {
            name: 'a-series',
            type: FieldType.number,
            values: new ArrayVector(),
            config: {}
        },
        yAxis: {
            index: 1, //1 = y-axis to the left; 0 = to the right (?)
            //min: 0, //first number in y-axis [optional]
            tickDecimals: 0 //decimal precision [optional]
        }
    };
}