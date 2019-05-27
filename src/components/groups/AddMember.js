import React, { Component } from 'react'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import Select from 'react-select'
import { addMember, changeAddStatus } from '../../store/actions/groupActions'
import { Link, Redirect } from 'react-router-dom'


class AddMember extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedUser: null,
      userId: ''
    }
  }

  //Handle select change
  handleUserSelect = (selectedUser) => {
    this.setState({
      userId: selectedUser.value,
      selectedUser
    });
  }

  //Handle form submit
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.userId && this.props.group.id) {
      this.props.addMember(this.state.userId, this.props.group.id);
      this.userOptions = [];
      this.setState({ selectedUser: null });
    }
    else {
      console.log("Ngu");
    }
  }

  //Success or error notification
  handleNoti = () => {
    if (this.props.status === "Success")
      return (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Successfully added {this.state.userId}
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    if (this.props.status !== null && this.props.status !== "Success")
      return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {this.props.status}
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
  }


  render() {
    const userOptions = [];
    const { group, users, auth } = this.props;
    if(!auth.uid) return <Redirect to='/signin'></Redirect>
    if(group === undefined) return <Redirect to='/'></Redirect>
    
    if (group && users) {
      if (userOptions.length === 0) {
        for (var i = 0; i < users.length; i++) {
          userOptions.push({ value: users[i].id, label: users[i].id })
        }
      }
      return (
        <div className="container text-center">
          <form className="form-signin mx-auto col-md-6" onSubmit={this.handleSubmit}>
            <h1 className="h3 mb-3 font-weight-normal">{group.groupName} - Add member</h1>
            <Select value={this.state.selectedUser} options={userOptions} onChange={this.handleUserSelect} placeholder='Select member' name='userId' required />

            {
              this.state.selectedUser && users.filter(user => { return user.username === this.state.userId })
                .map(user => {
                  return (
                    <ul className="collection with-header members-list" key={user.id}>
                      <li className="collection-item avatar">
                        <img src={user.avatar} alt="" className="circle" />
                        <span className="title">{user.name}</span>
                        <p>{user.username} <br /> {user.department}</p>
                      </li>
                    </ul>
                  )
                })
            }
            {
              this.handleNoti()
            }
            <button className="btn btn-lg btn-primary btn-block" type="submit">Add</button>
            <Link to={`/group/${group.id}`} style={{ textDecoration: 'none' }}><button className="btn btn-danger btn-block" type="submit">Return</button></Link>
          </form>
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

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const groups = state.firestore.ordered.groups;
  //Get selected group
  const group = groups ? groups.filter(target => (target.id === id))[0] : null;
  const users = state.firestore.ordered.users;
  //Get users not in selected group
  const nonUsers = users ? users.filter(user => (user.groups === undefined || !user.groups.includes(id))) : null;
  return {
    group: group,
    users: nonUsers,
    status: state.groups.addStatus,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMember: (member, group) => dispatch(addMember(member, group)),
    changeAddStatus: () => dispatch(changeAddStatus())
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'groups' },
    { collection: 'users' }
  ])
)(AddMember);
