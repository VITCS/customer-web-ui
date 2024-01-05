import { Box, useToast } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { API, graphqlOperation } from 'aws-amplify';
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import awsExports from '../../aws-exports';
import { searchStore } from '../../graphql/queries';
import * as CartService from '../../services/cart-service';
import * as OrderService from '../../services/order-service';
import * as PaymentService from '../../services/payment-service';
import OrderShipment from './order-shipment';
import ScheduleDeliveryTime from './schedule-delivery';
import StripePayment from './stripe-payment';

// Move to aws-exports.js
const stripePromise = loadStripe(
  'pk_test_51KWLzaKSMMiABBtCCilbLt4xv7wje6bOF6x9qPbHYkQe24nJLhS006unSIMPjoy6lsntNLnEeDRB0GqMgLe7VHaj00R0E1ieAz',
);

const Checkout = (props) => {
  const toast = useToast();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { cartId, updateCart, emptyCart, user } = props;
  const [cart, setCart] = useState(null);
  const [calculatedTaxes, setCalculatedTaxes] = useState([]);
  const [paymentIntents, setPaymentIntents] = useState([]);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  const childRef = useRef([]);

  const handleScheduleDates = idx => () => {
    const next = childRef.current[idx];
    if (next) {
      return next.validationFunc();
    }
  };


  const calculateTaxes = async (_cart) => {
    const lstSearchedStores = [];
    _cart.cartShipment.items.forEach((eachCartShipment) => {
      lstSearchedStores.push(eachCartShipment.assignedStoreId);
    });

    // Search Stores For Store Address
    if (lstSearchedStores.length > 0) {
      const searchableStoreFilterInput = {
        distance: 10,
        lat: user?.deliveryToAddress?.latitude || 40.27478,
        lon: user?.deliveryToAddress?.longitude || -74.62813,
        showAll: true,
        filter: {},
      };
      searchableStoreFilterInput.filter.or = [];

      lstSearchedStores.forEach((eachStoreId) => {
        searchableStoreFilterInput.filter.or.push({
          id: { eq: eachStoreId },
          isDeliveryPaused: { ne: true },
        });
      });
      // Change the search query
      // console.log('searchableStoreFilterInput', searchableStoreFilterInput);

      const graphqlQuery = graphqlOperation(searchStore, {
        ...searchableStoreFilterInput,
      });
      const res = await API.graphql({
        ...graphqlQuery,
        authMode: 'API_KEY',
        authToken: awsExports.aws_appsync_apiKey,
      });

      if (res?.data.searchStore?.items.length > 0) {
        const lstStoreDetails = res.data.searchStore.items;

        const tempCartShipmentsWithStoreAddress = [];
        _cart.cartShipment.items.forEach((eachCartShipment) => {
          const storeDetails = lstStoreDetails.filter(
            (eachStore) => eachCartShipment.assignedStoreId === eachStore.id,
          )[0];
          tempCartShipmentsWithStoreAddress.push({
            assignedStoreId: eachCartShipment.assignedStoreId,
            storeAddress: {
              postCode: storeDetails.address.postCode.replace(/\s/g, ''),
              state: storeDetails.address.state.replace(/\s/g, ''),
            },
            deliveryAddress: eachCartShipment.deliveryAddress,
            subTotalProductAmount: eachCartShipment.subTotalProductAmount,
            orderLineItems: eachCartShipment.lineItems.map((eachLineItem) => ({
              qtyPurchased: eachLineItem.qtyPurchased,
              unitPrice: eachLineItem.unitPrice,
            })),
          });
        });

        const res1 = await OrderService.calculateTaxes(
          tempCartShipmentsWithStoreAddress,
        );
        if (res1.success) {
          setCalculatedTaxes(res1.calculatedTaxes);
        }
      }
    }
  };

  const createPaymentIntents = async (_cartShipment) => {
    let subTotalProductAmount = 0;
    _cartShipment.lineItems.map((eachLineItem) => {
      subTotalProductAmount +=
        eachLineItem.unitPrice * eachLineItem.qtyPurchased;
    });

    // TO DO : Now get Payment Intent Id from Stripe - Loop On cart shipments and get multiple payment intents
    const res = await PaymentService.createPaymentIntent({
      paymentMethodType: 'card', // Payment config object from aws-exports.js
      currency: 'USD', // Payment config object from aws-exports.js
      totalAmount: parseInt(subTotalProductAmount * 100, 10),
      userId: _cartShipment.userId,
    });
    if (res.success) {
      const oldPaymentintents = paymentIntents;
      oldPaymentintents.push({
        cartShipmentId: _cartShipment.id,
        clientSecret: res.clientSecret,
        id: res.id,
        publicKey: res.publicKey,
      });
      setPaymentIntents(oldPaymentintents);
    }
  };

  const getCartDetails = async (_cartId) => {
    const res = await CartService.getCart(_cartId);
    const tempCart = res;

    // Manipulate the cart with partial items
    const isPartial = localStorage.getItem('ispartial');
    if (isPartial === 'true') {
      const partialCartItems = JSON.parse(localStorage.getItem('partialcart'));

      const newPartialCartShipments = res.cartShipment.items
        .filter((cS) =>
          partialCartItems.some((pCI) => cS.assignedStoreId === pCI.storeId),
        )
        .map((cS) => {
          const matchedPartialItem =
            partialCartItems.find(
              (eachPartialCartItem) =>
                eachPartialCartItem.storeId === cS.assignedStoreId,
            ) || {};

          return {
            ...cS,
            lineItems: cS.lineItems.filter(
              (lI) => matchedPartialItem.productIds.indexOf(lI.productId) >= 0,
            ),
          };
        });
      tempCart.cartShipment.items = newPartialCartShipments;
    }

    if (tempCart) {
      tempCart.cartShipment.items.forEach(async (eachCartShipment) => {
        eachCartShipment.lineItems = eachCartShipment.lineItems.map(
          (eachLineItem) => ({
            ...eachLineItem,
            updateBtnDisabled: true,
            qtySelected: eachLineItem.qtyPurchased,
          }),
        );
        const storeRes = await CartService.getStore(
          eachCartShipment.assignedStoreId,
        );
        eachCartShipment.deliveryHours = storeRes?.deliveryHours;
        eachCartShipment.scheduleHours = storeRes?.scheduleHours;
        eachCartShipment.deliveryFee = storeRes?.deliveryFee;
        eachCartShipment.merchantFeeToCustomer = storeRes?.merchantFeeToCustomer;
        eachCartShipment.creditCardProcessingPercent = storeRes?.creditCardProcessingPercent;
        eachCartShipment.creditCardProcessingFlatFee = storeRes?.creditCardProcessingFlatFee;
      });
    }

    setCart(tempCart);
    updateCart(tempCart);
    if (tempCart) {
      calculateTaxes(tempCart);
      tempCart.cartShipment.items.forEach((eachCartShipment) => {
        createPaymentIntents(eachCartShipment);
      });
      setIsPageLoading(false);
    }
  };

  const postOrderCreation = async (orderId) => {
    const isPartial = localStorage.getItem('ispartial');
    if (isPartial === 'true') {
      const partialCartItems = JSON.parse(localStorage.getItem('partialcart'));
      localStorage.removeItem('ispartial');
      localStorage.removeItem('partialcart');

      // TO DO : Update the cart with remaining items
      // await CartService.updateCart(
      //   selectedStore,
      //   selectedProduct,
      //   qty,
      //   user,
      //   cartDetails,
      // );
    } else if (
      localStorage.getItem('buynow') !== null &&
      localStorage.getItem('buynow') === 'true'
    ) {
      localStorage.removeItem('isbuynow');
      localStorage.removeItem('buynowcart');
    } else {
      const emptyCartRes = await CartService.deleteCart(cartId);
      if (emptyCartRes.success) {
        emptyCart();
      }
    }

    // Note : Clear the local storage cart as well
    updateCart(null);
    navigate(`/confirmation/${orderId}`);
  };

  const createOrder = async (_cart) => {
    const res = await OrderService.createOrder(_cart, user);
    if (res.success) {
      toast({
        status: 'success',
        position: 'top',
        description: 'Order created successfully',
      });

      postOrderCreation(res.orderId);
    } else {
      toast({
        status: 'error',
        position: 'top',
        description: 'Error while creating order',
      });
    }
  };

  useEffect(() => {
    if (cartId) {
      getCartDetails(cartId);
    } else {
      const isBuyNow = localStorage.getItem('isbuynow');
      if (isBuyNow !== null && isBuyNow === 'true') {
        setIsPageLoading(false);
        const buyNowCart = JSON.parse(localStorage.getItem('buynowcart'));
        const newCart = {
          ...buyNowCart,
          cartShipment: {
            items: buyNowCart.cartShipment,
          },
        };
        setCart(newCart);
        updateCart(newCart);
        if (newCart) {
          calculateTaxes(newCart);
          newCart.cartShipment.items.forEach(async (eachCartShipment) => {
            createPaymentIntents(eachCartShipment);
            const storeRes = await CartService.getStore(
              eachCartShipment.assignedStoreId,
            );
            eachCartShipment.deliveryHours = storeRes?.deliveryHours;
            eachCartShipment.scheduleHours = storeRes?.scheduleHours;
            eachCartShipment.deliveryFee = storeRes?.deliveryFee;
            eachCartShipment.merchantFeeToCustomer = storeRes?.merchantFeeToCustomer;
            eachCartShipment.creditCardProcessingPercent = storeRes?.creditCardProcessingPercent;
            eachCartShipment.creditCardProcessingFlatFee = storeRes?.creditCardProcessingFlatFee;


          });
        }
      }
    }
  }, [cartId]);


  return (
    <Box className="blockBg">
      {!isPageLoading && calculatedTaxes.length > 0 ? (
        cart ? (
          <Box w={{ base: '100%', lg: '40%' }} m="auto">
            <h1>Checkout Information</h1>
            {cart.cartShipment.items.map((eachCartShipment, i) => (
              <Box
                key={`shipment-payment-${eachCartShipment.id}`}
                p="5"
                mt="5"
                mb="10"
                borderWidth="1px"
                borderColor="brand.red"
                rounded="5"
              >
                <Box
                  rounded="lg"
                  flexGrow="2"
                  alignItems="stretch"
                  className="mainBg"
                  borderColor="brand.red"
                  borderWidth="1px"
                >
                  <OrderShipment
                    key={`shipment-summary-${eachCartShipment.id}`}
                    cartShipment={eachCartShipment}
                    calculatedTax={calculatedTaxes[i]}
                    handleSubTotalAmount={(
                      subOrderAmount,
                      calculatedTax,
                      deliveryFee,
                      platformFee,
                      tipAmount,
                      TotalAmount,
                      CardProcessingFee,
                      shipmentLevelReplacement,
                      shipmentLevelReplacementFee,
                      totalPayableAmount,
                    ) => {
                      cart.cartShipment.items.forEach((eCS) => {
                        if (eachCartShipment.id === eCS.id) {
                          eachCartShipment.subOrderAmount = subOrderAmount;
                          eachCartShipment.subTotalTax = calculatedTax;
                          eachCartShipment.subTotalDeliveryCharges =
                            deliveryFee;
                          eachCartShipment.subTotal1800platformfee =
                            platformFee;
                          eachCartShipment.subTotalTipAmount = tipAmount;
                          eachCartShipment.subTotalAmount = TotalAmount;
                          eachCartShipment.subTotalCardProcessingFee = CardProcessingFee;
                          eachCartShipment.shipmentLevelReplacement = shipmentLevelReplacement;
                          eachCartShipment.shipmentLevelReplacementFee = shipmentLevelReplacementFee;
                          eachCartShipment.totalPayableAmount = totalPayableAmount;
                        }
                      });
                      updateCart({ ...cart });
                    }}
                  />
                </Box>
                <Box
                  mt="10"
                  rounded="lg"
                  flexGrow="2"
                  alignItems="stretch"
                  className="mainBg"
                  borderColor="brand.red"
                  borderWidth="1px"
                >
                  <ScheduleDeliveryTime
                    key={`schedule-delivery-${eachCartShipment.id}`}
                    cartShipment={eachCartShipment}
                    setScheduleDate={setScheduleDate}
                    setScheduleTime={setScheduleTime}
                    ref={el => childRef.current[i] = el}
                  />
                </Box>


                {stripePromise && paymentIntents.length > 0 && (
                  <Elements stripe={stripePromise}>
                    <StripePayment
                      paymentIntents={paymentIntents.find(
                        (pI) => pI.cartShipmentId === eachCartShipment.id,
                      )}
                      createOrder={createOrder}
                      cartShipment={eachCartShipment}
                      isLastShipment={i + 1 === cart.cartShipment.items.length}
                      scheduleDate={scheduleDate}
                      scheduleTime={scheduleTime}
                      handleScheduleDates={handleScheduleDates(i)}
                    />
                  </Elements>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Box bg="White" rounded="lg" p="10">
            <h1>Something went wrong with the cart</h1>
          </Box>
        )
      ) : (
        <div>Loading...</div>
      )}
    </Box>
  );
};

const stateMapper = (state) => ({
  // cart: state.cart.cart,
  user: state.auth?.user,
});

const dispatchMapper = (dispatch) => ({
  emptyCart: dispatch.cart.emptyCart,
  updateCart: dispatch.cart.updateCart,
});

export default connect(stateMapper, dispatchMapper)(Checkout);
