import { createMuiTheme } from '@material-ui/core/styles';
import { blue, red, text, textLight } from './constants/colors';

export default createMuiTheme({
  palette: {
    primary:  {
      // light: will be calculated from palette.primary.main,
      main: blue,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: '#0066ff',
      main: red,
      // dark: will be calculated from palette.secondary.main,
      // contrastText: '#ffcc00',
    },
    text: {
      primary: text,
      // secondary: textLight,
    }
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