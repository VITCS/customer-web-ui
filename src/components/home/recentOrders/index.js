import { Box, Flex, HStack, Image, Link, Text } from '@chakra-ui/react';
import React from 'react';
import {
  gridHeaderStylesProps,
  gridStylesProps,
} from '../../../utils/stylesProps';

export default function RecentOrders() {
  return (
    <Box w={{ base: '100%', md: '32%' }} className="grid" mr="5" mt="5">
      <Box
        className="gridHeader"
        fontWeight="bold"
        fontSize="lg"
        h="43px"
        pl="15px"
      >
        Recent / Past Orders
      </Box>

      <Flex direction="column" p="5">
        <HStack>
          <Image
            src="http://1800spirits-images.s3-website-us-east-1.amazonaws.com/product/00702770004003_CF__GS1_JPEG.jpg"
            h="100px"
            w="100px"
            textAlign="center"
          />
          <Text fontSize="xl" fontWeight="bold">
            Widmer Brothers Brewing Hop Jack Ale Singles 12 FL OZ Bottle
          </Text>
        </HStack>
        <Box alignSelf="flex-end">
          <Link
            color="brand.red"
            fontSize="sm"
            href="#"
            textDecoration="underline"
          >
            View All Orders
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}
