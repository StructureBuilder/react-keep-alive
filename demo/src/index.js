import React from "react";
import ReactDOM from "react-dom"
import KeepAlive from './KeepAlive.backup';

const {Provider, Consumer} = React.createContext();

class Test2 extends React.Component {
  state = {
    index: 0,
    visible: false,
  }

  index = 0;

  componentDidMount() {
    // console.log('componentDidMount', this);
    // this.timer = setInterval(() => {
    //   this.setState(({index}) => {
    //     this.index = index + 1;
    //     return ({
    //       index: index + 1,
    //     });
    //   });
    // }, 600);
  };

  componentWillUnmount() {
    // console.log('componentWillUnmount');
    clearInterval(this.timer);

  }

  handleClick = () => {
    // console.log(this);
    this.setState(({visible}) => ({
      visible: !visible,
    }));
  }


  render() {
    return <div><button onClick={this.handleClick}>{this.state.visible ? 'show' : 'hide'}</button>{this.state.index}</div>
  }
}

class Test extends React.Component {
  state = {
    index: 0,
    visible: false,
  }

  index = 0;

  componentDidMount = () => {
    // console.log('componentDidMount', this);
    // this.timer = setInterval(() => {
    //   this.setState(({index}) => {
    //     this.index = index + 1;
    //     return ({
    //       index: index + 1,
    //     });
    //   });
    // }, 600);
  };

  componentWillUnmount = () => {
    // console.log('componentWillUnmount', this);
    clearInterval(this.timer);
    this.aaa = 'bbb';
  }

  handleClick = () => {
    // console.log(this);
    this.setState(({visible}) => ({
      visible: !visible,
    }));
  }


  render() {
    return <div>{this.state.visible ? <Test2 /> : null}<button onClick={this.handleClick}>{this.state.visible ? 'show' : 'hide'}</button>{this.state.index}</div>
  }
}

class Noop extends React.Component {
  render() {
    return null;
  }
}

class App extends React.Component {
  state = {
    visible: true,
  }

  handleClick = () => {
    const {visible} = this.state;
    // if (visible) {
    //   this.backup = getStateBackup(this);
    // } else {
    //   setTimeout(() => {
    //     deepForceUpdateByBackup(this, this.backup);
    //   });
    // }
    this.setState({visible: !visible});
  }

  render() {
    return (
      <div>
        <Provider value='test'>
          <button onClick={this.handleClick}>visible({this.state.visible.toString()})</button>
          {this.state.visible ? (
            <KeepAlive>
              <Test />
            </KeepAlive>
          ) : null}
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
