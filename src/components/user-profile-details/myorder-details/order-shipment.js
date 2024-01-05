import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  StackDivider,
  Table,
  Td,
  Text,
  Th,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { Step, Steps } from 'chakra-ui-steps';
import React from 'react';
import {
  MdAddCircle,
  MdRemoveCircle,
  MdRemoveRedEye,
  MdRemoveShoppingCart,
} from 'react-icons/md';
import { RiPrinterLine } from 'react-icons/ri';
const OrderShipments = ({ orders, status, updateShipment, handleInvoice }) => {
  const statusSteps = [
    { label: 'waiting for store to accept ', key: 'Placed', state: 1 },
    { label: 'Accepted by store ', key: 'Accepted', state: 2 },
    { label: 'Shipped ', key: 'Assigned', state: 3 },
    { label: 'Delivered ', key: 'Delivered', state: 4 },
  ];

  return (
    <Box>
      {orders?.map((order) => {
        const {
          id: orderId,
          createdAt,
          orderShipment,
          orderStatus,
          userId,
        } = order;

        let totalAmount = 0;
        order.orderShipment.items.forEach((eachOrderShipment) => {
          totalAmount += eachOrderShipment.subOrderAmount;
        });

        const orderCreatedAt = new Date(createdAt);
        const orderCreatedAtStr = `${[
          ('0' + (orderCreatedAt.getMonth() + 1)).slice(-2),
          ('0' + orderCreatedAt.getDate()).slice(-2),
          orderCreatedAt.getFullYear(),
        ].join('/')} ${[
          ('0' + orderCreatedAt.getHours()).slice(-2),
          ('0' + orderCreatedAt.getMinutes()).slice(-2),
          orderCreatedAt.getSeconds(),
        ].join(':')}`;
        return (
          <Box
            className="grid"
            cursor="pointer"
            key={orderId}
            mb="10"
            maxH="100%"
            border="1px solid #e4e4e4"
            mr="0"
          >
            <Flex
              className="gridHeader"
              height="fit-content"
              alignSelf="center"
              justifyContent="space-between"
              fontSize="md"
              flexWrap="wrap"
            >
              <Box mr="3">
                <Box as="span" color="#B72618" fontWeight="bold">
                  Order:{' '}
                </Box>
                #{orderId}
              </Box>
              <Box mb="2">
                <Box as="span" color="#B72618" fontWeight="bold">
                  Placed At:{' '}
                </Box>
                {orderCreatedAtStr}
              </Box>
              <Divider
                orientation="vertical"
                ml="3"
                mr="3"
                borderColor="#717476"
                borderLeftWidth="2px"
              />
              <Box flexGrow={{ base: '0', lg: '2' }} alignContent="right">
                <Box as="span" color="#B72618" fontWeight="bold">
                  Total :
                </Box>{' '}
                ${parseFloat(totalAmount).toFixed(2)}
              </Box>
            </Flex>

            <Box p="2" className="blockBg" AllowToggle borderRadius="10px">
              <Box borderColor="brand.lightgrey" p="3">
                <Accordion w="100%" allowToggle className="orderAccordian">
                  {orderShipment?.items?.map((shipmment, i) => {
                    const {
                      id,
                      shipmentStatus,
                      assignedStoreName,
                      deliveryAddress,
                      deliveryType,
                      orderLineItems,
                      rejectionMsg,
                      isUpdated,
                      subOrderAmount,
                      subTotalProductAmount,
                      subTotalDiscount,
                      subTotalDeliveryCharges,
                      subTotal1800platformfee,
                      subTotalCardProcessingFee,
                      subTotalAmount,
                      shipmentLevelReplacement,
                      shipmentLevelReplacementFee,
                      totalPayableAmount,
                      subTotalTax,
                      subTotalTipAmount,
                    } = shipmment;
                    console.log("shipment is",shipmment)
                    let activeStep = 0;
                    if (shipmentStatus === 'Shipped') activeStep = 8;
                    else {
                      activeStep = statusSteps.filter((step) =>
                        step.key === shipmentStatus ? step.state : 0,
                      )[0]?.state;
                    }
                    return (
                      <AccordionItem key={i}>
                        {({ isExpanded }) => (
                          <Box>
                            <Flex
                              direction={{ base: 'column', lg: 'row' }}
                              justifyContent="space-between"
                              alignItems="center"
                              className="orderAccordianItem"
                            >
                              <Flex
                                flexGrow="2"
                                direction={{ base: 'column', lg: 'row' }}
                                w="84%"
                              >
                                <Flex
                                  p={0}
                                  alignItems="center"
                                  mt="5px"
                                  flexGrow="2"
                                >
                                  <AccordionButton
                                    w="max-content"
                                    m="0px"
                                    pl="2"
                                    pr="2"
                                    pt="0"
                                    alignSelf="flex-start"
                                  >
                                    {isExpanded ? (
                                      <MdRemoveCircle
                                        font-size="30px"
                                        color="#B72618"
                                        mr="2"
                                      />
                                    ) : (
                                      <MdAddCircle
                                        font-size="30px"
                                        color="#B72618"
                                        mr="2"
                                      />
                                    )}
                                  </AccordionButton>
                                  <Box>
                                    <Flex
                                      flexGrow="2"
                                      direction={{ base: 'column', lg: 'row' }}
                                    >
                                      <Text fontWeight="bold" mr="2">
                                        {assignedStoreName}
                                      </Text>
                                      <Text as="span" color="#717476" mr="2">
                                        ( {deliveryAddress?.addrLine1},{' '}
                                        {deliveryAddress?.city} )
                                      </Text>
                                      {shipmentStatus === 'Rejected' ? (
                                        <Box className="statusAlert">
                                          <CloseIcon fontSize="xs" mr="2" />
                                          Order is rejected
                                        </Box>
                                      ) : null}
                                      {isUpdated ? (
                                        <Box className="statusAlert">
                                          <CheckIcon fontSize="xs" mr="2" />
                                          Order is updated
                                        </Box>
                                      ) : null}
                                    </Flex>
                                    <HStack
                                      divider={
                                        <StackDivider borderColor="gray.200" />
                                      }
                                      spacing={2}
                                      align="stretch"
                                      flexWrap="wrap"
                                      mt="2"
                                      mb="2"
                                      fontSize={{ base: 'sm', lg: 'md' }}
                                    >
                                      <Box>
                                        {' '}
                                        <Text as="span" color="#717476">
                                          {' '}
                                          Total Amount Paid:{' '}
                                        </Text>
                                        $
                                        {parseFloat(
                                          totalPayableAmount,
                                        ).toFixed(2)}
                                      </Box>
                                      <Box>
                                        {' '}
                                        <Text as="span" color="#717476">
                                          {' '}
                                          Sub Total:{' '}
                                        </Text>
                                        ${parseFloat(subOrderAmount).toFixed(2)}
                                      </Box>
                                      <Box>
                                        {' '}
                                        <Text as="span" color="#717476">
                                          {' '}
                                          Product Sub Total:{' '}
                                        </Text>
                                        $
                                        {parseFloat(
                                          subTotalProductAmount,
                                        ).toFixed(2)}
                                      </Box>
                                      <Box>
                                        {' '}
                                        <Text as="span" color="#717476">
                                          {' '}
                                          Discount:{' '}
                                        </Text>
                                        $
                                        {parseFloat(subTotalDiscount).toFixed(
                                          2,
                                        )}
                                      </Box>
                                      <Box>
                                        {' '}
                                        <Text as="span" color="#717476">
                                          {' '}
                                          Delivery Charges:{' '}
                                        </Text>
                                        $
                                        {parseFloat(
                                          subTotalDeliveryCharges,
                                        ).toFixed(2)}
                                      </Box>
                                      <Box>
                                        {' '}
                                        <Text as="span" color="#717476">
                                          {' '}
                                          1800 platform fee:{' '}
                                        </Text>
                                        $
                                        {parseFloat(
                                          subTotal1800platformfee,
                                        ).toFixed(2)}
                                      </Box>
                                      <Box>
                                        {' '}
                                        <Text as="span" color="#717476">
                                          {' '}
                                          Total Amount:{' '}
                                        </Text>
                                        $
                                        {parseFloat(
                                          subTotalAmount,
                                        ).toFixed(2)}
                                      </Box>
                                      <Box>
                                        {' '}
                                        <Text as="span" color="#717476">
                                          {' '}
                                          Card Proccessing Fee:{' '}
                                        </Text>
                                        $
                                        {parseFloat(
                                          subTotalCardProcessingFee,
                                        ).toFixed(2)}
                                      </Box>
                                      <Box>
                                        {' '}
                                        <Text as="span" color="#717476">
                                          {' '}
                                          Shipment Replacement:{' '}
                                        </Text>
                                        {shipmment?.shipmentLevelReplacement ? (shipmment?.shipmentLevelReplacement ? "Yes" : "No") : "false"}
                                      </Box>
                                      
                                      <Box>
                                        {' '}
                                        <Text as="span" color="#717476">
                                          {' '}
                                          Shipment Replacement Fee:{' '}
                                        </Text>
                                        $
                                        {parseFloat(
                                          shipmentLevelReplacementFee,
                                        ).toFixed(2)}
                                      </Box>
                                      
                                      <Box>
                                        {' '}
                                        <Text as="span" color="#717476">
                                          {' '}
                                          Tax:{' '}
                                        </Text>
                                        ${parseFloat(subTotalTax).toFixed(2)}
                                      </Box>
                                      <Box>
                                        {' '}
                                        <Text as="span" color="#717476">
                                          {' '}
                                          Tip:{' '}
                                        </Text>
                                        $
                                        {parseFloat(subTotalTipAmount).toFixed(
                                          2,
                                        )}
                                      </Box>
                                    </HStack>
                                  </Box>
                                </Flex>
                              </Flex>
                              <Box ml="5px">
                                <Flex
                                  direction={{ base: 'column', lg: 'row' }}
                                  alignContent="left"
                                  alignItems={{
                                    base: 'flex-start',
                                    lg: 'center',
                                  }}
                                >
                                  <Flex
                                    direction={{ base: 'row', lg: 'column' }}
                                    mb="2"
                                    w="32%"
                                  >
                                    
                                    <Box fontWeight="bold" mr="2" ml="3">
                                      Status:{' '}
                                      <Text color="green" as="span">
                                        {shipmentStatus}
                                      </Text>
                                    </Box>

                                    <Menu>
                                      <MenuButton
                                        color="brand.red"
                                        fontSize="md"
                                      >
                                        <Flex alignItems="center">
                                          {' '}
                                          <MdRemoveRedEye fontSize="20px" />{' '}
                                          <Text ml="1">History</Text>
                                        </Flex>
                                      </MenuButton>
                                      <MenuList>
                                        <MenuItem fontWeight={'bold'}>
                                          Order Status
                                        </MenuItem>
                                        <Box flexGrow="2" mx="20px">
                                          {shipmentStatus === 'Rejected' ? (
                                            <Text color="green" pl="1">
                                              Select other store
                                            </Text>
                                          ) : null}
                                          {shipmentStatus === 'Cancelled' ? (
                                            <Text color="green" pl="1">
                                              {shipmentStatus}
                                            </Text>
                                          ) : null}
                                          {shipmentStatus !== 'Cancelled' &&
                                          shipmentStatus !== 'Rejected' ? (
                                            <Steps
                                              labelOrientation="vertical"
                                              activeStep={activeStep}
                                              variant="statusSteps"
                                              orientation="vertical"
                                            >
                                              {statusSteps.map(
                                                ({ label }, index) => (
                                                  <Step
                                                    label={label}
                                                    key={label}
                                                  />
                                                ),
                                              )}
                                            </Steps>
                                          ) : null}
                                        </Box>
                                        {/* <Box>
                                        Status : {shipmentStatus}
                                      </Box> */}
                                      </MenuList>
                                    </Menu>
                                  </Flex>
                                  <Divider
                                    display={{ base: 'none', lg: 'block' }}
                                    orientation="vertical"
                                    ml="3"
                                    mr="3"
                                    borderColor="#717476"
                                    borderLeftWidth="2px"
                                    height="40px"
                                  />
                                  <Flex
                                    alignItems="center"
                                    justifyContent="space-between"
                                    w="67%"
                                  >
                                    <Flex mb="5" ml="1">
                                      {deliveryType === 'Pickup' ? (
                                        <Image
                                          alignSelf="center"
                                          src={require('../../../assets/icons/pickup.svg')}
                                        />
                                      ) : null}
                                      {deliveryType === 'Home Delivery' ? (
                                        <Image
                                          alignSelf="center"
                                          src={require('../../../assets/icons/delivery.svg')}
                                        />
                                      ) : null}
                                      <Text ml="2" alignSelf="end" as="span">
                                      {deliveryType}
                                      </Text>
                                    </Flex>
                                    {orderStatus === 'Fulfilled' ? (
                                      <>
                                        <Divider
                                          orientation="vertical"
                                          ml="3"
                                          mr="3"
                                          borderColor="#717476"
                                          borderLeftWidth="2px"
                                          height="40px"
                                        />
                                        <Box color="brand.red">
                                          <IconButton
                                            p="1"
                                            color="brand.red"
                                            variant="outline"
                                            onClick={() => {
                                              handleInvoice(id, userId);
                                            }}
                                            icon={
                                              <RiPrinterLine
                                                fontSize="30px"
                                                title="Invoice"
                                              />
                                            }
                                          />
                                        </Box>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    {shipmentStatus !== 'Rejected' &&
                                      orderStatus !== 'Fulfilled' &&
                                      shipmentStatus !== 'Cancelled' && (
                                        <>
                                          <Divider
                                            orientation="vertical"
                                            ml="3"
                                            mr="3"
                                            borderColor="#717476"
                                            borderLeftWidth="2px"
                                            height="40px"
                                          />
                                          <Box color="brand.red">
                                            <Button
                                              variant="cancel-button"
                                              onClick={() => {
                                                updateShipment({
                                                  id: id,
                                                  orderId: orderId,
                                                  shipmentStatus: 'Cancelled',
                                                });
                                              }}
                                              borderColor="brand.red"
                                              color="brand.red"
                                            >
                                              Cancel
                                            </Button>
                                          </Box>
                                        </>
                                      )}
                                  </Flex>
                                </Flex>
                              </Box>
                            </Flex>
                            <AccordionPanel
                              pb={4}
                              pt="4"
                              className="orderAccordianPanel"
                            >
                              {shipmentStatus === 'Rejected' ? (
                                <Alert status="error" borderRadius="lg" mb="2">
                                  <AlertIcon />
                                  <AlertTitle>
                                    Your order has been rejected!
                                  </AlertTitle>
                                  <AlertDescription fontWeight="bold">
                                    Reason: {rejectionMsg}
                                  </AlertDescription>
                                </Alert>
                              ) : (
                                <></>
                              )}
                              <Table variant="itemTable" size="lg">
                                <Tr w="max-content">
                                  <Th fontWeight="bold" w="70%" p="10px">
                                    Item Description
                                  </Th>
                                  <Th fontWeight="bold">Total Price</Th>
                                  <Th display={{ base: 'none', lg: 'block' }} />
                                </Tr>
                                {orderLineItems?.map((lineItem, i) => (
                                  <Tr valign="top" key={i}>
                                    <Td p="10px">
                                      <Box>
                                        {status === 'Closed' && (
                                          <Text fontWeight="bold">
                                            Delivered on 20 Feb 2022
                                          </Text>
                                        )}
                                        <Text>{lineItem.productName}</Text>
                                        <Flex
                                          fontSize="sm"
                                          direction={{
                                            base: 'column',
                                            lg: 'row',
                                          }}
                                        >
                                          <Text>
                                            Qty : {lineItem.qtyPurchased}
                                          </Text>
                                          <Divider
                                            display={{
                                              base: 'none',
                                              lg: 'block',
                                            }}
                                            orientation="vertical"
                                            ml="3"
                                            mr="3"
                                            mt="1"
                                            borderColor="#717476"
                                            borderLeftWidth="2px"
                                          />
                                          <Text>
                                            Price: $
                                            {parseFloat(
                                              lineItem.unitPrice,
                                            ).toFixed(2)}
                                          </Text>
                                          <Divider
                                            display={{
                                              base: 'none',
                                              lg: 'block',
                                            }}
                                            orientation="vertical"
                                            ml="3"
                                            mr="3"
                                            mt="1"
                                            borderColor="#717476"
                                            borderLeftWidth="2px"
                                          />
                                          <Text>
                                            Item Total: $
                                            {parseFloat(
                                              lineItem.totalPrice,
                                            ).toFixed(2)}
                                          </Text>
                                        </Flex>
                                      </Box>
                                    </Td>
                                    <Td>
                                      $
                                      {parseFloat(lineItem.totalPrice).toFixed(
                                        2,
                                      )}
                                      <Button
                                        display={{ base: 'block', lg: 'none' }}
                                        variant="link"
                                        mb="2"
                                        mr="2"
                                        onClick={() => {
                                          navigate(
                                            `/product/${lineItem.productId}`,
                                          );
                                        }}
                                      >
                                        Reorder
                                      </Button>
                                    </Td>
                                    <Td display={{ base: 'none', lg: 'block' }}>
                                      <Button
                                        variant="link"
                                        w="100px"
                                        mb="2"
                                        mr="2"
                                        onClick={() => {
                                          navigate(
                                            `/product/${lineItem.productId}`,
                                          );
                                        }}
                                      >
                                        Reorder
                                      </Button>
                                    </Td>
                                  </Tr>
                                ))}
                              </Table>
                            </AccordionPanel>
                          </Box>
                        )}
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default OrderShipments;
