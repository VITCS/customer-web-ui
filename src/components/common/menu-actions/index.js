import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import {
  Box,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from '@chakra-ui/react';
import { graphqlOperation } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { FaEllipsisV, FaHome } from 'react-icons/fa';
import { updatePaymentDetails } from '../../../graphql/mutations';
import { getCustomerPaymentByCustomerProfileId } from '../../../graphql/queries';
import { graphql } from '../../../utils/api';
import { menuListStylesProps } from '../../../utils/stylesProps';

const MenuActions = ({
  item,
  setSelectedItem,
  onAddEditItemModalOpen,
  deleteConfirmOpen,
  onDetailsDrawerOpen,
  setIsBulkDelete,
  getDefaultCardsPresent,
  setCardsData,
  setIsDefaultCardPresent,
  type,
  defaultCard,
  setCardDefaultUpdated,
  setDefaultCardRoot,
}) => {
  const toast = useToast();

  const [defaultItem, setDefaultItem] = useState(null);

  useEffect(() => {
    if (type === 'payment-card') {
      const defaultItemFromRoot = defaultCard();
      setDefaultItem(defaultItemFromRoot);
    }
  }, [type, defaultCard, setCardsData]);

  const updateCardDefaultValue = async () => {
    if (defaultItem && defaultItem.id !== item.id) {
      setDefaultItem(item);
      setDefaultCardRoot(item);
      toast({
        title: 'Updating the default card',
        status: 'info',
        duration: 700,
      });
      try {
        // Remove the old card as default
        const dataRemove = await graphql(
          graphqlOperation(updatePaymentDetails, {
            input: {
              ...defaultItem,
              cardDefault: false,
            },
          }),
        );

        console.log('Old card removed as default:: ', dataRemove);

        // Add the new card as default
        const dataAdd = await graphql(
          graphqlOperation(updatePaymentDetails, {
            input: {
              ...item,
              cardDefault: true,
            },
          }),
        );

        console.log('New card added as default:: ', dataAdd);
      } catch (err) {
        console.log(err);
      }
    } else if (defaultItem && defaultItem.id === item.id) {
      setDefaultItem(null);
      setDefaultCardRoot(null);
      toast({
        title: 'Removing the default card',
        status: 'info',
        duration: 700,
      });
      try {
        // Remove the current card as default
        const data = await graphql(
          graphqlOperation(updatePaymentDetails, {
            input: {
              ...item,
              cardDefault: false,
            },
          }),
        );

        console.log('Current card removed as default:: ', data);
      } catch (err) {
        console.log(err);
      }
    } else {
      setDefaultItem(item);
      setDefaultCardRoot(item);
      toast({
        title: 'Adding the default card',
        status: 'info',
        duration: 700,
      });
      try {
        // Add the card as default
        const data = await graphql(
          graphqlOperation(updatePaymentDetails, {
            input: {
              ...item,
              cardDefault: true,
            },
          }),
        );

        console.log('Current card added as default:: ', data);
      } catch (err) {
        console.log(err);
      }
    }

    console.log(defaultItem);

    // Fire the query to load the cards and set them
    const dataQuery = await graphql(
      graphqlOperation(getCustomerPaymentByCustomerProfileId, {
        userId: item.userId,
      }),
    );

    console.log('New cards fetched from menu actions:: ', dataQuery);

    // Set the cards
    setCardsData(dataQuery?.data?.CustomerPaymentByCustomerProfileId?.items);
  };

  // const updateCardDefaultValue = async () => {
  //   setItemId(item.id);
  //   setDefaultCardIdRoot(item.id);
  //   setIsDefaultCardPresent(!item.cardDefault);
  //   setCardDefaultUpdated([true, !item.cardDefault]);

  //   if (item.cardDefault) {
  //     toast({
  //       title: 'Removing the default card',
  //       description: 'The selected card is being removed as default',
  //       status: 'info',
  //       isClosable: true,
  //       duration: '500',
  //     });
  //   } else {
  //     toast({
  //       title: 'Adding the card as default',
  //       description: 'The selected card is being added as default',
  //       status: 'info',
  //       isClosable: true,
  //       duration: '500',
  //     });
  //   }

  //   const data = await graphql(
  //     graphqlOperation(updatePaymentDetails, {
  //       input: {
  //         id: item.id,
  //         cardHolderName: item.cardHolderName,
  //         cardNumber: item.cardNumber,
  //         expDate: item.expDate,
  //         cardDefault: !item.cardDefault,
  //         postalCode: item.postalCode,
  //       },
  //     }),
  //   );

  //   if (item.cardDefault) {
  //     toast({
  //       title: 'Card removed as default',
  //       status: 'success',
  //       isClosable: true,
  //       duration: '700',
  //     });
  //   } else {
  //     toast({
  //       title: 'Card added as default',
  //       status: 'success',
  //       isClosable: true,
  //       duration: '700',
  //     });
  //   }

  //   console.log(data);

  //   const dataQuery = await graphql(
  //     graphqlOperation(getCustomerPaymentByCustomerProfileId, {
  //       userId: item.userId,
  //     }),
  //   );
  //   setCardsData(dataQuery?.data?.CustomerPaymentByCustomerProfileId?.items);
  // };

  return (
    <Box>
      <Menu autoSelect="false">
        <MenuButton>
          <FaEllipsisV />
        </MenuButton>
        <MenuList {...menuListStylesProps}>
          <MenuItem
            _hover={{ bg: 'brand.red' }}
            _focus={{ bg: 'brand.red' }}
            icon={<EditIcon fontSize="md" />}
            onClick={() => {
              console.log('Edit User details in actions', item);
              setSelectedItem(item);
              onAddEditItemModalOpen();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            _hover={{ bg: 'brand.red' }}
            icon={<DeleteIcon fontSize="md" />}
            onClick={() => {
              setSelectedItem(item);
              deleteConfirmOpen(true);
            }}
          >
            Delete
          </MenuItem>
          {type === 'payment-card' ? (
            <MenuItem
              _hover={{ bg: 'brand.red' }}
              icon={<Icon as={FaHome} fontSize="md" />}
              onClick={async () => {
                setSelectedItem(item);
                await updateCardDefaultValue();
                // if (getDefaultCardsPresent() && item.id === itemId) {
                //   await updateCardDefaultValue();
                // } else if (getDefaultCardsPresent() && item.id !== itemId) {
                //   return toast({
                //     title: 'There is a default card present.',
                //     description:
                //       'You cannot create more than one default card.',
                //     status: 'error',
                //     isClosable: true,
                //   });
                // } else {
                //   await updateCardDefaultValue();
                // }
              }}
            >
              Default
            </MenuItem>
          ) : (
            <MenuItem
              _hover={{ bg: 'brand.red' }}
              icon={<ViewIcon fontSize="md" />}
              onClick={() => {
                setSelectedItem(item);
                onDetailsDrawerOpen();
              }}
            >
              View
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default MenuActions;
