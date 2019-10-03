import React from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import WithConfirmAction from '../WithConfirmAction';

import DOMPurify from 'dompurify';

import TimelineIcon from '@material-ui/icons/Timeline';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import StatusSelect from '../StatusSelect';
import ShowTime from '../ShowTime';

const Wrap = styled(Paper)`
  padding: 20px;
  max-width: 600px;
  margin: 20px auto;
`;

const Head = styled.div`
  margin-bottom: 5px;
`;

const Title = styled.div`
  margin-bottom: 10px;
  font-weight: bold;
`;

const Branch = styled.div`
  margin-bottom: 5px;
  cursor: pointer;
`;

const StyledTimelineIcon = styled(TimelineIcon)`
  vertical-align: middle;
  color: #333333;
  margin-top: -5px;
`;

const TaskItem = (props) => {
  const { task, confirm, onRemoveTask, onEditTask, onCloneTask, firebase } = props;

  const setTimer = () => {
    const time = Date.now();
    const data = {
      ...task
    };
    if (!data.track) data.track = [];
    if (!data.track[0] || data.track[data.track.length-1].stop) {
      data.track.push({ start: time });
    } else {
      data.track[data.track.length-1].stop = time;
    }
    firebase.task(task.uid).set(data)
  };

  const copyToClipboard = (text) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const setStatus = async (status) => {
    const data = {
      ...task,
      status
    };


    try {
      await firebase.task(task.uid).set(data);
      console.log('STATUS SET >>>>>>');
    } catch(e) {
      console.log('SET STATUS ERROR:', e);
    }
  };

  const deleteTask = (id, name) => {
    confirm({
      message: `Are you sure you want to delete task ${name}? This action cannot be undone.`
    }).then(() => {
      onRemoveTask(id);
    }).catch(() => {
      console.log('Delete action canceled by user');
    });
  };

  return (
    <Wrap>
      <Head>
        {
          task.link ? (<a href={task.link} target="_blank"><b>{task.name}</b></a>) : (<b>{task.name}</b>)
        }

        <StatusSelect status={task.status} setStatus={setStatus} />

      </Head>
      <Title>{task.title}</Title>


      <Branch onClick={copyToClipboard.bind(null, task.branch)}>
        <StyledTimelineIcon color="primary" /> {task.branch}
      </Branch>

      <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(task.notes)}} />

      {
        task.track && task.track.length ? (<ShowTime track={task.track} />) : ''
      }

      <div style={{'paddingTop': '10px'}}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={ () => deleteTask(task.uid, task.name) }
        >
          DELETE
        </Button>
        <Button
          style={{'marginLeft': '5px'}}
          size="small"
          variant="contained"
          color="primary"
          onClick={ setTimer }
        >
          {
            task.track && task.track.length && !task.track[task.track.length - 1].stop ?
              'STOP' : 'START'
          }
        </Button>
        <Button
          style={{'marginLeft': '5px'}}
          size="small"
          variant="contained"
          color="primary"
          onClick={ () => onEditTask(task) }
        >
          EDIT
        </Button>
        <Button
          style={{'marginLeft': '5px'}}
          size="small"
          variant="contained"
          color="primary"
          onClick={ () => onCloneTask(task) }
        >
          CLONE
        </Button>
        <Button
          style={{'marginLeft': '5px'}}
          size="small"
          variant="contained"
          color="primary"
          onClick={ () => { console.log('STASH'); } }
        >
          STASH
        </Button>
      </div>
    </Wrap>
  )
};

export default compose(
  withFirebase,
  WithConfirmAction,
)(TaskItem);