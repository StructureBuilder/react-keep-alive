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
      </ul>

      <div>
        <button onClick={() => setToggle(!toggle)}>toggle({toggle.toString()})</button>
      </div>

      <Switch>
        <Route
          path="/a"
          render={() => (
            <KeepAlive name="Test" disabled={!toggle}>
              <A />
            </KeepAlive>
          )}
        />
        <Route
          path="/b"
          render={() => (
            <KeepAlive name="A"><B /><B /></KeepAlive>

          )}
        />
        <Route
          path="/c"
          render={() => (
            <KeepAlive name="B">
              <C />
            </KeepAlive>
          )}
        />
      </Switch>
    </div>
  );
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
