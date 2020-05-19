import React, { useState, useEffect } from 'react';
import ProgressBar from 'rc-progress-bar';
import useRootStore from '@store/useRootStore'

function CrawlingProgressBar({progress}) {
    const { siteStore } = useRootStore()
    var state = { crawlingProgress: 0 };

    var res = siteStore.crawlingResult;

    const [interval, setInterval] = useState(0);

    var tick = () => {
        var crawlingProgress = siteStore.crawlingProgress;
        if (!siteStore.crawlingResult) {
             siteStore.crawlingProgress = siteStore.crawlingProgress + 5;
        }
    };

    useEffect(() => {
        setInterval(tick, 300);
    });

    return (<div>
              <ProgressBar 
                  value={siteStore.crawlingProgress} showPercentage={true}
               />
            </div>)
}

export default CrawlingProgressBar
