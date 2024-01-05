// import { FaUserCircle } from 'react-icons/fa';
import {
  Box,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaAlignLeft, FaAlignRight } from 'react-icons/fa';

export default function Sidebar() {
  const [navSize, changeNavSize] = useState('large');
  return (
    <Flex
      zIndex="9999"
      sx={{
        position: 'sticky',
        left: '0',
      }}
      mr="5"
      display={{ base: 'none', md: 'flex' }}
      pos="sticky"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      w={navSize === 'small' ? '45px' : '85px'}
      flexDir="column"
      justifyContent="space-between"
      bg={useColorModeValue('brand.red', 'gray.800')}
      color={useColorModeValue('white', 'black')}
    >
      <Flex
        flexDir="column"
        w="100%"
        alignItems={navSize === 'small' ? 'center' : 'flex-start'}
        as="nav"
        fontSize="12"
      >
        <Menu placement="right">
          <Link
            color={useColorModeValue('White', 'Black')}
            mt={2}
            p={2}
            href
            onClick={() => {
              if (navSize === 'small') changeNavSize('large');
              else changeNavSize('small');
            }}
            _hover={{
              textDecor: 'none',
              backgroundColor: 'brand.green',
            }}
            w={navSize === 'large' && '100%'}
          >
            <MenuButton w="100%">
              <Icon
                as={navSize === 'small' ? FaAlignRight : FaAlignLeft}
                boxSize="8"
                color={useColorModeValue('White', 'Black')}
              />
              <Box display={navSize === 'small' ? 'none' : 'flex'}>
                Collapse Menu
              </Box>
            </MenuButton>
          </Link>
        </Menu>

        {/* <NavItem
          navSize={navSize}
          icon={FaUser}
          title="User Management"
          link="/users"
        />
        <NavItem
          navSize={navSize}
          icon={FaStore}
          title="Store management"
          link="/stores"
        />
        <NavItem
        navSize={navSize}
          icon={FaMapMarked}
          title="Store Locator"
          link="/store-locator"
        /> */}
      </Flex>
    </Flex>
  );
}
