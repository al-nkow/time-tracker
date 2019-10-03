import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import ScheduleIcon from '@material-ui/icons/Schedule';
import CircularProgress from '@material-ui/core/CircularProgress';

const TrackWrap = styled.div`
  margin: 10px 0;
  border: 1px solid #3f51b5;
  padding: 10px;
  border-radius: 4px;
`;

const StyledScheduleIcon = styled(ScheduleIcon)`
  vertical-align: middle;
  margin-right: 5px;
  margin-top: -3px;
`;

const StyledCircularProgress = styled(CircularProgress)`
  vertical-align: middle;
  margin: -5px 10px 0 5px;
`;

const ShowTime = ({ track }) => {
  const milliseconds = track.reduce((res, item) => {
    if (item.start && item.stop) res = res + item.stop - item.start;
    return res;
  }, 0);
  const minutes = Math.round(milliseconds/60000);
  const sum = minutes > 60 ? getHours(minutes) : minutes + 'min';
  const lastTrack = track[track.length - 1];
  const lastStartTime = lastTrack.start;
  const lastStopTime = lastTrack.stop;

  function getHours(minutes) {
    const hours = Math.round(minutes/60);
    const remainder = minutes%60;
    return `${hours}h${remainder}min`;
  }

  return (
    <TrackWrap>
        <StyledScheduleIcon />
        <b>{ sum } </b>
        <b>{ lastStartTime && !lastStopTime ?  (
          <span>
            <StyledCircularProgress size={20}/>
            { 'START:' + moment(lastStartTime).format('HH:mm') }
          </span>
        ) : '' }</b>
    </TrackWrap>
  );
};

export default ShowTime;