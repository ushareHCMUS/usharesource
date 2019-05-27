import React, { Component } from 'react';
import Group from './Group';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom'

class GroupList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      search: '',
      groups: null
    }
  }

  handleSearch = (e) => {
    const { groups } = this.props;
    this.setState({
      [e.target.id]: e.target.value
    }, () => {

      if (this.state.search !== '' || this.state.search !== null) {
        const filteredGroups = groups.filter(group => (group.groupName.toLowerCase().includes(this.state.search.toLowerCase())));
        this.setState({
          groups: filteredGroups
        })
      }
      if (this.state.search === null || this.state.search === '')
        this.setState({
          groups
        })
      console.log(this.state.groups);
    });
  }

  changeState = (groups) => {
    if (this.state.groups === null)
      this.setState({
        groups
      })
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  render() {

    const { groups, auth } = this.props;
    
    if(!auth.uid) return <Redirect to='/signin'></Redirect>
    if (groups) {
      this.changeState(groups);
      return (
        <div className='container'>
          <ul className="collection with-header">
            <li className="collection-header"><h4 className='mx-auto'>Groups list</h4></li>
            <li className='collection-item'>
              <form className='nav-wrapper' onSubmit={this.handleSubmit}>
                <div className="input-field">
                  <input id="search" type="search" onChange={this.handleSearch} value={this.state.search} />
                  <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                  <i className="material-icons">close</i>
                </div>
              </form>
            </li>
            <Group groups={this.state.groups} />
          </ul>
        </div>
      )
    }
    else {
      return (
        <div className='container'>
          <ul className="collection with-header">
            <h2 className="page-header text-center">Page loading</h2>
          </ul>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  const groups = state.firestore.ordered.groups;
  const groupsList = groups ? groups.filter(group => (group.id !== 'hcmus')) : null;
  return {
    groups: groupsList,
    auth: state.firebase.auth
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'groups' }
  ])
)(GroupList)