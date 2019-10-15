import React, { Component, Fragment } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

import { StyledPaper, Inner, Block } from '../Shared';
import Spinner from '../Spinner';
import { blue } from '../../constants/colors';


class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: [],
    };
  }





  componentDidMount() {
    this.setState({ loading: true });



    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      // if no users???
      const usersList = usersObject ? Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      })) : [];

      this.setState({
        users: usersList,
        loading: false,
      });

    });

  }



  componentWillUnmount() {
    this.props.firebase.users().off(); // stop .on(...)
  }
  render() {
    const { users, loading } = this.state;
    return (
      <Fragment>
        { loading ? <Spinner /> : (
          <StyledPaper>
            <Inner>
              <UserList users={users} />
            </Inner>
          </StyledPaper>
        ) }
      </Fragment>
    );
  }
}

const UserList = ({ users }) => (
  <div>
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
  </div>
);


const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage);