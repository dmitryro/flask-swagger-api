import React, { Componsent, useState, useEffect, useRef} from 'react';
import memoize from 'memoize-one';
import ReactDOM from "react-dom"
import { observer } from 'mobx-react'
import { useOnMount, useOnChange } from '@utils/hooks'
import ProgressBar from 'rc-progress-bar';
import useRootStore from '@store/useRootStore'
import useForceUpdate from 'use-force-update';
import { Divider, Table, Popconfirm } from 'antd'
import styles from './index.scss'
import modifyStyle from '@components/SiteAction';
//import useInterval from '@components/LogsTable';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {

    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}


function CrawlingProgressBar({record, progress}) {
    const { siteStore } = useRootStore()
    const forceUpdate = useForceUpdate();
    var state = { crawlingProgress: 0 };

    var res = siteStore.crawlingResult;

    const [interval, setInterval] = useState(0);


    var handleRefresh = () => {
        siteStore.crawlingProgress = siteStore.crawlingProgress + 1;
        forceUpdate();
    };

    useEffect(() => {
        var crawlingProgress = siteStore.crawlingProgress;
        if (!siteStore.crawlingResult && siteStore.crawlingProgress < 100) {
            siteStore.crawlingProgress = siteStore.crawlingProgress + 1;
        }
        console.log("OUR VALUES"+siteStore.crawlingProgress+" AND "+siteStore.isCrawling);
        if (siteStore.crawlingProgress === 100) {
               siteStore.setIsCrawling(false);
               siteStore.setCrawlingProgress(0);
        }
    });

    useInterval(() => {
        forceUpdate();
    }, 200);

    const handleChange = async() => {
       forceUpdate();
    };

    observer(handleChange);

    return (siteStore.isCrawling & record.id == siteStore.site_id  ? 
            <React.Fragment>
              <ProgressBar 
               value={siteStore.crawlingProgress} showPercentage={true}
               onChange={handleChange}
               onClick={handleRefresh}/>
            </React.Fragment> :
                         <span>
                             <span className={styles.ctrlEle} onClick={() => siteStore.crawlSite(record.id)}>
                                 Crawl
                             </span>
                             <Divider type="vertical" />
                             <span className={styles.ctrlEle} onClick={() => modifySite(record)}>
                                 Modify
                             </span>
                             <Divider type="vertical" />
                             <Popconfirm
                              placement="top"
                              title="Delete?"
                              onConfirm={() => siteStore.deleteSite(record.id)}
                              okText="Yes"
                              cancelText="No">
                                  <span className={styles.ctrlEle}>Delete</span>
                             </Popconfirm>
                         </span>
     )
}

export default CrawlingProgressBar
