<p align="center">
  <a href="https://github.com/Sam618/react-keep-alive">
    <img width="120" src="https://github.com/Sam618/react-keep-alive/raw/master/assets/react-logo.png">
  </a>
</p>

<h1 align="center">React Keep Alive</h1>
<div align="center">

  [![npm](https://img.shields.io/npm/v/react-keep-alive.svg?style=for-the-badge)](https://www.npmjs.com/package/react-keep-alive) [![Travis (.org)](https://img.shields.io/travis/Sam618/react-keep-alive.svg?style=for-the-badge)](https://travis-ci.org/Sam618/react-keep-alive.svg?branch=master) [![license](https://img.shields.io/npm/l/react-keep-alive.svg?style=for-the-badge)](https://github.com/Sam618/react-keep-alive/blob/master/LICENSE) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react-keep-alive.svg?style=for-the-badge)](https://www.npmjs.com/package/react-keep-alive) [![downloads](https://img.shields.io/npm/dm/react-keep-alive.svg?style=for-the-badge)](https://www.npmjs.com/package/react-keep-alive) [![typescript](https://img.shields.io/badge/language-typescript-blue.svg?style=for-the-badge)](https://www.typescriptlang.org/)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FSam618%2Freact-keep-alive.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FSam618%2Freact-keep-alive?ref=badge_shield)

  <p>A component that maintains component state and avoids repeated re-rendering.</p>

  <div style="width: 100px; text-align: left;">
    <div>English | <a href="https://github.com/Sam618/react-keep-alive/blob/master/README.zh-CN.md">中文</a></div>
    <div><a href="https://github.com/Sam618/react-keep-alive/blob/master/ONLINE_EDITOR.md">Online Editor</a></div>
  </div>
</div>



[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FSam618%2Freact-keep-alive.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FSam618%2Freact-keep-alive?ref=badge_large)

## ✨ Features
- **Alone**. Not based on React Router, so you can use it wherever you need to cache it.
- **Easy**. You can easily use <KeepAlive> to wrap your components to keep them alive.
- **Strong**. You can use animation and you will also get a new lifecycle.

## 📦 Installation
React Keep Alive requires React 16.3 or later.

To use React Keep Alive with your React app:

```bash
npm install --save react-keep-alive
```


## 🔨 Usage
React Keep Alive provides `<Provider>`, you must use `<Provider>` to wrap the `<KeepAlive>` cache to take effect.

```JavaScript
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Provider,
  KeepAlive,
} from 'react-keep-alive';
import Test from './views/Test';

ReactDOM.render(
  <Provider>
    <KeepAlive key="Test">
      <Test />
    </KeepAlive>
  </Provider>,
  document.getElementById('root'),
);
```


## 💡 Why do you need this component?
If you've used [Vue](https://vuejs.org/), you know that it has a very good component ([keep-alive](https://vuejs.org/v2/guide/components-dynamic-async.html)) that keeps the state of the component to avoid repeated re-rendering.

Sometimes, we want the list page to cache the page state after the list page enters the detail page. When the detail page returns to the list page, the list page is still the same as before the switch.

Oh, this is actually quite difficult to achieve, because the components in React cannot be reused once they are uninstalled. Two solutions are proposed in [issue #12039](https://github.com/facebook/react/issues/12039). By using the style switch component display (`display: none | block;`), this can cause problems, such as when you switch components, you can't use animations; or use data flow management tools like Mobx and Redux, but this is too much trouble.

In the end, I implemented this effect through the [React.createPortal API](https://reactjs.org/docs/portals.html). `react-keep-alive` has two main components `<Provider>` and `<KeepAlive>`. The `<Provider>` is responsible for saving the component's cache and rendering the cached component outside of the application via the React.createPortal API before processing. The cached components must be placed in `<KeepAlive>`, and `<KeepAlive>` will mount the components that are cached outside the application to the location that really needs to be displayed.


## 📝 API Reference

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

class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/one">
            <KeepAlive key="One">
              <One />
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
} from 'react-keep-alive';

class One extends React.Component {
  render() {
    return (
      <div>This is One.</div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/one">
            <KeepAlive key="One">
              <One />
            </KeepAlive>
          </Route>
        </Switch>
      </div>
    );
  }
}

ReactDOM.render(
  <Router>
    <Provider include="One">
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

## 🐛 Issues
If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/Sam618/react-keep-alive/issues).


## 🏁 Changelog
Changes are tracked in the [CHANGELOG.md](https://github.com/Sam618/react-keep-alive/blob/master/CHANGELOG.md).


## 📄 License
React Keep Alive is available under the [MIT](https://github.com/Sam618/react-keep-alive/blob/master/LICENSE) License.