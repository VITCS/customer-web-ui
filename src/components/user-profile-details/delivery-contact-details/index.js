import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spacer,
  Spinner,
  Switch,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { graphqlOperation } from 'aws-amplify';
import React, { useEffect, useRef, useState } from 'react';
import { BsClock, BsPlus } from 'react-icons/bs';
import { FaEllipsisV } from 'react-icons/fa';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';
import { connect } from 'react-redux';
import {
  deleteContactDetails,
  deleteCustomerAddress,
  deleteCustomerOccasion,
  updateCustomerContact,
  updateCustomerProfileDeliveryToId,
  updateCustomerProfileOccasionReminderProfile,
  updateOccasionsReminder,
} from '../../../graphql/mutations';
import { getCustomerContacts } from '../../../graphql/queries';
import { graphql } from '../../../utils/api';
import {
  inputTextStyleProps,
  menuListStylesProps,
} from '../../../utils/stylesProps';
import ConfirmationView from '../../common/confirmation-view';
import AddDeliveryContact from '../../home/addDeliveryContact';
import AddDeliveryContactDetails from './add-delivery-contact-details';
import AddEditAddressDetails from './add-edit-address-details';
import AddEditOccasionDetails from './add-edit-occasion-details';
import moment from 'moment';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
const DeliveryContactDetails = ({
  user,
  setDeliveryTo,
  deliveryAddressStatus,
  storeDeliveryContacts,
  fetchAndSetUser,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    isOpen: isAddDetailsModelOpen,
    onClose: onAddDetailsModalClose,
    onOpen: onAddDetailsModalOpen,
  } = useDisclosure();
  const {
    isOpen: isAddEditOccasionModelOpen,
    onClose: onAddEditOccasionModalClose,
    onOpen: onAddEditOccasionModalOpen,
  } = useDisclosure();
  const {
    isOpen: isAddEditAddressModelOpen,
    onClose: onAddEditAddressModalClose,
    onOpen: onAddEditAddressModalOpen,
  } = useDisclosure();
  const [deliveryContacts, setDeliveryContacts] = useState();
  const [deliveryContact, setDeliveryContact] = useState();
  const [deliveryCategoryId, setDeliveryCategoryId] = useState();
  const [occasion, setOccasion] = useState();
  const [contactId, setContactId] = useState();
  const [addressDetails, setAddressDetails] = useState();
  const [deliveryContactId, setDeliveryContactId] = useState();
  const [deliveryToId, setDeliveryToId] = useState();
  const [deleteContactConfirmOpen, setDeleteContactConfirmOpen] =
    useState(false);
  const [confirmDefaultAddressOpen, setConfirmDefaultAddressOpen] =
    useState(false);
  const [confirmDefaultAddressMessage, setConfirmDefaultAddressMessage] =
    useState(false);
  const [deleteOcassionConfirmOpen, setDeleteOcassionConfirmOpen] =
    useState(false);
  const [deleteAddressConfirmOpen, setDeleteAddressConfirmOpen] =
    useState(false);
  const [isDeleteContactLoading, setIsDeleteContactLoading] = useState(false);
  const [isDeleteOcassionLoading, setIsDeleteOcassionLoading] = useState(false);
  const [isDeleteAddressLoading, setIsDeleteAddressLoading] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [selectedOcassionId, setSelectedOcassionId] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(false);
  const [defaultDeliveryAddress, setDefaultDeliveryAddress] = useState();
  const [updateDeliveryAddressModal, setUpdateDeliveryAddressModal] =
    useState(false);
  const toast = useToast();
  const cancelRef = useRef();

  const getNewContactDetails = async (filterValue) => {
    try {
      const Query = filterValue
        ? graphqlOperation(getCustomerContacts, {
          userId: user?.userId,
          filter: { contactCategory: { eq: filterValue } },
        })
        : graphqlOperation(getCustomerContacts, {
          userId: user?.userId,
        });
      const contacts = await graphql(Query);
      setDeliveryContacts(
        contacts.data.CustomerContactsByCustomerProfileId.items,
      );
      storeDeliveryContacts(
        contacts.data.CustomerContactsByCustomerProfileId.items,
      );
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong in retrieving the contacts',
        status: 'error',
        isClosable: true,
        duration: 5000,
      });
    }
  };

  const deleteContact = async () => {
    setIsDeleteContactLoading(true);
    try {
      await graphql(
        graphqlOperation(deleteContactDetails, {
          input: {
            id: selectedContactId,
          },
        }),
      );
      toast({
        title: 'Success',
        description: 'Contact deleted succesfully',
        status: 'success',
        isClosable: true,
        duration: 5000,
      });
      getNewContactDetails();
      setIsDeleteContactLoading(false);
      setDeleteContactConfirmOpen(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
        isClosable: true,
        duration: 5000,
      });
    }
    setIsDeleteContactLoading(false);
  };

  const deleteOccasion = async () => {
    setIsDeleteOcassionLoading(true);
    try {
      await graphql(
        graphqlOperation(deleteCustomerOccasion, {
          input: {
            id: selectedOcassionId,
          },
        }),
      );
      toast({
        title: 'Success',
        description: 'Occassion deleted succesfully',
        status: 'success',
        isClosable: true,
        duration: 5000,
      });
      getNewContactDetails();
      setIsDeleteOcassionLoading(false);
      setDeleteOcassionConfirmOpen(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
        isClosable: true,
        duration: 5000,
      });
    }
  };

  const deleteAddress = async () => {
    setIsDeleteAddressLoading(true);
    try {
      await graphql(
        graphqlOperation(deleteCustomerAddress, {
          input: {
            id: selectedAddressId,
          },
        }),
      );
      toast({
        title: 'Success',
        description: 'Address deleted succesfully',
        status: 'success',
        isClosable: true,
        duration: 5000,
      });
      getNewContactDetails();
      setIsDeleteAddressLoading(false);
      setDeleteAddressConfirmOpen(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
        isClosable: true,
        duration: 5000,
      });
    }
  };

  const handleReminderAll = async (prop) => {
    try {
      await graphql(
        graphqlOperation(updateOccasionsReminder, {
          input: prop,
        }),
      );
      getNewContactDetails();
      toast({
        title: 'Success',
        description: 'Reminder changed to all occasions',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
        isClosable: true,
        duration: 5000,
      });
    }
  };

  const handleDeliveryToAddress = async (prop) => {
    try {
      const { userId, deliveryToId: _deliveryToId } = prop;
      const resp = await graphql(
        graphqlOperation(updateCustomerProfileDeliveryToId, {
          input: {
            userId,
            deliveryToId: _deliveryToId,
          },
        }),
      );
      if (resp && resp.data?.updateCustomerProfile?.deliveryToId) {
        setDeliveryToId(resp.data?.updateCustomerProfile?.deliveryToId);
        user.deliveryToId = resp.data?.updateCustomerProfile?.deliveryToId;
        if (deliveryContacts) {
          const deliveryAddr = deliveryContacts
            .flatMap((eachObj) => eachObj.deliveryAddress.items)
            .find((contact) => contact.id === user.deliveryToId);
          const updatedUser = { ...user, deliveryToAddress: deliveryAddr };
          setDeliveryTo(updatedUser);
          return;
        }
        setDeliveryTo(user);
      }

      toast({
        title: 'Success',
        description: 'Delivery to Address updated.',
        status: 'success',
        duration: 500,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
        isClosable: true,
        duration: 5000,
      });
    }
  };

  const handleProfileRemindAll = async (prop) => {
    try {
      await graphql(
        graphqlOperation(updateCustomerProfileOccasionReminderProfile, {
          input: prop,
        }),
      );
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
        isClosable: true,
        duration: 5000,
      });
    }
  };

  const markAddressDefault = async () => {
    setConfirmDefaultAddressOpen(false);

    const { defaultAddressId, id } = defaultDeliveryAddress;

    try {
      await graphql(
        graphqlOperation(updateCustomerContact, {
          input: { defaultAddressId, id },
        }),
      );
      getNewContactDetails();

      toast({
        title: 'Success',
        description: 'succesfully updated default Address',
        status: 'success',
        isClosable: true,
        duration: 1000,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong to update default Address',
        status: 'error',
        isClosable: true,
        duration: 5000,
      });
    }
  };

  const updateDeliveryAddressModalClose = () => {
    setUpdateDeliveryAddressModal(false);
  };

  useEffect(() => {
    if (user?.userId) {
      setDeliveryToId(user?.deliveryToId);
      getNewContactDetails();
      // Below condition will check and open the add address
      if (deliveryAddressStatus && deliveryAddressStatus.status === 'add') {
        setUpdateDeliveryAddressModal(true);
      }
    }
  }, []);

  return (
    <Box>
      <AddDeliveryContactDetails
        user=""
        deliveryCategoryId={deliveryCategoryId}
        deliveryContact={deliveryContact}
        isOpen={isAddDetailsModelOpen}
        onClose={(success) => {
          onAddDetailsModalClose();
          if (success === true) {
            getNewContactDetails();
          }
        }}
      />
      <AddEditOccasionDetails
        user={user}
        contactId={contactId}
        occasion={occasion}
        isOpen={isAddEditOccasionModelOpen}
        onClose={(success) => {
          setOccasion('');
          onAddEditOccasionModalClose();
          if (success === true) {
            getNewContactDetails();
          }
        }}
      />
      <AddEditAddressDetails
        user={user}
        deliveryContactId={deliveryContactId}
        addressDetails={addressDetails}
        isOpen={isAddEditAddressModelOpen}
        onClose={(success) => {
          setAddressDetails('');
          onAddEditAddressModalClose();
          if (success === true) {
            getNewContactDetails();
          }
        }}
      />

      {updateDeliveryAddressModal && (
        <AddDeliveryContact
          isOpen={updateDeliveryAddressModal}
          updateDeliveryAddressModalClose={updateDeliveryAddressModalClose}
          onAddDetailsModalOpen={onAddDetailsModalOpen}
          onAddEditAddressModalOpen={onAddEditAddressModalOpen}
          setDeliveryContactId={setDeliveryContactId}
        />
      )}
      <Box mt="3">
        <Flex direction={{ base: 'column', lg: 'row' }} px="10">
          <Flex
            w={{ base: '100%', lg: '70%' }}
            direction={{ base: 'column', lg: 'row' }}
          >
            <Box mb="2" mr="3">
              <InputGroup w="260px">
                <Input
                  variant="filled"
                  type="text"
                  placeholder="Search"
                // w="300px"
                />
                <InputRightElement
                  pointerEvents="none"
                  children={<SearchIcon color="#D6D7E3" />}
                />
              </InputGroup>
            </Box>
            <Flex alignItems="center" mb="2" mr="3" w="260px">
              <HStack>
                <Text w="100px"> Contact Type</Text>
              </HStack>
              <Select
                // border= '1px solid #ACABAB !important'
                ml="2"
                // w="260px"
                // variant="filled"
                placeholder="All"
                name="userRole"
                onChange={(event) => {
                  const filterValue = event.target.value;
                  getNewContactDetails(filterValue);
                }}
              >
                <option value="Self">Self</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
                <option value="Colleagues">Colleagues</option>
                <option value="Mentor">Mentor</option>
                <option value="Customers">Customers</option>
                <option value="Employees">Employees</option>
                <option value="Partners">Partners</option>
                <option value="Custom">Custom</option>
              </Select>
            </Flex>
            <Flex mb="2" alignItems="center">
              <Text as="span"> All Reminders</Text>
              <Switch
                ml="2"
                // isDisabled={!(occasions?.items?.length > 0)}
                colorScheme="red"
                id="contact_reminder"
                //  isChecked={!reminderAllChecked.length > 0}
                onChange={(event) => {
                  handleProfileRemindAll({
                    userId: user.userId,
                    occasionReminderProfile: event.target.checked,
                  });
                }}
              />
            </Flex>
          </Flex>
          <Spacer />
          <Box>
            <Button
              onClick={() => {
                setDeliveryContact(null);
                setDeliveryCategoryId(null);
                onAddDetailsModalOpen();
              }}
            >
              Add New
            </Button>
          </Box>
        </Flex>
      </Box>
      {loading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      ) : (
        <>
          {deliveryContacts?.length > 0 ? (
            <Box mt="4">
              <Accordion defaultIndex={[0]} allowToggle width="100%">
                {deliveryContacts?.map((contact) => {
                  const {
                    id,
                    firstName,
                    middleName,
                    lastName,
                    phoneNumber,
                    email,
                    contactCustomType,
                    contactCategory,
                    deliveryAddress,
                    occasions,
                    defaultAddressId,
                  } = contact;

                  const reminderAllChecked = occasions
                    ? occasions?.items.filter((item) => item.reminder === true)
                    : [];

                  return (
                    <AccordionItem key={id}>
                      {({ isExpanded }) => (
                        <>
                          <Box className="accordionItem">
                            <Flex
                              alignItems="center"
                              width="100%"
                              direction={{ base: 'none', lg: 'row' }}
                              ml="8px"
                            >
                              <Flex alignItems="center">
                                <AccordionButton
                                  w="max-content"
                                  m="0px"
                                  p="8px"
                                  _hover={{ background: 'brand.lightpink' }}
                                >
                                  {isExpanded ? (
                                    <MdRemoveCircle font-size="20px" />
                                  ) : (
                                    <MdAddCircle font-size="20px" />
                                  )}
                                </AccordionButton>
                                <Box>
                                  {' '}
                                  <Text textTransform="uppercase" as="h2">
                                    {firstName} {middleName} {lastName}
                                  </Text>
                                </Box>
                                <Tag
                                  ml="4"
                                  pl="3"
                                  pr="3"
                                  boxShadow="inset 0 0 0px 1px #B72618"
                                  borderRadius="full"
                                  bg="White"
                                  color="brand.red"
                                >
                                  <TagLabel fontWeight="bold" fontSize="xs">
                                    {contactCategory}{' '}
                                    {contactCustomType ? ' - ' : ''}
                                    {contactCustomType}
                                  </TagLabel>
                                </Tag>
                              </Flex>
                              <Spacer />
                              {contactCategory !== 'Self' ? (
                                <>
                                  {/* <IconButton
                                    _hover={{ background: 'brand.lightpink' }}
                                    variant="outline"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setDeleteContactConfirmOpen(true);
                                      setSelectedContactId(id);
                                    }}
                                    borderColor="brand.red"
                                    icon={<BsTrash fontSize="20px" />}
                                    p="2"
                                  /> */}
                                  <Menu autoSelect="false">
                                    <MenuButton
                                      as={IconButton}
                                      mr="15px"
                                      p="5px"
                                      borderColor="brand.red"
                                      aria-label="Options"
                                      icon={<FaEllipsisV />}
                                      variant="outline"
                                    />

                                    <MenuList {...menuListStylesProps}>
                                      <MenuItem
                                        _hover={{ bg: 'brand.red' }}
                                        _focus={{ bg: 'brand.red' }}
                                        icon={<EditIcon fontSize="md" />}
                                        onClick={(event) => {
                                          setDeliveryContact(contact);
                                          setDeliveryCategoryId(id);
                                          onAddDetailsModalOpen();
                                        }}
                                      >
                                        Edit
                                      </MenuItem>
                                      <MenuItem
                                        _hover={{ bg: 'brand.red' }}
                                        _focus={{ bg: 'brand.red' }}
                                        icon={<DeleteIcon fontSize="md" />}
                                        onClick={(event) => {
                                          setDeleteContactConfirmOpen(true);
                                          setSelectedContactId(id);
                                        }}
                                      >
                                        Delete
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </>
                              ) : null}
                            </Flex>
                          </Box>

                          <AccordionPanel className="mainBg">
                            <Box mt="4" p="4">
                              <Flex>
                                <Text as="h2" fontWeight="bold">
                                  Occasions
                                </Text>

                                <Divider
                                  ml="4"
                                  mr="4"
                                  h="25px"
                                  w="2px"
                                  bg="#717476"
                                />
                                <FormControl display="flex" alignItems="center">
                                  <FormLabel htmlFor="email-alerts" mb="0">
                                    Reminder
                                  </FormLabel>

                                  <Switch
                                    isDisabled={!(occasions?.items?.length > 0)}
                                    colorScheme="green"
                                    id={id}
                                    isChecked={reminderAllChecked.length > 0}
                                    onChange={(event) => {
                                      handleReminderAll({
                                        customerContactId: id,
                                        reminder: event.target.checked,
                                      });
                                    }}
                                  />
                                </FormControl>
                              </Flex>
                              <Box mt="4">
                                <Flex flexWrap="wrap">
                                  <Button
                                    borderRadius="0px"
                                    className="mainBg"
                                    w="130px"
                                    h="47px"
                                    mr="2"
                                    mb="2"
                                    onClick={() => {
                                      setContactId(id);
                                      setOccasion();
                                      onAddEditOccasionModalOpen();
                                    }}
                                  >
                                    <BsPlus fontSize="3xl" />
                                    <Text as="span"> Add New</Text>
                                  </Button>

                                  {occasions?.items?.length > 0 ? (
                                    <>
                                      {occasions?.items?.map((occasion) => (
                                        <Tag
                                          className="tagItem"
                                          w="130px"
                                          p="2"
                                          mb="2"
                                          key={occasion.occasionTitle}
                                        >
                                          <TagLabel w="100%">
                                            <Flex alignItems="center">
                                              <Text>
                                                {moment(
                                                  occasion.occasionDate,
                                                ).format('MM/DD/YYYY')}
                                              </Text>
                                              <Spacer />
                                              <Menu autoSelect="false">
                                                <MenuButton>
                                                  <FaEllipsisV color="#B72618" />
                                                </MenuButton>
                                                <MenuList
                                                  {...menuListStylesProps}
                                                >
                                                  <MenuItem
                                                    _hover={{ bg: 'brand.red' }}
                                                    _focus={{ bg: 'brand.red' }}
                                                    icon={
                                                      <EditIcon fontSize="md" />
                                                    }
                                                    onClick={() => {
                                                      setOccasion(occasion);
                                                      setContactId(id);
                                                      onAddEditOccasionModalOpen();
                                                    }}
                                                  >
                                                    Edit
                                                  </MenuItem>
                                                  <MenuItem
                                                    _hover={{ bg: 'brand.red' }}
                                                    icon={
                                                      <DeleteIcon fontSize="md" />
                                                    }
                                                    onClick={() => {
                                                      // setSelectedItem(item);
                                                      // setIsBulkDelete(false);
                                                      // deleteConfirmOpen(true);
                                                      setDeleteOcassionConfirmOpen(
                                                        true,
                                                      );
                                                      setSelectedOcassionId(
                                                        occasion.id,
                                                      );
                                                    }}
                                                  >
                                                    Delete
                                                  </MenuItem>
                                                </MenuList>
                                              </Menu>
                                            </Flex>

                                            <Flex mt="2" alignItems="center">
                                              <Text
                                                fontSize="xs"
                                                textTransform="uppercase"
                                                color="brand.red"
                                              >
                                                {occasion.occasionTitle}
                                              </Text>
                                              <Spacer />
                                              {occasion.reminder ? (
                                                <BsClock
                                                  color="#01B032"
                                                  width="12px"
                                                  height="12px"
                                                />
                                              ) : null}
                                            </Flex>
                                          </TagLabel>
                                        </Tag>
                                      ))}
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </Flex>
                              </Box>
                            </Box>
                            <Box mt="4" className="blockBg" px="4" py="6">
                              <Flex direction={{ base: 'column', lg: 'row' }}>
                                <Box mr="3">
                                  <Text fontWeight="bold" as="span">
                                    Mobile Number
                                  </Text>
                                  <Text ml="4" as="span">
                                    {formatPhoneNumberIntl(phoneNumber)}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text fontWeight="bold" as="span">
                                    Email - Id
                                  </Text>
                                  <Text ml="4" as="span">
                                    {email}
                                  </Text>
                                </Box>
                              </Flex>
                            </Box>
                            <Box>
                              <Flex flexWrap="wrap">
                                <Button
                                  h="150px"
                                  w="380px"
                                  mr="5"
                                  mt="5"
                                  variant="dottedBorder-button"
                                  onClick={() => {
                                    setDeliveryContactId(id);
                                    onAddEditAddressModalOpen();
                                  }}
                                >
                                  <BsPlus fontSize="3xl" />
                                  <Text as="span"> Add New</Text>
                                </Button>

                                {deliveryAddress?.items?.length > 0 ? (
                                  <>
                                    {deliveryAddress?.items?.map((address) => (
                                      <Box
                                        w="380px"
                                        className="grid "
                                        key={address.id}
                                        mr="5"
                                        mt="5"
                                      >
                                        <HStack
                                          className="gridHeader"
                                          alignSelf="center"
                                          alignItems="center"
                                          justify={{
                                            base: 'center',
                                            md: 'center',
                                          }}
                                        >
                                          <Flex p={0}>
                                            <Checkbox
                                              borderColor="#BDBDBD"
                                              colorScheme="green"
                                              borderRadius="4"
                                              isChecked={
                                                defaultAddressId === address.id
                                              }
                                              size="lg"
                                              onChange={(event) => {
                                                setDefaultDeliveryAddress({
                                                  defaultAddressId: address.id,
                                                  id,
                                                });
                                                setConfirmDefaultAddressMessage(
                                                  event.target.checked
                                                    ? ' Are you sure you want set this address as Default ?'
                                                    : ' Are you sure you want remove this address as Default ?',
                                                );
                                                setConfirmDefaultAddressOpen(
                                                  true,
                                                );
                                              }}
                                            />
                                            <Text ml="2" fontWeight="bold" w="120px" isTruncated>
                                              {address?.addressType}{' '}
                                              {address?.customType ? ' - ' : ''}
                                              {address?.customType}
                                            </Text>
                                          </Flex>
                                          <Spacer />
                                          <Flex alignItems="center">
                                            <Text
                                              fontWeight="bold"
                                              mr="2"
                                              ml="2"
                                            >
                                              Delivery To
                                            </Text>
                                            {/* {user?.deliveryToId ===
                                            address.id ? (
                                              <RiTruckLine
                                                color="#B72618"
                                                fontSize="25px"
                                              />
                                            ) : (
                                              <RiTruckLine
                                                fontSize="25px"
                                                color="#C4C4C4"
                                              />
                                            )} */}
                                            <Switch
                                              colorScheme="red"
                                              id={address.id}
                                              isChecked={
                                                deliveryToId === address.id
                                              } //! deliveryToChecked}
                                              onChange={(event) => {
                                                if (
                                                  deliveryToId !== address.id
                                                ) {
                                                  handleDeliveryToAddress({
                                                    deliveryAddress,
                                                    userId: user.userId,
                                                    deliveryToId: address.id,
                                                  });
                                                }
                                              }}
                                            />
                                            <Divider
                                              ml="4"
                                              mr="4"
                                              h="25px"
                                              w="1px"
                                              bg="#717476"
                                            />
                                            <Menu autoSelect="false">
                                              <MenuButton>
                                                <FaEllipsisV color="#B72618" />
                                              </MenuButton>
                                              <MenuList
                                                {...menuListStylesProps}
                                              >
                                                <MenuItem
                                                  _hover={{ bg: 'brand.red' }}
                                                  _focus={{ bg: 'brand.red' }}
                                                  icon={
                                                    <EditIcon fontSize="md" />
                                                  }
                                                  onClick={() => {
                                                    setAddressDetails(address);
                                                    setDeliveryContactId(id);
                                                    onAddEditAddressModalOpen();
                                                  }}
                                                >
                                                  Edit
                                                </MenuItem>
                                                <MenuItem
                                                  _hover={{ bg: 'brand.red' }}
                                                  icon={
                                                    <DeleteIcon fontSize="md" />
                                                  }
                                                  onClick={() => {
                                                    if (
                                                      address.id !==
                                                      user?.deliveryToId
                                                    ) {
                                                      setDeleteAddressConfirmOpen(
                                                        true,
                                                      );
                                                      setSelectedAddressId(
                                                        address.id,
                                                      );
                                                    } else {
                                                      toast({
                                                        title: 'Warning',
                                                        description:
                                                          'Select the another address as "Delivery To address" before deleting.',
                                                        status: 'warning',
                                                        isClosable: true,
                                                        duration: 5000,
                                                      });
                                                    }
                                                  }}
                                                >
                                                  Delete
                                                </MenuItem>
                                              </MenuList>
                                            </Menu>
                                          </Flex>
                                        </HStack>
                                        <Flex
                                          p="4"
                                          pr="0"
                                          alignItems="flex-start"
                                          className="blockBg"
                                          spacing="3"
                                          roundedBottom="xl"
                                        >
                                          <Box
                                            w="48%"
                                            borderRight="1px"
                                            borderColor="brand.lightgrey"
                                            pr="5"
                                            mr="5"
                                          >
                                            <Text fontWeight="bold">
                                              {address.firstName}{' '}
                                              {address.middleName}{' '}
                                              {address.lastName}
                                            </Text>
                                            <Text>
                                              {' '}
                                              {address.addrLine1}{' '}
                                              {address.addrLine2} {address.city}
                                            </Text>
                                            <Text>
                                              {' '}
                                              {address.addrState}{' '}
                                              {address.country}{' '}
                                              {address.postCode}{' '}
                                            </Text>
                                          </Box>
                                          {/* <Divider
                                            ml="4"
                                            mr="4"
                                            h="70px"
                                            w="1px"
                                            bg="#717476"
                                          /> */}
                                          <Box
                                            w="50%"
                                            className="blockBg scrollBar"
                                            pl="0"
                                            ml="0"
                                            style={{
                                              '-webkit-overflow-scrolling':
                                                'touch',
                                              'overflow-x': 'auto',
                                              'overflow-y': 'auto',
                                              width: '150px',
                                              height: '100px',
                                              marginLeft: '5px',
                                              marginRight: '0px',
                                            }}
                                          >
                                            <Text
                                              color="brand.red"
                                              textTransform="uppercase"
                                              fontSize="xs"
                                            >
                                              Delivery Instructions
                                            </Text>
                                            <Text>{address.instructions}</Text>
                                          </Box>
                                        </Flex>
                                      </Box>
                                    ))}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </Flex>
                            </Box>
                          </AccordionPanel>
                        </>
                      )}
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Box>
          ) : (
            <Text alignSelf="center" mt={4} ml="6">
              No Contacts added yet{' '}
            </Text>
          )}
        </>
      )}

      <ConfirmationView
        message={confirmDefaultAddressMessage}
        onConfirmClose={() => {
          setConfirmDefaultAddressOpen(false);
        }}
        callbackFunction={() => {
          markAddressDefault(defaultDeliveryAddress);
        }}
        isOpen={confirmDefaultAddressOpen}
        cancelRef={cancelRef}
        submitBtnText="Confirm"
      />

      {/* <ConfirmationView
        message={confirmReminderMessage}
        onConfirmClose={() => {
          setConfirmReminderOpen(false);
          setIsReminderCheck(!isReminderCheck);
        }}
        callbackFunction={() => {
          handleReminderAll(isReminderAll);
        }}
        isOpen={confirmReminderOpen}
        cancelRef={cancelRef}
        submitBtnText="Confirm"
      /> */}

      <ConfirmationView
        message="Are you sure you want to delete the contact?"
        onConfirmClose={() => {
          setDeleteContactConfirmOpen(false);
        }}
        callbackFunction={async () => {
          await deleteContact();
        }}
        submitLoading={isDeleteContactLoading}
        isOpen={deleteContactConfirmOpen}
        cancelRef={cancelRef}
      />
      <ConfirmationView
        message="Are you sure you want to delete this ocassion?"
        onConfirmClose={() => {
          setDeleteOcassionConfirmOpen(false);
        }}
        callbackFunction={async () => {
          await deleteOccasion();
        }}
        submitLoading={isDeleteOcassionLoading}
        isOpen={deleteOcassionConfirmOpen}
        cancelRef={cancelRef}
      />
      <ConfirmationView
        message="Are you sure you want to delete this address?"
        onConfirmClose={() => {
          setDeleteAddressConfirmOpen(false);
        }}
        callbackFunction={async () => {
          await deleteAddress();
        }}
        submitLoading={isDeleteAddressLoading}
        isOpen={deleteAddressConfirmOpen}
        cancelRef={cancelRef}
      />
    </Box>
  );
};

const stateMapper = (state) => ({
  deliveryAddressStatus: state.deliveryAddress?.deliveryAddressStatus,
});

const dispatchMapper = (dispatch) => ({
  setDeliveryTo: dispatch.auth.setDeliveryTo,
  storeDeliveryContacts: dispatch.deliveryContacts.storeDeliveryContacts,
  fetchAndSetUser: dispatch.auth.fetchAndSetUser,
});

export default connect(stateMapper, dispatchMapper)(DeliveryContactDetails);
