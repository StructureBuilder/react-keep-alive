# React Keep Alive
Package will allow components to maintain their status, to avoid repeated re-rendering.


## TODO
- test


## Installation
React Keep Alive requires React 16.3 or later.

To use React Keep Alive with your React app:

```bash
npm install --save react-keep-alive
```


## Usage
React Keep Alive provides `<Provider>`, you must use `<Provider>` to wrap the `<KeepAlive>` cache to take effect.

```JavaScript
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Provider,
  KeepAlive,
} from 'react-keep-alive';

class Test extends React.Component {
  state = {
    count: 0,
  };

  handleClick = () => {
    this.setState(({count}) => ({
      count: count + 1,
    }));
  }

  render() {
    const {count} = this.state;
    return (
      <div>
        <h1>This is {`<Test>`}</h1>
        <p>Please feel free to click the button, then hide this component, and the status will be retained again.</p>
        <button onClick={this.handleClick}>Click me(count: {count})</button>
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    hidden: false,
  };

  handleClick = () => {
    this.setState(({hidden}) => ({
      hidden: !hidden,
    }));
  }

  render() {
    const {hidden} = this.state;
    return (
      <div>
        <div>
          Clicking the button will hide the component, but the status will be preserved.
        </div>
        <button onClick={this.handleClick}>Click me(hidden: {hidden.toString()})</button>
        <div>
          {
            !hidden
              ? (
                // Must have a key, and it is unique
                <KeepAlive key="Test">
                  <Test />
                </KeepAlive>
              )
              : null
          }
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'),
);
```


## API Reference

### `Provider`
Since the cached components need to be stored, the `<Provider>` must be rendered at the top of the application for the program to run properly.

#### Props
`include`: Only components that match key will be cached. It can be a string, an array of strings, or a regular expression, eg:
```JavaScript
<Provider include="A,B">...</Provider>
// or
<Provider include={['A', 'B']}>...</Provider>
// or
<Provider include={/A|B/}>...</Provider>
```

`exclude`: Any component that matches key will not be cached. It can be a string, an array of strings, or a regular expression.

#### Example
In the example below, the <App /> component is our root-level component. This means it’s at the very top of our component hierarchy.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-keep-alive';
import App from './App';

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'),
);
```

##### Usage with React Router and Mobx React

```JavaScript
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import {
  Provider as MobxProvider,
} from 'mobx-react';
import {
  Provider as KeepAliveProvider,
} from 'react-keep-alive';

ReactDOM.render(
  <MobxProvider>
    <Router>
      <KeepAliveProvider>
        <App />
      </KeepAliveProvider>
    </Router>
  </MobxProvider>,
  document.getElementById('root'),
);
```

**Note**: You must put <Provider> in <Router> and the React Router must be sure to be the **latest version**. Because React Keep Alive uses the **new Context**, you must ensure that the Router does the same. Please use the following command to install the latest version.

```bash
npm install react-router@next react-router-dom@next
```


### `KeepAlive`
Children of `<KeepAlive>` will be cached, but we have to make sure that `<KeepAlive>` is inside `<Provider>`.

#### Props
`key`: Key must exist and need to ensure that all `<KeepAlive>` keys under the current `<Provider>` are unique.

`disabled`: When we don't need components for caching, we can disable it; the disabled configuration will only takes effect when the component's status changes from unactive to active.

`onActivate`: Activation event.

`onUnactivate`: Unactivation event.

#### Example
```JavaScript
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import {
  Provider,
  KeepAlive,
} from 'react-keep-alive';

class One extends React.Component {
  render() {
    return (
      <div>This is One.</div>
    );
  }
}

class Two extends React.Component {
  render() {
    return (
      <div>This is Two.</div>
    );
  }
}

class App extends React.Component {
  handleActivate = () => {
    console.log('One activated');
  }

  handleUnactivate = () => {
    console.log('One unactivated');
  }

  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/one">one</Link>
          </li>
          <li>
            <Link to="/two">two</Link>
          </li>
        </ul>
        <Switch>
          <Route path="/one">
            <KeepAlive
              key="One"
              onActivate={this.handleActivate}
              onUnactivate={this.handleUnactivate}
            >
              <One />
            </KeepAlive>
          </Route>
          <Route path="/two">
            <KeepAlive key="Two">
              <Two />
            </KeepAlive>
          </Route>
        </Switch>
      </div>
    );
  }
}

ReactDOM.render(
  <Router>
    <Provider>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root'),
);
```

##### Usage with `include` props of `<Provider>`
```JavaScript
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import {
  Provider,
  KeepAlive,
  bindLifecycle,
} from 'react-keep-alive';

@bindLifecycle
class One extends React.Component {
  componentDidMount() {
    console.log('One componentDidMount');
  }

  componentWillUnmount() {
    console.log('One componentWillUnmount');
  }

  render() {
    return (
      <div>This is One.</div>
    );
  }
}

class Two extends React.Component {
  render() {
    return (
      <div>This is Two.</div>
    );
  }
}

class App extends React.Component {
  handleActivate = () => {
    console.log('One activated');
  }

  handleUnactivate = () => {
    console.log('One unactivated');
  }

  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/one">one</Link>
          </li>
          <li>
            <Link to="/two">two</Link>
          </li>
        </ul>
        <Switch>
          <Route path="/one">
            <KeepAlive
              key="One"
              onActivate={this.handleActivate}
              onUnactivate={this.handleUnactivate}
            >
              <One />
            </KeepAlive>
          </Route>
          <Route path="/two">
            <KeepAlive key="Two">
              <Two />
            </KeepAlive>
          </Route>
        </Switch>
      </div>
    );
  }
}

ReactDOM.render(
  <Router>
    <Provider include="Two">
      <App />
    </Provider>
  </Router>,
  document.getElementById('root'),
);
```

**Note**: If you want to use the **lifecycle**, wrap the components in a `bindLifecycle` high-level component.

### `bindLifecycle`
Components that pass this high-level component wrap will have the **correct** lifecycle, and we have added two additional lifecycles, `componentDidActivate` and `componentWillUnactivate`.

Lifecycle after adding:
![Lifecycle after adding](https://github.com/Sam618/react-keep-alive/raw/master/assets/lifecycle.png)

`componentDidActivate` will be executed once after the initial mount or from the unactivated state to the active state. although we see `componentDidActivate` after `componentDidUpdate` in the `Updating` phase, this does not mean `componentDidActivate` Always triggered.

At the same time, only one of the lifecycles of `componentWillUnactivate` and `componentWillUnmount` is triggered. `componentWillUnactivate` is executed when caching is required; `componentWillUnmount` is executed without caching.

#### Example
```JavaScript
import React from 'react';
import {bindLifecycle} from 'react-keep-alive';

@bindLifecycle
class Test extends React.Component {
  render() {
    return (
      <div>
        This is Test.
      </div>
    );
  }
}
```

## Issues
If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/Sam618/react-keep-alive/issues).


## Changelog
Changes are tracked in the [CHANGELOG.md](https://github.com/Sam618/react-keep-alive/blob/master/CHANGELOG.md).


## License
React Keep Alive is available under the [MIT](https://github.com/Sam618/react-keep-alive/blob/master/LICENSE) License.
