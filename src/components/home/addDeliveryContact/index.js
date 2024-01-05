import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  VStack,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import * as CartService from '../../../services/cart-service';
import { inputTextStyleProps } from '../../../utils/stylesProps';

function AddDeliveryContact(props) {
  const {
    cart,
    isOpen,
    updateDeliveryAddressModalClose,
    onAddDetailsModalOpen,
    onAddEditAddressModalOpen,
    setDeliveryContactId,
    updateDeliveryToAddress,
    deliveryContacts,
    deliveryAddress,
    updateDeliveryToAddressId,
    setCartInvalidFlag,
  } = props;
  const [value, setValue] = useState('');
  const [contactId, setContactId] = useState(null);
  const cancelRef = useRef();

  const openDrawer = () => {
    if (value === 'deliveryContact') {
      onAddDetailsModalOpen();
    } else {
      setDeliveryContactId(contactId);
      onAddEditAddressModalOpen();
    }
  };

  const setDeliveryAddr = () => {
    updateDeliveryAddressModalClose();
    if (updateDeliveryToAddress) {
      updateDeliveryToAddressId();
    } else {
      openDrawer();
    }
  };

  const cancelSetDeliveryAddr = async () => {
    setCartInvalidFlag(await CartService.setInvalidCartFlag(cart));
    navigate(`/availabilitysearch/${cart.id}`);
    updateDeliveryAddressModalClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody p="0" m="0" className="blockBg">
          <Flex direction="column" roundedTopLeft="10" roundedBottomRight="10">
            <Flex justifyContent="flex-end">
              <Box w="35%" h="5px" bg="brand.red" roundedBottomLeft="md" />
            </Flex>
            <VStack textAlign="center" spacing="3" p="10" h="400px" mt="5">
              <Image
                src={require('../../../assets/logo/Full-Logo.svg')}
                w="170px"
              />
              {updateDeliveryToAddress ? (
                <>
                  <FormControl as="fieldset">
                    <FormLabel as="legend">
                      Please set delivery-to address :
                    </FormLabel>
                    {deliveryAddress.address
                      ? `${deliveryAddress.address?.addrLine1}, ${
                          deliveryAddress.address?.addrLine2 !== ''
                            ? `${deliveryAddress.address?.addrLine2},`
                            : ''
                        } , ${deliveryAddress.address?.city}, ${
                          deliveryAddress.address?.addrState
                        }, ${deliveryAddress.address?.country}, ${
                          deliveryAddress.address?.postCode
                        }`
                      : ''}
                  </FormControl>
                </>
              ) : (
                <>
                  <Box fontWeight="bold" textAlign="center">
                    Given Delivery address is not exist in Existing Contacts.
                    Please add with below options.
                  </Box>
                  <FormControl as="fieldset">
                    <FormLabel as="legend" />
                    <RadioGroup onChange={setValue} value={value}>
                      <VStack spacing="10px" alignItems="center">
                        <Radio value="deliveryContact" colorScheme="red">
                          Add New Delivery Contact
                        </Radio>
                        <Radio value="deliveryAddress" colorScheme="red">
                          Add to Existing Delivery Contact
                        </Radio>
                      </VStack>
                    </RadioGroup>
                  </FormControl>

                  {value && value === 'deliveryAddress' && (
                    <FormControl isRequired>
                      <FormLabel htmlFor="deliveryAddress">
                        Contact List
                      </FormLabel>
                      <Select
                        type="text"
                        name="deliveryAddress"
                        id="deliveryAddress"
                        // value={addressValues.state || ''}
                        onChange={(event) => {
                          setContactId(event.target.value);
                        }}
                      >
                        <option value="">-Select-</option>
                        {deliveryContacts.map((dc) => (
                          <option value={dc.id} key={dc.id}>
                            {dc.firstName} {dc.lastName}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </>
              )}
              <Flex pt="5" pb="10">
                <Button
                  ref={cancelRef}
                  onClick={cancelSetDeliveryAddr}
                  variant="cancel-button"
                >
                  Cancel
                </Button>
                <Button
                  ml="2"
                  onClick={setDeliveryAddr}
                  type="submit"
                  _hover={{ background: 'brand.red' }}
                >
                  Add Delivery Address
                </Button>
              </Flex>
            </VStack>

            <Box
              w="35%"
              h="5px"
              bg="brand.red"
              roundedTopRight="md"
              alignItems="flex-end"
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const stateMapper = (store) => ({
  user: store.auth?.user,
  cart: store.cart.cart,
  deliveryContacts: store.deliveryContacts.deliveryContacts,
  deliveryAddress: store.deliveryAddress?.deliveryAddress,
});

const dispatchMapper = (dispatch) => ({
  setCartInvalidFlag: dispatch.cart.setCartInvalidFlag,
  updateDeliveryAddressStatus:
    dispatch.deliveryAddress.updateDeliveryAddressStatus,
});

export default connect(stateMapper, dispatchMapper)(AddDeliveryContact);
