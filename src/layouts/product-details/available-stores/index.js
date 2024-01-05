import {
  Box,
  Button,
  Flex,
  HStack,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Td,
  Text,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { MdStar, MdStarBorder } from 'react-icons/md';
import Rating from 'react-rating';
import { connect } from 'react-redux';
import NumberInput from '../../../components/common/numberInput';
import * as CartService from '../../../services/cart-service';
import * as ProductService from '../../../services/product-service';

const AvailableStores = (props) => {
  const { product, user, updateCart, cart, deliveryAddress } = props;
  const [availableStores, setAvailableStores] = useState([]);
  const [showAllFlag, setShowAllFlag] = useState(false);
  const toast = useToast();
  localStorage.removeItem('isbuynow');
  localStorage.removeItem('buynowcart');

  const setAvailableStoresInState = (stores) => {
    const tempLstStores = stores.map((obj) => ({
      ...obj,
      qtyPurchased: 1,
      qtySelected: obj.qtySelected ? obj.qtySelected : 1,
      addToCartBtnDisabled: false,
      alreadyInCart: false,
      deliveryType: 'Home Delivery',
    }));

    // update quantiy against each store by reading it from cart
    if (cart) {
      cart.cartShipment.items.forEach((eachCartShipment) => {
        tempLstStores.forEach((eachStore) => {
          if (
            eachCartShipment.assignedStoreId === eachStore.storeId &&
            eachCartShipment.deliveryType === eachStore.deliveryType
          ) {
            eachCartShipment.lineItems.forEach((eachLineItem) => {
              if (eachLineItem.productId === product.id) {
                eachStore.qtyPurchased = eachLineItem.qtyPurchased;
                eachStore.qtySelected = eachLineItem.qtyPurchased;
                eachStore.addToCartBtnDisabled = true;
                eachStore.alreadyInCart = true;
              }
            });
          }
        });
      });
    }
    setAvailableStores(tempLstStores);
  };

  const getAvailableStores = async () => {
    const lat = user?.deliveryToAddress?.latitude || deliveryAddress?.lat;
    const lon = user?.deliveryToAddress?.longitude || deliveryAddress?.lon;
    if (lat) {
      const res = await ProductService.getAvailableStoresByProductId(
        product.id,
        10,
        lat,
        lon,
        showAllFlag
      );
      setAvailableStoresInState(res);
    }
  };

  const addToCart = async (selectedStore) => {
    const res = await CartService.addToCart(
      selectedStore,
      product,
      user,
      deliveryAddress?.address,
      cart,
    );

    if (res.success) {
      updateCart(res.cart);

      toast({
        status: 'success',
        position: 'top',
        description: 'Product added to cart',
      });
    }
  };

  useEffect(() => {
    if (product.id) {
      getAvailableStores();
    }
  }, [product, deliveryAddress, showAllFlag]);

  useEffect(() => {
    if (cart) {
      setAvailableStoresInState(availableStores);
    }
  }, [cart]);

  return (
    <Box>
      <Tabs>
        <TabList>
          <Tab
            fontWeight="bold"
            _selected={{
              color: 'brand.red',
              borderBottomColor: 'brand.red',
              boxShadow: 'none',
            }}
          >
            <h2>Delivery</h2>
          </Tab>
          <Tab
            fontWeight="bold"
            _selected={{
              color: 'brand.red',
              borderBottomColor: 'brand.red',
              boxShadow: 'none',
            }}
          >
            <h2>Pick Up</h2>
          </Tab>
          <Tab
            fontWeight="bold"
            _selected={{
              color: 'brand.red',
              borderBottomColor: 'brand.red',
              boxShadow: 'none',
            }}
          >
            <h2> Shipping</h2>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel alignItems="start" p="0" m="0">
            <Table variant="spiritTable" mb="2">
              {availableStores?.length > 0 ? (
                <>
                  {availableStores.map((eachStore) => (
                    <Tr key={eachStore.id} borderBottom="1px">
                      <Td>
                        <Box fontSize="xl" fontWeight="bold">
                          ${eachStore.price}
                        </Box>
                        <Box fontWeight="bold" mt="3">
                          {eachStore.storeName}
                        </Box>
                        <Flex mt="3">
                          <Rating
                            alignItems="center"
                            initialRating="4.5"
                            readonly
                            emptySymbol={
                              <MdStarBorder fontSize="lg" color="#FB8200" />
                            }
                            fullSymbol={
                              <MdStar fontSize="lg" color="#FB8200" />
                            }
                          />
                          <Text ml="2">4.5</Text>
                        </Flex>
                        <Box fontSize="sm" mt="3">
                          <Text as="span">$4.49 Delivery Fee </Text>
                        </Box>
                        <Flex mt="3" direction="row" w="80%">
                          <HStack>
                            <NumberInput
                              quantity={eachStore.qtySelected}
                              onChange={(updatedQty) => {
                                let addToCartBtnDisabled = true;
                                if (eachStore.qtyPurchased !== updatedQty) {
                                  availableStores.find(
                                    (es) => es.storeId === eachStore.storeId,
                                  ).qtySelected = updatedQty;

                                  addToCartBtnDisabled = false;
                                } else {
                                  addToCartBtnDisabled = true;
                                }

                                availableStores.find(
                                  (es) => es.storeId === eachStore.storeId,
                                ).addToCartBtnDisabled = addToCartBtnDisabled;

                                setAvailableStores([...availableStores]);
                              }}
                            />

                            <Button
                              colorScheme="red"
                              onClick={() => {
                                availableStores.find(
                                  (es) => es.storeId === eachStore.storeId,
                                ).addToCartBtnDisabled = true;
                                setAvailableStores([...availableStores]);
                                addToCart(eachStore);
                              }}
                              isDisabled={eachStore.addToCartBtnDisabled}
                            >
                              {eachStore.alreadyInCart
                                ? 'Update Cart'
                                : 'Add to Cart'}
                            </Button>

                            <Button
                              colorScheme="red"
                              onClick={() => {
                                const createCartInput = CartService.prepareCart(
                                  eachStore,
                                  product,
                                  user,
                                  null,
                                  deliveryAddress?.address,
                                );
                                localStorage.setItem('isbuynow', true);
                                localStorage.setItem(
                                  'buynowcart',
                                  JSON.stringify(createCartInput),
                                );
                                navigate(`/checkout`);
                                // navigate(`/checkout/isbuynow=true`);
                              }}
                            >
                              Buy Now
                            </Button>
                          </HStack>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </>

              ) : (
                <Box p="5">
                  This product is not available in any of the nearest stores to
                  the given delivery address.
                </Box>
              )}
            </Table>
            <Flex justifyContent="flex-end" mr="3">
              <Box>
              {availableStores?.length > 0 ? (
                
              <Button variant="link" textAlign="right" onClick={() => {
                setShowAllFlag(!showAllFlag);
              }}> {showAllFlag ? "Show Less" : "Show More"} </Button>
              )
            :(
              <></>
            )}
              </Box>
            </Flex>

          </TabPanel>
          <TabPanel>
            <Box p="5">Pick Up Stores</Box>
          </TabPanel>
          <TabPanel>
            <Box p="5">Coming Soon</Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {cart ? (
        <Box textAlign="center" mt="5">
          <Button
            colorScheme="red"
            onClick={() => {
              navigate(`/cart/${cart.id}`);
            }}
          >
            View Cart
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

const stateMapper = (state) => ({
  user: state.auth.user,
  cart: state.cart.cart,
  deliveryAddress: state.deliveryAddress?.deliveryAddress,
});

const dispatchMapper = (dispatch) => ({
  updateCart: dispatch.cart.updateCart,
});

export default connect(stateMapper, dispatchMapper)(AvailableStores);
