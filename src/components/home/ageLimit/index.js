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

export default function AgeLimit({ isOpen, setAgeLimitOpen, setLoginOpen }) {
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
      <ModalContent>
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
              <Text color="brand.red" fontSize="lg">
                Welcome to 1800Spirits
              </Text>
              <Text as="h1" fontWeight="bold">
                Are you 21 Years old?
              </Text>
              <Text>
                You must be 21 years(Minimum Legal Drinking Age) to order
                alcohol through our platform.
              </Text>
              <Flex pb="5" direction="row" pt="5">
                <Box>
                  <Button
                    variant="cancel-button"
                    borderColor="brand.red"
                    color="brand.red"
                    onClick={() => {
                      setUnderAgeInfo('Thank you for your Honesty.');
                    }}
                  >
                    No
                  </Button>
                </Box>
                <Box ml="3">
                  <Button
                    type="submit"
                    _hover={{ background: 'brand.red' }}
                    onClick={() => {
                      setLoginOpen(true);
                      setAgeLimitOpen(false);
                    }}
                    data-cy="ageLimitYesbtn"
                  >
                    Yes
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
