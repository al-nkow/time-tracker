import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import styled from 'styled-components';
import { compose } from 'recompose';
import { validateEmail } from '../../service/validation';
import { withFirebase } from '../Firebase';
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
  margin-bottom: 20px;
`;

const PasswordForgetForm = ({ firebase, openToast }) => {
  const [values, setValues] = React.useState({
    email: '',
  });

  const [errors, setErrors] = React.useState({
    email: '',
  });

  function checkEmail(value) {
    return validateEmail(value) || !value
      ? ''
      : 'Wrong address format';
  }

  const rules = {
    email: checkEmail,
  };

  const handleChange = name => event => {
    const { value } = event.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: rules[name](value) });
  };

  const onSubmit = async () => {
    const { email } = values;
    try {
      await firebase.doPasswordReset(email);
      setValues({ email: '' });
      openToast({
        message: 'Check your mail',
        type: 'success',
      });
    } catch (err) {
      console.log('RESET PASSWORD ERROR', err);
      const ERROR = err && err.message ? err.message : 'ERROR';
      openToast({
        message: ERROR,
        type: 'error',
      });
    }
  };

  return (
    <Wrap>
      <form noValidate autoComplete="off">
        <Row>
          <TextField
            id="email-address"
            label="Email Address *"
            value={values.email}
            onChange={handleChange('email')}
            helperText={errors.email}
            margin="normal"
            fullWidth
          />
        </Row>
        <StyledButton
          size="small"
          variant="contained"
          color="secondary"
          onClick={onSubmit}
          disabled={!values.email || !!errors.email}
        >
          <SendIcon fontSize="small" />
          Reset my password
        </StyledButton>
      </form>
    </Wrap>
  );
};

export default compose(
  withFirebase,
  WithToast,
)(PasswordForgetForm);
