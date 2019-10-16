import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';

const StyledSnackbar = styled(Snackbar)`
  &.success {
    .MuiSnackbarContent-message {
      color: #95ffac;
    }
  }
  &.error {
    .MuiSnackbarContent-message {
      color: #ff5151;
    }
  }
`;

const WithToast = Component => {
  class WithToastBase extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
        message: '',
      };
    }

    openToast = options => {
      this.setState({
        open: true,
        message: options.message,
        type: options.type,
        duration: options.duration || 1000,
      });
    };

    handleClose = () => {
      this.setState({
        open: false,
        message: '',
        type: '',
        duration: 1000,
      });
    };

    render() {
      const { type, open, duration, message } = this.state;

      return (
        <React.Fragment>
          <StyledSnackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            className={type}
            open={open}
            autoHideDuration={duration}
            onClose={this.handleClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{message}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
          <Component {...this.props} openToast={this.openToast} />
        </React.Fragment>
      );
    }
  }

  return WithToastBase;
};

export default WithToast;
