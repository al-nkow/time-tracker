import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import PasswordChangeForm from '../PasswordChangeForm';
import PasswordForgetForm from '../PasswordForgetForm';
import { beige, violet, blue } from '../../constants/colors';

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
  padding: 10px 10px 0 10px;
  color: ${blue};
`;

const Name = styled.div`
  font-size: 14px;
  padding: 0 10px 20px 10px;
  color: ${violet};
`;

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <StyledPaper>
        <Inner>
          <Title>Account: {authUser.email}</Title>
          {
            authUser.username ? (<Name>{authUser.username}</Name>) : ''
          }
          <PasswordForgetForm />
          <PasswordChangeForm />
        </Inner>
      </StyledPaper>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);
