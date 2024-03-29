import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import { compose } from 'recompose';
import WithToast from '../WithToast';
import { withFirebase } from '../Firebase';

import { DAY_FORMAT } from '../../constants/dates';

const Controls = styled.div`
  position: fixed;
  top: 69px;
  right: 30px;
  width: 58px;
  @media (max-width: 480px) {
    top: auto;
    bottom: 20px;
    right: 20px;
  }
`;

const AddEditTaskDialog = props => {
  const {
    edit,
    onStopEdit,
    userId,
    firebase,
    openToast,
    outerOpen,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState({
    name: '',
    title: '',
    link: '',
    branch: '',
    notes: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValues({
      name: '',
      title: '',
      link: '',
      branch: '',
      notes: '',
    });
    setOpen(false);

    if (outerOpen) onStopEdit();
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const getCursorPosition = el => {
    if ('selectionStart' in el) return el.selectionStart;
    if ('selection' in document) {
      el.focus();
      const Sel = document.selection.createRange();
      const SelLength = document.selection.createRange().text.length;
      Sel.moveStart('character', -el.value.length);
      return Sel.text.length - SelLength;
    }
    return 0;
  };

  const splice = (idx, rem, substr, str) =>
    str.slice(0, idx) + substr + str.slice(idx + Math.abs(rem));

  const addTag = tag => {
    const el = document.getElementById('task-notes');
    const pos = getCursorPosition(el);
    const { notes } = values;

    setValues({ ...values, notes: splice(pos, 0, tag, notes) });
    el.focus();
  };

  const createNewTask = async () => {
    const data = {
      ...values,
      day: moment().format(DAY_FORMAT),
      userId,
      createdAt: firebase.serverValue.TIMESTAMP,
    };

    try {
      await firebase.tasks().push(data);
      openToast({
        message: 'Task created',
        type: 'success',
      });
    } catch (err) {
      openToast({
        message: 'ERROR',
        type: 'error',
      });
      console.log('CREATE TASK ERROR: ', err);
    }
  };

  const updateTask = () => {
    const data = {
      ...values,
      track: edit.track || [],
      userId: edit.userId,
      day: edit.day,
      status: edit.status || 'to_do',
    };

    try {
      firebase.task(edit.uid).set(data);
    } catch (err) {
      console.log('EDIT TASK ERROR: ', err);
    }
  };

  const saveForm = () => {
    if (edit) {
      updateTask();
    } else {
      createNewTask();
    }
    handleClose();
  };

  React.useEffect(() => {
    if (edit) {
      setOpen(true);
      setValues({
        name: edit.name,
        title: edit.title,
        link: edit.link,
        branch: edit.branch,
        notes: edit.notes,
      });
    }
  }, [edit]);

  React.useEffect(() => {
    if (outerOpen) setOpen(true);
  }, [outerOpen]);

  return (
    <div>
      <Controls>
        <Tooltip title="Add task" placement="left" enterDelay={500}>
          <Fab
            color="primary"
            aria-label="add task"
            onClick={handleClickOpen}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Controls>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {edit ? 'Update task' : 'Create task'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To save the task, specify at least a name and description.
            You can edit this later.
            <br />
            You can write html code in notes area.
          </DialogContentText>
          <form noValidate autoComplete="off">
            <div>
              <TextField
                id="task-name"
                label="Name *"
                value={values.name}
                onChange={handleChange('name')}
                margin="normal"
                fullWidth
              />
            </div>
            <div>
              <TextField
                id="task-title"
                label="Title *"
                value={values.title}
                onChange={handleChange('title')}
                margin="normal"
                fullWidth
              />
            </div>
            <div>
              <TextField
                id="task-link"
                label="Link"
                value={values.link}
                onChange={handleChange('link')}
                margin="normal"
                fullWidth
              />
            </div>
            <div>
              <TextField
                id="task-branch"
                label="Branch"
                value={values.branch}
                onChange={handleChange('branch')}
                margin="normal"
                fullWidth
              />
            </div>
            <div>
              <TextField
                id="task-notes"
                label="Notes"
                multiline
                rows="4"
                value={values.notes}
                onChange={handleChange('notes')}
                margin="normal"
                fullWidth
              />
              <Button size="small" onClick={() => addTag('<br/>')}>{'<br>'}</Button>
              <Button size="small" onClick={() => addTag('<div></div>')}>{'<div>'}</Button>
              <Button size="small" onClick={() => addTag('<b></b>')}>{'<b>'}</Button>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={saveForm} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default compose(
  withFirebase,
  WithToast,
)(AddEditTaskDialog);
