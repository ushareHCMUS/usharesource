import React, { Component } from 'react'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Link, Redirect } from 'react-router-dom'
import { removeMember, changeRemoveStatus } from '../../store/actions/groupActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class AllNews extends Component {

  constructor(props) {
    super(props)

    this.state = {
      show: false,
      userId: '',
      removeBtn: true,
      newsSearch: '',
      news: null
    };
  }


  handleNewsSearch = (e) => {
    const { news } = this.props;
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
    if (this.state.news === null)
      this.setState({ news: this.props.news });
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

    const { group, news, auth } = this.props;
    if(!auth.uid) return <Redirect to='/signin'></Redirect>
    if (group === undefined) return <Redirect to='/'></Redirect>

    if (group && news) {
      this.changeState();
      return (
        <>
          <div className='container'>
            <h2 className="page-header text-center">News</h2>
            <div className="row">
              <div className='col-md-12'>
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
  const groups = state.firestore.ordered.groups;
  //Get selected group
  const group = groups ? groups.filter(target => (target.id === 'hcmus'))[0] : null;
  const news = state.firestore.ordered.news;
  const groupNews = news ? news.filter(groupNews => (groupNews.isPublic !== undefined && groupNews.isPublic === true)) : null;
  return {
    group: group,
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
    {
      collection: 'news',
      orderBy: [
        ['isImportant', 'desc'],
        ['timeStamp', 'desc']
      ]
    }
  ])
)(AllNews);