import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signIn } from '../../store/actions/authActions'
import { Redirect } from 'react-router-dom'

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    error: null
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
    if (this.state.error !== null) {
      this.setState({ error: null })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signIn({
      email: this.state.email,
      password: this.state.password
    });
  }

  loginError = () => {
    if (this.state.error === 'auth/user-not-found')
      return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          Incorrect username
        </div>
      )
    if (this.state.error === 'auth/wrong-password')
      return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          Incorrect password
        </div>
      )
  }

  componentWillReceiveProps(nextProps) {
    console.log("Next props status:", nextProps.authError);
    if (nextProps.authError !== this.state.error)
      this.setState({
        error: nextProps.authError
      })
  }

  render() {
    const { auth } = this.props;
    if (auth.uid) return <Redirect to='/' />;
    return (
      <div className="container text-center">
        <form className="form-signin mx-auto col-md-4" onSubmit={this.handleSubmit}>
          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
          {/* Email input */}
          <label htmlFor="email" className="sr-only">Email address</label>
          <input type="email" id="email" className="form-control" placeholder="Email address" required="" autoFocus onChange={this.handleChange} />
          {/* Password input */}
          <label htmlFor="password" className="sr-only">Password</label>
          <input type="password" id="password" className="form-control" placeholder="Password" required="" onChange={this.handleChange} />
          {/* reCaptcha */}
          <div className='mx-auto'>
            {this.loginError()}
          </div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (creds) => dispatch(signIn(creds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)