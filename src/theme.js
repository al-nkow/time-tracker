import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary:  {
      // light: will be calculated from palette.primary.main,
      main: '#606686',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
    // error: will use the default color
  },
  // typography: {
  //   fontSize: 14,
  // },
  overrides: {
    MuiTextField: {
      root: {
        marginTop: '8px'
      }
    },
    MuiInputLabel: {
      root: {
        fontSize: '14px',
        '&$focused': {
          fontSize: '16px'
        },
        '&$shrink': {
          fontSize: '16px'
        },
      },
    },
    MuiDialogContentText: {
      root: {
        fontSize: '14px'
      }
    },
    MuiMenuItem: {
      root: {
        fontSize: '14px'
      }
    }



    // MuiOutlinedInput: {
    //   root: {
    //     '&$focused $notchedOutline': {
    //       borderColor: 'green',
    //       borderWidth: 1,
    //     },
    //   }
    // },

    // MuiOutlinedInput: {
    //   root: {
    //     '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
    //       borderColor: 'green',
    //       borderWidth: 1,
    //     },
    //   }
    // },











  },

});