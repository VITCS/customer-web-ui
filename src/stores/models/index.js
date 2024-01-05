import authStore from './auth';
import cartStore from './cart';
import deliveryAddressStore from './delivery-address';
import userProfileStore from './userProfile';

const models = {
  auth: authStore,
  cart: cartStore,
  deliveryAddress: deliveryAddressStore,
  deliveryContacts: userProfileStore,
};

export default models;
