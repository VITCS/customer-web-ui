import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Radio, Text, useToast } from '@chakra-ui/react';
// import { useStripe } from '@stripe/react-stripe-js';
import { graphqlOperation } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getCustomerProfile } from '../../../graphql/queries';
import * as PaymentService from '../../../services/payment-service';
import { graphql } from '../../../utils/api';

function SavedCards(props) {
  const { handleSelectedPaymentMethod, isMyAccount, user } = props;
  // const stripe = useStripe();
  const toast = useToast();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [customerId, setCustomerId] = useState([]);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState();

  const getSavedPaymentMethods = async (customerRes) => {
    try {
      const res = await PaymentService.getSavedPaymentMethods({
        customerId: customerRes,
      });

      if (res.success) {
        const tempPaymentMethods = JSON.parse(
          res.paymentMethods.paymentMethods,
        ).data.map((eachPaymentMethod) => {
          if (
            eachPaymentMethod.id === res.paymentMethods.defaultPaymentMethodId
          ) {
            handleSelectedPaymentMethod(eachPaymentMethod);
          }
          return {
            ...eachPaymentMethod,
          };
        });

        setDefaultPaymentMethodId(res.paymentMethods.defaultPaymentMethodId);
        if (tempPaymentMethods.length > 0) {
          // const duplicatePaymentMethods = tempPaymentMethods
          //   .map((e) => e.card.fingerprint)
          //   .map((e, i, final) => final.indexOf(e) !== i && i)
          //   .filter((obj) => tempPaymentMethods[obj])
          //   .map((e) => tempPaymentMethods[e]);

          // if (duplicatePaymentMethods.length > 0) {
          //   duplicatePaymentMethods.forEach((eachPaymentMethod) => {
          //     detachDuplicatePaymentMethds(eachPaymentMethod.id);
          //   });
          // }

          const uniquePaymentMethods = tempPaymentMethods
            .map((e) => e.card.fingerprint)
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter((obj) => tempPaymentMethods[obj])
            .map((e) => tempPaymentMethods[e]);

          setPaymentMethods([
            {
              paymentMethods: uniquePaymentMethods,
            },
          ]);
        }
      } else {
        throw new Error('Exception while gettings saved cards');
      }
    } catch (err) {
      toast({
        status: 'error',
        position: 'top',
        description: err.message,
      });
    }
  };

  // const detachDuplicatePaymentMethds = async (paymentMethodId) => {
  //   try {
  //     // console.log('detachDuplicatePaymentMethds', paymentMethodId);
  //     // const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
  //     // await stripe.paymentMethods.detach(paymentMethodId);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const deletePaymentMethod = async (paymentMethodId) => {
    try {
      const res = await PaymentService.deletePaymentMethod(paymentMethodId);
      // console.log('deletePaymentMethod', res);
      if (res.success) {
        getSavedPaymentMethods(customerId);
        toast({
          status: 'success',
          position: 'top',
          description: 'Saved card deleted successfully',
        });
      } else {
        throw new Error('Exception while deleting saved card');
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

  const updateDefaultPaymentMethod = async (makeDefault) => {
    try {
      const res = await PaymentService.updateDefaultPaymentMethod({
        paymentMethodId: makeDefault,
        customer: customerId,
      });
      // console.log('updateDefaultPaymentMethod', res);
      if (res.success) {
        getSavedPaymentMethods(customerId);
        toast({
          status: 'success',
          position: 'top',
          description: 'Default card updated successfully',
        });
      } else {
        throw new Error('Exception while updating the default card');
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

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await graphql(
          graphqlOperation(getCustomerProfile, {
            userId: user?.userId,
          }),
        );
        const { customerId: _customerId } = data.data.getCustomerProfile;
        if (_customerId) {
          setCustomerId(_customerId);
          getSavedPaymentMethods(_customerId);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  return (
    <>
      {paymentMethods && paymentMethods.length > 0 ? (
        isMyAccount ? (
          <div>
            {paymentMethods[0].paymentMethods.map((eachpaymentMethod) => {
              const { card } = eachpaymentMethod;

              return (
                <Flex
                  key={`payment-method-${eachpaymentMethod.id}`}
                  direction="row"
                  alignItems="left"
                  justifyContent="space-between"
                  sx={{ borderBottom: '1px solid #333' }}
                  pb="2"
                  mb="5"
                >
                  <Box>
                    {card.brand} **** **** **** {card.last4} {card.exp_month}/
                    {card.exp_year}
                  </Box>
                  <Box ml="5">
                    {defaultPaymentMethodId === eachpaymentMethod.id
                      ? '(Default)'
                      : ''}
                    {defaultPaymentMethodId !== eachpaymentMethod.id ? (
                      <Button
                        onClick={() => {
                          updateDefaultPaymentMethod(
                            eachpaymentMethod.id,
                            eachpaymentMethod.customer,
                          );
                        }}
                      >
                        Make default
                      </Button>
                    ) : (
                      ''
                    )}
                  </Box>
                  <Box>
                    <DeleteIcon
                      id={`btnDeleteCard${card.id}`}
                      fontSize="xl"
                      color="brand.red"
                      onClick={() => {
                        deletePaymentMethod(eachpaymentMethod.id);
                      }}
                    />
                  </Box>
                </Flex>
              );
            })}
          </div>
        ) : (
          <>
            {paymentMethods[0].paymentMethods.map((eachPaymentMethod) => {
              const { card } = eachPaymentMethod;
              return (
                <Flex
                  key={`payment-method-${eachPaymentMethod.id}`}
                  alignItems="left"
                  justifyContent="space-between"
                  sx={{ borderBottom: '1px solid #333' }}
                  pb="2"
                  mb="5"
                >
                  <Radio
                    value={eachPaymentMethod.id}
                    colorScheme="red"
                    size="lg"
                    onClick={() => {
                      handleSelectedPaymentMethod(eachPaymentMethod);
                    }}
                  />

                  <Flex justifyContent="space-between">
                    <Box>
                      {card.brand} **** **** **** {card.last4} {card.exp_month}/
                      {card.exp_year}
                      {defaultPaymentMethodId === eachPaymentMethod.id
                        ? '(Default)'
                        : ''}
                    </Box>
                    <Box ml="5">
                      {defaultPaymentMethodId !== eachPaymentMethod.id ? (
                        <Button
                          onClick={() => {
                            updateDefaultPaymentMethod(
                              eachPaymentMethod.id,
                              eachPaymentMethod.customer,
                            );
                          }}
                        >
                          Make default
                        </Button>
                      ) : (
                        ''
                      )}
                    </Box>
                  </Flex>

                  <DeleteIcon
                    id={`btnDeleteCard${card.id}`}
                    fontSize="xl"
                    color="brand.red"
                    onClick={() => {
                      deletePaymentMethod(eachPaymentMethod.id);
                    }}
                  />
                </Flex>
              );
            })}
          </>
        )
      ) : (
        <Text as="span">No saved cards</Text>
      )}
    </>
  );
}

const stateMapper = (state) => ({
  user: state.auth.user,
});

const dispatchMapper = (dispatch) => ({
  // fetchAndSetUser: dispatch.auth.fetchAndSetUser,
});

export default connect(stateMapper, dispatchMapper)(SavedCards);
