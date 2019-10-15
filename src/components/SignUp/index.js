import React from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import WithToast from '../WithToast';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import { StyledPaper, Inner, CardTitle } from '../Shared';
import SignUpFormNew from '../SignUpForm';

const SignUpPage = ({ firebase, openToast, history }) => {
  const errorHandler = (consoleText, err) => {
    console.log(consoleText + ': ', err);
    const ERROR = err && err.message ? err.message : 'ERROR';
    openToast({
      message: ERROR,
      type: 'error'
    });
  };

  const onSubmit = async values => {
    const { username, email, passwordOne, admin } = values;
    const roles = {};

    if (admin) roles[ROLES.ADMIN] = ROLES.ADMIN;

    try {
      // Create a user in your Firebase realtime database
      // (1) It creates a user in Firebase's internal authentication database that is only limited accessible.
      // (2) If (1) was successful, it creates a user in Firebase's realtime database that is accessible.
      const authUser = await firebase.doCreateUserWithEmailAndPassword(email, passwordOne); // (1)
      await firebase.user(authUser.user.uid).set({ username, email, roles }); // (2)
      history.push(ROUTES.HOME);
    } catch(err) {
      errorHandler('SIGN UP ERROR', err)
    }
  };

  return (
    <StyledPaper>
      <Inner>
        <CardTitle>Sign Up</CardTitle>
        <SignUpFormNew onSubmit={ onSubmit }/>
      </Inner>
    </StyledPaper>
  );
};

export default compose(
  WithToast,
  withRouter,
  withFirebase,
)(SignUpPage);