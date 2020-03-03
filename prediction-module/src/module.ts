import { PanelPlugin } from '@grafana/data';
import { SimpleOptions, defaults } from './types';
import { Panel } from './SimplePanel';
import { SimpleEditor } from './SimpleEditor';
import './style.css';

export const plugin = new PanelPlugin<SimpleOptions>(Panel).setDefaults(defaults).setEditor(SimpleEditor);
