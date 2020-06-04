import * as React from 'react';
import "./../../src/assets/css/header.css";
import "./../../src/assets/css/footer.css";
import "./../../src/assets/css/main.css";
import Footer from "./footer";
import Header from "./header";
import Main from "./main";

class App extends React.Component {
    render() {
        return <React.Fragment>
               <Main/>
               </React.Fragment>;
    }
}

export default App;
