import {
  Box,
  Button,
  Checkbox,
  Flex,
  Radio,
  RadioGroup,
  Text,
  CheckboxGroup,
  Link,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SavedCards from '../saved-cards';
import StatusMessages, { useMessages } from './status-messages';
import './stripe-payment.css';
import { getCustomerProfile } from '../../../graphql/queries';
import { graphql } from '../../../utils/api';
import { Auth, graphqlOperation } from 'aws-amplify';

function StripePayment({
  cart,
  user,
  paymentIntents,
  createOrder,
  cartShipment,
  isLastShipment,
  updateCart,
  scheduleDate,
  scheduleTime,
  handleScheduleDates,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [saveCardForFuture, setSaveCardForFuture] = useState(false);
  const [paymentBtnTxt, setPaymentBtnTxt] = useState('Pay');
  const [enablePaymentBtn, setEnablePaymentBtn] = useState('false');
  const [messages, addMessage] = useMessages();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [orderLineitemReplacement, setOrderLineitemReplacement] = useState(false);
  const [shipmentLevelReplacement, setShipmentLevelReplacement] = useState(false);
  const [shipmentLevelReplacementFee, setShipmentLevelReplacementFee] = useState(0);
  const handleReplacementFeeChange = (value) => {
    setShipmentLevelReplacementFee(parseInt(value, 10));
  };
  const handlePaymentSubmit = async (e) => {
    const formik = handleScheduleDates();
    formik.handleSubmit();
    if (!formik.isValid) {
      return;
    }
    setPaymentBtnTxt('Paid');
    setEnablePaymentBtn('true');

    // We don't want to let default form submission happen here, which would refresh the page.
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded, Make sure to disable form submission until Stripe.js has loaded.
      addMessage('Stripe.js has not yet loaded.');
      return;
    }

    let tempPaymentMethod;
    if (elements && selectedPaymentMethod === null) {
      tempPaymentMethod = {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Jenny Rosen', // TO DO : Need to fill the billing_details from cart
          // address: {
          //   postal_code: '12345',
          // },
        },
      };
    } else {
      tempPaymentMethod = selectedPaymentMethod.id;
    }

    const { error: stripeError, paymentIntent: paymentIntentResponse } =
      await stripe.confirmCardPayment(paymentIntents.clientSecret, {
        payment_method: tempPaymentMethod,
        setup_future_usage: saveCardForFuture ? 'on_session' : '',
      });

    if (stripeError) {
      addMessage(stripeError.message);
      return;
    }

    // Show a success message to your customer, There's a risk of the customer closing the window before callback execution.
    // Set up a webhook or plugin to listen for the payment_intent.succeeded event that handles any business critical post-payment actions.

    // addMessage(
    //   `Payment ${paymentIntentResponse.status}: ${paymentIntentResponse.id}`,
    // );

    cart.cartShipment.items.forEach((eachCartShipment) => {
      if (eachCartShipment.id === cartShipment.id) {
        eachCartShipment['paymentIntentId'] = paymentIntentResponse.id;
        eachCartShipment['paymentIntentRes'] = JSON.stringify(
          paymentIntentResponse,
        );
        eachCartShipment['shipmentLevelReplacement'] = shipmentLevelReplacement;
        eachCartShipment['shipmentLevelReplacementFee'] = shipmentLevelReplacementFee;
        eachCartShipment['totalPayableAmount'] = totalPayableAmount;
        eachCartShipment['scheduledDeliveryDt'] = scheduleDate;
        eachCartShipment['scheduledTimeSlot'] = scheduleTime;
      }
    });

    updateCart({ ...cart });
    // console.log('updated cart with payment responses', cart);
    if (isLastShipment) {
      createOrder(cart, user);
    }
    ;

  };

  useEffect(() => {
    const getData = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const dbUser = await graphql(
        graphqlOperation(getCustomerProfile, {
          userId: user.username,
        }),
      );
      let userObj = dbUser?.data?.getCustomerProfile;
      let orderLine = userObj?.orderLineitemReplacement;
      setOrderLineitemReplacement(orderLine);
      console.log(orderLine);
    }
    getData();
  }, [])

  let totalPayableAmount = cartShipment.subOrderAmount + shipmentLevelReplacementFee;



  return (
    <>
      <Box
        mt="10"
        rounded="lg"
        flexGrow="2"
        alignItems="stretch"
        className="mainBg"
        borderColor="brand.red"
        borderWidth="1px"
      >
        <Box
          bg="brand.red"
          roundedTop="lg"
          color="White"
          py="3"
          fontSize="lg"
          px="4"
        >
          List of cards
        </Box>
        <Box p="5">
          <form id="payment-form" onSubmit={handlePaymentSubmit}>
            <RadioGroup name="select-payment-method">
              <SavedCards
                handleSelectedPaymentMethod={(_selectedPaymentMethod) => {
                  setSelectedPaymentMethod(_selectedPaymentMethod);
                }}
                isMyAccount={false}
              />
              <Box>
                <Radio
                  value="null"
                  colorScheme="red"
                  size="lg"
                  onClick={() => {
                    setSelectedPaymentMethod(null);
                  }}
                >
                  New Card
                </Radio>
                <CardElement id="card" />
              </Box>
            </RadioGroup>
            <Text as="span" color="brand.red">
              <StatusMessages messages={messages} />
            </Text>

            <Checkbox
              mt="5"
              isChecked={saveCardForFuture}
              colorScheme="red"
              onChange={(e) => {
                e.preventDefault();
                setSaveCardForFuture(e.target.checked);
              }}
            >
              Save card for future payments
            </Checkbox>
          </form>
        </Box>
      </Box>
      {orderLineitemReplacement ? (
        <>
          <Flex pt='10px' justifyContent="space-between" mt="7" pl='5'>

            <Box >
              <Checkbox
                name='shipmentLevelReplacement'
                value={shipmentLevelReplacement}
                isChecked={shipmentLevelReplacement}
                onChange={(e) => {
                  if (!shipmentLevelReplacement) {
                    setShipmentLevelReplacement(e.target.checked)
                    console.log(shipmentLevelReplacement);
                    setShipmentLevelReplacementFee(5);
                  }
                  else {
                    setShipmentLevelReplacement(false);
                    setShipmentLevelReplacementFee(0)
                  };
                }
                }
              >
                <Text as="span" fontSize='13px' fontWeight='bold'>
                  Replace any unavailable product with a similar product in this order
                </Text>
              </Checkbox>
            </Box>
          </Flex>
        </>
      ) : (
        <></>
      )}

      {shipmentLevelReplacement ? (
        <>
          <Flex mt="2">
            <Box >
              {/* <FormControl 
                isRequired
                isInvalid={!!errors.creditCardProcessingPercent && touched.creditCardProcessingPercent}
                > */}
              <HStack>
                <Box pt='5' pl='10' pr='6' w='82%' >
                  <Text fontSize='13px' fontWeight='bold' color='red.500'>
                    Enter additional amount for a replacement product {' '}

                  </Text>
                </Box>
                <Box pt='5'>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents='none'
                      color='gray.300'
                      fontSize='1.1em'
                      children='$'
                    />
                    <NumberInput
                      maxW={20}
                      defaultValue={5}
                      min={0}
                      value={shipmentLevelReplacementFee}
                      onChange={handleReplacementFeeChange}
                      mr="3"
                    >
                      <NumberInputField pl='7' pr='7' />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </InputGroup>
                  {/* ${subTotalTax} */}
                </Box>
              </HStack>
              {/* <FormErrorMessage>{errors.creditCardProcessingPercent}</FormErrorMessage> */}
              {/* </FormControl> */}
            </Box>
          </Flex>
        </>
      ) : (
        <></>
      )}

      <Flex justifyContent="space-between" mt="7">
        <Button
          variant="cancel-button"
          mb="3"
          mr="3"
          onClick={() => {
            navigate('/');
          }}
        >
          <span id="button-text">Continue Shopping</span>
        </Button>
        <Box>
          <Button
            variant="cancel-button"
            mb="3"
            mr="3"
            disabled
            onClick={() => {
              // cart.cartShipment.items.forEach((eachCartShipment) => {
              //   if (eachCartShipment.id === cartShipment.id) {
              //     eachCartShipment['isCancelled'] = true;
              //   }
              // });
              // updateCart({ ...cart });
            }}
          >
            <span id="button-text">Cancel</span>
          </Button>
          <Button
            mb="3"
            mr="3"
            disabled={!stripe || !elements || enablePaymentBtn === 'true'}
            id="submit"
            onClick={handlePaymentSubmit}
          >
            <span id="button-text">
              {paymentBtnTxt} $
              {parseFloat(totalPayableAmount).toFixed(2)}
            </span>
          </Button>
        </Box>
      </Flex>
    </>
  );
}

const stateMapper = (state) => ({
  cart: state.cart.cart,
  user: state.auth?.user,
});

const dispatchMapper = (dispatch) => ({
  updateCart: dispatch.cart.updateCart,
});

export default connect(stateMapper, dispatchMapper)(StripePayment);
