import React from 'react';
import {
  Box,
  Heading,
  ListItem,
  OrderedList,
  UnorderedList,
  Stack,
  Text,
} from '@chakra-ui/react';
const AboutUs = () => (
  <Stack
    spacing="24px"
    className="blockBg"
    w="100%"
    borderRadius="xl"
    boxShadow="lg"
    p="5"
    pb="30"
  >
    <Heading as="h1" fontSize="xl">
      About Us
    </Heading>
    <Box>
      We 1800spirits, is a technology intermediary company aimed to connect
      consumers with local merchants of alcoholic beverages - Beer, Liquor &
      Wines, for enhanced experience for celebrations that are event based or
      casual meetups.
    </Box>
    <Box>
      While our mission is to support your ‘Celebrate with high Spirits’
      attitude,
      <Box pl="10" mt="4">
        Searching from multiple local stores near your party place, getting the
        best price, getting your drinks delivered in 1 hr, or pre-order to
        pick-up from a store of your choice, or gifting to your near & dear from
        stores closest to them – are some of features of our platform.
      </Box>
    </Box>
    <Box>
      <Text fontWeight="bold" textDecoration="underline">
        Our offerings to Consumers:
      </Text>
      <UnorderedList pl="10" mt="4">
        <ListItem>
          Convenience of online ordering & delivery (self-Consumption) - Local
          Store
        </ListItem>
        <ListItem>
          Convenience & Savings of online ordering & delivery (Gifting) - Local
          store or shipping from a specific store for specific brands
        </ListItem>
        <ListItem>
          Saving time and avoid waiting in line during peak hours - Pre-Order
          for In-store & Curbside pickups
        </ListItem>
      </UnorderedList>
    </Box>
    <Box>
      <Text fontWeight="bold" textDecoration="underline">
        {' '}
        Our offerings to Merchants:
      </Text>
      <OrderedList pl="10" mt="4">
        <ListItem>Additional channel for revenue augmentation</ListItem>
        <ListItem>
          Expanded customer base beyond local area - Order flow from far places
          for local delivery
        </ListItem>
        <ListItem>
          Operational efficiency & Productivity improvement - Pre-Orders &
          Curbside pickup
        </ListItem>
      </OrderedList>
    </Box>
  </Stack>
);
export default AboutUs;
