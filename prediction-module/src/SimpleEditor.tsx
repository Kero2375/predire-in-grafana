import React, { PureComponent } from 'react';
import { PanelEditorProps } from '@grafana/data';
import { SimpleOptions } from './types';

export class SimpleEditor extends PureComponent<PanelEditorProps<SimpleOptions>> {

    upload(input: any) {
        const reader = new FileReader();

        reader.readAsText(input.files[0]);
        reader.onload = (event) => {
            if (event.target && event.target.result) {
                this.props.onOptionsChange({ ...this.props.options, text: event.target.result.toString() });
            }
        };
    }

    render() {
        return (
            <div>
                <h5>Importazione Predittore</h5>
                <input type="file" id="Predictor" name="Predictor" onChange={(event) => { this.upload(event.target); }} />
            </div>
        );
    }
}
