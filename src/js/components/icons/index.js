import Icon from './Icon.jsx';
import _ from 'lodash';

const strings = {
  Add:'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  AlarmOff:'M12 6c3.87 0 7 3.13 7 7 0 .84-.16 1.65-.43 2.4l1.52 1.52c.58-1.19.91-2.51.91-3.92 0-4.97-4.03-9-9-9-1.41 0-2.73.33-3.92.91L9.6 6.43C10.35 6.16 11.16 6 12 6zm10-.28l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM2.92 2.29L1.65 3.57 2.98 4.9l-1.11.93 1.42 1.42 1.11-.94.8.8C3.83 8.69 3 10.75 3 13c0 4.97 4.02 9 9 9 2.25 0 4.31-.83 5.89-2.2l2.2 2.2 1.27-1.27L3.89 3.27l-.97-.98zm13.55 16.1C15.26 19.39 13.7 20 12 20c-3.87 0-7-3.13-7-7 0-1.7.61-3.26 1.61-4.47l9.86 9.86zM8.02 3.28L6.6 1.86l-.86.71 1.42 1.42.86-.71z',
  Box:'M20.8,3.2v17.6H3.2V3.2H20.8 M22.5,1.5h-1.7H3.2H1.5v1.7v17.6v1.7h1.7h17.6h1.7v-1.7V3.2V1.5 L22.5,1.5z',
  Checkmark:'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  ChevronRight:'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  Close:'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  Edit:'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  Home:'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  MoreHoriz:'M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  Opsee:'M2.6,2.2c-0.2,0-0.4,0.2-0.4,0.4v5.9c0,0.2,0.2,0.4,0.4,0.4c0.2,0,0.4-0.2,0.4-0.4V2.6C2.9,2.4,2.8,2.2,2.6,2.2 z M7,2.2c-0.2,0-0.4,0.2-0.4,0.4v5.9c0,0.2,0.2,0.4,0.4,0.4c0.2,0,0.4-0.2,0.4-0.4V2.6C7.3,2.4,7.2,2.2,7,2.2z M15.8,5.1 c0.2,0,0.4-0.2,0.4-0.4V2.6c0-0.2-0.2-0.4-0.4-0.4s-0.4,0.2-0.4,0.4v2.2C15.4,5,15.6,5.1,15.8,5.1z M20.2,2.2 c-0.2,0-0.4,0.2-0.4,0.4v2.2c0,0.2,0.2,0.4,0.4,0.4c0.2,0,0.4-0.2,0.4-0.4V2.6C20.5,2.4,20.4,2.2,20.2,2.2z M20.2,0 c-0.9,0-1.7,0.5-2.2,1.2C17.5,0.5,16.7,0,15.8,0S14,0.5,13.6,1.2C13.1,0.5,12.3,0,11.4,0c-0.9,0-1.7,0.5-2.2,1.2C8.7,0.5,7.9,0,7,0 S5.2,0.5,4.8,1.2C4.3,0.5,3.5,0,2.6,0C1.2,0,0,1.2,0,2.6v5.9C0,9.8,1.2,11,2.6,11c0.7,0,1.4-0.3,1.8-0.8v2.2c0,0.8,0.7,1.5,1.5,1.5 s1.5-0.7,1.5-1.5V11c0.8-0.1,1.4-0.6,1.8-1.2c0.4,0.7,1.3,1.2,2.2,1.2c0.9,0,1.7-0.5,2.2-1.2c0.4,0.7,1.3,1.2,2.2,1.2 s1.7-0.5,2.2-1.2c0.4,0.7,1.3,1.2,2.2,1.2c1.4,0,2.6-1.2,2.6-2.6V2.6C22.7,1.2,21.6,0,20.2,0z M2.6,10.3c-1,0-1.8-0.8-1.8-1.8V2.6 c0-1,0.8-1.8,1.8-1.8s1.8,0.8,1.8,1.8v5.9C4.4,9.4,3.6,10.3,2.6,10.3z M7,10.3L7,10.3c-0.2,0-0.4,0.2-0.4,0.4v1.8 c0,0.4-0.4,0.8-0.8,0.7c-0.4,0-0.7-0.4-0.7-0.8v-4l0,0V2.6c0-1,0.7-1.8,1.7-1.9c1.1-0.1,2,0.8,2,1.8v5.9C8.8,9.4,8,10.3,7,10.3z  M11.2,10.3c-0.9-0.1-1.7-0.9-1.7-1.9v-1C9.5,7.1,9.7,7,9.9,7h0.7C10.8,7,11,7.1,11,7.3v1.1c0,0.2,0.1,0.4,0.3,0.4 c0.2,0,0.4-0.1,0.4-0.4V7.3c0-0.6-0.5-1.1-1.1-1.1l0,0c-0.6,0-1.1-0.5-1.1-1.1V2.6c0-1,0.7-1.8,1.7-1.9c1.1-0.1,2,0.8,2,1.8v1.1 C13.2,3.9,13,4,12.8,4h-0.7c-0.2,0-0.4-0.2-0.4-0.4V2.6c0-0.2-0.1-0.4-0.3-0.4c-0.2,0-0.4,0.1-0.4,0.4v1.1c0,0.6,0.5,1.1,1.1,1.1 l0,0c0.6,0,1.1,0.5,1.1,1.1v2.6C13.2,9.5,12.3,10.4,11.2,10.3z M15.6,10.3c-0.9-0.1-1.7-0.9-1.7-1.9V2.6c0-1,0.7-1.8,1.7-1.9 c1.1-0.1,2,0.8,2,1.8v3.7c0,0.2-0.2,0.4-0.4,0.4h-0.7c-0.6,0-1.1,0.5-1.1,1.1v0.7c0,0.2,0.1,0.4,0.3,0.4c0.2,0,0.4-0.1,0.4-0.4V7.7 c0-0.2,0.2-0.4,0.4-0.4h0.7c0.2,0,0.4,0.2,0.4,0.4v0.7C17.6,9.5,16.7,10.4,15.6,10.3z M22,6.2c0,0.2-0.2,0.4-0.4,0.4h-0.7 c-0.6,0-1.1,0.5-1.1,1.1v0.7c0,0.2,0.1,0.4,0.3,0.4c0.2,0,0.4-0.1,0.4-0.4V7.7c0-0.2,0.2-0.4,0.4-0.4h0.7c0.2,0,0.4,0.2,0.4,0.4v0.7 c0,1.1-0.9,1.9-2,1.8c-0.9-0.1-1.7-0.9-1.7-1.9V2.6c0-1,0.7-1.8,1.7-1.9c1.1-0.1,2,0.8,2,1.8V6.2z',
  Person:'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
}

export default _.mapValues(strings, s => Icon(s));