import {
  Button,
  Flex,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const SIDE_MENU_ITEMS = [
  {
    label: 'Account Info',
    href: '/',
  },
  {
    label: 'Business Info',
    href: '/business',
  },
  {
    label: 'Billing Info',
    href: '/billing',
  },
  {
    label: 'Settings',
    href: '/info',
  },
];
function Profile() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Flex mt={4} rounded="sm" mx={4}>
      <VStack
        flex={1}
        bg="white"
        align="flex-start"
        px={2}
        py={3}
        spacing={6}
        // pt={16}
      >
        {SIDE_MENU_ITEMS.map((sideItem) => (
          <Button
            variant="link"
            fontSize="xl"
            onClick={() => {
              navigate(`/profile/${sideItem.href}`);
            }}
          >
            {' '}
            {sideItem.label}
          </Button>
        ))}
      </VStack>
      <Stack
        p={3}
        flex={3}
        direction={['column']}
        spacing="24px"
        bg="white"
        mx={2}
        alignSelf="center"
        width={{ base: '80%', md: '60%' }}
      >
        <Text
          fontSize={{ base: '24px', md: '40px', lg: '30px' }}
          fontWeight="bold"
        >
          Profile Settings
        </Text>
        <div
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <FaUserCircle
            style={{
              width: 100,
              height: 100,
            }}
          />
        </div>

        <Button colorScheme="teal">Save</Button>
      </Stack>
    </Flex>
  );
}

export default Profile;
