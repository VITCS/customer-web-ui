import { ChevronDownIcon, CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Link,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { navigate, useLocation } from '@reach/router';
import React, { useState, memo } from 'react';
import { BsPencil } from 'react-icons/bs';
import { GiPriceTag } from 'react-icons/gi';
import { connect } from 'react-redux';
import DeliveryTo from '../../../layouts/delivery-to';
import DeliveryAddressSelectorModal from '../../home/deliveryAddressSelectorModal';

const navigation = [
  {
    navItem: 'Beer',
    navLinks: [
      {
        title: 'Beer Varieties',
        links: [
          { name: 'Alternative', url: '/category/Beer/Alternative' },
          { name: 'Malt', url: '/category/Beer/Malt' },
          { name: 'Flavored', url: '/category/Beer/Flavored' },
          { name: 'Gluten Free', url: '/category/Beer/Gluten Free' },
          { name: 'Cider', url: '/category/Beer/Cider' },
          { name: 'Seltzer', url: '/category/Beer/Seltzer' },
          { name: 'Imported', url: '/category/Beer/Imported' },
          { name: 'Ale', url: '/category/Beer/Ale' },
          { name: 'Low Alcohol', url: '/category/Beer/Low Alcohol' },
          { name: 'Craft', url: '/category/Beer/Craft' },
          { name: 'Non-Alcoholic', url: '/category/Beer/Non-Alcoholic' },
          { name: 'Premium Beer', url: '/category/Beer/Premium Beer' },
          { name: 'Light Beer', url: '/category/Beer/Light Beer' },
        ],
      },
    ],
  },
  {
    navItem: 'Wine',
    navLinks: [
      {
        title: 'Wine Varieties',
        links: [
          { name: 'Red', url: '/category/Wine/Red' },
          { name: 'White', url: '/category/Wine/White' },
          { name: 'Sparkling Wine', url: '/category/Wine/Sparkling Wine' },
          { name: 'Wine Cocktail', url: '/category/Wine/Wine Cocktail' },
          { name: 'Rose', url: '/category/Wine/Rose' },
          { name: 'Flavored Wine', url: '/category/Wine/Flavored Wine' },
          { name: 'Carbonated Wine', url: '/category/Wine/Carbonated Wine' },
          { name: 'Blush Wine', url: '/category/Wine/Blush Wine' },
          { name: 'White - Red Wine', url: '/category/Wine/White - Red Wine' },
          { name: 'Gift Set', url: '/category/Wine/Gift Set' },
          { name: 'Ice Wine', url: '/category/Wine/Ice Wine' },
          { name: 'Mead', url: '/category/Wine/Mead' },
          { name: 'Port Wine', url: '/category/Wine/Port Wine' },
          { name: 'Rice Wine', url: '/category/Wine/Rice Wine' },
          { name: 'Fruit Wine', url: '/category/Wine/Fruit Wine' },
          { name: 'Sherry Wine', url: '/category/Wine/Sherry Wine' },
          { name: 'Tonic Wine', url: '/category/Wine/Tonic Wine' },
          { name: 'Alcohol Free', url: '/category/Wine/Alcohol Free' },
          { name: 'Wine Spritzer', url: '/category/Wine/Wine Spritzer' },
        ],
      },
    ],
  },
  {
    navItem: 'Liquor',
    navLinks: [
      {
        title: 'Liquor Varieties',
        links: [
          { name: 'Whiskey', url: '/category/Liquor/Whiskey' },
          { name: 'Brandy', url: '/category/Liquor/Brandy' },
          { name: 'Vodka', url: '/category/Liquor/Vodka' },
          { name: 'Gin', url: '/category/Liquor/Gin' },
          { name: 'Rum', url: '/category/Liquor/Rum' },
          { name: 'Tequila', url: '/category/Liquor/Tequila' },
          { name: 'Cocktails', url: '/category/Liquor/Cocktails' },
          { name: 'Non Alcoholic', url: '/category/Liquor/Non Alcoholic' },
          { name: 'Asian Spirits', url: '/category/Liquor/Asian Spirits' },
          {
            name: 'Distilled Spirits',
            url: '/category/Liquor/Distilled Spirits',
          },
          { name: 'Mezcal', url: '/category/Liquor/Mezcal' },
          { name: 'Moonshine', url: '/category/Liquor/Moonshine' },
          { name: 'Flavoured', url: '/category/Liquor/Flavoured' },
          { name: 'Grain', url: '/category/Liquor/Grain' },
          { name: 'Liqueur', url: '/category/Liquor/Liqueur' },
          { name: 'Armagnac', url: '/category/Liquor/Armagnac' },
          { name: 'Cognac', url: '/category/Liquor/Cognac' },
          {
            name: 'Molecular Spirit',
            url: '/category/Liquor/Molecular Spirit',
          },
          { name: 'Raicilla', url: '/category/Liquor/Raicilla' },
          { name: 'Sotol', url: '/category/Liquor/Sotol' },
          {
            name: 'Sugar Cane Spirit',
            url: '/category/Liquor/Sugar Cane Spirit',
          },
          { name: 'Vermouth', url: '/category/Liquor/Vermouth' },
          { name: 'Gift Set', url: '/category/Liquor/Gift Set' },
          { name: 'Mixers', url: '/category/Liquor/Mixers' },
        ],
      },
    ],
  },
];

function TopNavigation({ deliveryToAddress, user, deliveryAddress }) {
  const [display, changeDisplay] = useState('none');
  const deliveryAddressStr = deliveryAddress?.address
    ? `${deliveryAddress?.address.addrLine1} , ${deliveryAddress?.address.city} , ${deliveryAddress?.address.addrState} , ${deliveryAddress?.address.postCode}`
    : '';
  const location = useLocation();
  const { onDeliveryClose } = useDisclosure();
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isDeliveryAddressOpen, setIsDeliveryAddressOpen] = useState(true);
  const [isDeliveryAddressEdit, setIsDeliveryAddressEdit] = useState(false);
  const deliveryAddressModalClose = () => {
    if (location.pathname === '/storelocator' && !deliveryAddress) {
      navigate('/');
    }
    setIsDeliveryAddressOpen(false);
    setIsDeliveryAddressEdit(false);
  };

  return (
    <>
      <Box className="blockBg" px={6} boxShadow="lg">
        <Box width="100%">
          <Flex
            spacing={8}
            direction="row"
            justifyContent="space-between"
            h={14}
          >
            <HStack
              as="nav"
              spacing={8}
              display={['none', 'none', 'flex', 'flex']}
            >
              {navigation.map((nav) => (
                <Menu key={nav.navItem} autoSelect={false} className="mainBg">
                  <MenuButton
                    fontWeight="bold"
                    fontSize="lg"
                    rounded="lg"
                    px="4px"
                    _hover={{
                      color: 'brand.red',
                      borderColor: 'brand.red',
                    }}
                  >
                    {nav.navItem} <ChevronDownIcon />
                  </MenuButton>
                  <MenuList px="5">
                    <MenuItem _hover={{ bg: 'none' }}>
                      <Flex direction={{ lg: 'row', base: 'column' }}>
                        {nav.navLinks.map((navLink) => (
                          <Box key={navLink.title} mr="10" mb="10">
                            <Box fontWeight="bold" fontSize="lg">
                              {navLink.title}
                            </Box>
                            {Object.prototype.hasOwnProperty.call(
                              navLink,
                              'subNavLinks',
                            ) ? (
                              <Flex>
                                {navLink.subNavLinks.map((subNavLink) => (
                                  <Box key={subNavLink.title} mr="10" mt="4">
                                    <Text fontWeight="bold">
                                      {subNavLink.title}
                                    </Text>
                                    <SimpleGrid
                                      columns={Math.round(
                                        navLink.links.length / 5,
                                      )}
                                      spacingX="30px"
                                      spacingY="10px"
                                      mt="4"
                                    >
                                      {subNavLink.links.map((link) => (
                                        <Link key={link.name} href={link.url}>
                                          {' '}
                                          {link.name}
                                        </Link>
                                      ))}
                                    </SimpleGrid>
                                  </Box>
                                ))}
                              </Flex>
                            ) : null}
                            {Object.prototype.hasOwnProperty.call(
                              navLink,
                              'links',
                            ) ? (
                              <SimpleGrid
                                columns={Math.round(navLink.links.length / 5)}
                                spacingX="30px"
                                spacingY="10px"
                                mt="4"
                              >
                                {navLink.links.map((link) => (
                                  <Link key={link.name} href={link.url}>
                                    {' '}
                                    {link.name}
                                  </Link>
                                ))}
                              </SimpleGrid>
                            ) : null}
                          </Box>
                        ))}
                      </Flex>
                    </MenuItem>
                  </MenuList>
                </Menu>
              ))}
              <Button
                variant="link"
                href="#"
                fontSize="lg"
                onClick={() => {
                  navigate('#');
                }}
              >
                <GiPriceTag color="#B72618" fontSize="xl" />
                <Text as="span" ml="2" fontWeight="bold">
                  More Deals
                </Text>
              </Button>
            </HStack>
            <HamburgerIcon
              aria-label="Open Menu"
              mr={2}
              style={{ fontSize: '20px', margin: 'auto' }}
              onClick={() => changeDisplay('flex')}
              display={['flex', 'flex', 'none', 'none']}
            />
            <Flex
              w="100vw"
              display={display}
              className="mainBg"
              h="100vh"
              pos="fixed"
              top="0"
              left="0"
              zIndex={20}
              overflowY="auto"
              flexDir="column"
            >
              <Flex justify="flex-end">
                <IconButton
                  mt={2}
                  mr={2}
                  aria-label="Open Menu"
                  size="lg"
                  icon={<CloseIcon />}
                  onClick={() => changeDisplay('none')}
                />
              </Flex>

              <Flex flexDir="column" align="center" mt="2">
                <Accordion allowToggle w="100%">
                  {navigation.map((nav) => (
                    <AccordionItem key={nav.navItem}>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            {nav.navItem}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {nav.navLinks.map((navLink) => (
                          <React.Fragment key={navLink.title}>
                            <Box fontWeight="bold" fontSize="lg">
                              {navLink.title}
                            </Box>
                            {Object.prototype.hasOwnProperty.call(
                              navLink,
                              'subNavLinks',
                            ) ? (
                              <Flex direction="column">
                                {navLink.subNavLinks.map((subNavLink) => (
                                  <Box key={subNavLink.title} mr="10" mt="4">
                                    <Text fontWeight="bold">
                                      {subNavLink.title}
                                    </Text>
                                    <List spacing={3} mt="4">
                                      {subNavLink.links.map((link) => (
                                        <ListItem
                                          key={link.name}
                                          onClick={() => {
                                            navigate(link.url);
                                          }}
                                        >
                                          {link.name}
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Box>
                                ))}
                              </Flex>
                            ) : null}
                            {Object.prototype.hasOwnProperty.call(
                              navLink,
                              'links',
                            ) ? (
                              <List spacing={3} mt="4">
                                {navLink.links.map((link) => (
                                  <ListItem
                                    key={link.name}
                                    onClick={() => {
                                      navigate(link.url);
                                    }}
                                  >
                                    {link.name}
                                  </ListItem>
                                ))}
                              </List>
                            ) : null}
                          </React.Fragment>
                        ))}{' '}
                      </AccordionPanel>{' '}
                    </AccordionItem>
                  ))}
                </Accordion>

                <Button
                  variant="link"
                  href="#"
                  fontSize="lg"
                  padding="5px"
                  onClick={() => {
                    navigate('#');
                  }}
                >
                  <GiPriceTag color="#B72618" fontSize="xl" />
                  <Text as="span" ml="2" fontWeight="bold">
                    More Deals
                  </Text>
                </Button>
              </Flex>
            </Flex>
            <HStack fontWeight="bold" fontSize="lg">
              {user ? (
                <>
                  <Text textTransform="uppercase" color="brand.red">
                    Delivery to
                  </Text>
                  <Text> &gt; </Text>
                  <Text>
                    {deliveryToAddress?.firstName} -{' '}
                    {deliveryToAddress?.addressType}
                  </Text>
                  <IconButton
                    variant="outline"
                    color="brand.red"
                    border="none"
                    icon={<BsPencil fontSize="xl" />}
                    onClick={() => {
                      setIsDeliveryOpen(true);
                    }}
                  />
                </>
              ) : deliveryAddress ? (
                <>
                  <Text textTransform="uppercase" color="brand.red">
                    Delivery to
                  </Text>
                  <Text> &gt; </Text>
                  <Tooltip hasArrow label={deliveryAddressStr}>
                    <Text cursor="default">{`${deliveryAddressStr?.slice(
                      0,
                      10,
                    )}...`}</Text>
                  </Tooltip>
                  <IconButton
                    variant="outline"
                    colorScheme="red"
                    border="none"
                    icon={<BsPencil fontSize="xl" />}
                    onClick={() => {
                      setIsDeliveryAddressEdit(true);
                    }}
                  />
                </>
              ) : location.pathname !== '/' ? (
                <>
                  {' '}
                  <Text textTransform="uppercase" color="brand.red">
                    Delivery to
                  </Text>
                  <Text> &gt; </Text>
                  <Button
                    ml="2"
                    onClick={() => {
                      setIsDeliveryAddressEdit(true);
                    }}
                    type="submit"
                    _hover={{ background: 'brand.red' }}
                    data-cy="addDeliveryAddressbtn"
                  >
                    {' '}
                    Add
                  </Button>
                </>
              ) : null}
              ;
            </HStack>
          </Flex>
        </Box>
      </Box>
      <DeliveryTo
        isOpen={isDeliveryOpen}
        setIsDeliveryOpen={setIsDeliveryOpen}
        onClose={onDeliveryClose}
      />
      {!user &&
      location.pathname !== '/signin/' &&
      location.pathname !== '/about-us' &&
      location.pathname !== '/careers' &&
      (location.pathname !== '/' || deliveryAddress) &&
      (!deliveryAddress || isDeliveryAddressEdit) ? (
        <DeliveryAddressSelectorModal
          isOpen={isDeliveryAddressEdit || isDeliveryAddressOpen}
          deliveryAddrModalClose={deliveryAddressModalClose}
        />
      ) : null}
    </>
  );
}

const stateMapper = (state) => ({
  user: state.auth?.user,
  deliveryAddress: state.deliveryAddress?.deliveryAddress,
});

const dispatchMapper = () => ({});

export default connect(stateMapper, dispatchMapper)(memo(TopNavigation));
