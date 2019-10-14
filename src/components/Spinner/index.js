import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import { green } from '../../constants/colors';

const Wrap = styled.div`
  height: 400px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .MuiCircularProgress-svg {
    color: ${green};
  }
`;

export default () => {
  return (
    <Wrap>
      <CircularProgress color="secondary" size={60} />
    </Wrap>
  )
}