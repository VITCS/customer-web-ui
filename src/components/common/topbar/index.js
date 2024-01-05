/* eslint-disable arrow-body-style */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import { BellIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Circle,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  VStack,
  Tooltip,
} from '@chakra-ui/react';
import { navigate, useLocation } from '@reach/router';
import { API, Auth, graphqlOperation, Hub } from 'aws-amplify';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { HiShoppingCart } from 'react-icons/hi';
import { ImUser } from 'react-icons/im';
import { IoIosContacts, IoMdUnlock } from 'react-icons/io';
import { MdPayment, MdSettings } from 'react-icons/md';
import { RiLogoutBoxRFill } from 'react-icons/ri';
import { connect } from 'react-redux';
import {
  onRejectionNotificationUpdate,
  onUpdateOrderShipmentNotification,
} from '../../../graphql/queries';
import * as ProductService from '../../../services/product-service';
import { updateDeliveryToId } from '../../../services/user-service';
import { menuListStylesProps } from '../../../utils/stylesProps';
import ChangePasswordView from '../../auth/change-password';
import AddDeliveryContact from '../../home/addDeliveryContact';
import AgeLimit from '../../home/ageLimit';
import Welcome from '../../home/welcome';
import LoginView from '../../login';
import ConfirmationView from '../confirmation-view';
import QuickLinks from '../quickLinks';
import RejectionNotificationView from '../rejection-order-notification-view';
import TopNavigation from '../topNavigation';
import UpdateNotificationView from '../update-order-notification-view';

