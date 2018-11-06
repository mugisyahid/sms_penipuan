 /* eslint-disable */
import React, { Component } from "react";
import { Redirect, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import agent from '../../agent';

import {
  HOME_PAGE_UNLOADED,
  HOME_PAGE_LOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: HOME_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: HOME_PAGE_UNLOADED })
});



class Dashboard extends Component {

  componentWillMount() {
  }
  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {

    const u = window.localStorage.getItem('user')
    if (u === 'undefined' || !u) {
      return <Redirect to='/login' />;
    }

    return (
      <div className="content">
     
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));

