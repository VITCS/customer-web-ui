import { Box, Button, Flex, Stack, Text, VStack } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React from 'react';
import aboutUsBg from '../../../assets/home/aboutus_bg.png';

export default function aboutUs() {
  return (
    <Box mt="10">
      <Flex
        w="full"
        alignItems="end"
        h="450px"
        backgroundSize="cover"
        borderTopRadius="xl"
        style={{ backgroundImage: `url(${aboutUsBg})` }}
      >
        <VStack
          h="50%"
          w="full"
          justify="center"
          borderTopRadius="xl"
          backgroundColor="rgba(0,0,0,0.5)"
        >
          <Stack maxW="3xl" alignContent="flex-end" textAlign="center">
            <Text fontSize="40px" lineHeight={1} color="White">
              About Us
            </Text>
            <Text fontSize="lg" color="White">
              Our platform provides you convenience of searching, ordering, and
              getting alcoholic beverages sourced & delivered from nearest
              store(s) at best price. You can pre-order to pick-up, or get your
              favorite beverages shipped out from far-away stores. We can help
              with your personal consumption or gifting needs.
            </Text>
          </Stack>{' '}
          <Button
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
        </VStack>
      </Flex>
    </Box>
  );
}
