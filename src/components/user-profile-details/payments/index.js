import { Box } from '@chakra-ui/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { connect } from 'react-redux';
import SavedCards from '../../../layouts/checkout/saved-cards';
import AddNewCardStripe from './add-new-card-stripe';

// Move to aws-exports.js
const stripePromise = loadStripe(
  'pk_test_51KWLzaKSMMiABBtCCilbLt4xv7wje6bOF6x9qPbHYkQe24nJLhS006unSIMPjoy6lsntNLnEeDRB0GqMgLe7VHaj00R0E1ieAz',
);

const Payments = () => (
  <Box w={{ base: '100%', lg: '40%' }} m="auto">
    <Box
      mt="5"
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
        <SavedCards
          handleSelectedPaymentMethod={(_selectedPaymentMethod) => {
            console.log('handleSelectedPaymentMethod', _selectedPaymentMethod);
          }}
          isMyAccount
        />
        {stripePromise && (
          <Elements stripe={stripePromise}>
            <AddNewCardStripe />
          </Elements>
        )}
      </Box>
    </Box>
  </Box>
);

const stateMapper = (state) => ({
  // cart: state.cart.cart,
});

const dispatchMapper = (dispatch) => ({
  // updateCart: dispatch.cart.updateCart,
});

export default connect(stateMapper, dispatchMapper)(Payments);
