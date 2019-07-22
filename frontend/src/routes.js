import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { isAuth } from './services/auth';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import UserIndex from './pages/Users/Index';
import UserCreate from './pages/Users/Create';
import UserShow from './pages/Users/Show';
import UserEdit from './pages/Users/Edit';
import ProductIndex from './pages/Products/Index';
import ProductCreate from './pages/Products/Create';
import ProductShow from './pages/Products/Show';
import ProductEdit from './pages/Products/Edit';
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
    <div className="h-100">
      <Navbar />
      <main>
        <Component {...props} />
      </main>
      {props.location.pathname !== '/home' && 
        <Footer />
      }
    </div>
  ) : (
    <Redirect to={{ pathname: '/', state: { from: props.location } }} />
  )} />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <GuestRoute exact path="/" component={Login} />
      <AuthRoute exact path="/home" component={Home} />
      <AuthRoute exact path="/users" component={UserIndex} />
      <AuthRoute exact path="/users/create" component={UserCreate} />
      <AuthRoute exact path="/users/:id" component={UserShow} />
      <AuthRoute exact path="/users/:id/edit" component={UserEdit} />      
      <AuthRoute exact path="/products" component={ProductIndex} />
      <AuthRoute exact path="/products/create" component={ProductCreate} />
      <AuthRoute exact path="/products/:id" component={ProductShow} />
      <AuthRoute exact path="/products/:id/edit" component={ProductEdit} />
      <Route path="*" component={Error404} />
    </Switch>
  </BrowserRouter>
);

export default Routes;