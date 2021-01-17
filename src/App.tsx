import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import Users from './pages/Users';
import RegisterUser from './pages/RegisterUser';

function App() {
  return (
    <>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/users' component={Users} />
        <Route exact path='/register_user' component={RegisterUser} />
      </Switch>
    </>
  );
}

export default App;
