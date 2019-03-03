import React from 'react';
import ReactDOM from 'react-dom';
import {
  Switch,
  Route,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';
import {Provider} from '../../es';
import A from './views/A';
import B from './views/B';
import C from './views/C';

class App extends React.Component {
  state = {
    toggle: true,
  };

  handleClick = () => {
    this.setState(({toggle}) => ({
      toggle: !toggle,
    }));
  }

  handleClickB = () => {
    this.setState({
      toggle: true,
    });
  }

  handleClickC = () => {
    this.setState({
      toggle: false,
    });
  }

  render() {
    const {toggle} = this.state;
    return (
      <div>
        <ul>
          <li>
            <Link to="/a">a</Link>
          </li>
          <li onClick={this.handleClickB}>
            <Link to="/b">b</Link>
          </li>
          <li onClick={this.handleClickC}>
            <Link to="/c">c</Link>
          </li>
        </ul>

        <div>
          <button onClick={this.handleClick}>toggle({toggle.toString()})</button>
        </div>

        <Switch>
          <Route
            path="/a"
            render={() => (
              <React.Fragment>
                <A keepAlive={toggle} />
              </React.Fragment>
            )}
          />
          <Route
            path="/b"
            render={() => <B />}
          />
          <Route
            path="/c"
            render={() => <C />}
          />
        </Switch>
      </div>
    );
  }
}

ReactDOM.render(
  (
    <Provider>
      <Router>
        <App />
      </Router>
    </Provider>
  ),
  document.getElementById('root')
);
