import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import styled from 'styled-components';


import Paper from '@material-ui/core/Paper';
import {beige} from "../../constants/colors";

const StyledPaper = styled(Paper)`
  max-width: 90%;
  width: 400px;
  margin: 50px auto;
  padding: 10px;
`;

const Inner = styled.div`
  padding: 10px;
  border-radius: 4px;
  background: ${beige};
`;

const Title = styled.div`
  font-size: 22px;
  margin-bottom: 20px;
`;

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <StyledPaper>
        <Inner>
          <Title>Account: {authUser.email}</Title>
          <PasswordForgetForm />
          <PasswordChangeForm />
        </Inner>
      </StyledPaper>
    )}
  </AuthUserContext.Consumer>
);
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);
