import React from 'react';
import BaseSVG from './BaseSVG';

export default React.createClass({
  getDefaultProps() {
    return {
      height: '1.3rem',
      width: '100',
      viewBox: '0 0 500 96.2'
    };
  },
  render() {
    return (
      <BaseSVG {...this.props}>
        <path d="M107.26,29.14A16.11,16.11,0,0,0,97.55,21,18.93,18.93,0,0,0,92,20.1H62.66V31.76H92a5.22,5.22,0,0,1,3.75,1.42A5,5,0,0,1,97.23,37v5.12H74.74a16.72,16.72,0,0,0-7.84,1.7,16.27,16.27,0,0,0-5.24,4.23,16.48,16.48,0,0,0-2.9,5.51,19.11,19.11,0,0,0-.9,5.53,16.81,16.81,0,0,0,1.66,7.8,16.16,16.16,0,0,0,4.23,5.24A16.46,16.46,0,0,0,69.23,75a18.94,18.94,0,0,0,5.51.9H92a16.72,16.72,0,0,0,7.87-1.7,16.27,16.27,0,0,0,5.27-4.17,16.54,16.54,0,0,0,2.9-5.48,18.87,18.87,0,0,0,.9-5.49V37A16.72,16.72,0,0,0,107.26,29.14ZM97.3,59a5.41,5.41,0,0,1-1.37,3.77A5,5,0,0,1,92,64.28H74.83a5.6,5.6,0,0,1-3.75-1.34,4.67,4.67,0,0,1-1.58-3.76,5.51,5.51,0,0,1,1.36-3.8,4.94,4.94,0,0,1,3.88-1.53H97.29V59h0Z"/>
        <path d="M207.56,54.1a16.82,16.82,0,0,0,7.91-1.71,16.21,16.21,0,0,0,8.19-9.76,19,19,0,0,0,.9-5.53,16.85,16.85,0,0,0-1.71-7.92,16.26,16.26,0,0,0-4.25-5.29A16.46,16.46,0,0,0,213.09,21a19,19,0,0,0-5.53-.9H190.13a16.79,16.79,0,0,0-7.91,1.71A16.29,16.29,0,0,0,176.94,26,16.72,16.72,0,0,0,174,31.53a19.37,19.37,0,0,0-.9,5.54v22.2a16.79,16.79,0,0,0,1.72,7.91,16.06,16.06,0,0,0,9.76,8.19,19,19,0,0,0,5.53.91H222.8V64.5H190.23a5.52,5.52,0,0,1-3.82-1.39,4.86,4.86,0,0,1-1.54-3.85V54.06h22.69v0Zm-22.69-16.9a5.55,5.55,0,0,1,1.39-3.83,4.94,4.94,0,0,1,3.89-1.54h17.43a5.41,5.41,0,0,1,3.73,1.39,4.85,4.85,0,0,1,1.54,3.8,5.53,5.53,0,0,1-1.39,3.82,5,5,0,0,1-3.89,1.54H184.86V37.19h0Z"/>
        <path d="M309.11,76.08H290.43c-6.63,0-10.5-2.7-12.58-5a17,17,0,0,1-4.11-11.94V36.85c0-6.46,2.64-10.3,4.85-12.36a17.25,17.25,0,0,1,11.94-4.28h23.28V0h11.86V59.46a16,16,0,0,1-4.6,11.87A17.92,17.92,0,0,1,309.11,76.08ZM285.58,59.86a5.16,5.16,0,0,0,1,3.27,5.55,5.55,0,0,0,3.82,1.1h18.7c4.66-.06,4.66-3.58,4.66-4.72V32H290a5.35,5.35,0,0,0-3.32,1.11,5.06,5.06,0,0,0-1.06,3.68v23h0Z"/>
        <path d="M11.88,96.2H0V36.6a16.05,16.05,0,0,1,4.6-11.94,17.92,17.92,0,0,1,12-4.71H35.3c6.64,0,10.52,2.7,12.6,5A17,17,0,0,1,52,36.86V59.29c0,6.47-2.64,10.31-4.86,12.39A17.27,17.27,0,0,1,35.2,76H11.88V96.2ZM35.76,64.14A5.49,5.49,0,0,0,39.13,63a5.09,5.09,0,0,0,1.07-3.7V36.25a5.18,5.18,0,0,0-1-3.28,5.58,5.58,0,0,0-3.85-1.1H16.55c-4.68.06-4.68,3.58-4.68,4.78V64.12H35.75v0Z"/>
        <path d="M241.19,76.1H229.34V36.68a16.05,16.05,0,0,1,4.59-11.86A18,18,0,0,1,246,20H269V31.9H245.92c-4.78.07-4.78,3.58-4.78,4.78V76.1h0Z"/>
        <path d="M348.42,76.13a18.14,18.14,0,0,1-12-4.78,16,16,0,0,1-4.55-11.8V20.14H343.7V59.55c0,2.59.9,3.44,1.86,4a7.29,7.29,0,0,0,3,.8H371.7V20.14h11.86V76.2H348.42V76.13Z"/>
        <path d="M149.56,95.67H121.39V83.81h28.16c3,0,4-1.19,4.63-2.29a8.73,8.73,0,0,0,1-3.4V75.85H132.79a18.14,18.14,0,0,1-12.57-4.49c-2.33-2.17-5.1-6.21-5.1-13.06V37.64a18.32,18.32,0,0,1,4.57-12.55c2.19-2.31,6.2-5.05,13-5.05H149.5c7,0,17.5,4.66,17.5,17.5V78.25C166.94,85.27,162.23,95.67,149.56,95.67ZM127,37.24V58.31a5.88,5.88,0,0,0,1.35,4.4,6.61,6.61,0,0,0,3.94,1.3h22.89V37.5c0-3.14-1.27-4.2-2.51-4.78a8.74,8.74,0,0,0-3.14-.82H132.66a5.89,5.89,0,0,0-4.31,1.31,6.39,6.39,0,0,0-1.39,4h0Z"/>
        <path d="M482.56,95.83h-28.1V84h28.1c3,0,4-1.19,4.61-2.27a8.61,8.61,0,0,0,.94-3.38V76.14H465.7c-6.83,0-10.87-2.77-13.06-5.1a18.23,18.23,0,0,1-4.53-12.6V20.13H460V58.92a6.32,6.32,0,0,0,1.36,4,6,6,0,0,0,4.37,1.33h22.43V20H500V78.41C499.94,85.44,495.26,95.83,482.56,95.83Z"/>
        <polygon points="421.66 76.16 409.8 76.16 409.8 31.95 389.62 31.95 389.62 20.09 409.8 20.09 409.8 4.86 421.66 4.86 421.66 20.09 441.9 20.09 441.9 31.95 421.66 31.95 421.66 76.16"/>
      </BaseSVG>
    );
  }
});