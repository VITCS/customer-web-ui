// import { FaUserCircle } from 'react-icons/fa';
import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Link,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { FaMapMarked, FaStore, FaUser } from 'react-icons/fa';

export default function MobileSidebar() {
  const {
    isOpen: isMobileSideBarOpen,
    onOpen: onMobileSideBarOpen,
    onClose: onMobileSideBarClose,
  } = useDisclosure();

  return (
    <Box display={{ base: 'flex', md: 'none' }} minH="inherit" minWidth="60px">
      <IconButton
        rounded="0"
        m="0"
        minWidth="50px"
        onClick={() => {
          onMobileSideBarOpen();
        }}
        icon={<HamburgerIcon w="6" h="6" p="0" m="0" />}
        p="0"
      />
      <Drawer
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={isMobileSideBarOpen}
        placement="left"
        onClose={onMobileSideBarClose}
      >
        <DrawerOverlay>
          <DrawerContent bg="brand.red" style={{ width: '250px' }}>
            <DrawerCloseButton color="White" />
            <DrawerHeader />
            <DrawerBody>
              <VStack color="white" spacing="4" align="left" width="180px">
                <Link href="/users" style={{ _hover: 'text-decoration:none' }}>
                  <Flex width="180px" align="center">
                    <FaUser fontSize="3xl" />
                    <Text ml="2">User Management</Text>
                  </Flex>
                </Link>
                <Link href="/stores">
                  <Flex width="180px" align="center">
                    <FaStore fontSize="3xl" />
                    <Text ml="2">Store Management</Text>
                  </Flex>
                </Link>
                <Link href="/store-locator">
                  <Flex width="180px" align="center">
                    <FaMapMarked fontSize="3xl" />
                    <Text ml="2">Store Locator</Text>
                  </Flex>
                </Link>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
}
