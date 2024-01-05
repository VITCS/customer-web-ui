import { API, graphqlOperation } from 'aws-amplify';
import awsExports from '../../aws-exports';
import {
  getCart as getCartQuery,
  getCartByUserId as getCartByUserIdQuery,
} from '../../graphql/queries';

const cartStore = {
  state: {
    cart: null,
  },
  reducers: {
    UPDATE_CART(state, cart) {
      return {
        ...state,
        cart,
      };
    },
    EMPTY_CART(state) {
      return {
        ...state,
        cart: null,
        cartInvalidFlag: false,
      };
    },
    SET_CART_INVALID_FLAG(state, cartInvalidFlag) {
      return {
        ...state,
        cartInvalidFlag,
      };
    },
  },
  effects: (dispatch) => ({
    updateCart(cart) {
      dispatch.cart.UPDATE_CART(cart);
    },
    emptyCart(cart) {
      dispatch.cart.EMPTY_CART(cart);
      dispatch.cart.SET_CART_INVALID_FLAG(false);
    },
    setCartInvalidFlag(flag) {
      dispatch.cart.SET_CART_INVALID_FLAG(flag);
    },
    async fetchAndSetCart(userId) {
      try {
        const graphqlQuery = graphqlOperation(getCartByUserIdQuery, {
          userId,
        });

        const res = await API.graphql({
          ...graphqlQuery,
          authMode: 'API_KEY',
          authToken: awsExports.aws_appsync_apiKey,
        });

        if (res.data.getCartByUserId.items.length > 0) {
          const graphqlQuery1 = graphqlOperation(getCartQuery, {
            id: res.data.getCartByUserId.items.pop().id,
          });
          const res1 = await API.graphql({
            ...graphqlQuery1,
            authMode: 'API_KEY',
            authToken: awsExports.aws_appsync_apiKey,
          });
          const cartData = res1.data.getCart;

          // unitPrice & totalPrice has to be float from the api response
          if (cartData !== null) {
            cartData.cartShipment.items.forEach((eachCartShipment) => {
              eachCartShipment.lineItems.forEach((li) => {
                li.unitPrice = parseFloat(li.unitPrice).toFixed(2) * 1;
                li.totalPrice = parseFloat(li.totalPrice).toFixed(2) * 1;
              });
            });
          }

          dispatch.cart.UPDATE_CART({
            ...cartData,
          });
          return cartData;
        }
        return null;
      } catch (error) {
        console.log('fetchAndSetCart', error);
      }
    },
  }),
};

export default cartStore;
