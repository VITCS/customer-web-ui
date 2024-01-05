import { Box, Button, Flex, Heading, Image } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React from 'react';
import classicBrandBg from '../../../assets/home/classicBrand_bg.png';

export default function ClassicBrand() {
  return (
    <Box mt="10">
      <Flex bg="#6B4C4C" alignItems="center">
        <Box p="10" color="White" w="50%" textAlign="center">
          <Heading as="h2" fontWeight="normal">
            Deals for you
          </Heading>
          <Box mt="3">
            Exclusive deals directly from manufacturers and stores near you.
            More reasons for celebrations.
          </Box>
          <Button
            mt="3"
            href="#"
            fontSize="lg"
            variant="outline"
            color="White"
            borderRadius="lg"
            borderColor="White"
            onClick={() => {
              navigate('#');
            }}
          >
            Explore
          </Button>
        </Box>
        <Box w="50%" bg="White">
          <Image src={classicBrandBg} h="335px" w="100%" />
        </Box>
      </Flex>
    </Box>
  );
}
