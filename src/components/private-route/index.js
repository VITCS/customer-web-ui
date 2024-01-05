import { Redirect } from '@reach/router';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Layout } from '../layout';

const PrivateRoute = (props) => {
  const { user, children, component: Component, location, ...rest } = props;

  if (!user) {
    return <Redirect to="/login" noThrow />;
  }

  return (
    <Layout isUserNav>
      <Suspense fallback={<div>Loading...</div>}>
        <Component {...rest} />
      </Suspense>
    </Layout>
  );
};

const stateMapper = (state) => ({
  user: state.auth?.user,
});

const dispatchMapper = () => ({});

export default connect(stateMapper, dispatchMapper)(PrivateRoute);
