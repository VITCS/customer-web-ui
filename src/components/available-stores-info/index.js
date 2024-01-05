import {
  Box,
  Button,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { MdStar, MdStarBorder } from 'react-icons/md';
import Rating from 'react-rating';
import { connect } from 'react-redux';
import * as CartService from '../../services/cart-service';
import NumberInput from '../common/numberInput';

const AvailableStoresInfo = (props) => {
  const toast = useToast();
  const {
    availablStoreList,
    qtyPurchased,
    handleUpdateCart,
    selectedProduct,
    cart,
    getProductsDetailsFromCart,
    updateCart,
  } = props;
  const [qty, setQty] = useState();

  const getCartDetails = async (_cartId) => {
    const res = await CartService.getCart(_cartId);

    const tempCart = res;
    if (tempCart) {
      tempCart.cartShipment.items.forEach((eachCartShipment) => {
        eachCartShipment.lineItems = eachCartShipment.lineItems.map(
          (eachLineItem) => ({
            ...eachLineItem,
            updateBtnDisabled: true,
            qtySelected: eachLineItem.qtyPurchased,
          }),
        );
      });
    }
    updateCart(tempCart);
  };

  const handleRemoveProduct = async () => {
    if (cart) {
      cart.cartShipment.items.map((cartShipment) => {
        cartShipment.lineItems.map(async (lineItem) => {
          if (lineItem.productId === selectedProduct.id) {
            await CartService.removeCartShipmentLineItem(
              cart,
              cartShipment.id,
              lineItem.id,
            );
          }
        });
      });

      getProductsDetailsFromCart(cart.id);
      getCartDetails(cart.id);
      toast({
        status: 'success',
        position: 'top',
        description: 'Product removed from cart',
      });
    }
  };

  return (
    <Box className="grid" maxH="max-content">
      <Tabs className="mainBg" borderRadius="8px">
        <TabList
          className="gridHeader"
          fontWeight="bold"
          h="50px"
          pb="0"
          borderBottomColor="#000"
          borderBottomWidth="2px"
        >
          <Tab
            px="10px"
            _selected={{
              color: 'brand.red',
              borderBottomColor: 'brand.red',
              boxShadow: 'none',
              fontWeight: 'bold',
            }}
          >
            <h2>Delivery</h2>
          </Tab>
          <Tab
            px="30px"
            _selected={{
              color: 'brand.red',
              borderBottomColor: 'brand.red',
              boxShadow: 'none',
              fontWeight: 'bold',
            }}
          >
            <h2>Shipping</h2>
          </Tab>
          <Tab
            px="30px"
            _selected={{
              color: 'brand.red',
              borderBottomColor: 'brand.red',
              boxShadow: 'none',
              fontWeight: 'bold',
            }}
          >
            <h2>Pickup</h2>
          </Tab>
        </TabList>
        <TabPanels p="0" m="2">
          <TabPanel alignItems="start" p="1" m="0">
            {availablStoreList?.length > 0 ? (
              <Flex flexWrap="wrap" direction="row" m="5px">
                {availablStoreList?.map((store) => {
                  const { id, price, storeName } = store;
                  return (
                    <Box
                      w="279px"
                      borderRadius="7px"
                      // mr="5px"
                      // ml="5px"
                      // mt="5"
                      m="5px"
                    >
                      <Stack
                        className="blockBg"
                        // w="280px"
                        p="10px"
                        spacing={2}
                        key={id}
                      >
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          h="45px"
                          sx={{
                            display: ' -webkit-box',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {storeName}
                        </Text>
                        <Rating
                          alignItems="center"
                          initialRating="4"
                          readonly
                          emptySymbol={
                            <MdStarBorder fontSize="lg" color="#FB8200" />
                          }
                          fullSymbol={<MdStar fontSize="lg" color="#FB8200" />}
                        />
                        <Flex
                          style={{ justifyContent: 'space-between' }}
                          fontSize="sm"
                        >
                          <Text>${price} Min</Text>
                          <Text>$4.49 Delivery Fee </Text>
                        </Flex>
                        <Flex style={{ justifyContent: 'space-between' }}>
                          <NumberInput
                            quantity={qtyPurchased}
                            onChange={(updatedQty) => {
                              setQty(updatedQty);
                            }}
                          />
                          <Button
                            ml="3"
                            onClick={() => {
                              handleUpdateCart(store, qty);
                            }}
                          >
                            Update Cart
                          </Button>
                        </Flex>
                      </Stack>
                    </Box>
                  );
                })}
              </Flex>
            ) : (
              <Box mt="5" mb="2">
                This product is not available in any of the nearest stores to
                the given delivery address.
              </Box>
            )}

            <Button
              variant="cancel-button"
              visibility="hidden"
              onClick={() => {
                handleRemoveProduct();
                // alert('Need to implement the functionality');
              }}
            >
              Discard Product
            </Button>
          </TabPanel>
          <TabPanel alignItems="start" p="0" m="0">
            Shipping Content
          </TabPanel>
          <TabPanel alignItems="start" p="0" m="0">
            Pickup Content
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

const stateMapper = (state) => ({});

const dispatchMapper = (dispatch) => ({
  updateCart: dispatch.cart.updateCart,
});

export default connect(stateMapper, dispatchMapper)(AvailableStoresInfo);
