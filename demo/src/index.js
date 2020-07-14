import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {
  Switch,
  Route,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';
import {Provider, KeepAlive} from '../../es';
import A from './views/A';
import B from './views/B';
import C from './views/C';
import D from './views/D';
import E from './views/E';
import F from './views/F';

function App() {
  const [toggle, setToggle] = useState(true);
  return (
    <div>
      <ul>
        <li>
          <Link to="/a">a</Link>
        </li>
        <li onClick={() => setToggle(true)}>
          <Link to="/b">b</Link>
        </li>
        <li onClick={() => setToggle(false)}>
          <Link to="/c">c</Link>
        </li>
        <li onClick={() => setToggle(true)}>
          <Link to="/d">d</Link>
        </li>
        <li>
          <Link to="/e">e</Link>
        </li>
        <li>
          <Link to="/f">f</Link>
        </li>
      </ul>

      <div>
        <button onClick={() => setToggle(!toggle)}>toggle({toggle.toString()})</button>
      </div>

      <Switch>
        <Route
          path="/a"
          render={() => (
            <KeepAlive name="A">
              <A />
            </KeepAlive>
          )}
        />
        <Route
          path="/b"
          render={() => (
            <KeepAlive name="B"><B /><B /></KeepAlive>
          )}
        />
        <Route
          path="/c"
          render={() => (
            <KeepAlive name="C">
              <C />
            </KeepAlive>
          )}
        />
        <Route
          path="/d"
          render={() => (
            <KeepAlive name="D">
              <D />
            </KeepAlive>
          )}
        />
        <Route
          path="/e"
          render={() => (
            <KeepAlive name="E">
              <E />
            </KeepAlive>
          )}
        />
        <Route
          path="/f"
          render={() => (
            <KeepAlive name="F">
              <F />
            </KeepAlive>
          )}
        />
      </Switch>
    </div>
  );
}

ReactDOM.render(
  (
    <Provider max={5}>
      <Router>
        <App />
      </Router>
    </Provider>
  ),
  document.getElementById('root')
);
