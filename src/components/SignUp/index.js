import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
// import { FirebaseContext } from '../Firebase';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import * as ROLES from '../../constants/roles';

import {StyledPaper, Inner} from '../Shared';


const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};



const SignUpPage = () => (
  <StyledPaper>
    <Inner>
      <h1>SignUp</h1>
      <SignUpForm />
      {/*<FirebaseContext.Consumer>*/}
        {/*{firebase => <SignUpForm firebase={firebase} />}*/}
      {/*</FirebaseContext.Consumer>*/}
    </Inner>
  </StyledPaper>
);





class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = {};
    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        // (1) It creates a user in Firebase's internal authentication database that is only limited accessible.
        // (2) If (1) was successful, it creates a user in Firebase's realtime database that is accessible.
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
            roles
          });
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';
    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <input
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Full Name"
          />
        </div>
        <div>
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
        </div>
        <div>
          <input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </div>
        <div>
          <input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
          />
        </div>
        <div>
          <label>
            Admin:
            <input
              name="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={this.onChangeCheckbox}
            />
          </label>
        </div>
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

// const SignUpForm = withRouter(withFirebase(SignUpFormBase));
const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };