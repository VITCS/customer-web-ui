import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { graphqlOperation } from 'aws-amplify';
import { reduce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-multi-date-picker';
import { getPDFDownload } from '../../../graphql/mutations';
import * as OrderService from '../../../services/order-service';
import { graphql } from '../../../utils/api';
import { inputTextStyleProps } from '../../../utils/stylesProps';
import Navigate from '../../common/navigate';
import OrderShipments from './order-shipment';

const MyOrderDetails = ({ user }) => {
  // const [lstOrders, setLstOrders] = useState();
  const [orderDetails, setOrderDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState('Created');
  const orderDateRef = useRef();
  const [nextToken, setNextToken] = useState(undefined);
  const [nextNextToken, setNextNextToken] = useState();
  const [previousTokens, setPreviousTokens] = useState([]);
  const hasNext = !!nextNextToken;
  const hasPrev = previousTokens.length;
  const toast = useToast();
  const reset = () => {
    setNextToken(undefined);
    setPreviousTokens([]);
    setNextNextToken(undefined);
  };

  const next = () => {
    setPreviousTokens((prev) => [...prev, nextToken]);
    setNextToken(nextNextToken);
    setNextNextToken(null);
  };

  const prev = () => {
    setNextToken(previousTokens.pop());
    setPreviousTokens([...previousTokens]);
    setNextNextToken(null);
  };
  const [props, setProps] = useState({
    value: new Date(),
    format: 'MM-DD-YYYY',
  });
  const [orderRange, setOrderRange] = useState([]);
  const calendarRef = useRef();

  const handleInvoice = async (shipmentId, userId) => {
    try {
      const res = await graphql(
        graphqlOperation(getPDFDownload, {
          shipmentId,
          userId,
        }),
      );
      if (res && res.data?.getPDFDownload) {
        //  window.location = res.data.getPDFDownload;
        window.open(res.data.getPDFDownload, '_blank');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.message || 'Something went wrong. Please try again',
        status: 'error',
      });
    }
  };

  const getOrdersList = async (_orderType, dateRange, _nextToken) => {
    const dateRangeInput = [];
    if (dateRange?.length > 0) {
      const startDate = new Date(dateRange[0] + ' 00:00:00');
      const endDate = new Date(dateRange[1] + ' 23:59:59');
      dateRangeInput.push(moment(startDate).format('YYYY-MM-DDTHH:mm:ss.sssZ'));
      dateRangeInput.push(moment(endDate).format('YYYY-MM-DDTHH:mm:ss.sssZ'));
      console.log('Date range', dateRangeInput);
    }
    // TO DO:: Need to update the filter for Created. For in progress Orders we need to get the orders type created and open both
    const filter = { orderStatus: { eq: _orderType } };
    const limit = 11;   // TODO: Need to change this once backend is fixed. Backend is required for N+1 to get N results.
    if (dateRangeInput?.length > 0) {
      filter.createdAt = { between: dateRangeInput };
    }
    const ModelOrderFilterInput = {
      filter,
    };
    const res = await OrderService.getOrdersByUserId(
      user.userId,
      _nextToken,
      limit,
      {
        ...ModelOrderFilterInput,
      },
    );
    // sorting orders on created At Date
    const sortOrders = res?.items?.sort(function (a, b) {
      var c = new Date(a.createdAt);
      var d = new Date(b.createdAt);
      return c > d ? -1 : 1;
    });
    setOrderDetails(sortOrders);
    setNextNextToken(res.nextToken);
    // Quick fix : This error need to be fixed in API
    const refinedOrders = res.items.map((eachOrder) => ({
      ...eachOrder,
      orderShipment: {
        ...eachOrder.orderShipment,
        items: eachOrder.orderShipment.items.filter(
          (os) => os.assignedStoreName !== null,
        ),
      },
    }));

    // setLstOrders(refinedOrders);
    setLoading(false);
  };

  const searchOrders = () => {
    // orderRange[1] = orderRange[1] ? orderRange[1] : orderRange[0];
    getOrdersList(orderType, orderRange, nextToken);
    calendarRef.current.closeCalendar();
  };

  const setOrders = (_orderType) => {
    setOrderType(_orderType);
    getOrdersList(_orderType, orderRange, nextToken);
  };

  const updateShipment = async (updateOrderShipmentInput) => {
    const res = await OrderService.updateShipment(updateOrderShipmentInput);
    if (res.success) {
      getOrdersList('Created', orderRange, nextToken);
      toast({
        title: 'Success',
        description: 'Order Cancelled Successfully.',
        status: 'success',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again',
        status: 'error',
      });
    }
  };

  useEffect(() => {
    if (user?.userId) {
      getOrdersList('Created', orderRange, nextToken);
    }
  }, [nextToken]);

  return (
    <Box>
      {loading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      ) : (
        <>
          <Flex
            className="myorderOption"
            p="5"
            justifyContent="space-between"
            direction={{ base: 'column', lg: 'row' }}
          >
            <RadioGroup
              defaultValue="Created"
              size="lg"
              colorScheme="red"
              onChange={setOrders}
              mb={{ base: '10px', lg: '0px' }}
            >
              <Flex flexWrap="wrap">
                <Radio
                  value="Created"
                  colorScheme="green"
                  mr="3"
                  mb="2"
                  data-cy="currentOrdersRadio"
                >
                  {' '}
                  Current Orders{' '}
                </Radio>
                <Radio
                  value="Fulfilled"
                  colorScheme="green"
                  mr="3"
                  mb="2"
                  data-cy="deliveredOrdersRadio"
                >
                  {' '}
                  Delivered Orders{' '}
                </Radio>
                {/* TODO::  Once the Cancelled order tpye is added in DB we need to uncomment the bottom */}
                <Radio
                  value="Cancelled"
                  disabled
                  colorScheme="green"
                  mb="2"
                  data-cy="cancelledOrdersRadio"
                >
                  Cancelled Orders
                </Radio>
              </Flex>
            </RadioGroup>
            <Flex direction={{ base: 'column', lg: 'row' }}>
              <Flex alignItems="center" mb="3">
                <Box mr="3"> Filter Orders </Box>
                <Box>
                  <InputGroup>
                    <Input
                      border='1px solid #ACABAB !important'
                      variant="filled"
                      ref={orderDateRef}
                      alignItems="center"
                      width="250px"
                      data-cy="dateRangeInput"
                    />
                    <InputRightElement data-cy="calIcon">
                      <FaCalendarAlt
                        fontSize="20px"
                        color="#B72618"
                        onClick={() => {
                          calendarRef.current.openCalendar();
                        }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </Box>
                <Box ml="2">
                  <Button onClick={searchOrders} data-cy="orderFilterBtn">
                    Filter
                  </Button>
                </Box>
              </Flex>

              <DatePicker
                {...props}
                name="orderDateRange"
                className="red"
                render={<Box />}
                ref={calendarRef}
                range
                onPropsChange={setProps}
                arrow={false}
                maxDate={moment().format('YYYY-MM-DD')}
                value={orderRange}
                onChange={(dateObject) => {
                  setOrderRange([
                    dateObject[0]?.format(),
                    dateObject[1]?.format(),
                  ]);
                }}
              >
                <Button
                  mb="2"
                  onClick={() => {
                    orderRange[1] = orderRange[1]
                      ? orderRange[1]
                      : orderRange[0];
                    orderDateRef.current.value = `${orderRange[0]} - ${orderRange[1]}`;
                    calendarRef.current.closeCalendar();
                  }}
                  data-cy="dateFilterAddBtn"
                >
                  Add
                </Button>
              </DatePicker>
            </Flex>
          </Flex>
          {orderDetails?.length > 0 ? (
            <Box mt="5" p="5">
              <OrderShipments
                orders={orderDetails}
                status="Created"
                token={nextToken}
                updateShipment={updateShipment}
                handleInvoice={handleInvoice}
              />
              <Box w="sm" ml="auto" width="fit-content" mb="10" mr="5">
                <Navigate
                  {...{
                    hasNext,
                    hasPrev,
                    prev,
                    next,
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box m="5" p="5">
              <Alert status="info">
                <AlertIcon />
                No Orders Available
              </Alert>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default MyOrderDetails;
