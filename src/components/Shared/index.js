import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import { beige } from '../../constants/colors';

export const StyledPaper = styled(Paper)`
  max-width: 90%;
  width: 400px;
  margin: 50px auto;
  padding: 10px;
`;

export const Inner = styled.div`
  padding: 10px;
  border-radius: 4px;
  background: ${beige};
`;