import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import registerServiceWorker from "./registerServiceWorker";
import firebase from "./firebase";

import "semantic-ui-css/semantic.min.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import { setUser, clearUser } from "./actions";
import Spinner from "./Spinner";

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  componentDidMount() {
    /* Register firebase's onAuthStateChanged, it will keep listening firebase state event */
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // console.log(user);
        this.props.setUser(user);
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
        this.props.clearUser();
      }
    });
  }

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/Register" component={Register} />
      </Switch>
    );
  }
}

// these data save in store will be saved as props to App.
const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(
  connect(
    mapStateFromProps,
    {
      setUser,
      clearUser
    }
  )(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
