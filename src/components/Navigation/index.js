import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import SettingsIcon from '@material-ui/icons/Settings';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const Wrap = styled.div`
  z-index: 1000;
  position: fixed;
  top: 69px;
  left: 30px;
  width: 58px;
  @media (max-width: 480px) {
    top: auto;
    bottom: 20px;
    left: 20px;
    .hide-mob {
      display: none;
    }
  }
`;

const MenuItem = styled(Link)`
  margin-bottom: 5px;
  display: inline-block;
`;

const Navigation = ({ firebase }) => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} firebase={firebase} />
      ) : (
        <NavigationNonAuth />
      )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser, firebase }) => (
  <Wrap>
    <Tooltip title="Home" placement="right" enterDelay={500}>
      <MenuItem to={ROUTES.HOME} className="hide-mob">
        <Fab color="primary" aria-label="edit">
          <HomeIcon />
        </Fab>
      </MenuItem>
    </Tooltip>
    <Tooltip title="Account" placement="right" enterDelay={500}>
      <MenuItem to={ROUTES.ACCOUNT} className="hide-mob">
        <Fab color="primary" aria-label="edit">
          <PersonIcon />
        </Fab>
      </MenuItem>
    </Tooltip>
    {!!authUser.roles[ROLES.ADMIN] && (
      <Tooltip title="Admin" placement="right" enterDelay={500}>
        <MenuItem to={ROUTES.ADMIN} className="hide-mob">
          <Fab color="primary" aria-label="edit">
            <SettingsIcon />
          </Fab>
        </MenuItem>
      </Tooltip>
    )}
    <Tooltip title="Exit" placement="right" enterDelay={500}>
      <Fab
        color="primary"
        aria-label="edit"
        onClick={() => firebase.doSignOut()}
      >
        <ExitToAppIcon />
      </Fab>
    </Tooltip>
  </Wrap>
);

const NavigationNonAuth = () => (
  <Wrap>
    <Tooltip title="Sign in" placement="right" enterDelay={500}>
      <MenuItem to={ROUTES.SIGN_IN}>
        <Fab color="primary" aria-label="edit">
          <MeetingRoomIcon />
        </Fab>
      </MenuItem>
    </Tooltip>
  </Wrap>
);

export default withFirebase(Navigation);
