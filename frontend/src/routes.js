import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { isAuth } from './services/auth';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Error404 from './pages/Errors/404';

const GuestRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => !isAuth() ? (
    <Component {...props} />
  ) : (
    <Redirect to={{ pathname: '/home', state: { from: props.location } }} />
  )} />
);

const AuthRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => isAuth() ? (
    <div>
      <Navbar />
      <Component {...props} />
    </div>
  ) : (
    <Redirect to={{ pathname: '/', state: { from: props.location } }} />
  )} />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <GuestRoute exact path="/" component={Login} />
      <AuthRoute path="/home" component={Home} />
      <Route path="*" component={Error404} />
    </Switch>
  </BrowserRouter>
);

export default Routes;