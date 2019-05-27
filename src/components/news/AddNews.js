import React, { Component } from 'react'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import Select from '../layout/Select'
import { addNews, changeAddStatus } from '../../store/actions/newsAction'
import { Button, Modal } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

class AddNews extends Component {

  constructor(props) {
    super(props)

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
      selectedGroups: [],
      title: '',
      content: '',
      isImportant: null
    };
    this.handleGroupsSelect = this.handleGroupsSelect.bind(this);
  }

  //Handle select change
  handleGroupsSelect = (selectedGroups) => {
    this.setState({
      selectedGroups
    });
  }

    //Handle select change
    handleImportantSelect = (isImportant) => {
      this.setState({
        isImportant
      });
    }

  //Handle form submit
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.addNews(
      { 
        title: this.state.title, 
        content: this.state.content, 
        isImportant: this.state.isImportant 
      }, this.state.selectedGroups);
  }

  //Handle input change
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleClose() {
    this.setState({
      show: false,
      userId: '',
      selectedGroups: [],
      title: '',
      content: '',
      isImportant: null
    });
    this.props.changeAddStatus();
  }

  handleShow() {
    if (this.props.status === 'Success' && this.state.show !== true)
      this.setState({ show: true });
  }

  render() {
    const groupsOptions = [];
    const importantOptions = [
      { value: true, label: 'True' },
      { value: false, label: 'False' }
    ]
    const { groups, auth } = this.props;
    if(!auth.uid) return <Redirect to='/signin'></Redirect>
    this.handleShow();
    if (groups) {
      if (groupsOptions.length === 0) {
        for (var i = 0; i < groups.length; i++) {
          groupsOptions.push({ value: groups[i].id, label: groups[i].id })
        }
      }
      return (
        <>
          <div className='container'>
            <div className='col-md-12'>
              <h4 className="mb-3">Add news</h4>
              <form className='need-validation' onSubmit={this.handleSubmit}>

                <div className="mb-3">
                  <label htmlFor="title">Title</label>
                  <input type="text" className="form-control" id="title" placeholder="" onChange={this.handleChange} value={this.state.title} required />
                </div>

                <div className="mb-3">
                  <label htmlFor="content">Content</label>
                  <textarea className="form-control" id="content" placeholder="" onChange={this.handleChange} value={this.state.content} required />
                </div>

                <Select value={this.state.selectedGroups}
                  options={groupsOptions}
                  onChange={this.handleGroupsSelect}
                  placeholder='Select groups'
                  name='groupsId'
                  required
                  isMulti
                  allowSelectAll
                />

                <Select value={this.state.isImportant}
                  options={importantOptions}
                  onChange={this.handleImportantSelect}
                  placeholder='Is important?'
                  name='isImportant'
                  required
                />

                <button className="btn btn-primary btn-lg btn-block" type="submit">Add</button>
              </form>
            </div>
          </div>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Thành công</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Thêm tin thành công
            </Modal.Body>
            <Modal.Footer>
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

const mapStateToProps = (state) => {
  const groups = state.firestore.ordered.groups;
  console.log(state.news.addStatus);
  return {
    groups: groups,
    status: state.news.addStatus, 
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addNews: (news, group) => dispatch(addNews(news, group)),
    changeAddStatus: () => dispatch(changeAddStatus())
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'groups' },
    { collection: 'users' }
  ])
)(AddNews);
