import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';

import CssBaseline from '@material-ui/core/CssBaseline';

// custom theme
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../../theme';

import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const MainWrap = styled.div`
  padding: 10px;
  max-width: 1200px;
  margin: 0 auto;
`;

const App = () => (
  <MainWrap>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route
          path={ROUTES.PASSWORD_FORGET}
          component={PasswordForgetPage}
        />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
      </Router>
    </MuiThemeProvider>
  </MainWrap>
);

export default withAuthentication(App);