function TopBar({
  user,
  profileImage,
  cart,
  signOut,
  deliveryAddress,
  cartInvalidFalg,
  deliveryAddressStatus,
  setDeliveryToAddressStatus,
  updateDeliveryAddressStatus,
  fetchAndSetUser,
}) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [display, changeDisplay] = useState('none');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [ageLimitOpen, setAgeLimitOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState();
  const [searchResultsProducts, setSearchResultsProducts] = useState([]);
  const [cartQty, setCartQty] = useState('0');
  const [updateDeliveryAddressModal, setUpdateDeliveryAddressModal] =
    useState(false);
  const [updateDeliveryToAddress, setUpdateDeliveryToAddress] = useState(false);
  const location = useLocation();
  const [rejectOrderOpen, setRejectOrderOpen] = useState(false);
  const [rejectedOrderDetails, setRejectedOrderDetails] = useState([]);
  const [updateOrderOpen, setUpdateOrderOpen] = useState(false);
  const [updatedOrderDetails, setUpdatedOrderDetails] = useState([]);
  const [viewState, setViewState] = useState('signin');
  const [userObj, setUserObj] = useState({});
  const cancelRef = useRef();

  const changePasswordConfirmOpenFunc = (bool) => {
    setChangePasswordOpen(bool);
  };

  const onChangePasswordClose = () => {
    setChangePasswordOpen(false);
  };

  const onLoginViewClose = () => {
    setLoginOpen(false);
  };

  const signout = async () => {
    signOut();
    navigate('/');
    setConfirmOpen(false);
  };

  const socialLoginViewClose = () => {
    setLoginOpen(false);
    navigate('/');
  };

  const onConfirmClose = () => {
    setConfirmOpen(false);
  };

  const onRejectOrderClose = () => {
    setRejectOrderOpen(false);
  };

  const onUpdateOrderClose = () => {
    setUpdateOrderOpen(false);
  };

  const searchProducts = async (searchText) => {
    const res = await ProductService.search(searchText);
    setSearchResultsProducts(res.products);
  };

  const debounceSearch = useRef(
    debounce((searchText) => searchProducts(searchText), 300),
  ).current;

  const onSearchTextChange = (e) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value);
  };
  const handleSearchSubmit = () => {
    setSearchResultsProducts([]);
    window.location.href = `/search/${searchTerm}`;
    // navigate(`/search/${searchTerm}`);
  };

  const updateDeliveryAddressModalClose = () => {
    setUpdateDeliveryAddressModal(false);
    setUpdateDeliveryToAddress(false);
  };

  const updateDeliveryToAddressId = async () => {
    await updateDeliveryToId(
      user?.userId,
      deliveryAddressStatus?.deliveryAddressId,
    );
    navigate(`/cart/${cart.id}`);
    setUpdateDeliveryAddressModal(false);
    updateDeliveryAddressStatus(null);
  };

  useEffect(async () => {
    const showWelcomePopUp = sessionStorage.getItem('showwelcomepopup');
    if (!showWelcomePopUp) {
      setWelcomeOpen(true);
      sessionStorage.setItem('showwelcomepopup', 1);
    }
    if (location.pathname === '/signin/') {
      // Need to checkthe user already in DynamoDB or not.
      const user = await fetchAndSetUser();
      if (!user) {
        setLoginOpen(true);
        setViewState('socialsignup');
      } else {
        navigate('/');
      }
    }
  }, []);

  useEffect(() => {
    Hub.listen('auth', ({ payload }) => {
      const { event, data } = payload;
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then((userData) => {
            Auth.currentSession().then((userInfo) => {
              const user = userInfo?.idToken?.payload;
              setUserObj({
                username: userData.username,
                family_name: user.family_name,
                given_name: user.given_name,
                email: user.email,
              });
            });
          });
          break;
        case 'signOut':
          setUserObj(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          navigate('/');
          break;
        default:
          break;
      }
    });

    // eslint-disable-next-line no-use-before-define
    getUser().then((userData) => {
      if (userData) {
        Auth.currentSession().then((userInfo) => {
          const user = userInfo?.idToken?.payload;
          setUserObj({
            username: userData.username,
            family_name: user.family_name,
            given_name: user.given_name,
            email: user.email,
          });
        });
      }
    });
  }, []);

  const getUser = async () => {
    return Auth.currentAuthenticatedUser()
      .then((userData) => userData)
      .catch(() => console.log('Not signed in'));
    /*  return Auth.currentUserInfo()
      .then(userData => { console.log('userData----', userData);})
      .catch(() => console.log('Not signed in'));    */
  };

  useEffect(() => {
    if (cart !== null && cart !== undefined) {
      let qty = 0;
      cart.cartShipment.items.forEach((eachCartShipment) => {
        eachCartShipment.lineItems.forEach(() => {
          qty++;
        });
      });
      setCartQty(qty);
    } else {
      setCartQty('0');
    }
  }, [cart]);

  const getCustomerContact = async () => {
    // If contact exists then redirect to cart and update the delivery to.
    if (
      deliveryAddressStatus?.status === 'exists' &&
      location.pathname === '/'
    ) {
      if (
        deliveryAddress.address.latitude ===
          user?.deliveryToAddress?.latitude &&
        deliveryAddress.address.longitude === user?.deliveryToAddress?.longitude
      ) {
        setDeliveryToAddressStatus('same');
        updateDeliveryAddressStatus(null);
      } else if (
        deliveryAddress.address.latitude !==
          user?.deliveryToAddress?.latitude &&
        deliveryAddress.address.longitude !== user?.deliveryToAddress?.longitude
      ) {
        setUpdateDeliveryAddressModal(true);
        setUpdateDeliveryToAddress(true);
        setDeliveryToAddressStatus('notsame');
      }
    }
  };

  useEffect(() => {
    if (
      cart &&
      deliveryAddress &&
      deliveryAddress?.address &&
      user &&
      user?.deliveryToAddress
    ) {
      getCustomerContact();
    }
    if (user === null || user === undefined || user === '') {
      // updateDeliveryAddressStatus(null);
      setDeliveryToAddressStatus(null);
    }
  }, [cart, deliveryAddress, user, deliveryAddressStatus]);

  useEffect(() => {
    if (user) {
      API.graphql(
        graphqlOperation(onRejectionNotificationUpdate, {
          userId: user?.userId,
        }),
      ).subscribe({
        next: ({ value }) => {
          setRejectedOrderDetails({
            id: value.data.onRejectionNotificationUpdate.id,
            orderId: value.data.onRejectionNotificationUpdate.orderId,
            rejectionMsg: value.data.onRejectionNotificationUpdate.rejectionMsg,
          });
          setRejectOrderOpen(true);
        },
        error: (error) => console.log(error),
      });
    }
    if (user) {
      API.graphql(
        graphqlOperation(onUpdateOrderShipmentNotification, {
          userId: user?.userId,
        }),
      ).subscribe({
        next: ({ value }) => {
          setUpdatedOrderDetails({
            id: value.data.onUpdateOrderShipmentNotification.id,
            orderId: value.data.onUpdateOrderShipmentNotification.orderId,
          });
          setUpdateOrderOpen(true);
        },
        error: (error) => console.log(error),
      });
    }
  }, [user]);

  return (
    <>
      <ConfirmationView
        onConfirmClose={onConfirmClose}
        message="Are you sure you want to Signout"
        callbackFunction={signout}
        isOpen={confirmOpen}
        cancelRef={cancelRef}
        submitBtnText="Signout"
      />
      <RejectionNotificationView
        onRejectOrderClose={onRejectOrderClose}
        isRejectOrderOpen={rejectOrderOpen}
        rejectedOrderDetails={rejectedOrderDetails}
      />
      <UpdateNotificationView
        onUpdateOrderClose={onUpdateOrderClose}
        isUpdateOrderOpen={updateOrderOpen}
        updatedOrderDetails={updatedOrderDetails}
      />
      <Box
        zIndex="999"
        w="100%"
        sx={{
          position: 'sticky',
          top: '0',
        }}
      >
        <QuickLinks />
        <Box px={6} m="auto" className="mainBg">
          <Flex
            minH="60px"
            align="center"
            direction="row"
            flexGrow="2"
            justifyContent="space-between"
          >
            <Tooltip
              hasArrow
              label="Home / Dashboard"
              bg="brand.red"
              color="White"
            >
              <Box>
                <Button
                  width="120px"
                  variant="link"
                  onClick={() => {
                    navigate('/');
                  }}
                >
                  <Image src={require('../../../assets/logo/small.svg')} />
                </Button>
              </Box>
            </Tooltip>
            <Flex alignItems="center" mx="10" w="100%">
              <VStack
                position="relative"
                w="100%"
                display={{ base: 'none', md: 'flex' }}
              >
                <InputGroup>
                  <Input
                    variant="outline"
                    bg="#fff"
                    color={colorMode === 'light' ? 'black' : 'white'}
                    type="text"
                    placeholder="Search for Products"
                    onChange={onSearchTextChange}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        handleSearchSubmit();
                      }
                    }}
                    name="search"
                    autoComplete="off"
                    data-cy="searchInput"
                  />
                  <InputRightElement borderRadius="16px">
                    <IconButton
                      onClick={handleSearchSubmit}
                      aria-label="Search"
                      type=""
                      bg="brand.red"
                      style={{ minWidth: '40px', height: '100%' }}
                      icon={<SearchIcon color="#D6D7E3" fontSize="xl" />}
                    />
                  </InputRightElement>
                </InputGroup>
                {/* <InputRightAddon
                    onClick={handleSearchSubmit}
                    bg="brand.red"
                    pointerEvents="none"
                    roundedRight="lg"
                    children={<SearchIcon color="#D6D7E3" fontSize="xl" />}
                  /> */}

                {searchResultsProducts && searchResultsProducts.length > 0 ? (
                  <Box
                    alignItems="right"
                    position="absolute"
                    top="27px"
                    left="0px"
                    className="mainBg"
                    style={{ border: '1px solid #ACABAB' }}
                    p="5"
                    w="100%"
                    zIndex="99999"
                  >
                    <List spacing={3}>
                      <ListItem>Search Suggestions</ListItem>
                      {searchResultsProducts.map((eachResult) => (
                        <ListItem key={eachResult.title}>
                          <a href={`/product/${eachResult.id}`}>
                            {eachResult.title}
                          </a>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ) : (
                  <></>
                )}
              </VStack>
              {user ? null : (
                <Box ml="10px">
                  <Button
                    onClick={() => {
                      setLoginOpen(true);
                    }}
                    data-cy="loginBtn"
                  >
                    Login
                  </Button>
                </Box>
              )}
            </Flex>

            <Flex direction="row" sx={{ alignItems: 'center' }}>
              <Box>
                {user ? (
                  <Flex direction="row">
                    <Box
                      alignItems="center"
                      display={{ base: 'none', md: 'flex' }}
                      mr="3"
                    >
                      <Text noOfLines={1} isTruncated title={user?.firstName}>
                        {user?.firstName}
                      </Text>
                    </Box>
                    <Menu>
                      <Tooltip
                        hasArrow
                        label="Profile / Settings"
                        bg="brand.red"
                        color="White"
                      >
                        <MenuButton
                          as={Button}
                          rounded="full"
                          variant="link"
                          cursor="pointer"
                          width="50px"
                          height="50px"
                          data-cy="userMenuBtn"
                        >
                          <Avatar
                            name={user?.firstName}
                            bg="red.500"
                            src={
                              profileImage ||
                              require('../../../assets/defaultUser.png')
                            }
                          />
                        </MenuButton>
                      </Tooltip>
                      <MenuList {...menuListStylesProps} w="200px">
                        <MenuItem
                          _hover={{ bg: 'brand.red' }}
                          _focus={{ bg: 'brand.red' }}
                          onClick={() => {
                            navigate('/userprofile/');
                          }}
                          icon={<ImUser fontSize="16px" />}
                        >
                          My Profile
                        </MenuItem>
                        {user && !user.isSocialLogin && (
                          <MenuItem
                            _hover={{ bg: 'brand.red' }}
                            _focus={{ bg: 'brand.red' }}
                            onClick={() => {
                              changePasswordConfirmOpenFunc(true);
                            }}
                            icon={<IoMdUnlock fontSize="16px" />}
                          >
                            Change Password
                          </MenuItem>
                        )}
                        <MenuItem
                          _hover={{ bg: 'brand.red' }}
                          _focus={{ bg: 'brand.red' }}
                          onClick={() => {
                            navigate('/userprofile/deliverycontacts');
                          }}
                          icon={<IoIosContacts fontSize="16px" />}
                        >
                          Delivery Contacts
                        </MenuItem>
                        <MenuItem
                          _hover={{ bg: 'brand.red' }}
                          _focus={{ bg: 'brand.red' }}
                          onClick={() => {
                            navigate('/userprofile/payments');
                          }}
                          icon={<MdPayment fontSize="16px" />}
                        >
                          Payments
                        </MenuItem>
                        <MenuItem
                          _hover={{ bg: 'brand.red' }}
                          _focus={{ bg: 'brand.red' }}
                          onClick={() => {
                            navigate('/userprofile/myorders');
                          }}
                          icon={<MdSettings fontSize="16px" />}
                          data-cy="myOrderMenuItem"
                        >
                          My Orders
                        </MenuItem>
                        <MenuItem
                          _hover={{ bg: 'brand.red' }}
                          icon={<MdSettings fontSize="16px" />}
                          onClick={() => {
                            navigate('/userprofile/settings');
                          }}
                        >
                          Settings
                        </MenuItem>
                        <MenuItem
                          icon={<RiLogoutBoxRFill fontSize="16px" />}
                          _hover={{ bg: 'brand.red' }}
                          onClick={() => {
                            setConfirmOpen(true);
                          }}
                        >
                          Sign Out
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                ) : null}
              </Box>
              <SearchIcon
                aria-label="Open Menu"
                mr={2}
                style={{ fontSize: '20px', margin: 'auto' }}
                onClick={() => changeDisplay('flex')}
                display={['flex', 'flex', 'none', 'none']}
              />

              <Flex
                w="100vw"
                display={display}
                bgColor="gray.50"
                p="5"
                pr="10"
                h="100vh"
                pos="fixed"
                top="20"
                left="0"
                zIndex={20}
                overflowY="auto"
                flexDir="column"
              >
                <Flex justify="flex-end">
                  <CloseIcon size="lg" onClick={() => changeDisplay('none')} />
                </Flex>

                <Flex
                  flexDir="column"
                  align="center"
                  mt="2"
                  position="relative"
                >
                  <InputGroup>
                    <Input
                      variant="outline"
                      type="text"
                      bg="#fff"
                      color="#000"
                      placeholder="Search for Products"
                      onChange={onSearchTextChange}
                      onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                          handleSearchSubmit();
                        }
                      }}
                      name="search"
                      autoComplete="off"
                    />
                    <InputRightElement borderRadius="16px">
                      <IconButton
                        onClick={handleSearchSubmit}
                        aria-label="Search"
                        bg="brand.red"
                        style={{ minWidth: '40px', height: '100%' }}
                        icon={<SearchIcon color="#D6D7E3" fontSize="xl" />}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {searchResultsProducts && searchResultsProducts.length > 0 ? (
                    <Box
                      alignItems="right"
                      position="absolute"
                      top="27px"
                      left="0px"
                      bg="White"
                      style={{ border: '1px solid #ACABAB' }}
                      p="5"
                      w="100%"
                      zIndex="99999"
                    >
                      <List spacing={3} data-cy="searchItemList">
                        <ListItem>Search Suggestions</ListItem>
                        {searchResultsProducts.map((eachResult) => (
                          <ListItem key={eachResult.title}>
                            <a href={`/product/${eachResult.id}`}>
                              {eachResult.title}
                            </a>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Flex>
              </Flex>
              <Tooltip
                hasArrow
                label={colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
                bg="brand.red"
                color="White"
              >
                <IconButton
                  size="md"
                  alignItems="center"
                  fontSize="xl"
                  aria-label="Switch to mode"
                  variant="ghost"
                  color="current"
                  ml={{ base: '0', md: '3' }}
                  onClick={toggleColorMode}
                  icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                />
              </Tooltip>
              <Box
                alignItems="center"
                display={{ base: 'none', md: 'flex' }}
                ml="2"
              >
                <Tooltip
                  hasArrow
                  label="Notifications"
                  bg="brand.red"
                  color="White"
                >
                  <BellIcon fontSize="2xl" />
                </Tooltip>
              </Box>

              <Box
                alignItems="center"
                display="flex"
                ml="2"
                cursor="pointer"
                position="relative"
                onClick={
                  cart !== null && cart !== undefined
                    ? () => {
                        if (
                          cartInvalidFalg !== null &&
                          cartInvalidFalg !== undefined &&
                          cartInvalidFalg
                        ) {
                          navigate(`/availabilitysearch/${cart.id}`);
                        } else {
                          navigate(`/cart/${cart.id}`);
                        }
                      }
                    : undefined
                }
              >
                <HiShoppingCart fontSize="24px" />
                <Circle
                  size="20px"
                  bg="brand.red"
                  color="white"
                  position="absolute"
                  top="-5px"
                  right="-10px"
                  fontSize="xs"
                >
                  {cartQty}
                </Circle>
              </Box>
            </Flex>
          </Flex>
          <ChangePasswordView
            onChangePasswordClose={onChangePasswordClose}
            isOpen={changePasswordOpen}
          />
          <Welcome
            isOpen={welcomeOpen}
            setAgeLimitOpen={setAgeLimitOpen}
            setWelcomeOpen={setWelcomeOpen}
          />

          <AgeLimit
            isOpen={ageLimitOpen}
            setAgeLimitOpen={setAgeLimitOpen}
            setLoginOpen={setLoginOpen}
          />
          {updateDeliveryAddressModal && location.pathname === '/' && (
            <AddDeliveryContact
              isOpen={updateDeliveryAddressModal}
              updateDeliveryAddressModalClose={updateDeliveryAddressModalClose}
              updateDeliveryToAddress={updateDeliveryToAddress}
              updateDeliveryToAddressId={updateDeliveryToAddressId}
            />
          )}
          <LoginView
            onLoginViewClose={onLoginViewClose}
            isOpen={loginOpen}
            viewState={viewState}
            setViewState={setViewState}
            userObj={userObj}
            socialLoginViewClose={socialLoginViewClose}
          />
        </Box>
        <TopNavigation deliveryToAddress={user?.deliveryToAddress} />
      </Box>
      {cartInvalidFalg &&
      location.pathname !== '/about-us' &&
      location.pathname !== '/careers' ? (
        <Box
          bg="brand.grey"
          sx={{ p: '1', textAlign: 'center', color: '#fff' }}
        >
          Your cart is invalid.Please update the Cart.
          {location.pathname.includes('/availabilitysearch') ? (
            <></>
          ) : (
            <Button
              color="brand.balck"
              sx={{ ml: 2 }}
              onClick={() => {
                navigate(`/availabilitysearch/${cart.id}`);
              }}
              // variant="link"
            >
              Update Cart
            </Button>
          )}
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}

const stateMapper = (state) => ({
  profileImage: state.auth.profileImage,
  user: state.auth?.user,
  cart: state.cart.cart,
  cartInvalidFalg: state.cart.cartInvalidFlag,
  deliveryAddress: state.deliveryAddress?.deliveryAddress,
  deliveryAddressStatus: state.deliveryAddress?.deliveryAddressStatus,
  deliveryToAddressStatus: state.deliveryAddress?.deliveryToAddressStatus,
});

const dispatchMapper = (dispatch) => ({
  signOut: dispatch.auth.signOut,
  setDeliveryToAddressStatus:
    dispatch.deliveryAddress.setDeliveryToAddressStatus,
  setCartInvalidFlag: dispatch.cart.setCartInvalidFlag,
  updateDeliveryAddressStatus:
    dispatch.deliveryAddress.updateDeliveryAddressStatus,
  fetchAndSetUser: dispatch.auth.fetchAndSetUser,
});

export default connect(stateMapper, dispatchMapper)(TopBar);
