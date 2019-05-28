import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'

const NavBar = (props) => {
  const { auth } = props;
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary">
      <div className='container'>
        <Link to='/' className="navbar-brand">Ushare admin</Link>
        <div className="collapse navbar-collapse" id="navbarsExampleDefault"></div>
        <div className="float-right" id="navbarsExampleDefault">
          {
            auth.uid ?
              <ul className="navbar-nav mr-auto float-right">
                <li className="nav-item">
                  <NavLink exact to='/news' className="nav-link" >Public news</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to='/news/add' className="nav-link" >Add news</NavLink>
                </li>
                <li className="nav-item">
                  <p style={{ cursor: 'pointer' }} onClick={props.signOut} className="nav-link" >Log out</p>
                </li>
              </ul> :
              <ul className="navbar-nav mr-auto float-right">
              </ul>
          }
        </div>
      </div>
    </nav>
  )
}

const mapStateToProps = (state, ownProps) => {
  return ({
    auth: state.firebase.auth
  })
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);