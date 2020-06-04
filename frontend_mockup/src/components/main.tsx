import * as React from 'react';
import "./../../src/assets/css/main.css";
import SignUp from "./signup";
let classNameHeader = "main";

export default class Main extends React.Component {
    render() {
        return <div className={classNameHeader}>
               <SignUp/>
               </div>;
    }
}

