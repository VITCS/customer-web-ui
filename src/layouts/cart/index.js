import {
  Box,
  Button,
  Checkbox,
  Flex,
  Image,
  Text,
  useToast,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import defaultProductImg from '../../assets/default-product.png';
import NumberInput from '../../components/common/numberInput';
import LoginView from '../../components/login';
import * as CartService from '../../services/cart-service';

const Cart = (props) => {
  const toast = useToast();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { cartId, updateCart, user } = props;
  const [cart, setCart] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [partialCart, setPartialCart] = useState([]);
  const [lstInvalidMinPriceStoreDetails, setLstInvalidMinPriceStoreDetails] =
    useState([]);
  const [disableCheckout, setDisableCheckout] = useState(true);

  const getCartDetails = async (_cartId) => {
    setLstInvalidMinPriceStoreDetails([]);
    const res = await CartService.getCart(_cartId);
    setIsPageLoading(false);

    const tempCart = res;
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
        if (
          storeRes?.deliveryScope !== null &&
          storeRes?.deliveryScope !== undefined &&
          storeRes?.deliveryScope?.MinOrderSize > 0 &&
          eachCartShipment.subTotalProductAmount <=
            storeRes?.deliveryScope?.MinOrderSize
        ) {
          setLstInvalidMinPriceStoreDetails([
            ...lstInvalidMinPriceStoreDetails,
            {
              assignedStoreId: eachCartShipment.assignedStoreId,
              assignedStoreName: eachCartShipment.assignedStoreName,
              minOrderPrice: storeRes?.deliveryScope?.MinOrderSize,
            },
          ]);
        }
      });
    }

    setCart(tempCart);
    updateCart(tempCart);
  };

  useEffect(() => {
    if (lstInvalidMinPriceStoreDetails.length > 0) {
      setDisableCheckout(true);
    } else {
      setDisableCheckout(false);
    }
  }, [lstInvalidMinPriceStoreDetails]);

  const removeCartShipmentLineItem = async (cartShipmentId, lineItemId) => {
    const res = await CartService.removeCartShipmentLineItem(
      cart,
      cartShipmentId,
      lineItemId,
    );
    if (res.success) {
      getCartDetails(cartId);
      toast({
        status: 'success',
        position: 'top',
        description: 'Product removed from cart',
      });
    } else {
      toast({
        status: 'error',
        position: 'top',
        description: 'Error while removing product from cart',
      });
    }
  };

  const updateCartShipment = async (cartShipment) => {
    const res = await CartService.updateCartShipment(cartShipment);
    if (res.success) {
      getCartDetails(cartId);
      toast({
        status: 'success',
        position: 'top',
        description: 'Product quantity is updated',
      });
    } else {
      toast({
        status: 'error',
        position: 'top',
        description: 'Error while updating product quantity',
      });
    }
  };

  const numberInputChangeHandler = (updatedQty, lineItem, cartShipment) => {
    const tempCart = cart;
    let updateBtnDisabled = true;

    if (lineItem.qtyPurchased !== updatedQty) {
      tempCart.cartShipment.items
        .find((cs) => cs.id === cartShipment.id)
        .lineItems.find(
          (li) => li.productId === lineItem.productId,
        ).qtySelected = updatedQty;
      updateBtnDisabled = false;
    } else {
      updateBtnDisabled = true;
    }

    tempCart.cartShipment.items
      .find((cs) => cs.id === cartShipment.id)
      .lineItems.find(
        (li) => li.productId === lineItem.productId,
      ).updateBtnDisabled = updateBtnDisabled;

    setCart({ ...tempCart });
  };

  const onLoginViewClose = () => {
    setLoginOpen(false);
  };

  const handlePartialCheckout = (isCheked, storeId, productId) => {
    if (isCheked) {
      if (partialCart.length > 0) {
        const i = partialCart.findIndex(
          (eachPartialItem) => eachPartialItem.storeId === storeId,
        );
        if (i > -1) {
          partialCart[i].productIds.push(productId);
        } else {
          partialCart.push({
            storeId,
            productIds: [productId],
          });
        }
      } else {
        partialCart.push({
          storeId,
          productIds: [productId],
        });
      }
    } else {
      // Delete the unchecked item
      partialCart.forEach((eachPartialItem) => {
        if (eachPartialItem.storeId === storeId) {
          eachPartialItem.productIds.splice(
            eachPartialItem.productIds.indexOf(productId),
            1,
          );
        }
      });
    }

    // Clean up for deleteting a previously checked product
    const cleanedPartialCart = partialCart.filter(
      (eachPartialItem) => eachPartialItem.productIds.length > 0,
    );
    setPartialCart(cleanedPartialCart);
  };

  useEffect(() => {
    if (cartId) {
      getCartDetails(cartId);
    }
  }, [cartId]);

  return (
    <>
      {!isPageLoading ? (
        cart ? (
          <Flex direction="row" pb="10">
            <Box
              className="blockBg"
              rounded="lg"
              flexGrow="2"
              alignItems="stretch"
            >
              <Box p="10px">
                <h1>Cart</h1>
                {cart.cartShipment.items.map((eachCartShipment) => {
                  const {
                    id,
                    assignedStoreName,
                    deliveryType,
                    deliveryAddress,
                  } = eachCartShipment;
                  return (
                    <Box
                      key={id}
                      my="5"
                      pb="5"
                      borderBottom="3px dashed #878787"
                    >
                      <Flex
                        justifyContent="space-between"
                        className="mainBg"
                        mb="3"
                        boxShadow="md"
                        p="6"
                        direction={{ base: 'column', md: 'row' }}
                      >
                        <Box>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color="brand.red"
                            textTransform="uppercase"
                          >
                            {assignedStoreName}
                          </Text>
                          <Box fontSize="lg">
                            <Text as="span" fontWeight="bold">
                              Delivery Address{' '}
                            </Text>
                            <Text as="span">{`${deliveryAddress.addrLine1}, ${
                              deliveryAddress.addrLine2 !== ''
                                ? `${deliveryAddress.addrLine2},`
                                : ''
                            } ${deliveryAddress.city}, 
                            ${deliveryAddress.country}, ${
                              deliveryAddress.postCode
                            }`}</Text>
                          </Box>
                        </Box>
                        <Flex align-items="flex-end" align-content="flex-end">
                          {deliveryType === 'Pickup' ? (
                            <Image
                              alignSelf="end"
                              src={require('../../assets/pick-up.svg')}
                              height="30px"
                            />
                          ) : null}
                          {deliveryType === 'Delivery' ? (
                            <Image
                              alignSelf="end"
                              src={require('../../assets/shipping.svg')}
                              height="30px"
                            />
                          ) : null}
                          <Text ml="2" alignSelf="end">
                            {deliveryType}
                          </Text>
                        </Flex>
                      </Flex>
                      {eachCartShipment.lineItems.map((eachLineItem) => (
                        <Box key={eachLineItem.productId}>
                          <Flex
                            direction="row"
                            my="5"
                            w="100%"
                            justifyContent="space-between"
                          >
                            <Flex w="80%">
                              {cart.cartShipment.items.length > 1 ||
                              cart.cartShipment.items[0].lineItems.length >
                                1 ? (
                                <Box p={0}>
                                  <Checkbox
                                    value={eachLineItem.productId}
                                    borderColor="#BDBDBD"
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handlePartialCheckout(
                                        e.target.checked,
                                        eachCartShipment.assignedStoreId,
                                        eachLineItem.productId,
                                      );
                                    }}
                                  />
                                </Box>
                              ) : (
                                <></>
                              )}
                              <Box
                                border="1px"
                                borderColor="brand.lightgrey"
                                ml="5"
                              >
                                <Image
                                  src={defaultProductImg}
                                  w="75px"
                                  h="80px"
                                />
                              </Box>
                              <Box ml="5" w="50%">
                                <Text fontSize="lg" fontWeight="bold">
                                  <a
                                    href={`/product/${eachLineItem.productId}`}
                                  >
                                    {eachLineItem.productName}
                                  </a>
                                </Text>
                                <Text> {eachLineItem.prodShortDesc}</Text>
                                <Text as="span" fontWeight="bold">
                                  Delivery By
                                </Text>
                                <Text as="span" color="brand.red">
                                  {' '}
                                  Fed Ex
                                </Text>
                              </Box>
                            </Flex>
                            <Box
                              ml="2"
                              mr="5"
                              alignContent="flex-end "
                              flexGrow="1"
                              textAlign="right"
                              borderLeft="1px solid #717476"
                            >
                              <Text fontSize="xl" fontWeight="bold">
                                $
                                {parseFloat(eachLineItem.totalPrice).toFixed(2)}
                              </Text>
                            </Box>
                          </Flex>
                          <Flex className="redBg" p="3" pl="5">
                            <NumberInput
                              quantity={eachLineItem.qtySelected}
                              onChange={(updatedQty) => {
                                numberInputChangeHandler(
                                  updatedQty,
                                  eachLineItem,
                                  eachCartShipment,
                                );
                              }}
                            />
                            <Button
                              variant="link"
                              color="brand.red"
                              ml="3"
                              fontWeight="normal"
                              onClick={() =>
                                updateCartShipment(eachCartShipment)
                              }
                              isDisabled={eachLineItem.updateBtnDisabled}
                            >
                              Update
                            </Button>

                            <Box
                              borderLeft="1px solid #717476"
                              ml="4"
                              alignSelf="center"
                            >
                              <Button
                                variant="link"
                                color="brand.red"
                                ml="3"
                                fontWeight="normal"
                                onClick={() =>
                                  removeCartShipmentLineItem(
                                    eachCartShipment.id,
                                    eachLineItem.id,
                                  )
                                }
                              >
                                Remove
                              </Button>
                            </Box>
                            <Box
                              borderLeft="1px solid #717476"
                              ml="4"
                              alignSelf="center"
                            >
                              <Button
                                variant="link"
                                color="brand.red"
                                ml="3"
                                fontWeight="normal"
                              >
                                Save for Later
                              </Button>
                            </Box>
                          </Flex>
                        </Box>
                      ))}
                    </Box>
                  );
                })}
              </Box>

              <Flex
                justifyContent="flex-end"
                mb="5"
                px="5"
                direction={{ base: 'column', lg: 'row' }}
              >
                {lstInvalidMinPriceStoreDetails.length > 0 ? (
                  <>
                  <Text fontWeight="bold" fontSize="lg" mr="4" color="brand.red">Minimum order price for store : {' '}</Text>
                    {lstInvalidMinPriceStoreDetails.map((eachStore) => (
                      <Text fontSize="lg" mr="5">
                        {eachStore.assignedStoreName} is $
                        {eachStore.minOrderPrice} ,
                      </Text>
                    ))}
                  </>
                ) : (
                  <></>
                )}

                <Button
                  variant="cancel-button"
                  w="200px"
                  mb="3"
                  mr="3"
                  onClick={() => {
                    navigate('/');
                  }}
                >
                  Continue Shopping
                </Button>
                <Button
                  disabled={disableCheckout}
                  _hover={{ background: 'brand.red' }}
                  w="200px"
                  mb="3"
                  onClick={() => {
                    if (user) {
                      if (partialCart.length > 0) {
                        localStorage.setItem('ispartial', true);
                        localStorage.setItem(
                          'partialcart',
                          JSON.stringify(partialCart),
                        );
                        navigate(`/checkout/${cart.id}?ispartial=true`);
                      } else {
                        localStorage.removeItem('ispartial');
                        localStorage.removeItem('partialcart');
                        navigate(`/checkout/${cart.id}`);
                      }
                    } else {
                      setLoginOpen(true);
                    }
                  }}
                >
                  Proceed To Checkout
                </Button>
              </Flex>
            </Box>
          </Flex>
        ) : (
          <Box bg="White" rounded="lg" p="10">
            <h1>Your cart is empty</h1>
          </Box>
        )
      ) : (
        <div>Loading...</div>
      )}
      <LoginView onLoginViewClose={onLoginViewClose} isOpen={loginOpen} />
    </>
  );
};

const stateMapper = (state) => ({
  // cart: state.cart.cart,
  user: state.auth?.user,
});

const dispatchMapper = (dispatch) => ({
  updateCart: dispatch.cart.updateCart,
});

export default connect(stateMapper, dispatchMapper)(Cart);
