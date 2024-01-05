import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

export default function OrderShipment(props) {
  const { cartShipment, calculatedTax, handleSubTotalAmount } = props;
  const { assignedStoreName, deliveryAddress, deliveryFee, creditCardProcessingPercent,creditCardProcessingFlatFee,merchantFeeToCustomer,shipmentLevelReplacement,shipmentLevelReplacementFee,totalPayableAmount} = cartShipment;
  const [subOrderAmount, setSubOrderAmount] = useState(0);
  const [orderTotalAmount, setOrderTotalAmount] = useState(0);
  const [subTotalTax, setSubTotalTax] = useState(10);

  const platform = 1.99+(merchantFeeToCustomer || 0);
  let subTotalProductAmount = 0;
  cartShipment.lineItems.map((eachLineItem) => {
    subTotalProductAmount += eachLineItem.unitPrice * eachLineItem.qtyPurchased;
  });

  const handleTipChange = (value) => {
    setSubTotalTax(parseInt(value, 10));
  };

  useEffect(() => {
    setSubOrderAmount(
      subTotalProductAmount + calculatedTax.calculatedTax + (deliveryFee || 4.49) + platform  + subTotalTax + CardProcessingFee,
    );
  }, [subTotalTax]);

  useEffect(() => {
    handleSubTotalAmount(
      subOrderAmount,
      calculatedTax.calculatedTax,
      (deliveryFee || 4.49),  
      platform,
      subTotalTax,
      TotalAmount,
      CardProcessingFee,
      shipmentLevelReplacement,
      shipmentLevelReplacementFee,
      totalPayableAmount,
    );
  }, [subOrderAmount]);
  let TotalAmount=(subTotalProductAmount + calculatedTax.calculatedTax + (deliveryFee || 4.49) + platform  + subTotalTax);
  const creditCardProcessingAmount = (creditCardProcessingPercent*TotalAmount)/100;
  let CardProcessingFee;
  
  if(creditCardProcessingAmount>creditCardProcessingFlatFee)
  {
    CardProcessingFee=creditCardProcessingAmount;
  }
  else{
    CardProcessingFee=creditCardProcessingFlatFee;
  }
  console.log("Grand Total S",creditCardProcessingAmount);
  return (
    <Box>
      <Box
        className="mainBg"
        bg="brand.red"
        roundedTop="lg"
        color="White"
        py="3"
        fontSize="lg"
        px="4"
      >
        Shipment : {assignedStoreName}
      </Box>

      <Box className="mainBg" roundedBottom="lg" pb="5">
        <Box color="brand.red" p="5" fontWeight="bold">
          Store(s) to fulfill
        </Box>
        <Accordion defaultIndex={[0]} allowMultiple className="blockBg">
          <AccordionItem key={assignedStoreName}>
            <AccordionButton textAlign="left" className="gridHeader">
              <Text
                as="b"
                flex="1"
                alignContent="left"
                textTransform="capitalize"
                fontWeight="bold"
              >
                {assignedStoreName}
              </Text>
              <AccordionIcon color="brand.red" fontSize="2xl" />
            </AccordionButton>

            <AccordionPanel textAlign="left" key="" p="0" m="0">
              <Grid
                templateColumns="repeat(2, 1fr)"
                columnGap="1"
                rowGap="3"
                mt="3"
                p="4"
              >
                <GridItem fontWeight="bold"> Product Sub Total </GridItem>
                <GridItem justifySelf="end">
                  ${parseFloat(subTotalProductAmount).toFixed(2)}
                </GridItem>
                <GridItem fontWeight="bold">Taxes</GridItem>
                <GridItem justifySelf="end">
                  {/* Use the store id property to compare and then display the correct tax */}
                  ${calculatedTax.calculatedTax}
                </GridItem>
                {/* <GridItem fontWeight="bold">Delivery Charges</GridItem>
                <GridItem justifySelf="end">$4.49</GridItem> */}
                <GridItem fontWeight="bold">Delivery Charges</GridItem>
                <GridItem justifySelf="end">${deliveryFee || 4.49}</GridItem>
                <GridItem fontWeight="bold">1800 platform fee</GridItem>
                <GridItem justifySelf="end">${platform}   </GridItem>
                <GridItem fontWeight="bold">Tips</GridItem>
                <GridItem justifySelf="end">
                  <Flex alignItems="center">
                    <NumberInput
                      maxW={20}
                      min={0}
                      value={subTotalTax}
                      onChange={handleTipChange}
                      mr="10"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    ${subTotalTax}
                  </Flex>
                </GridItem>
              </Grid>

              <Box
                fontWeight="bold"
                px="4"
                py="2"
                boxShadow="md"
                className="mainBg"
              >
                <Text>Delivery Address :</Text>
              </Box>
              <Box p="5">
                {`${deliveryAddress.addrLine1}, ${
                  deliveryAddress.addrLine2 !== ''
                    ? `${deliveryAddress.addrLine2},`
                    : ''
                } ${deliveryAddress.city}, ${deliveryAddress.country}, ${
                  deliveryAddress.postCode
                }`}
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Grid
                templateColumns="repeat(2, 1fr)"
                columnGap="1"
                rowGap="3"
                mt="3"
                p="4"
              >
          <GridItem>Total Amount </GridItem>
          <GridItem justifySelf="end">${parseFloat(TotalAmount).toFixed(2)}</GridItem>
          
          <GridItem>Card Processing Fee </GridItem>
          <GridItem justifySelf="end">${parseFloat(CardProcessingFee).toFixed(2)}</GridItem>
        </Grid>
        <Flex
          fontWeight="bold"
          fontSize="xl"
          p="4"
          w="100%"
          justifyContent="space-between"
          borderBottom="1px dashed #878787"
          borderTop="1px dashed #878787"
          className="mainBg"
        >
          <Box>Order Total </Box>
          <Box>${parseFloat(subOrderAmount).toFixed(2)}</Box>
        </Flex>

      </Box>
    </Box>
  );
}
