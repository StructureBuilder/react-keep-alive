<p align="center">
  <a href="https://github.com/Sam618/react-keep-alive">
    <img width="120" src="https://github.com/Sam618/react-keep-alive/raw/master/assets/logo.png">
  </a>
</p>

<h1 align="center">React Keep Alive</h1>
<div align="center">

  [![npm](https://img.shields.io/npm/v/react-keep-alive.svg?style=for-the-badge)](https://www.npmjs.com/package/react-keep-alive) [![Travis (.org)](https://img.shields.io/travis/Sam618/react-keep-alive.svg?style=for-the-badge)](https://travis-ci.org/Sam618/react-keep-alive.svg?branch=master) [![license](https://img.shields.io/npm/l/react-keep-alive.svg?style=for-the-badge)](https://github.com/Sam618/react-keep-alive/blob/master/LICENSE) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react-keep-alive.svg?style=for-the-badge)](https://www.npmjs.com/package/react-keep-alive) [![downloads](https://img.shields.io/npm/dm/react-keep-alive.svg?style=for-the-badge)](https://www.npmjs.com/package/react-keep-alive) [![typescript](https://img.shields.io/badge/language-typescript-blue.svg?style=for-the-badge)](https://www.typescriptlang.org/)

  <p>一个保持组件状态并避免重复重渲染的组件。</p>

  <div style="width: 100px; text-align: left;">
    <div><a href="./README.md">English</a> | 中文</div>
    <div><a href="./ONLINE_EDITOR.md">Online Editor</a></div>
  </div>
</div>

## 安装
React Keep Alive 最低支持 React 16.3 版本。

在你的应用中安装 React Keep Alive：

```bash
npm install --save react-keep-alive
```


## 使用
React Keep Alive 提供了 `<Provider>`， 你必须把 `<KeepAlive>` 放在 `Provider` 里面。

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


## 为什么使用这个组件？
如果你用过 [Vue](https://vuejs.org/)，那肯定知道它有一个非常好用的组件（[keep-alive](https://vuejs.org/v2/guide/components-dynamic-async.html)）能够保持组件的状态来避免重复重渲染。

有时，我们希望在列表页面进入详情页面后，缓存列表页面的状态；当从详情页面返回列表页面时，列表页面还是和切换前一样。

这实际上挺难实现的，因为 React 中的组件一旦卸载就无法重用。在 [issue #12039](https://github.com/facebook/react/issues/12039) 中提出了两种解决方案；通过样式来控制组件的显示（`display：none | block;`），但是这可能会导致问题，例如切换组件时，无法使用动画；或者使用像 Mobx 和 Redux 这样的数据流管理工具，但这太麻烦了。

最后，我通过 [React.createPortal API](https://reactjs.org/docs/portals.html) 实现了这个效果。`react-keep-alive` 有两个主要的组件 `<Provider>` 和 `<KeepAlive>`；`<Provider>` 负责保存组件的缓存，并在处理之前通过 `React.createPortal` API 将缓存的组件渲染在应用程序的外面。缓存的组件必须放在 `<KeepAlive>` 中，`<KeepAlive>` 会把在应用程序外面渲染的组件挂载到真正需要显示的位置。


## API 参考

### `Provider`
因为需要存储缓存的组件，所以必须把 `<Provider>` 放在应用程序的最外面以使程序能够正常运行。

#### Props
`include`：只会缓存匹配 `key` 的组件。它可以是字符串，字符串数组或正则表达式，例如：
```JavaScript
<Provider include="A,B">...</Provider>
// or
<Provider include={['A', 'B']}>...</Provider>
// or
<Provider include={/A|B/}>...</Provider>
```

`exclude`：任何匹配 `key` 的组件都不会被缓存。它可以是字符串，字符串数组或正则表达式，例如：

#### 例子
在下面的示例中，`<App />` 是我们的根组件，这意味着它位于组件层次结构的最顶层。

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

##### 结合 React Router 和 Mobx React 使用

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

**注意**：你必须将 `<Provider>` 放在 `<Router>` 中，并且 React Router 必须确保是 **最新版本**。因为 React Keep Alive 使用了 **new Context**，所以必须确保 `<Router>` 使用相同的 API。请使用以下命令安装 React Router 的最新版本：

```bash
npm install react-router@next react-router-dom@next
```


### `KeepAlive`
我们必须确保 `<KeepAlive>` 在 `<Provider>` 里面，这样 `<KeepAlive>` 的子组件才能被缓存。

#### Props
`key`：`key` 必须存在并且需要确保当前 `<Provider>` 下的所有 `<KeepAlive>` 的 `key` 都是唯一的。

`disabled`：当我们不需要缓存组件时，我们可以禁用它；禁用仅在组件从未激活状态变为激活状态时生效。

`onActivate`：激活事件。

`onUnactivate`：未激活事件。

#### 例子
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

##### 使用 `<Provider>` 的 `include` 属性
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

**注意**：如果要使用 **生命周期**，请将组件包装在 `bindLifecycle` 高阶组件中。

### `bindLifecycle`
这个高阶组件包装的组件将具有 **正确的** 的生命周期，并且我们添加了两个额外的生命周期 `componentDidActivate` 和 `componentWillUnactivate`。

添加新的生命周期之后:
![Lifecycle after adding](https://github.com/Sam618/react-keep-alive/raw/master/assets/lifecycle.png)

`componentDidActivate` 将在组件刚挂载或从未激活状态变为激活状态时执行。虽然我们在 `Updating` 阶段的 `componentDidUpdate` 之后能够看到 `componentDidActivate`，但这并不意味着 `componentDidActivate` 总是被触发。

同时只能触发 `componentWillUnactivate` 和 `componentWillUnmount` 生命周期的其中之一。当需要缓存时执行 `componentWillUnactivate`，而 `componentWillUnmount` 在禁用缓存的情况下执行。

#### 例子
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
如果你发现了错误，请在 [我们 GitHub 的 Issues](https://github.com/Sam618/react-keep-alive/issues) 上提出问题。


## Changelog
在 [CHANGELOG.md](https://github.com/Sam618/react-keep-alive/blob/master/CHANGELOG.md) 中能够查看到所有的更新.


## License
React Keep Alive 使用了 [MIT](https://github.com/Sam618/react-keep-alive/blob/master/LICENSE) 许可.
