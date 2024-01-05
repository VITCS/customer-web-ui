import { graphqlOperation } from '@aws-amplify/api-graphql';
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  HStack,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { FormikProvider, useFormik } from 'formik';
import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import {
  createCustomerContactAddressOccasion,
  updateCustomerContact,
} from '../../../../graphql/mutations';
import * as CartService from '../../../../services/cart-service';
import { graphql } from '../../../../utils/api';
import getFormErrorFocus from '../../../common/FormikOnError';
import AddaddressesDetails from './addresses-details';
import CategoryDetails from './category-details';
import OccasionsDetails from './occasions-details';
import PhoneInput, { isValidPhoneNumber, formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input'

const AddDeliveryContactDetailsMemo = (props) => {
  const {
    isOpen,
    onClose,
    user,
    cart,
    deliveryCategoryId,
    deliveryContact,
    deliveryAddressStatus,
    setCartInvalidFlag,
    updateDeliveryAddressStatus,
    deliveryAddress,
  } = props;
  const toast = useToast();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [occasionValues, setOccasionValues] = useState([]);
  const contactEditModeValidationSchema = Yup.object({
    contactCategory: Yup.string().required('Required'),
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    phoneNumber: Yup.string().required(
      'Please enter Mobile Number',
    ).test('phoneValidation', 'Invalid Mobile Number Format', (val) => {
      if (val && val.length > 3) {
        return isValidPhoneNumber(val);
      }
    }),
    email: Yup.string().email('Invalid email address').required('Required'),
  });
  const contactAddModeValidationSchema = Yup.object({
    contactCategory: Yup.string().required('Required'),
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    phoneNumber: Yup.string().required(
      'Please enter Mobile Number',
    ).test('editPhoneValidation', 'Invalid Mobile Number Format', (val) => {
      if (val && val.length > 3) {
        return isValidPhoneNumber(val);
      }
    }),
    email: Yup.string().email('Invalid email address').required('Required'),
    addresses: Yup.array()
      .of(
        Yup.object().shape({
          addressType: Yup.string().required('Required'),
          firstName: Yup.string().required('Required'),
          lastName: Yup.string().required('Required'),
          addrLine1: Yup.string().required('Required'),
          city: Yup.string().required('Required'),
          addrState: Yup.string().required('Required'),
          postCode: Yup.string().required('Required'),
          // country: Yup.string().required('Required'),
        }),
      )
      .required(),
  });

  const formik = useFormik({
    initialValues: {
      contactCategory: '',
      contactCustomType: '',
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      addresses: [],
    },
    validationSchema: deliveryContact
      ? contactEditModeValidationSchema
      : contactAddModeValidationSchema,
    onSubmit: async (values, helpers) => {
      // let successMessage = '';

      try {
        values.userId = user.userId;

        if (deliveryContact) {
          setSubmitLoading(true);
          delete values.deliveryAddress;
          delete values.occasions;
          delete values.customType;
          values.id = deliveryCategoryId;
          await graphql(
            graphqlOperation(updateCustomerContact, {
              input: values,
            }),
          );
          setSubmitLoading(false);
          onClose(true);
          toast({
            title: 'Success',
            description: 'Customer Contact Updated successfully.',
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
        } else if (values.addresses.length > 0) {
          setSubmitLoading(true);
          const addressInput = [...values.addresses];
          delete values.addresses;
          delete values.customType;
          const occasionInput = occasionValues;
          const contactInput = values;
          const customerInput = {
            CustomerContactInput: contactInput,
            CustomerOccasionInput: occasionInput,
            CustomerAddressInput: addressInput,
          };

          await graphql(
            graphqlOperation(createCustomerContactAddressOccasion, {
              input: customerInput,
            }),
          );
          setSubmitLoading(false);
          onClose(true);
          toast({
            title: 'Success',
            description: 'Customer Contact Created successfully.',
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
          helpers.resetForm();
        } else {
          toast({
            title: 'Warning',
            description: 'Add atleast one address',
            status: 'warning',
            duration: 4000,
            isClosable: true,
          });
        }
      } catch (error) {
        setSubmitLoading(false);
        console.log('Customer Contact Details ::addRes::error', error);
        toast({
          title: 'Error',
          description: 'Error in Customer Contact adding',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        onClose(false);
      }
    },
  });
  const {
    values,
    handleBlur,
    handleChange,
    resetForm,
    handleSubmit,
    setValues,
    setFieldValue,
  } = formik;
  const closeAndResetValues = async (bool) => {
    onClose(bool);
    if (deliveryAddressStatus?.status === 'add') {
      setCartInvalidFlag(await CartService.setInvalidCartFlag(cart));
      navigate(`/ availabilitysearch / ${cart.id} `);
    }

    resetForm();
  };

  useEffect(() => {
    if (deliveryContact) {
      const { phoneNumber } = deliveryContact;
      setValues({
        ...deliveryContact,
      });
      // setValues(deliveryContact);
    } else {
      resetForm();
    }
  }, [deliveryContact, setValues, resetForm]);

  useEffect(() => {
    getFormErrorFocus(formik);
  }, [formik.isSubmitting]);

  return (
    <FormikProvider value={formik}>
      <form onSubmit={handleSubmit}>
        <Box>
          <Drawer
            closeOnOverlayClick={false}
            closeOnEsc={false}
            placement="right"
            isOpen={isOpen}
            onClose={() => {
              closeAndResetValues();
            }}
            size="xl"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton
                color="White"
                onClose={() => {
                  closeAndResetValues();
                }}
              />
              <DrawerBody p="0" className="blockBg">
                <Box bg="brand.red" color="White" p="3" pl="4">
                  <h2>
                    {deliveryContact
                      ? 'Edit delivery contact'
                      : 'Add new delivery contact'}
                  </h2>
                </Box>
                <Stack align="flex-start">
                  {deliveryContact ? (
                    <Box mt="4" mb="4" pl="4" pr="4">
                      <Text as="h2" fontWeight="bold">
                        CATEGORY
                      </Text>

                      <CategoryDetails
                        {...{ handleChange, handleBlur, formik, setFieldValue }}
                        // formik={...{formik}}
                        contactCategory={values.contactCategory}
                        customeValue={values.customeValue}
                        firstName={values.firstName}
                        middleName={values.middleName}
                        lastName={values.lastName}
                        phoneNumber={values.phoneNumber}
                        email={values.email}
                      />
                    </Box>
                  ) : (
                    <>
                      <Box mt="4" mb="4" pl="4" pr="4">
                        <Text as="h2" fontWeight="bold">
                          CATEGORY
                        </Text>

                        <CategoryDetails
                          {...{
                            handleChange,
                            handleBlur,
                            formik,
                            setFieldValue,
                          }}
                          // formik={...{formik}}
                          contactCategory={values.contactCategory}
                          contactCustomType={values.contactCustomType}
                          customeValue={values.customeValue}
                          firstName={values.firstName}
                          middleName={values.middleName}
                          lastName={values.lastName}
                          phoneNumber={values.phoneNumber}
                          email={values.email}
                        />
                      </Box>
                      <Divider />
                      <Box mt="4" mb="4" pl="4" pr="4" width="100%">
                        <Text as="h2" fontWeight="bold">
                          ADDRESSES
                        </Text>
                        <AddaddressesDetails
                          formik={formik}
                          deliveryAddress={deliveryAddress}
                        />
                      </Box>
                      <Divider />
                      <Box mt="4" pl="4" pr="4">
                        <Text as="h2" fontWeight="bold">
                          OCCASIONS
                        </Text>
                        <OccasionsDetails
                          {...{ setOccasionValues }}
                          occasionValues={occasionValues}
                        />
                      </Box>
                    </>
                  )}
                  <HStack p={3} alignSelf="flex-end">
                    <Button
                      variant="cancel-button"
                      onClick={closeAndResetValues}
                    >
                      Cancel
                    </Button>
                    <Button
                      _hover={{ background: 'brand.red' }}
                      type="submit"
                      mr={3}
                      isLoading={submitLoading}
                      onClick={() => {
                        if (deliveryAddressStatus?.status) {
                          updateDeliveryAddressStatus(null);
                        }
                        handleSubmit();
                      }}
                    >
                      Save
                    </Button>
                  </HStack>
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
      </form>
    </FormikProvider>
  );
};

const stateMapper = (state) => ({
  user: state.auth.user,
  cart: state.cart.cart,
  cartInvalidFalg: state.cart.cartInvalidFlag,
  deliveryAddress: state.deliveryAddress?.deliveryAddress,
  deliveryAddressStatus: state.deliveryAddress?.deliveryAddressStatus,
});

const dispatchMapper = (dispatch) => ({
  setCartInvalidFlag: dispatch.cart.setCartInvalidFlag,
  updateDeliveryAddressStatus:
    dispatch.deliveryAddress.updateDeliveryAddressStatus,
});

const AddDeliveryContactDetails = memo(
  connect(stateMapper, dispatchMapper)(AddDeliveryContactDetailsMemo),
);

export default AddDeliveryContactDetails;
