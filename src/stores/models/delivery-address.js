const deliveryAddressStore = {
  state: {
    deliveryAddress: null,
    deliveryAddressStatus: null,
    deliveryToAddressStatus: null,
  },
  reducers: {
    UPDATE_DELIVERY_ADDRESS(state, deliveryAddress) {
      return {
        ...state,
        deliveryAddress,
      };
    },
    UPDATE_DELIVERY_ADDRESS_STATUS(state, deliveryAddressStatus) {
      return {
        ...state,
        deliveryAddressStatus,
      };
    },
    SET_DELIVERYTO_ADDRESS_SAME(state, deliveryToAddressStatus) {
      return {
        ...state,
        deliveryToAddressStatus,
      };
    },
    // EMPTY_DELIVERY_ADDRESS(state) {
    //   return {
    //     ...state,
    //     deliveryAddress: null,
    //   };
    // },
  },
  effects: (dispatch) => ({
    updateDeliveryAddress(deliveryAddress) {
      dispatch.deliveryAddress.UPDATE_DELIVERY_ADDRESS(deliveryAddress);
    },
    updateDeliveryAddressStatus(deliveryAddressStatus) {
      dispatch.deliveryAddress.UPDATE_DELIVERY_ADDRESS_STATUS(
        deliveryAddressStatus,
      );
    },
    setDeliveryToAddressStatus(deliveryToAddressStatus) {
      dispatch.deliveryAddress.SET_DELIVERYTO_ADDRESS_SAME(
        deliveryToAddressStatus,
      );
    },
    // emptyDeliveryAddress(deliveryAddress) {
    //   dispatch.deliveryAddress.EMPTY_DELIVERY_ADDRESS(deliveryAddress);
    // },
  }),
};

export default deliveryAddressStore;
