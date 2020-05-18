import React from 'react';
import ProgressBar from 'rc-progress-bar';
import useRootStore from '@store/useRootStore'

function CrawlingProgressBar({progress}) {
    const { siteStore } = useRootStore()
//    siteStore.crawlingProgress = siteStore.crawlingProgress + 85;
        // setTimeout(function () {
        //          var v  = this.crawlingProgress + 10;
        //          this.setCrawlingProgress = v; 
        // }, 30000);

//    if (siteStore.crawlingProgress == 100) {
//             siteStore.isCrawling = false;
//             siteStore.crawlingProgress = 0;
//    }             
    return (<div>
              <ProgressBar 
                  value={siteStore.crawlingProgress} showPercentage={true}
               />
            </div>)
}
 
export default CrawlingProgressBar
