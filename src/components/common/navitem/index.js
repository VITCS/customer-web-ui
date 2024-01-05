import {
  Box,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useMatch } from '@reach/router';
import React from 'react';

export default function NavItem({ icon, title, navSize, link }) {
  const isMatched = useMatch(link || '/');

  return (
    <Flex
      flexDir="column"
      w="100%"
      mt="2"
      backgroundColor={!!isMatched && 'brand.green'}
      alignItems={navSize === 'small' ? 'center' : 'flex-start'}
    >
      <Menu placement="right">
        <Link
          color={useColorModeValue('White', 'Black')}
          as={RouterLink}
          to={link || '/'}
          // _hover={{ textDecor: 'none', backgroundColor: 'brand.red' }}
          w="100%"
        >
          <MenuButton w="100%" p={2}>
            <Icon
              as={icon}
              boxSize="6"
              // fill="white"
              // color="white"
              color={useColorModeValue('White', 'Black')}
            />
            <Box display={navSize === 'small' ? 'none' : 'flex'} pt="2">
              {title}
            </Box>
          </MenuButton>
        </Link>
      </Menu>
    </Flex>
  );
}
