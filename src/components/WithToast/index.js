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

  class WithToast extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
        message: ''
      };
    }

    openToast = (options) => {
      this.setState({
        open: true,
        message: options.message,
        type: options.type
      });
    };

    handleClose = () => {
      this.setState({
        open: false,
        message: '',
        type: ''
      });
    };

    render() {

      return (
        <React.Fragment>
        <StyledSnackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          className={this.state.type}
          open={this.state.open}
          autoHideDuration={1000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.message}</span>}
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
        <Component {...this.props} openToast={this.openToast}/>
        </React.Fragment>
      );
    }
  }

  return WithToast;

};
export default WithToast;