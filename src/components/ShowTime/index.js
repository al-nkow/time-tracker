import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import ScheduleIcon from '@material-ui/icons/Schedule';
import CircularProgress from '@material-ui/core/CircularProgress';
import { slateblue } from '../../constants/colors';

const TrackWrap = styled.div`
  float: right;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${slateblue};
  color: #ffffff;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 3px 1px -2px rgba(0, 0, 0, 0.12);
`;

const StyledScheduleIcon = styled(ScheduleIcon)`
  &.MuiSvgIcon-root {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-right: 5px;
    margin-top: -3px;
  }
`;

const StyledCircularProgress = styled(CircularProgress)`
  vertical-align: middle;
  margin: -2px 8px 0 5px;
  .MuiCircularProgress-svg {
    color: #ffffff;
  }
`;

const ShowTime = ({ track }) => {
  if (!track || !track.length) return '';
  const milliseconds = track.reduce((res, item) => {
    if (item.start && item.stop) res = res + item.stop - item.start;
    return res;
  }, 0);

  function getHours(minutes) {
    const hours = Math.round(minutes/60);
    const remainder = minutes%60;
    return `${hours}h${remainder}min`;
  }

  const minutes = Math.round(milliseconds / 60000);
  const sum = minutes > 60 ? getHours(minutes) : `${minutes} min`;
  const lastTrack = track[track.length - 1];
  const lastStartTime = lastTrack.start;
  const lastStopTime = lastTrack.stop;

  return (
    <TrackWrap>
      <StyledScheduleIcon />
      <b>{sum} </b>
      <b>
        {lastStartTime && !lastStopTime && (
          <span>
            <StyledCircularProgress size={16} />
            {moment(lastStartTime).format('HH:mm')}
          </span>
        )}
      </b>
    </TrackWrap>
  );
};

export default ShowTime;
