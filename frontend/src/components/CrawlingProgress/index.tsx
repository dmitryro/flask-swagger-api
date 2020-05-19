import ProgressBar from 'rc-progress-bar';
import React from "react";
import ReactDOM from "react-dom";
import { action, decorate, observable } from "mobx";
import { inject, Provider, observer } from "mobx-react";

class UIStore {
  convertProgress = 0;

  setConvertProgress = progress => {
    if (this.convertProgress < 100) {
      this.convertProgress = progress;
    }
  };
}

decorate(UIStore, {
  convertProgress: observable,
  setConvertProgress: action
});

const store = new UIStore();

class CrawlingProgressBar extends React.Component {
  state = { progress: 0 };

  componentDidMount() {
    this.setState({ interval: setInterval(this.tick, 1000) });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  tick = () => {
    const { convertProgress, setConvertProgress } = this.props.store;
    const { progress } = this.state;

    setConvertProgress(convertProgress + 1);
    if (progress < 100) {
      this.setState({ progress: progress + 5 });
    }
  };

  render() {
    return (
      <>
              <ProgressBar 
                  value={this.state.progress} showPercentage={true}
               />
      </>
    );
  }
}

const CrawlingProgress = inject("siteStore")(observer(CrawlingProgressBar));

export default CrawlingProgress
