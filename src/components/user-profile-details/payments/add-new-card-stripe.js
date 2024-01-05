import { Button, useToast } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React from 'react';
import { connect } from 'react-redux';
import StatusMessages, {
  useMessages,
} from '../../../layouts/checkout/stripe-payment/status-messages';
import * as PaymentService from '../../../services/payment-service';

const AddNewCardStripe = ({ user }) => {
  const toast = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [messages, addMessage] = useMessages();

  const saveNewCard = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded, Make sure to disable form submission until Stripe.js has loaded.
      addMessage('Stripe.js has not yet loaded.');
      return;
    }

    try {
      const res = await PaymentService.saveCustomerCard(user.userId);
      if (res.success) {
        await stripe
          .confirmCardSetup(res.client_secret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: user.email,
            },
          })
          .then(() => {
            navigate('/userprofile/');

            toast({
              status: 'success',
              position: 'top',
              description: 'Card saved successfully',
            });
          });
      } else {
        // throw new Error('Exception while saving cards');
      }
    } catch (err) {
      // console.log(err);
      toast({
        status: 'error',
        position: 'top',
        description: err.message,
      });
    }
  };

  return (
    <>
      <CardElement id="card" />
      <Button
        onClick={() => {
          saveNewCard();
        }}
      >
        Save Card
      </Button>
      <StatusMessages messages={messages} />
    </>
  );
};

const stateMapper = (state) => ({
  user: state.auth.user,
});

const dispatchMapper = (dispatch) => ({
  // fetchAndSetUser: dispatch.auth.fetchAndSetUser,
});

export default connect(stateMapper, dispatchMapper)(AddNewCardStripe);
