import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import { StyledPaper, Inner } from '../Shared';
import WithToast from '../WithToast';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { slateblue, blue, textLight } from '../../constants/colors';

const Row = styled.div`
  margin-bottom: 10px;
`;

const StyledButton = styled(Button)`
  &.MuiButton-root {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const FootLink = styled(Link)`
  font-size: 14px;
  color: ${slateblue};
  text-decoration: none;
  &:hover {
    color: ${blue};
  }
`;

const LinkWrap = styled.p`
  margin: 10px 0;
`;

const StyledInputAdornment = styled(InputAdornment)`
  .MuiSvgIcon-root {
    color: ${textLight};
  }
`;

const SignInPage = () => (
  <StyledPaper>
    <Inner>
      <SignInForm />
      <LinkWrap>
        <FootLink to={ROUTES.PASSWORD_FORGET}>
          Forgot Password?
        </FootLink>
      </LinkWrap>
      <LinkWrap>
        <FootLink to={ROUTES.SIGN_UP}>
          Don't have an account? Sign Up
        </FootLink>
      </LinkWrap>
    </Inner>
  </StyledPaper>
);

const SignInFormBase = ({ firebase, history, openToast }) => {
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = name => event => {
    const { value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = () => {
    const { email, password } = values;
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setValues({ email: '', password: '' });
        history.push(ROUTES.HOME);
      })
      .catch(() => {
        openToast({
          message: 'Email or password is incorrect',
          type: 'error',
        });
      });
  };

  return (
    <form noValidate autoComplete="off">
      <Row>
        <TextField
          id="signin-email"
          label="Email Address"
          value={values.email}
          onChange={handleChange('email')}
          margin="normal"
          fullWidth
          InputProps={{
            endAdornment: (
              <StyledInputAdornment position="end">
                <EmailIcon />
              </StyledInputAdornment>
            ),
          }}
        />
      </Row>
      <Row>
        <TextField
          id="signin-password"
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange('password')}
          margin="normal"
          fullWidth
          InputProps={{
            endAdornment: (
              <StyledInputAdornment position="end">
                <LockIcon />
              </StyledInputAdornment>
            ),
          }}
        />
        <StyledButton
          fullWidth
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={!values.email || !values.password}
        >
          Sign In
        </StyledButton>
      </Row>
    </form>
  );
};

const SignInForm = compose(
  WithToast,
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;
