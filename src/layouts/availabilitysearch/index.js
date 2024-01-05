import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  useToast,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React, { useEffect, useRef, useState } from 'react';
import { MdStar, MdStarBorder } from 'react-icons/md';
import { TiArrowSortedUp } from 'react-icons/ti';
import Rating from 'react-rating';
import { connect } from 'react-redux';
import defaultProductImg from '../../assets/default-product.png';
import AvailableStoresInfo from '../../components/available-stores-info';
import ConfirmationView from '../../components/common/confirmation-view';
import * as CartService from '../../services/cart-service';
import * as ProductService from '../../services/product-service';

const AvailabilitySearchPage = (props) => {
  const {
    cartId,
    emptyCart,
    user,
    deliveryAddress,
    updateCart,
    setCartInvalidFlag,
  } = props;
  const [cartDetails, setCartDetails] = useState();
  const [productList, setProductList] = useState();
  const [cartProductList, setCartProductList] = useState();
  const [availableStores, setAvailableStores] = useState();
  const [qtyPurchased, setQtyPurchased] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewCart, setViewCart] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState();
  const toast = useToast();
  const cancelRef = useRef();

  const getAvailableStores = async (product, cartProducts) => {
    setAvailableStores([]);
    setQtyPurchased(1);
    const cartProductsTemp = cartProducts || cartProductList;
    const lat = user?.deliveryToAddress?.latitude || deliveryAddress?.lat;
    const lon = user?.deliveryToAddress?.longitude || deliveryAddress?.lon;
    if (product) {
      const res = await ProductService.getAvailableStoresByProductId(
        product.id,
        10,
        lat,
        lon,
        true
      );
      setSelectedProduct(product);
      const tempQtyPurchased = cartProductsTemp?.find(
        (product) => product.id === product.id,
      )?.qtyPurchased;

      setQtyPurchased(tempQtyPurchased);
      setAvailableStores(res);
    }
  };

  const viewCartBtnFlag = (cartDts) => {
    let itemInvalid = false;
    if (cartDts) {
      cartDts.cartShipment.items.forEach((cs) => {
        const item = cs.lineItems.find((ls) => ls.itemInvalid !== false);
        if (item) {
          itemInvalid = true;
        }
      });
      setViewCart(itemInvalid);
    }
  };

  const getProductsDetailsFromCart = async (_cartId) => {
    const res = await CartService.getCart(_cartId);
    const tempCart = res;
    const productIdList = [];
    const cartProducts = [];
    if (tempCart) {
      setCartDetails(tempCart); // used for further cart update in handleUpdateCart function   ..
      viewCartBtnFlag(tempCart);
      tempCart.cartShipment.items.forEach((eachCartShipment) => {
        eachCartShipment.lineItems.forEach((product) => {
          productIdList.push(product.productId);
          cartProducts.push(product);
        });
      });
    }
    setCartProductList(cartProducts);
    const ProductDetailsList = await ProductService.getProductDetailsList(
      productIdList,
    );
    setSelectedProduct(ProductDetailsList?.products[0]);
    getAvailableStores(ProductDetailsList?.products[0], cartProducts);
    setProductList(ProductDetailsList);
  };

  const onConfirmClose = () => {
    setConfirmOpen(false);
  };

  const discardCart = async () => {
    const res = await CartService.deleteCart(cartId);
    if (res.success) {
      emptyCart();
      toast({
        title: 'Success',
        description: 'Cart discarded successfully',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      setConfirmOpen(false);
      navigate('/');
    }
  };

  const handleUpdateCart = async (selectedStore, qty) => {
    // set the default and hard coded the delivery type. IN future we need to update the with proper values
    selectedStore.deliveryType = 'Home Delivery';
    // set the Qty to 1 if user does not select any value  set the default value to 1
    qty = qty || 1;
    const res = await CartService.updateCart(
      selectedStore,
      selectedProduct,
      qty,
      user,
      cartDetails,
    );

    if (res.success) {
      setCartInvalidFlag(await CartService.getInvalidCartFlag(res.cart)); // set the cart innvlid flag to this product false.
      updateCart(res.cart);
      setCartDetails(res.cart);
      viewCartBtnFlag(res.cart);
      toast({
        status: 'success',
        position: 'top',
        description: 'Cart Updated sucessfully',
      });
    }
  };

  useEffect(() => {
    if (cartId) {
      getProductsDetailsFromCart(cartId);
    }
  }, []);

  return (
    <Box className="blockBg" rounded="lg" p="5">
      <Heading as="h1" fontSize="xl" mb="10">
        Availability Information
      </Heading>
      <Box>
        {/* // <ProductList productList={productList} showSlider /> */}

        {productList?.products?.length > 0 ? (
          <Flex direction={{ base: 'column', lg: 'row' }} mb="4">
            {productList?.products?.map((product) => (
              <Box
                key={product.id}
                onClick={() => {
                  getAvailableStores(product);
                }}
                mr="6"
              >
                <Box w={{ base: '100%', lg: '250px' }}>
                  <Flex
                    borderWidth="1px"
                    borderColor="#F1F1F1"
                    borderRadius="4"
                    direction="column"
                    className="mainBg"
                    p="4"
                    textAlign="left"
                    _selected={{
                      borderColor: 'brand.red',
                      boxShadow: '0px 1px 4px #B72618, 0px 1px 8px #DF4F41',
                    }}
                    aria-selected={selectedProduct.id === product.id}
                  >
                    <Image
                      src={
                        product.imageSrc ? product.imageSrc : defaultProductImg
                      }
                      h="150px"
                      w="150px"
                      textAlign="center"
                      ml="6"
                    />

                    <Text fontWeight="bold" mt="3" noOfLines={2} height="45px">
                      {product.title}
                    </Text>

                    <Text mt="1"> {product.categoryName}</Text>
                    <Box mt="3">
                      <Text color="brand.red" fontSize="sm" fontWeight="bold">
                        Starts From
                      </Text>
                      <Text fontSize="xl" fontWeight="bold">
                        {product.price}
                      </Text>
                    </Box>
                    <Flex mt="1" alignItems="center">
                      <Box mt="1">
                        <Rating
                          alignItems="center"
                          initialRating={product.rating}
                          readonly
                          emptySymbol={
                            <MdStarBorder fontSize="lg" color="#FB8200" />
                          }
                          fullSymbol={<MdStar fontSize="lg" color="#FB8200" />}
                        />
                      </Box>
                      <Box
                        alignItems="center"
                        fontSize="md"
                        as="span"
                        ml="2"
                        fontWeight="bold"
                      >
                        {product.rating}
                      </Box>
                    </Flex>
                  </Flex>
                  <Box
                    margin="auto"
                    display={
                      selectedProduct.id === product.id ? 'block' : 'none'
                    }
                  >
                    <TiArrowSortedUp
                      style={{ margin: 'auto' }}
                      size="40"
                      color="#B72618"
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </Flex>
        ) : (
          <Box mt="10"> No Products are added to the Cart </Box>
        )}
      </Box>
      <AvailableStoresInfo
        availablStoreList={availableStores}
        qtyPurchased={qtyPurchased}
        handleUpdateCart={handleUpdateCart}
        selectedProduct={selectedProduct}
        cart={cartDetails}
        getProductsDetailsFromCart={getProductsDetailsFromCart}
      />

      <Flex
        mt="5"
        style={{ justifyContent: 'space-between' }}
        direction="column"
      >
        <Box>
          <Button
            mr="4"
            variant="cancel-button"
            onClick={() => {
              setConfirmOpen(true);
            }}
          >
            Discard Cart
          </Button>
          <Button
            variant="cancel-button"
            mr="4"
            onClick={() => {
              navigate('/');
            }}
          >
            Continue Shopping
          </Button>
          <Button
            colorScheme="red"
            isDisabled={viewCart}
            onClick={() => {
              navigate(`/cart/${cartId}`);
            }}
          >
            View Cart
          </Button>
        </Box>
      </Flex>

      <ConfirmationView
        onConfirmClose={onConfirmClose}
        message="Are you sure you want discard the Cart"
        callbackFunction={discardCart}
        isOpen={confirmOpen}
        cancelRef={cancelRef}
        submitBtnText="Dicard Cart"
      />
    </Box>
  );
};

const stateMapper = (state) => ({
  user: state.auth.user,
  deliveryAddress: state.deliveryAddress?.deliveryAddress,
});

const dispatchMapper = (dispatch) => ({
  updateCart: dispatch.cart.updateCart,
  emptyCart: dispatch.cart.emptyCart,
  setCartInvalidFlag: dispatch.cart.setCartInvalidFlag,
});

export default connect(stateMapper, dispatchMapper)(AvailabilitySearchPage);
