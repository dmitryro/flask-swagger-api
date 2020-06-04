import React, { Componsent, useState, useEffect } from 'react';
import memoize from 'memoize-one';
import ReactDOM from "react-dom";
import useRootStore from '@store/useRootStore'
import DataTable, { createTheme } from 'react-data-table-component';
import { observer } from 'mobx-react'
import { useOnMount, useOnChange } from '@utils/hooks'
import { Checkbox } from "antd";
import useForceUpdate from 'use-force-update';
import LogModal from '@components/LogModal'
import deepForceUpdate from 'react-deep-force-update';

const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

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
    if (component) {
        deepForceUpdate(component);
    }

    if (store) {
         store.setForceUpdate(forceUpdate);
         store.setComponent(component);
 
         if (selected.selectedRows) {
             store.setSelectedRows(selected.selectedRows);
             store.setTotal(selected.selectedRows.length);
         } else {
             console.log("Let's refresh ... ");
             store.forceUpdate();
         }

         //if(forceUpdate) {
              //forceUpdate(component);
         //}
         //console.log("SEE IT STORE ===> "+JSON.stringify(store.logs));
         //console.log("SEE IT STORE SELECTED ===> "+JSON.stringify(store.selected)); 
         //console.log("EEFORE --- HEI LET US CHECK "+JSON.stringify(store.logs));
         //console.log("BEFORE --- TASTY STUFF SELECTED"+JSON.stringify(store.selected));

         //if(store.selected) {
         //      for(var i=0; i< store.selected.length; i++) {
         //          var id = store.selected[i];
         //          store.popFromLogs(id);
         //      }
           //    console.log("AFTER --- HEI LET US CHECK "+JSON.stringify(store.logs));
           //    console.log("AFTER --- TASTY STUFF SELECTED "+JSON.stringify(store.selected));
         //}
         //store.emptySelected()
    }
    
    return false;
}



function LogsTable({title, columns, data, customStyles}) {
    const { logStore } = useRootStore()
    const [modalVisible, setModalVisible] = useState(false)

    const updateState = (state) => {
        if (state) {
            logStore.setTotal(state.selectedRows.length);
            //logStore.emptySelected()
 
            state.selectedRows.forEach(function(row) {
                logStore.pushLog(row.id);
            });
        }
        data = logStore.logs;
    };
    const forceUpdate = useForceUpdate();

    const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

    updateState.bind(updateExternalState, logStore);

    const pagination = true;
    const total = 1000;
    const perpage = 5;
    
    useOnMount(logStore.getLogs);
    useOnMount(updateExternalState);
    observer(updateExternalState);


    const handleChange = () => {
        forceUpdate();
    };
    
    return (
          <React.Fragment>      
                <DataTable
                 title={title}
                 columns={columns}
                 data={logStore.logs}
                 selectableRows
                 selectableRowsComponent={Checkbox} // Pass the function only
                 conditionalRowStyles={conditionalRowStyles} 
                 pagination={pagination}
                 onChange={handleChange}
                 onSelectedRowsChange={v => updateExternalState(v, logStore, this, forceUpdate)}
                 paginationTotalRows={total}
                 paginationPerPage={perpage}
                 selectableRowsComponentProps={selectProps}
                />
               <LogModal visible={modalVisible} onCancel={() => setModalVisible(false)} />
           </React.Fragment>
            )
}

export default observer(LogsTable);
export {updateExternalState};
