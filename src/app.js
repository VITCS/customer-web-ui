import { Auth } from 'aws-amplify';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Routes from './routes';
import './index.css';

function App({ signOut }) {
  useEffect(() => {
    Auth.currentSession()
      .then((session) => {
        if (!session.isValid()) {
          signOut();
        }
      })
      .catch(() => {
        signOut();
      });
  }, []);

  return (
    <>
      <Routes />
      <ToastContainer />
    </>
  );
}

const stateMapper = (state) => ({
  // user: state.auth.user,
});

const dispatchMapper = (dispatch) => ({
  // fetchAndSetUser: dispatch.auth.fetchAndSetUser,
  signOut: dispatch.auth.signOut,
});

export default connect(stateMapper, dispatchMapper)(App);
