import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {
  Switch,
  Route,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';
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
          render={props => (
            <KeepAlive name="A" extra={props}><B /><B /></KeepAlive>
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

const store = createStore(function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1;
  case 'DECREMENT':
    return state - 1;
  default:
    return state;
  }
});

ReactDOM.render(
  (
    <ReduxProvider store={store}>
      <Router>
        <Provider>
          <App />
        </Provider>
      </Router>
    </ReduxProvider>
  ),
  document.getElementById('root')
);
