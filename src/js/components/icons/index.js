import SVG from './SVG';
import _ from 'lodash';
import paths from './paths';

export default _.mapValues(paths, s => SVG(s));