import React from 'react';
import {Toolbar} from '../global';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Thank You"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <p>Thanks for signing up! When you're approved for the Opsee beta program, you'll get an email. Til then, check out the <a href="http://twitter.com/opseeco" target="_blank">Opsee Twitter account</a> for updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
