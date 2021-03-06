import React, { Componsent, useState, useEffect, useRef } from 'react';
import memoize from 'memoize-one';
import ReactDOM from "react-dom";
import useRootStore from '@store/useRootStore'
import DataTable, { createTheme } from 'react-data-table-component';
import { observer } from 'mobx-react'
import { useOnMount, useOnChange } from '@utils/hooks'
import { Checkbox } from "antd";
import useForceUpdate from 'use-force-update';
import LogModal from '@components/LogModal'

const selectProps = { indeterminate: isIndeterminate => isIndeterminate };
var records = []

createTheme('solarized', {
  text: {
    primary: '#268bd2',
    secondary: '#2aa198',
  },
  background: {
    default: '#002b36',
  },
  context: {
    background: '#cb4b16',
    text: '#FFFFFF',
  },
  divider: {
    default: '#073642',
  },
  action: {
    button: 'rgba(0,0,0,.54)',
    hover: 'rgba(0,0,0,.08)',
    disabled: 'rgba(0,0,0,.12)',
  },
});

const conditionalRowStyles = [
  {
    when: cell => cell.severity == 'highest',
    style: {
      backgroundColor: 'white',
      color: '#ff0000',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  {
    when: cell => cell.severity == 'high',
    style: {
      backgroundColor: 'white',
      color: '#ce1414',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },

  {
    when: cell => cell.severity == 'medium',
    style: {
      backgroundColor: 'white',
      color: '#00b6ff',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  {
    when: cell => cell == 'elevated',
    style: {
      backgroundColor: 'white',
      color: '#ff8300',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  {
    when: cell => cell == 'mild',
    style: {
      backgroundColor: 'white',
      color: '#2600ff',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  {
    when: cell => cell == 'low',
    style: {
      backgroundColor: 'white',
      color: '#00ff00',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  {
    when: cell => cell == 'disaster',
    style: {
      backgroundColor: 'white',
      color: '#ff0000',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }
];


function updateExternalState(selected, store, component, forceUpdate){
    if (store) {
         
         store.setForceUpdate(forceUpdate);
         store.setComponent(component);
 
         if (selected.selectedRows) {
             store.setSelectedRows(selected.selectedRows);
         } else {
             store.forceUpdate();
             selected.selectedRows = [];
             store.setSelectedRows([]);
         }
    }
    return false;
}

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


function LogsTable({title, columns, customStyles}) {
    const forceUpdate = useForceUpdate();
    const { logStore } = useRootStore()
    const [modalVisible, setModalVisible] = useState(false)
    const [data, setData] = useState(logStore.logs)
    const [toggledClearRows, setToggledClearRows] = useState(false);
    const handleClearRows = () => {
       setToggledClearRows({ toggledClearRows: !toggledClearRows});
       logStore.setToggledClearRows(!logStore.getToggledClearRows);
       logStore.setSelectedRows([]);
    };

    useEffect(() => {
        if (logStore.selectedRows) {
               for(var i=0; i< logStore.selectedRows.length; i++) {
                   var id = logStore.selectedRows[i].id;
                   //logStore.popFromLogs(id);
               }
        }
        //setToggledClearRows(!toggledClearRows);
        //logStore.setToggledClearRows(!toggledClearRows):
        
        setData(logStore.logs);
        console.log("TOTAL SELECTED:"+logStore.selectedRows.length);
    });

    useInterval(() => {
        logStore.getLogs();
        setData(logStore.logs);
        forceUpdate();
    }, 1000);


      // You can use setState or dispatch with something like Redux so we can use
      // the retrieved data
       //handleClearRows();
       //console.log('Selected Rows: ', state.selectedRows);
    //const handleChange = (state) => {
       // You can use setState or dispatch with something like Redux so we can use
       // the retrieved data
    //   console.log('Selected Rows: ', state.selectedRows);
    //};

    // Toggle the state so React Table Table changes to `clearSelectedRows` are
    // triggered



    const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

    const pagination = true;
    const total = 1000;
    const perpage = 5;
    const clear = true;
    
    useOnMount(logStore.getLogs);
    useOnMount(updateExternalState);
    observer(updateExternalState);

    return( 
          <React.Fragment>      
                <DataTable
                 title={title}
                 columns={columns}
                 data={data}
                 selectableRowsComponent={Checkbox} // Pass the function only
                 conditionalRowStyles={conditionalRowStyles} 
                 pagination={pagination}
                 //onSelectedRowsChange={handleClearRows}
                 //clearSelectedRows={toggledClearRows}
                 onSelectedRowsChange={v => updateExternalState(v, logStore, this, forceUpdate)}
                 paginationTotalRows={total}
                 paginationPerPage={perpage}
                 selectableRowsComponentProps={selectProps}
                 selectableRows
                />
               <LogModal visible={modalVisible} onCancel={() => setModalVisible(false)} />
           </React.Fragment>
            )
}

export default observer(LogsTable);
export {updateExternalState};
