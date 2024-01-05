import { Box, Button, Flex } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import { connect } from 'react-redux';
import * as OrderService from '../../services/order-service';

const Confirmation = (props) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { orderId } = props;
  const [orderDetails, setOrderDetails] = useState(null);

  const getOrderDetails = async (_orderId) => {
    const res = await OrderService.getOrderDetails(_orderId);
    setIsPageLoading(false);

    console.log('getOrderDetails', res);
    setOrderDetails(res);
  };

  useEffect(() => {
    if (orderId) {
      getOrderDetails(orderId);
    }
  }, [orderId]);

  return (
    <>
      {!isPageLoading ? (
        orderDetails ? (
          <Box rounded="lg" p="5" className="mainBg">
            <Box className="grid" cursor="pointer" mb="10" maxH="100%">
              <Box
                className="gridHeader"
                pl="2"
                alignSelf="center"
                direction="row"
                justifyContent="space-between"
                fontSize="xl"
                fontWeight="bold"
              >
                Order Confirmation
              </Box>

              <Box p="5" className="blockBg">
                <Flex direction="row" alignItems="center" mb="3">
                  {' '}
                  <MdCheckCircle
                    font-size="30px"
                    color="#38A169"
                    display="inline"
                  />
                  <Box fontSize="lg" fontWeight="bold">
                    {' '}
                    Order placed, thank you!
                  </Box>
                </Flex>
                <Box mb="5"> Confirmation will be sent to your email.</Box>

                <Box>
                  {' '}
                  <Button
                    variant="link"
                    mb="2"
                    mr="2"
                    onClick={() => {
                      navigate('/userprofile/myorders');
                    }}
                  >
                    Review or edit your recent orders
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box textAlign="right" mb="5" px="5">
              <Button
                className="blockBg"
                variant="cancel-button"
                w="200px"
                onClick={() => {
                  navigate('/');
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Box>
        ) : (
          <Box bg="White" rounded="lg" p="10">
            <h1>Order not found</h1>
          </Box>
        )
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

const stateMapper = (state) => ({
  // cart: state.cart.cart,
});

const dispatchMapper = (dispatch) => ({
  // updateCart: dispatch.cart.updateCart,
});

export default connect(stateMapper, dispatchMapper)(Confirmation);
