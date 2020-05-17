import React from 'react';
import ProgressBar from 'rc-progress-bar';

function CustomProgressBar() {
    return (<div>
              <ProgressBar 
                  value={75} showPercentage={true}
               />
            </div>)
}
 
export default CustomProgressBar
