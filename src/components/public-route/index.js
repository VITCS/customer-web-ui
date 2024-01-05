/* eslint-disable react/jsx-props-no-spreading */
import React, { Suspense } from 'react';
import { Layout } from '../layout';

const PublicRoute = ({ component: Component, ...rest }) => (
  <Layout isUserNav>
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...rest} />
    </Suspense>
  </Layout>
);

export default PublicRoute;
