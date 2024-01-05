import { Avatar, Box, Flex, Heading } from '@chakra-ui/react';
import React from 'react';

export default function ClientTestimonials() {
  return (
    <Flex mt="10" pb="10" alignContent="center" direction="column">
      <Box w="50%" alignSelf="center" textAlign="center">
        <Box>
          <Heading as="h2" color="brand.red" fontWeight="normal">
            Client Testimonials
          </Heading>
        </Box>
        <Avatar
          mt="3"
          size="xl"
          showBorder="true"
          borderColor="brand.red"
          name="Ryan Florence"
          src="https://bit.ly/ryan-florence"
        />
        <Box mt="3">
          I found it convenient to search & order for alcoholic beverages from
          multiple stores in one go. It is great experience. I would love to try
          gifting feature of this app during upcoming festive season.
        </Box>
      </Box>
    </Flex>
  );
}
