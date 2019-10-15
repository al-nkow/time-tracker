import React from 'react';
import PasswordForgetForm from '../../components/PasswordForgetForm';
import {StyledPaper, Inner} from '../Shared';

const PasswordForgetPage = () => (
  <StyledPaper>
    <Inner>
      <h1>PasswordForget</h1>
      <PasswordForgetForm />
    </Inner>
  </StyledPaper>
);

export default PasswordForgetPage;