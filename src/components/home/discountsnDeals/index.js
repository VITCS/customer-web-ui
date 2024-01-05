import { Box, Image } from '@chakra-ui/react';
import React from 'react';
import dealsImage from '../../../assets/home/deals.png';

export default function DiscountsnDeals() {
  return (
    <Box w={{ base: '100%', md: '32%' }} className="grid" mr="0" mt="5">
      <Box
        className="gridHeader"
        fontWeight="bold"
        fontSize="lg"
        h="43px"
        pl="15px"
      >
        Discounts & Deals
      </Box>
      <Box p="2" textAlign="center">
        <Image src={dealsImage} w="100%" h="164px" />
      </Box>
    </Box>
  );
}
