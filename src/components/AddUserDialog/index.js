import React from 'react';
import { compose } from 'recompose';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import SignUpForm from '../SignUpForm';
import * as ROLES from '../../constants/roles';
import WithToast from '../WithToast';
import { withFirebase } from '../Firebase';

const Controls = styled.div`
  position: fixed;
  top: 69px;
  right: 30px;
  width: 58px;
`;

const StyledIconButton = styled(IconButton)`
  &.MuiIconButton-root {
    position: absolute;
    top: 10px;
    right: 10px;
  }
`;

const AddUserDialog = props => {
  const { firebase, openToast } = props;
  const [open, setOpen] = React.useState(false);

  const errorHandler = (consoleText, err) => {
    console.log(`${consoleText} :`, err);
    const ERROR = err && err.message ? err.message : 'ERROR';
    openToast({
      message: ERROR,
      type: 'error',
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async values => {
    const { username, email, passwordOne, admin } = values;
    const roles = {};

    if (admin) roles[ROLES.ADMIN] = ROLES.ADMIN;

    try {
      const authUser = await firebase.doCreateUserWithEmailAndPassword(
        email,
        passwordOne,
      );
      await firebase
        .user(authUser.user.uid)
        .set({ username, email, roles });
      openToast({
        message: 'User created',
        type: 'success',
      });
    } catch (err) {
      errorHandler('SIGN UP ERROR', err);
    }
  };

  return (
    <div>
      <Controls>
        <Tooltip title="Add user" placement="left" enterDelay={500}>
          <Fab
            color="primary"
            aria-label="add user"
            onClick={handleClickOpen}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Controls>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" onClose={handleClose}>
          Add user
          <StyledIconButton aria-label="close" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </StyledIconButton>
        </DialogTitle>
        <DialogContent>
          <SignUpForm onSubmit={onSubmit} admin />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default compose(
  withFirebase,
  WithToast,
)(AddUserDialog);
