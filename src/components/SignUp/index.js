import React from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import WithToast from '../WithToast';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import { StyledPaper, Inner, CardTitle } from '../Shared';
import SignUpForm from '../SignUpForm';

const SignUpPage = ({ firebase, openToast, history }) => {
  const errorHandler = (consoleText, err) => {
    console.log(`${consoleText}: `, err);
    const ERROR = err && err.message ? err.message : 'ERROR';
    openToast({
      message: ERROR,
      type: 'error',
    });
  };

  const onSubmit = async values => {
    const { username, email, passwordOne, admin } = values;
    const roles = {};

    if (admin) roles[ROLES.ADMIN] = ROLES.ADMIN;

    try {
      const authUser = await firebase.doCreateUserWithEmailAndPassword(
        email,
        passwordOne,
      );
      await firebase
        .user(authUser.user.uid)
        .set({ username, email, roles });
      history.push(ROUTES.HOME);
    } catch (err) {
      errorHandler('SIGN UP ERROR', err);
    }
  };

  return (
    <StyledPaper>
      <Inner>
        <CardTitle>Sign Up</CardTitle>
        <SignUpForm onSubmit={onSubmit} />
      </Inner>
    </StyledPaper>
  );
};

export default compose(
  WithToast,
  withRouter,
  withFirebase,
)(SignUpPage);
