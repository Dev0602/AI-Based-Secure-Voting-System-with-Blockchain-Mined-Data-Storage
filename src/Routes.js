/* eslint-disable */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  AddCandidate,
  AddUser,
  Login,
  Admin,
  AddPromises_for_candidate,
  Candidate_details_for_users,
  AdminUpdateElectionDay,
  AdminVotecount
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/login"
      />

      <RouteWithLayout
        component={Login}
        exact
        layout={MinimalLayout}
        path="/login"
      />

      <RouteWithLayout
        component={AddCandidate}
        exact
        layout={MinimalLayout}
        path="/AddCandidate"
      />


      <RouteWithLayout
        component={AddPromises_for_candidate}
        exact
        layout={MainLayout}
        path="/AddPromises"
      />

      <RouteWithLayout
        component={Candidate_details_for_users}
        exact
        layout={MainLayout}
        path="/Candidate_details_for_users"
      />
      Candidate_details_for_users




      <RouteWithLayout
        component={AddUser}
        exact
        layout={MinimalLayout}
        path="/Addusers"
      />

      <RouteWithLayout
        component={Admin}
        exact
        layout={MainLayout}
        path="/Admin"
      />

      <RouteWithLayout
        component={AdminUpdateElectionDay}
        exact
        layout={MainLayout}
        path="/AdminUpdateElectionDay"
      />
   <RouteWithLayout
        component={AdminVotecount}
        exact
        layout={MainLayout}
        path="/AdminVotecount"
      />


      <RouteWithLayout
        component={Login}
        exact
        layout={MinimalLayout}
        path="/Logout"
      />

      <RouteWithLayout
        component={<Redirect to="/login" />}
        exact
        layout={MainLayout}
        path="/login"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
