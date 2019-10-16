import React from 'react';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  &.MuiButton-root {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-top: 10px;
`;

const SignUpForm = ({ onSubmit, admin }) => {
  const [values, setValues] = React.useState({
    username: '', email: '', passwordOne: '', passwordTwo: '', admin: false
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeCheckbox = () => {
    setValues({ ...values, admin: !values.admin });
  };

  const signUp = () => {
    onSubmit(values);
  };

  const { username, email, passwordOne, passwordTwo } = values;
  const isInvalid = !username || !email || !passwordOne || !passwordTwo || passwordOne !== passwordTwo;

  return (
    <form noValidate autoComplete="off">
      <div>
        <TextField
          id="signup-name"
          label="Name"
          value={ values.username }
          onChange={ handleChange('username') }
          margin="normal"
          fullWidth
        />
      </div>
      <div>
        <TextField
          id="signup-email"
          label="Email"
          value={ values.email }
          onChange={ handleChange('email') }
          margin="normal"
          fullWidth
        />
      </div>
      <div>
        <TextField
          id="signup-password-one"
          label="Password (at least 6)"
          value={ values.passwordOne }
          onChange={ handleChange('passwordOne') }
          margin="normal"
          fullWidth
        />
      </div>
      <div>
        <TextField
          id="signup-password-two"
          label="Repeat password"
          value={ values.passwordTwo }
          onChange={ handleChange('passwordTwo') }
          margin="normal"
          fullWidth
        />
      </div>
      {
        admin ? (
          <StyledFormControlLabel
            control={
              <Checkbox
                checked={ values.admin }
                onChange={ handleChangeCheckbox }
                value="admin"
                color="primary"
              />
            }
            label="Administrator"
          />
        ) : ''
      }
      <StyledButton
        fullWidth
        variant="contained"
        color="primary"
        onClick={ signUp }
        disabled={ isInvalid }
      >
        Sign Up
      </StyledButton>
    </form>
  );
};

export default SignUpForm;