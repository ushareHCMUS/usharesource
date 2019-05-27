import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import GroupList from './components/groups/GroupList';
import GroupDetails from './components/groups/GroupDetails'
import AddMember from './components/groups/AddMember'
import NewsDetails from './components/news/NewsDetails'
import AddNews from './components/news/AddNews'
import EditNews from './components/news/EditNews'
import AllNews from './components/news/AllNews'
import SignIn from './components/layout/SignIn'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas, faThumbtack } from '@fortawesome/free-solid-svg-icons'

library.add(fas, faThumbtack)

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App" >
          <Navbar></Navbar>
          <Switch>
            <Route exact path='/signin' component = {SignIn} />
            <Route exact path='/' component = {GroupList} />
            <Route exact path='/group/:id' component = {GroupDetails} />
            <Route path='/group/:id/add' component = {AddMember} />
            <Route path='/news/add' component = {AddNews} />
            <Route path='/news/:id/edit' component = {EditNews} />
            <Route path='/news/:id' component = {NewsDetails} />
            <Route exact path='/news' component = {AllNews} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;