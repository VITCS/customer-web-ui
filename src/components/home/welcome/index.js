import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';

export default function Welcome({ isOpen, setAgeLimitOpen, setWelcomeOpen }) {
  const [underAgeInfo, setUnderAgeInfo] = useState();
  return (
    <Modal
      isOpen={isOpen}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent roundedTopRight="0" roundedBottomLet="0">
        <ModalBody p="0" m="0" className="blockBg">
          <Flex direction="column" roundedTopLeft="10" roundedBottomRight="10">
            <Flex justifyContent="flex-end">
              <Box w="35%" h="5px" bg="brand.red" roundedBottomLeft="md" />
            </Flex>
            <VStack textAlign="center" spacing="3" p="10" h="400px" mt="10">
              <Image
                src={require('../../../assets/logo/Full-Logo.svg')}
                w="170px"
              />
              <Text color="brand.red" fontSize="lg" mt="10">
                Welcome to 1800Spirits
              </Text>
              <Text as="h1" fontWeight="bold" fontSize="2xl" mt="10">
                You seem to be
                <br /> Eager{' '}
                <Image
                  display="inline"
                  src={require('../../../assets/icons/eagerEmo.png')}
                  height="30px"
                />
              </Text>
              <Text fontSize="2xl">Will be there soon</Text>
              <Flex pb="8" direction="row" pt="5">
                <Box>
                  <Button
                    type="submit"
                    _hover={{ background: 'brand.red' }}
                    onClick={() => {
                      const showAgeLimitPopup = localStorage.getItem('showAgeLimitPopup');
                      if (!showAgeLimitPopup) {
                        setAgeLimitOpen(true);
                        localStorage.setItem('showAgeLimitPopup', 1);
                      }
                      setWelcomeOpen(false);
                    }}
                    data-cy="welcomeCloseBtn"
                  >
                    Close
                  </Button>
                </Box>
              </Flex>
              <Text>{underAgeInfo}</Text>
            </VStack>
            <Box
              w="35%"
              h="5px"
              bg="brand.red"
              roundedTopRight="md"
              alignItems="flex-end"
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
