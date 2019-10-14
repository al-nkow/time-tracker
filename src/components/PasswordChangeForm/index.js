import React from 'react';
import { withFirebase } from '../Firebase';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import TextField from '@material-ui/core/TextField';
import { compose } from 'recompose';
import WithToast from '../WithToast';

const StyledButton = styled(Button)`
  .MuiSvgIcon-root {
    width: 16px;
    height: 16px;
    margin-right: 3px;
  }
`;

const Row = styled.div`
  margin-bottom: 10px;
`;

const Wrap = styled.div`
  padding: 10px;
  margin-bottom: 20px;
`;

const PasswordChangeForm = ({ firebase, openToast }) => {
  const ERROR_TEXT = 'Passwords do not match';
  const [values, setValues] = React.useState({
    passwordOne: '',
    passwordTwo: ''
  });

  const handleChange = name => event => {
    const value = event.target.value;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async () => {
    const { passwordOne } = values;
    try {
      await firebase.doPasswordUpdate(passwordOne);
      setValues({ passwordOne: '', passwordTwo: '' });
      openToast({
        message: 'Password updated',
        type: 'success'
      });
    } catch(err) {
      console.log('UPDATE PASSWORD ERROR', err);
      const ERROR = err && err.message ? err.message : 'ERROR';
      openToast({
        message: ERROR,
        type: 'error'
      });
    }
  };

  const disabled = !values.passwordOne || !values.passwordTwo || values.passwordOne !== values.passwordTwo;
  const helper = values.passwordOne !== values.passwordTwo ? ERROR_TEXT : '';

  return (
    <Wrap>
      <form noValidate autoComplete="off">
        <TextField
          id="email-address"
          label="New password *"
          value={ values.passwordOne }
          onChange={ handleChange('passwordOne') }
          helperText={ helper }
          margin="normal"
          fullWidth
        />
        <Row>
          <TextField
            id="email-address"
            label="Repeat new password *"
            value={ values.passwordTwo }
            onChange={ handleChange('passwordTwo') }
            helperText={ helper }
            margin="normal"
            fullWidth
          />
        </Row>
        <StyledButton
          size="small"
          variant="contained"
          color="secondary"
          onClick={ onSubmit }
          disabled={ disabled }
        >
          <RotateLeftIcon fontSize="small" />
          Reset my password
        </StyledButton>
      </form>
    </Wrap>
  )
};

export default compose(
  withFirebase,
  WithToast,
)(PasswordChangeForm);