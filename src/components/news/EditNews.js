import React, { Component } from 'react'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import Select from '../layout/Select'
import { editNews, changeEditStatus } from '../../store/actions/newsAction'
import { Redirect } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap'

class EditNews extends Component {

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
    const { groups, news } = this.props;
    const groupsArr = groups.map(group => {
      return (group.id);
    })
    this.props.editNews(
      {
        title: this.state.title,
        content: this.state.content,
        isImportant: this.state.isImportant.value,
        id: news.id
      }, this.state.selectedGroups, groupsArr);
  }

  //Handle input change
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleClose() {
    this.setState({ show: false })
    this.props.changeEditStatus();
  }

  handleShow() {
    if (this.props.status === 'Success' && this.state.show !== true)
      this.setState({ show: true });
  }

  componentWillMount = () => {
    const { news } = this.props;
    if (news) {
      const groups = news.groups.map(single => {
        return (
          { value: single, label: single }
        )
      });
      const isImportant = { value: news.isImportant, label: news.isImportant.toString().charAt(0).toUpperCase() + news.isImportant.toString().slice(1) };
      this.setState({
        selectedGroups: groups,
        title: news.title,
        content: news.content,
        isImportant: isImportant
      })
    }
  }

  render() {
    const groupsOptions = [];
    const importantOptions = [
      { value: true, label: 'True' },
      { value: false, label: 'False' }
    ]
    const { groups, news, auth } = this.props;
    if(!auth.uid) return <Redirect to='/signin'></Redirect>
    if (news === undefined) return <Redirect to='/'></Redirect>
    this.handleShow();
    if (groups && news) {
      if (groupsOptions.length === 0) {
        for (var i = 0; i < groups.length; i++) {
          groupsOptions.push({ value: groups[i].id, label: groups[i].id })
        }
      }
      return (
        <>
          <div className='container'>
            <div className='col-md-12'>
              <h4 className="mb-3">Edit news</h4>
              <form className='need-validation' onSubmit={this.handleSubmit}>

                <div className="mb-3">
                  <label htmlFor="title">Title</label>
                  <input type="text" className="form-control" id="title" placeholder=""
                    onChange={this.handleChange} value={this.state.title} required />
                </div>

                <div className="mb-3">
                  <label htmlFor="content">Content</label>
                  <textarea className="form-control" id="content" placeholder=""
                    onChange={this.handleChange} value={this.state.content} required />
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

                <button className="btn btn-primary btn-lg btn-block" type="submit">Edit</button>
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

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const groups = state.firestore.ordered.groups;
  const allNews = state.firestore.ordered.news;
  const news = allNews ? allNews.filter(target => (target.id === id))[0] : null;
  console.log(state.news.editStatus);
  return {
    groups: groups,
    status: state.news.editStatus,
    news: news,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editNews: (news, group, allGroups) => dispatch(editNews(news, group, allGroups)),
    changeEditStatus: () => dispatch(changeEditStatus())
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'groups' },
    { collection: 'users' },
    { collection: 'news' }
  ])
)(EditNews);
