import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Popover,
  PopoverTrigger,
  Stack,
  Text,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { connect } from 'react-redux';

const NAV_ITEMS = [
  {
    label: 'Stores',
    href: '/stores',
  },
  {
    label: 'Users',
    href: '/users',
  },
];

const DesktopNav = () => (
  <Stack direction="row" spacing={4}>
    {NAV_ITEMS.map((navItem) => (
      <Box key={navItem.label}>
        <Popover trigger="hover" placement="bottom-start">
          <PopoverTrigger>
            <Button
              variant="link"
              p={2}
              href={navItem.href ?? '#'}
              fontSize="lg"
              fontWeight={500}
              color="gray.600"
              // _hover={{
              // textDecoration: "none",
              // color: ("gray.800", "white"),
              // }}
              onClick={() => {
                navigate(navItem.href);
              }}
            >
              {navItem.label}
            </Button>
          </PopoverTrigger>
        </Popover>
      </Box>
    ))}
  </Stack>
);

const MobileNav = () => (
  <Stack
    bg={useColorModeValue('white', 'gray.800')}
    p={4}
    display={{ md: 'none' }}
  >
    {NAV_ITEMS.map((navItem) => (
      <MobileNavItem key={navItem.label} {...navItem} />
    ))}
  </Stack>
);

const MobileNavItem = ({ label, href }) => (
  <Stack spacing={4}>
    <Button
      py={2}
      variant="link"
      justify="space-between"
      align="center"
      _hover={{
        textDecoration: 'none',
      }}
      onClick={() => {
        navigate(href);
      }}
    >
      <Text fontWeight={600}>{label}</Text>
    </Button>
  </Stack>
);

function Navbar(props) {
  const { signOut } = props;
  const { isOpen, onToggle } = useDisclosure();

  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box>
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle="solid"
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align="center"
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant="ghost"
              aria-label="Toggle Navigation"
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Button
              variant="link"
              onClick={() => {
                navigate('/');
              }}
            >
              <Text
                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                fontFamily="heading"
                color={useColorModeValue('gray.800', 'white')}
              >
                Logo super
              </Text>
            </Button>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify="flex-end"
            direction="row"
            spacing={6}
          >
            <Button onClick={toggleColorMode}>
              Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
              >
                <FaUserCircle
                  style={{
                    width: '40px',
                    height: '40px',
                  }}
                />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    navigate('/profile/');
                  }}
                >
                  Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  color="red.400"
                  onClick={async () => {
                    signOut();
                    navigate('/login');
                  }}
                >
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
    </>
  );
}

const stateMapper = () => ({});

const dispatchMapper = (dispatch) => ({
  signOut: dispatch.auth.signOut,
});

export default connect(stateMapper, dispatchMapper)(Navbar);
