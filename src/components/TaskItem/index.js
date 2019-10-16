import React, { Fragment } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { compose } from 'recompose';
import DOMPurify from 'dompurify';
import TimelineIcon from '@material-ui/icons/Timeline';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ArchiveIcon from '@material-ui/icons/Archive';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import { withFirebase } from '../Firebase';
import WithConfirmAction from '../WithConfirmAction';
import WithToast from '../WithToast';
import StatusSelect from '../StatusSelect';
import ShowTime from '../ShowTime';
import { beige, text, blue } from '../../constants/colors';
import { DAY_FORMAT } from '../../constants/dates';

const Wrap = styled(Paper)`
  padding: 10px;
  max-width: 600px;
  margin: 20px auto;
  &.stash {
    opacity: 0.5;
  }
`;

const Inner = styled.div`
  padding: 10px;
  border-radius: 4px;
  background: ${beige};
`;

const Head = styled.div`
  margin-bottom: 5px;
`;

const Title = styled.div`
  margin-bottom: 10px;
  font-weight: bold;
  padding: 8px 12px 8px 12px;
  border-radius: 4px;
  box-shadow: 0 5px 10px -3px rgba(0, 0, 0, 0.1);
`;

const Branch = styled.div`
  margin-bottom: 5px;
  cursor: pointer;
  padding: 8px 12px 8px 12px;
  border-radius: 4px;
  box-shadow: 0 5px 10px -3px rgba(0, 0, 0, 0.1);
`;

const StyledTimelineIcon = styled(TimelineIcon)`
  vertical-align: middle;
  margin-top: -4px;
  margin-right: 3px;
`;

const Name = styled.a`
  color: ${text};
  text-decoration: none;
  display: inline-block;
  &:hover {
    color: ${blue};
  }
`;

const StyledButton = styled(Button)`
  .MuiSvgIcon-root {
    width: 16px;
    height: 16px;
    margin-right: 3px;
  }
`;

const Notes = styled.div`
  padding: 10px;
`;

const TaskItem = props => {
  const { task, confirm, onEditTask, firebase, openToast } = props;

  const errorHandler = (consoleText, err) => {
    console.log(`${consoleText}: `, err);
    const ERROR = err && err.message ? err.message : 'ERROR';
    openToast({
      message: ERROR,
      type: 'error',
    });
  };

  const onRemoveTask = uid => {
    try {
      firebase.task(uid).remove();
    } catch (err) {
      errorHandler('REMOVE TASK ERROR', err);
    }
  };

  const onCloneTask = async () => {
    const data = {
      name: task.name,
      title: task.title,
      link: task.link,
      branch: task.branch,
      notes: task.notes,
      status: 'to_do',
      day: moment().format(DAY_FORMAT),
      userId: task.userId,
    };

    try {
      await firebase.tasks().push({
        ...data,
        createdAt: firebase.serverValue.TIMESTAMP
      });
      openToast({
        message: 'Task cloned',
        type: 'success',
      });
    } catch (err) {
      errorHandler('CLONE TASK ERROR', err);
    }
  };

  const deleteTask = (id, name) => {
    confirm({
      message: `Are you sure you want to delete task ${name}? This action cannot be undone.`,
    })
      .then(() => {
        onRemoveTask(id);
      })
      .catch(() => {
        console.log('Delete action canceled by user');
      });
  };

  const setTimer = () => {
    const time = Date.now();
    const data = {
      ...task,
    };
    if (!data.track) data.track = [];
    if (!data.track[0] || data.track[data.track.length - 1].stop) {
      data.track.push({ start: time });
    } else {
      data.track[data.track.length - 1].stop = time;
    }
    firebase.task(task.uid).set(data);
  };

  const copyToClipboard = txt => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(txt);
    }
  };

  const setStatus = async status => {
    const data = { ...task, status };

    try {
      await firebase.task(task.uid).set(data);
    } catch (err) {
      errorHandler('SET STATUS ERROR', err);
    }
  };

  const toggleStash = async () => {
    const data = {
      ...task,
      stash: !task.stash,
    };
    try {
      await firebase.task(task.uid).set(data);
    } catch (err) {
      errorHandler('STASH/APPLY ERROR', err);
    }
  };

  return (
    <Wrap className={task.stash ? 'stash' : ''}>
      <Inner>
        <Head>
          {task.link ? (
            <Name href={task.link} target="_blank">
              <b>{task.name}</b>
            </Name>
          ) : (
            <b>{task.name}</b>
          )}
          <StatusSelect status={task.status} setStatus={setStatus} />
          <ShowTime track={task.track} />
        </Head>
        {task.title && <Title>{task.title}</Title>}
        {task.branch && (
          <Branch onClick={() => copyToClipboard(task.branch)}>
            <StyledTimelineIcon color="primary" /> {task.branch}
          </Branch>
        )}
        <Notes
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(task.notes),
          }}
        />
        <div style={{ paddingTop: '10px' }}>
          <StyledButton
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => deleteTask(task.uid, task.name)}
          >
            <DeleteIcon fontSize="small" />
            DELETE
          </StyledButton>
          <StyledButton
            style={{ marginLeft: '5px' }}
            size="small"
            variant="contained"
            color="primary"
            onClick={setTimer}
          >
            {task.track &&
            task.track.length &&
            !task.track[task.track.length - 1].stop ? (
              <Fragment>
                <PauseCircleFilledIcon />
                STOP
              </Fragment>
            ) : (
              <Fragment>
                <PlayCircleFilledWhiteIcon />
                START
              </Fragment>
            )}
          </StyledButton>
          <StyledButton
            style={{ marginLeft: '5px' }}
            size="small"
            variant="contained"
            color="primary"
            onClick={() => onEditTask(task)}
          >
            <EditIcon />
            EDIT
          </StyledButton>
          <StyledButton
            style={{ marginLeft: '5px' }}
            size="small"
            variant="contained"
            color="primary"
            onClick={onCloneTask}
          >
            <FileCopyIcon />
            CLONE
          </StyledButton>
          <StyledButton
            style={{ marginLeft: '5px' }}
            size="small"
            variant="contained"
            color="primary"
            onClick={toggleStash}
          >
            {task.stash ? (
              <Fragment>
                <UnarchiveIcon />
                APPLY
              </Fragment>
            ) : (
              <Fragment>
                <ArchiveIcon />
                STASH
              </Fragment>
            )}
          </StyledButton>
        </div>
      </Inner>
    </Wrap>
  );
};

export default compose(
  withFirebase,
  WithConfirmAction,
  WithToast,
)(TaskItem);
