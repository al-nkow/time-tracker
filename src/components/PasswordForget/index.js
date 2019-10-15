import React from 'react';
import PasswordForgetForm from '../../components/PasswordForgetForm';
import { StyledPaper, Inner, CardTitle } from '../Shared';

const PasswordForgetPage = () => (
  <StyledPaper>
    <Inner>
      <CardTitle>Forgot password</CardTitle>
      <PasswordForgetForm />
    </Inner>
  </StyledPaper>
);

export default PasswordForgetPage;