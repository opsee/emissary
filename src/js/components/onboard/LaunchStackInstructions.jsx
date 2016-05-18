import React from 'react';
import {Padding} from '../layout';

export default React.createClass({
  render(){
    return (
      <div>
        <Padding tb={1}>
          <strong>How to install the CloudFormation Stack</strong>
        </Padding>
        <p>We enable cross-account access using a CloudFormation stack. To launch
        the stack in your AWS environment, do the following in your AWS console:</p>
        <ol>
            <li>Click “Next" on the "Select Template" screen. The template URL will already be specified for you.</li>
            <li>Click "Next" on the "Specify Details" page.</li>
            <li>Click "Next" on the "Options" page.</li>
            <li>Click the check box at the bottom of the “Review” page to acknowledge the notice about IAM privileges, and click “Create” to launch the stack.</li>
        </ol>
        <p>When it's done, return to this screen to finish installation. You can monitor the progress of the role creation in your AWS console.</p>
      </div>
    );
  }
});