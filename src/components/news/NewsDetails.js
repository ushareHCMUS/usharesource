import React, { Component } from 'react'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class NewsDetails extends Component {

  constructor(props) {
    super(props)

    this.state = {
    };
  }

  render() {

    const { news, auth } = this.props;
    if(!auth.uid) return <Redirect to='/signin'></Redirect>
    if (news === undefined) return <Redirect to='/'></Redirect>

    if (news) {
      return (
        <div className='container'>
          <h2 className="page-header text-center">News</h2>
          <div className="row">

            <div className='col-md-12'>
              {
                <div className="card" key={news.id}>
                  <div className='card-header'>
                    <h5>{news.title}
                      <Link to={`/news/${news.id}/edit`} className="material-icons secondary-content" style={{ float: 'right', textDecoration: 'none' }}>edit </Link>
                    </h5>
                  </div>
                  <div className="card-body">
                    <p>{news.content}</p><br/>
                    <p>{news.time}</p><br/>
                    <p>{news.place}</p>
                  </div>
                  <div className="card-footer text-muted">
                    {news.timeStamp.toDate().toString()}
                    {
                      news.isImportant ? <FontAwesomeIcon icon="thumbtack" style={{ float: 'right' }} /> : null
                    }
                  </div>
                </div>
              }

            </div>
          </div>
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
  const newsId = ownProps.match.params.id;
  const news = state.firestore.ordered.news;
  const singleNews = news ? news.filter(target => (target.id === newsId))[0] : null;
  return {
    status: state.groups.removeStatus,
    news: singleNews,
    auth:state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'groups' },
    { collection: 'users' },
    { collection: 'news' }
  ])
)(NewsDetails);