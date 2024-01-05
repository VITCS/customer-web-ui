const userProfileStore = {
  state: {
    deliveryContacts: null,
  },
  reducers: {
    STORE_DELIVERY_CONTACTS(state, deliveryContacts) {
      return {
        ...state,
        deliveryContacts,
      };
    },
  },
  effects: (dispatch) => ({
    storeDeliveryContacts(deliveryContacts) {
      dispatch.deliveryContacts.STORE_DELIVERY_CONTACTS(deliveryContacts);
    },
  }),
};

export default userProfileStore;
