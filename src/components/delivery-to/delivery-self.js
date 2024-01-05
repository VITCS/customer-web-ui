import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Spacer,
  Switch,
  Text,
  useRadioGroup,
  useToast,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { graphqlOperation } from 'aws-amplify';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {
  updateCustomerContact,
  updateCustomerProfileDeliveryToId,
} from '../../graphql/mutations';
import { getCustomerContacts } from '../../graphql/queries';
import * as CartService from '../../services/cart-service';
import { graphql } from '../../utils/api';
import { Tooltip } from '@chakra-ui/react';

const DeliverySelf = ({
  user,
  setIsDeliveryOpen,
  cart,
  setCartInvalidFlag,
  fetchAndSetUser,
}) => {
  const toast = useToast();
  // const [selectedAddressID, setSelectedAddressID] = useState();
  const [selectedDeliveryToId, setSelectedDeliveryToId] = useState(
    user?.deliveryToId,
  );
  const [selectedDefaultAddress, setSelectedDefaultAddress] = useState();
  const [contactId, setContactId] = useState();
  const cancelRef = useRef();
  const { userId } = user;
  const [selfAddresses, setselfAddresses] = useState();
  const [cartQty, setCartQty] = useState('0');
  const markAddressDefault = async () => {
    try {
      await graphql(
        graphqlOperation(updateCustomerContact, {
          input: { defaultAddressId: selectedDefaultAddress, id: contactId },
        }),
      );

      toast({
        title: 'Success',
        description: 'succesfully updated default Address',
        status: 'success',
        isClosable: true,
        duration: 1000,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong to update default Address',
        status: 'error',
        isClosable: true,
        duration: 5000,
      });
    }
  };

  const handleAddressFlags = async () => {
    const userInput = {
      userId: user.userId,
      deliveryToId: selectedDeliveryToId,
    };
    try {
      await graphql(
        graphqlOperation(updateCustomerProfileDeliveryToId, {
          input: userInput,
        }),
      );
      // setLocalDeliveryToId(selectedDeliveryToId);
      toast({
        title: 'Delivery Contact details updated',
        status: 'success',
      });
      // set the Deliveryaddress to the redux state selectedDeliveryAddress
      await fetchAndSetUser();

      markAddressDefault(selectedDefaultAddress);
      if (cartQty > 0) {
        setCartInvalidFlag(await CartService.setInvalidCartFlag(cart));
        navigate(`/availabilitysearch/${cart.id}`);
      }
      setIsDeliveryOpen(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (userId) {
      graphql(
        graphqlOperation(getCustomerContacts, {
          userId,
          filter: { contactCategory: { eq: 'Self' } },
        }),
      ).then((response) => {
        const contactsList =
          response.data.CustomerContactsByCustomerProfileId.items;

        let adresses = [];
        contactsList.map((contact) => {
          adresses = [...adresses, ...contact.deliveryAddress.items];
        });

        setContactId(contactsList[0].id);
        setSelectedDefaultAddress(contactsList[0].defaultAddressId);
        setselfAddresses(adresses);
      });
    }
  }, [setselfAddresses, userId, user]);

  useEffect(() => {
    if (cart !== null && cart !== undefined) {
      let qty = 0;
      cart.cartShipment.items.forEach((eachCartShipment) => {
        eachCartShipment.lineItems.forEach(() => {
          qty++;
        });
      });
      setCartQty(qty);
    } else {
      setCartQty('0');
    }
  }, [cart]);

  const { getRootProps } = useRadioGroup({
    name: 'deliveryToAddress',
    defaultValue: user.deliveryToId,
    // onChange: setSelectedAddressID,
  });

  const group = getRootProps();

  return (
    <Flex flexDirection="column" p="10px">
      <Grid
        {...group}
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        gap={6}
      >
        {selfAddresses?.length > 0 ? (
          <>
            {selfAddresses?.map((address) => {
              const {
                id,
                firstName,
                addressType,
                middleName,
                lastName,
                addrLine1,
                addrLine2,
                city,
                state,
                country,
                postCode,
              } = address;
              return (
                <Box className="grid" cursor="pointer" key={id}>
                  <Flex className="gridHeader" pl="2" alignSelf="center">
                    <Checkbox
                      borderColor="#BDBDBD"
                      colorScheme="green"
                      borderRadius="4"
                      mr="2"
                      isChecked={selectedDefaultAddress === id}
                      size="lg"
                      onChange={() => {
                        setSelectedDefaultAddress(id);
                      }}
                    >
                      <Text fontWeight="bold">
                        {firstName} - {addressType}
                      </Text>
                    </Checkbox>
                    {selectedDefaultAddress === id ? (
                      <Text
                        color="gray"
                        float="right"
                        fontSize="13px"
                        fontWeight="bold"
                        mt="0.8"
                      >
                        (Default)
                      </Text>
                    ) : null}

                    <Spacer />
                    <Tooltip
                      hasArrow
                      label="Delivery To"
                      fontSize="md"
                      bg="brand.red"
                      shouldWrapChildren
                      mt="3"
                    >
                      <Switch
                        colorScheme="red"
                        isChecked={selectedDeliveryToId === id}
                        onChange={() => {
                          setSelectedDeliveryToId(id);
                        }}
                      />
                    </Tooltip>
                  </Flex>

                  <Box p="2" className="mainBg" roundedBottom="xl">
                    {firstName} {middleName} {lastName}
                    <Text>
                      {addrLine1} {addrLine2} {city}
                    </Text>
                    <Text>
                      {state} {country} {postCode}{' '}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </>
        ) : null}
      </Grid>
      <Box alignSelf="flex-end" mt="10">
        <Button
          ref={cancelRef}
          variant="cancel-button"
          onClick={() => {
            setIsDeliveryOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          _hover={{ background: 'brand.red' }}
          ml="3"
          onClick={handleAddressFlags}
        >
          Save
        </Button>
      </Box>
    </Flex>
  );
};

const stateMapper = (state) => ({
  user: state.auth?.user,
  cart: state.cart.cart,
  cartInvalidFalg: state.cart.cartInvalidFlag,
});

const dispatchMapper = (dispatch) => ({
  updateCart: dispatch.cart.updateCart,
  setCartInvalidFlag: dispatch.cart.setCartInvalidFlag,
  fetchAndSetUser: dispatch.auth.fetchAndSetUser,
});

export default connect(stateMapper, dispatchMapper)(DeliverySelf);
