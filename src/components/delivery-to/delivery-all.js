import { Button, Text, VStack } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React, { useEffect } from 'react';

const DeliveryAll = ({ setIsDeliveryOpen }) => {
  useEffect(() => {
    setTimeout(() => {
      navigate('/userprofile/deliverycontacts');
      setIsDeliveryOpen(false);
    }, 5000);
  }, [setIsDeliveryOpen]);

  return (
    <VStack justifyContent="center" minH="100%" p="10px 0px">
      <Text>
        Re-directing your page to Delivery Contacts in{' '}
        <Text as="span" fontWeight="bold" color="brand.red">
          5 sec.
        </Text>
      </Text>
      <Text mb="10px">You can also click on the button to navigate.</Text>
      <Button
        bg="white"
        color="brand.red"
        borderColor="brand.red"
        _hover={{
          background: 'white',
          color: 'brand.red',
          borderColor: 'brand.red',
        }}
        onClick={() => {
          navigate('/userprofile/deliverycontacts');
        }}
      >
        Delivery Contacts
      </Button>
    </VStack>
  );
};

export default DeliveryAll;
