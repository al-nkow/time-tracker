import React from 'react';
import styled from 'styled-components';
import { slateblue, blue } from '../../constants/colors';

const Wrap = styled.div`
  cursor: pointer;
  text-align: center;
  border: 2px dashed ${slateblue};
  color: ${slateblue};
  border-radius: 4px;
  padding: 20px 10px;
  width: 500px;
  max-width: 90%;
  margin: 58px auto 0 auto;
  .title {
    font-size: 18px;
    text-transform: uppercase;
  }
  .desc {
    font-size: 14px;
  }
  &:hover {
    border: 2px dashed ${blue};
    color: ${blue};
  }
`;

const NoTasks = ({ create }) => {
  return (
    <Wrap onClick={create}>
      <div className="title">The task list is currently empty</div>
      <div className="desc">
        Click this area or the button on the right to create the first
        task
      </div>
    </Wrap>
  );
};

export default NoTasks;
