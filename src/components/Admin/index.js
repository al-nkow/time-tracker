import React, { Fragment, useEffect } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import { StyledPaper, Inner, Block } from '../Shared';
import Spinner from '../Spinner';
import { blue } from '../../constants/colors';
import AddUserDialog from '../AddUserDialog';

const AdminPage = ({ firebase }) => {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);

  // componentDidMount
  useEffect(() => {
    setLoading(true);

    firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();
      const usersList = usersObject ? Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      })) : [];

      setUsers(usersList);
      setLoading(false);
    });
  }, []);

  // componentWillUnmount
  useEffect(() => {
    return () => {
      firebase.users().off(); // unsubscribe firebase.users().on(...)
    }
  }, []);

  return (
    <Fragment>
      <AddUserDialog />
      { loading ? <Spinner /> : (
        <StyledPaper>
          <Inner>
            {users.map(user => (
              <Block key={user.uid}>
                <div>
                  <strong>E-Mail:</strong> <span style={{color: blue}}>{user.email}</span>
                </div>
                <div>
                  <strong>Username:</strong> {user.username}
                </div>
                <div>
                  <strong>Admin:</strong> {user.roles && user.roles.ADMIN ? 'TRUE' : 'FALSE'}
                </div>
                <div>
                  <strong>ID:</strong> {user.uid}
                </div>
              </Block>
            ))}
          </Inner>
        </StyledPaper>
      ) }
    </Fragment>
  );
};

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage);