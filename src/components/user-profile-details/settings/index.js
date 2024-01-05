import { Box, Flex, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { API, graphqlOperation } from 'aws-amplify';
import React from 'react';
import { connect } from 'react-redux';
import {
  updateCustomerProfileOrderLineitemReplacement,
  updateCustomerProfileSubscribeToNotification,
} from '../../../graphql/mutations';

const Settings = (props) => {
  const { user, fetchAndSetUser } = props;

  const onUpdateCustomerProfileSubscribeToNotification = async (
    updatedUserObj,
  ) => {
    await API.graphql(
      graphqlOperation(updateCustomerProfileSubscribeToNotification, {
        input: updatedUserObj,
      }),
    );

    fetchAndSetUser();
  };

  const onUpdateCustomerProfileOrderLineitemReplacement = async (
    updatedUserObj,
  ) => {
    await API.graphql(
      graphqlOperation(updateCustomerProfileOrderLineitemReplacement, {
        input: updatedUserObj,
      }),
    );

    fetchAndSetUser();
  };

  return (
    <>
      <Box mt="4" p="4">
        <Flex>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="email-alerts" mb="0">
              Subscribe to notifications/text messages
            </FormLabel>
            <Switch
              colorScheme="green"
              id="subscribeToNotification"
              isChecked={user.subscribeToNotification}
              onChange={(event) => {
                onUpdateCustomerProfileSubscribeToNotification({
                  userId: user.userId,
                  subscribeToNotification: event.target.checked,
                });
              }}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="email-alerts" mb="0">
              Automatically replace out of stock product in an order with
              similar product
            </FormLabel>

            <Switch
              colorScheme="green"
              id="orderLineitemReplacement"
              isChecked={user.orderLineitemReplacement}
              onChange={(event) => {
                onUpdateCustomerProfileOrderLineitemReplacement({
                  userId: user.userId,
                  orderLineitemReplacement: event.target.checked,
                });
              }}
            />
          </FormControl>
        </Flex>
      </Box>
    </>
  );
};

const stateMapper = (state) => ({
  // user: state.auth.user,
});

const dispatchMapper = (dispatch) => ({
  fetchAndSetUser: dispatch.auth.fetchAndSetUser,
});

export default connect(stateMapper, dispatchMapper)(Settings);
