import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Login from '../pages/Login';
import ListUsers from '../pages/ListUsers';
import RegisterUser from '../pages/RegisterUser';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem('token') ? (
          <Component {...props} />
        ) : (
          <Redirect to='/' />
        )
      }
    />
  );
};

const Routes = () => {
  return (
    <Switch>
      <Route exact path='/' component={Login} />
      <PrivateRoute exact path='/users' component={ListUsers} />
      <PrivateRoute exact path='/register_user' component={RegisterUser} />
      <Route path='*'>
        <h1>Essa rota não existe</h1>
      </Route>
    </Switch>
  );
};

export default Routes;
