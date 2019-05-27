import React, { Component } from 'react'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Link, Redirect } from 'react-router-dom'
import { Button, Modal } from 'react-bootstrap'
import { removeMember, changeRemoveStatus } from '../../store/actions/groupActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class GroupDetails extends Component {

  constructor(props) {
    super(props)

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
      userId: '',
      removeBtn: true,
      userSearch: '',
      users: null,
      newsSearch: '',
      news: null
    };
  }

  handleClose() {
    this.setState({
      show: false,
      userId: ''
    });
    this.props.changeRemoveStatus();
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleClick = (userId) => {
    this.setState({
      userId: userId
    })
    this.handleShow();
  }

  handleRemove = () => {
    this.props.removeMember(this.state.userId, this.props.group.id);
  }

  handleNoti = () => {
    if (this.props.status === "Success")
      return (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Successfully removed {this.state.userId}
        </div>
      )
    if (this.props.status !== null && this.props.status !== "Success")
      return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {this.props.status}
        </div>
      )
  }

  removeBtn = () => {
    if (this.props.status === null)
      return (
        <Button variant="danger" onClick={this.handleRemove}>Remove</Button>
      )
  }

  handleUserSearch = (e) => {
    const { users } = this.props;
    this.setState({
      [e.target.id]: e.target.value
    }, () => {

      if (this.state.userSearch !== '' || this.state.userSearch !== null) {
        const filteredUsers = users.filter(user =>
          (
            user.name.toLowerCase().includes(this.state.userSearch.toLocaleLowerCase()) || user.id.includes(this.state.userSearch)
          )
        );
        this.setState({
          users: filteredUsers
        })
      }
      if (this.state.userSearch === null || this.state.userSearch === '' || this.state.users === null)
        this.setState({
          users
        })
    });
  }

  handleNewsSearch = (e) => {
    const { news } = this.props;
    if (this.state.news === null)
      this.setState({ news: this.props.news });
    this.setState({
      [e.target.id]: e.target.value
    }, () => {

      if (this.state.newsSearch !== '' || this.state.newsSearch !== null) {
        const filteredNews = news.filter(single =>
          (
            single.title.toLowerCase().includes(this.state.newsSearch.toLocaleLowerCase())
          )
        );
        this.setState({
          news: filteredNews
        })
      }
      if (this.state.newsSearch === null || this.state.newsSearch === '' || this.state.news === null)
        this.setState({
          news
        })
    });
  }

  changeState = () => {
    if (this.state.users === null)
      this.setState({ users: this.props.users });
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  renderNews = (news) => {
    if (this.state.news === null) {
      console.log('Test');
      return (
        news && news.map(single => {
          return (
            <Link to={`/news/${single.id}`} style={{ textDecoration: 'none' }} key={single.id}>
              <div className="card">
                <div className="card-body">
                  <h5>{single.title}</h5>
                </div>
                <div className="card-footer text-muted">
                  {single.timeStamp.toDate().toString()}
                  {
                    single.isImportant ? <FontAwesomeIcon icon="thumbtack" style={{ float: 'right' }} /> : null
                  }
                </div>
              </div>
            </Link>
          )
        })
      )
    }
    else {
      console.log(this.state.news);
      return (
        this.state.news && this.state.news.map(single => {
          return (
            <Link to={`/news/${single.id}`} style={{ textDecoration: 'none' }} key={single.id}>
              <div className="card">
                <div className="card-body">
                  <h5>{single.title}</h5>
                </div>
                <div className="card-footer text-muted">
                  {single.timeStamp.toDate().toString()}
                  {
                    single.isImportant ? <FontAwesomeIcon icon="thumbtack" style={{ float: 'right' }} /> : null
                  }
                </div>
              </div>
            </Link>
          )
        })
      )
    }
  }

  render() {

    const { group, users, news, auth } = this.props;
    if (group === undefined) return <Redirect to='/'></Redirect>
    if(!auth.uid) return <Redirect to='/signin'></Redirect>
    if (group && users && news) {
      this.changeState();
      return (
        <>
          <div className='container'>
            <h2 className="page-header text-center">{group.groupName}</h2>
            <div className="row">
              <div className='col-md-4 order-md-2 mb-4 members-container'>
                <h4 className="d-flex justify-content-between align-items-center mb-3">Members</h4>
                <ul className="collection with-header members-list">
                  <li className='collection-item'>
                    <form className='nav-wrapper' onSubmit={this.handleSubmit}>
                      <div className="input-field">
                        <input id="userSearch" type="search" onChange={this.handleUserSearch} value={this.state.userSearch} />
                        <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                      </div>
                    </form>
                  </li>
                  {
                    this.state.users && this.state.users.map(user => {
                      return (
                        <li className="collection-item avatar" key={user.id}>
                          <img src={user.avatar} alt="" className="circle" />
                          <span className="title">{user.name}</span>
                          <p>{user.username} <br /> {user.department}</p>
                          <button className="secondary-content" onClick={this.handleClick.bind(null, user.id)}><i className="material-icons">clear</i></button>
                        </li>
                      )
                    })
                  }
                </ul>
                <Link to={`/group/${group.id}/add`} style={{ textDecoration: 'none' }}><button className='btn btn-primary btn-block'>Add member</button></Link>
              </div>

              <div className='col-md-8 order-md-1'>
                <h4 className="mb-3">Newsfeed</h4>
                <ul className="collection with-header members-list">
                  <li className='collection-item'>
                    <form className='nav-wrapper' onSubmit={this.handleSubmit}>
                      <div className="input-field">
                        <input id="newsSearch" type="search" onChange={this.handleNewsSearch} value={this.state.newsSearch} />
                        <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                      </div>
                    </form>
                  </li>
                </ul>
                {
                  this.renderNews(news)
                }
              </div>
            </div>
          </div>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Remove following member?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
                users.filter(user => { return user.username === this.state.userId })
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
              {this.handleNoti()}
            </Modal.Body>
            <Modal.Footer>
              {this.removeBtn()}
              <Button variant="secondary" onClick={this.handleClose}>
                Close
            </Button>
            </Modal.Footer>
          </Modal>
        </>
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
  //Get users in selected group
  const groupUsers = users ? users.filter(user => (user.groups !== undefined && user.groups.includes(id))) : null;
  const news = state.firestore.ordered.news;
  const groupNews = news ? news.filter(groupNews => (groupNews.groups !== undefined && groupNews.groups.includes(id))) : null;
  return {
    group: group,
    users: groupUsers,
    status: state.groups.removeStatus,
    news: groupNews,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeMember: (member, group) => dispatch(removeMember(member, group)),
    changeRemoveStatus: () => dispatch(changeRemoveStatus())
  }
}


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'groups' },
    { collection: 'users' },
    {
      collection: 'news',
      orderBy: [
        ['isImportant', 'desc'],
        ['timeStamp', 'desc']
      ]
    }
  ])
)(GroupDetails);