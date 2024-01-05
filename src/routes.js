import { Router } from '@reach/router';
import React, { lazy } from 'react';
import PublicRoute from './components/public-route';

const NotFoundPage = lazy(() => import('./layouts/404'));
const HomePage = lazy(() => import('./layouts/home'));
const LoginPage = lazy(() => import('./components/login'));
const UserProfilePage = lazy(() => import('./layouts/user-profile'));
const CategoryPage = lazy(() => import('./layouts/category'));
const AvailabilitySearchPage = lazy(() =>
  import('./layouts/availabilitysearch'),
);
const ProductDetailsPage = lazy(() => import('./layouts/product-details'));
const Cart = lazy(() => import('./layouts/cart'));
const Checkout = lazy(() => import('./layouts/checkout'));
const Confirmation = lazy(() => import('./layouts/confirmation'));
const StoreLocator = lazy(() => import('./layouts/store-locator'));
const ForgotPasswordPage = lazy(() =>
  import('./components/auth/forget-password'),
);
const AboutUs = lazy(() => import('./layouts/about-us'));
const Careers = lazy(() => import('./layouts/careers'));
const FilterPage = lazy(() => import('./layouts/filter'));

export const ROUTE_NAMES = {
  AUTH: '/login',
  HOME: '/',
  FILTER: '/filter/:retailertype/:retailerid',
  PROFILE: '/profile',
  FORGOTPASSWORD: '/forgot',
};

const Routes = () => (
  <>
    <Router>
      <PublicRoute path={ROUTE_NAMES.AUTH} component={LoginPage} />
      <PublicRoute
        path={ROUTE_NAMES.FORGOTPASSWORD}
        component={ForgotPasswordPage}
      />
      <PublicRoute path={ROUTE_NAMES.HOME} component={HomePage} />
      <PublicRoute path={ROUTE_NAMES.FILTER} component={FilterPage} />
      <PublicRoute path="/signin/" component={HomePage} />
      <PublicRoute path="/signout/" component={HomePage} />
      <PublicRoute path="/userprofile/:activeTab" component={UserProfilePage} />
      <PublicRoute path="/userprofile/*" component={UserProfilePage} />
      <PublicRoute
        path="/category/:parentCategoryName/:categoryName"
        component={CategoryPage}
      />
      <PublicRoute path="/search/:searchKeyword" component={CategoryPage} />

      <PublicRoute path="/product/:productId" component={ProductDetailsPage} />
      <PublicRoute path="/storelocator" component={StoreLocator} />
      <PublicRoute path="/cart/:cartId" component={Cart} />
      <PublicRoute path="/checkout/*" component={Checkout} />
      <PublicRoute path="/checkout/:cartId" component={Checkout} />
      <PublicRoute path="/confirmation/:orderId" component={Confirmation} />
      <PublicRoute
        path="/availabilitysearch/:cartId"
        component={AvailabilitySearchPage}
      />
      <PublicRoute default component={NotFoundPage} />
      <PublicRoute path="/about-us" component={AboutUs} />
      <PublicRoute path="/careers" component={Careers} />
    </Router>
  </>
);

export default Routes;
