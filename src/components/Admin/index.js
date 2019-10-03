import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';


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
      <div>
        <h1>Admin</h1>
        <p>
          The Admin Page is accessible by every signed in admin user.
        </p>
        {loading && <div>Loading ...</div>}
        <UserList users={users} />
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.uid}>
        <div>
          <strong>ID:</strong> {user.uid}
        </div>
        <div>
          <strong>E-Mail:</strong> {user.email}
        </div>
        <div>
          <strong>Username:</strong> {user.username}
        </div>
        <div>
          <strong>Admin:</strong> {user.roles && user.roles.ADMIN ? 'TRUE' : 'FALSE'}
        </div>
      </li>
    ))}
  </ul>
);


const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage);