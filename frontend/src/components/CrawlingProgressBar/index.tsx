import React, { useState, useEffect } from 'react';
import memoize from 'memoize-one';
import { observer } from 'mobx-react'
import { useOnMount, useOnChange } from '@utils/hooks'
import ProgressBar from 'rc-progress-bar';
import useRootStore from '@store/useRootStore'
import useForceUpdate from 'use-force-update';

function CrawlingProgressBar({progress}) {
    const { siteStore } = useRootStore()
    var state = { crawlingProgress: 0 };

    var res = siteStore.crawlingResult;

    const [interval, setInterval] = useState(0);

     const forceUpdate = useForceUpdate();

    var tick = async() => {
        var crawlingProgress = siteStore.crawlingProgress;
        if (!siteStore.crawlingResult) {
             siteStore.crawlingProgress = siteStore.crawlingProgress + 5;
             if (siteStore.crawlingProgress === 100) {
                 siteStore.setIsCrawling(false); 
                 siteStore.setCrawlingProgress(0);
             }
        }
    };

    var handleRefresh = () => {
        alert('clicked');
        siteStore.crawlingProgress = siteStore.crawlingProgress + 5;
        forceUpdate();
    };

    useEffect(() => {
       //setInterval(tick, 300);
        var crawlingProgress = siteStore.crawlingProgress;
        if (!siteStore.crawlingResult) {
             siteStore.crawlingProgress = siteStore.crawlingProgress + 5;
             if (siteStore.crawlingProgress === 100) {
                 siteStore.setIsCrawling(false);
                 siteStore.setCrawlingProgress(0);
             }
        } else {
             forceUpdate();
        }
       //setInterval(forceUpdate, 500);
    });



    const handleChange = async() => {
       // forceUpdate();
    };

    observer(handleChange);

    return (<div>
              <ProgressBar 
                  value={siteStore.crawlingProgress} showPercentage={true}
               onChange={handleChange}
               onClick={handleRefresh}/>
            </div>)
}

export default CrawlingProgressBar
