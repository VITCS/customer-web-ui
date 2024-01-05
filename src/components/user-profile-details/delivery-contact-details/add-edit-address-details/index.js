import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Input,
  List,
  ListItem,
  Select,
  Stack,
  useToast,
  Text,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import Location from 'aws-sdk/clients/location';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import awsExports from '../../../../aws-exports';
import {
  createCustomerAddress,
  updateCustomerAddress,
} from '../../../../graphql/mutations';
import { searchAddress } from '../../../../graphql/queries';
import * as CartService from '../../../../services/cart-service';
import { graphql } from '../../../../utils/api';
import { inputTextStyleProps } from '../../../../utils/stylesProps';
import getFormErrorFocus from '../../../common/FormikOnError';
import TextField from '../../../common/text-field';

const AddEditAddressDetailsMemo = (propValues) => {
  const {
    addressDetails,
    isOpen,
    onClose,
    deliveryContactId,
    cart,
    deliveryAddressStatus,
    setCartInvalidFlag,
    updateDeliveryAddressStatus,
    deliveryAddress,
  } = propValues;
  const toast = useToast();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [addressCustomTypeDisable, setAddressCustomTypeDisable] =
    useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [client, setClient] = useState(null);
  const [longLat, setLongLat] = useState([]);
  const [inputText, setInputText] = useState('');

  const formik = useFormik({
    initialValues: {
      addressType: '',
      customType: '',
      firstName: '',
      middleName: '',
      lastName: '',
      addrLine1: '',
      addrLine2: '',
      city: '',
      addrState: '',
      postCode: '',
      country: 'USA',
      instructions: '',
      markDefault: '',
    },
    validationSchema: Yup.object({
      addressType: Yup.string().required('Address Type cannot be empty'),
      firstName: Yup.string().required('First Name cannot be empty'),
      lastName: Yup.string().required('Last Name cannot be empty'),
      addrLine1: Yup.string().required('Address Line 1 cannot be empty'),
      city: Yup.string().required('City cannot be empty'),
      addrState: Yup.string().required('State cannot be empty'),
      postCode: Yup.string().required('ZipCode cannot be empty'),
    }),
    onSubmit: async (values, helpers) => {
      setSubmitLoading(true);
      try {
        if (addressDetails) {
          await graphql(
            graphqlOperation(updateCustomerAddress, {
              input: {
                id: addressDetails.id,
                addressType: values.addressType,
                customType: values.customType,
                firstName: values.firstName,
                middleName: values.middleName,
                lastName: values.lastName,
                addrLine1: values.addrLine1,
                addrLine2: values.addrLine2,
                city: values.city,
                addrState: values.addrState,
                postCode: values.postCode,
                longitude: longLat[0],
                latitude: longLat[1],
                country: 'USA',
                instructions: values.instructions,
                markDefault: values.markDefault,
                customerContactId: deliveryContactId,
              },
            }),
          );
          toast({
            title: 'Success',
            description: 'Address Updated successfully.',
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
        } else {
          const { data } = await graphql(
            graphqlOperation(createCustomerAddress, {
              input: {
                addressType: values.addressType,
                customType: values.customType,
                firstName: values.firstName,
                middleName: values.middleName,
                lastName: values.lastName,
                addrLine1: values.addrLine1,
                addrLine2: values.addrLine2,
                city: values.city,
                addrState: values.addrState,
                postCode: values.postCode,
                longitude: longLat[0],
                latitude: longLat[1],
                country: 'USA',
                instructions: values.instructions,
                customerContactId: deliveryContactId,
                markDefault: false,
              },
            }),
          );
          toast({
            title: 'Success',
            description: 'Address Created successfully.',
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
        }

        onClose(true);
        setSubmitLoading(false);
      } catch (error) {
        setSubmitLoading(false);
        console.log('Address Details ::addRes::error', error);
        toast({
          title: 'Error',
          description: 'Error in Address adding',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        onClose(false);
      }
      helpers.resetForm();
    },
  });
  const {
    values,
    handleBlur,
    resetForm,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
  } = formik;
  const closeAndResetValues = async (bool) => {
    setValues('');
    onClose(bool);
    resetForm();
    if (deliveryAddressStatus?.status === 'add') {
      setCartInvalidFlag(await CartService.setInvalidCartFlag(cart));
      navigate(`/availabilitysearch/${cart.id}`);
    }
  };

  const searchAddressFunc = async (str) => {
    try {
      const data = await API.graphql({
        query: searchAddress,
        variables: {
          input: {
            searchStr: str,
          },
        },
        authMode: 'API_KEY',
        authToken: awsExports.aws_appsync_apiKey,
      });

      setSearchResults(data?.data?.searchAddress?.items);
    } catch (err) {
      console.log(err);
    }
  };

  const searchPlace = async (place) => {
    const params = {
      IndexName: awsExports.aws_geo_mapIndexName,
      MaxResults: 10,
      Text: place,
    };

    try {
      const addrData = await client.searchPlaceIndexForText(params).promise();
      return addrData;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const debounceSearch = debounce(
    (searchText) => searchAddressFunc(searchText),
    300,
  );

  const handleSearchInputChange = (e) => {
    setInputText(e.target.value);
    debounceSearch(e.target.value);
  };

  const handleOnListItemClick = async (e) => {
    setSearchResults([]);
    setInputText('');
    const prefillData = e.target.innerText.split(',');
    setFieldValue('addrLine1', prefillData[0].trim());
    setFieldValue('city', prefillData[1].trim());
    setFieldValue('addrState', prefillData[2].trim());
    setFieldValue('postCode', prefillData[3].trim());

    // setValues({
    //   addrLine1: prefillData[0],
    //   city: prefillData[1],
    //   addrState: prefillData[2],
    //   postCode: prefillData[3],
    // });
    const data = await searchPlace(e.target.innerText);
    setLongLat(data.Results[0].Place.Geometry.Point);
  };

  useEffect(() => {
    if (addressDetails) {
      setValues({ addressType: addressDetails.addressType,
        customType: addressDetails.customType,
        firstName: addressDetails.firstName,
        middleName: addressDetails.middleName,
        lastName: addressDetails.lastName,
        addrLine1: addressDetails.addrLine1,
        addrLine2: addressDetails.addrLine2,
        city: addressDetails.city,
        addrState: addressDetails.addrState,
        postCode: addressDetails.postCode,
        longLat: addressDetails.longitude,
        longLat: addressDetails.latitude,});
      setAddressCustomTypeDisable(
        !(addressDetails.addressType === 'Custom'),
      );
    }

    const createClient = async () => {
      const credentials = await Auth.currentCredentials();
      const clientRes = new Location({
        credentials,
        region: awsExports.aws_project_region,
      });

      setClient(clientRes);
    };

    createClient();

    if (deliveryAddress) {
      const address = deliveryAddress?.address;
      setValues({
        ...values,
        addrLine1: address?.addrLine1,
        city: address?.city,
        addrState: address?.addrState,
        postCode: address?.postCode,
      });
    }
  }, [addressDetails, setValues]);

  useEffect(() => {
    getFormErrorFocus(formik);
  }, [formik.isSubmitting]);

  return (
    <Box>
      <Drawer
        closeOnOverlayClick={false}
        closeOnEsc={false}
        placement="right"
        isOpen={isOpen}
        onClose={() => {
          closeAndResetValues();
        }}
        size="md"
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
            <form onSubmit={handleSubmit}>
              <Box bg="brand.red" color="White" p="3" pl="4">
                <h2>{addressDetails ? 'Edit Address' : 'Add New Address'}</h2>
              </Box>
              <Stack align="flex-start" p="4">
                <Box w="100%" position="relative">
                  <Input
                    variant="filled"
                    type="text"
                    onChange={handleSearchInputChange}
                    value={inputText}
                    placeholder="Type your address here"
                  />
                  <Text as="span" fontSize="sm" color="brand.red" mt="0">
                    Addresses on routes - type US Highway / route / state route - for accurate search
                  </Text>
                  {searchResults && searchResults.length > 0 ? (
                    <Box
                      alignItems="right"
                      position="absolute"
                      top="36px"
                      left="0px"
                      bg="White"
                      style={{ border: '1px solid #ACABAB' }}
                      p="5"
                      w="100%"
                      zIndex="99999"
                    >
                      <List spacing={3}>
                        {searchResults.map((eachResult, idx) => (
                          <ListItem
                            key={idx}
                            cursor="pointer"
                            onClick={handleOnListItemClick}
                          >
                            {`${eachResult.street_line}, ${eachResult.city}, ${eachResult.state}, ${eachResult.zipcode}`}
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Box>
                <FormControl id="" isRequired>
                  <FormLabel>Address Type</FormLabel>
                  <Select
                    type="text"
                    name="addressType"
                    onBlur={handleBlur}
                    value={values.addressType || ''}
                    onChange={(event) => {
                      setAddressCustomTypeDisable(
                        !(event.target.value === 'Custom'),
                      );
                      setFieldValue('customType', '');
                      setFieldValue('addressType', event.target.value);
                    }}
                  >
                    <option value="">-Select-</option>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Custom">Custom</option>
                  </Select>
                  {formik.touched.addressType && formik.errors.addressType ? (
                    <Box className="error">{formik.errors.addressType}</Box>
                  ) : null}
                </FormControl>
                <FormControl id="">
                  <Input
                    variant="filled"
                    isDisabled={addressCustomTypeDisable}
                    type="text"
                    name="customType"
                    onBlur={handleBlur}
                    value={values.customType || ''}
                    placeholder="e.g. Custom Type"
                    onChange={handleChange}
                  />
                </FormControl>
                {/* <TextField
                  formik={formik}
                  label=""
                  name="customType"
                  type="text"
                  placeholder="Custom"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.customType || ''}
                /> */}
                <TextField
                  isRequired
                  formik={formik}
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="firstName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstName || ''}
                />
                <TextField
                  formik={formik}
                  label="Middle Name"
                  name="middleName"
                  type="text"
                  placeholder="middleName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.middleName || ''}
                />
                <TextField
                  isRequired
                  formik={formik}
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="lastName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName || ''}
                />
                <HStack>
                  <TextField
                    disabled
                    isRequired
                    formik={formik}
                    label="Address Line 1"
                    name="addrLine1"
                    type="text"
                    placeholder="Address Line 1"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.addrLine1 || ''}
                  />
                  <TextField
                    formik={formik}
                    label="Address Line 2"
                    name="addrLine2"
                    type="text"
                    placeholder="Address Line 2"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.addrLine2 || ''}
                  />
                </HStack>
                <HStack>
                  <TextField
                    disabled
                    isRequired
                    formik={formik}
                    label="City or Town"
                    name="city"
                    type="text"
                    placeholder="city"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.city || ''}
                  />

                  <FormControl id="" isRequired>
                    {/* <FormLabel>State</FormLabel> */}
                    <TextField
                      disabled
                      isRequired
                      formik={formik}
                      label="State"
                      name="addrState"
                      type="text"
                      placeholder="State"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.addrState || ''}
                    />
                    {/* <Select
                       
                      type="text"
                      name="addrState"
                      onBlur={handleBlur}
                      value={values.addrState || ''}
                      onChange={(event) => {
                        setFieldValue('addrState', event.target.value);
                      }}
                    >
                      <option value="">-Select-</option>
                      {stateOptions.map((st) => (
                        <option value={st.value} key={st.value}>
                          {st.label}
                        </option>
                      ))}
                    </Select>
                    {formik.touched.addrState && formik.errors.addrState ? (
                      <Box className="error">{formik.errors.addrState}</Box>
                    ) : null} */}
                  </FormControl>

                  <TextField
                    disabled
                    isRequired
                    formik={formik}
                    label="Zip Code"
                    name="postCode"
                    type="text"
                    placeholder="Zip Code"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.postCode || ''}
                  />
                </HStack>
                <TextField
                  formik={formik}
                  label="Delivery Instructions"
                  name="instructions"
                  type="text"
                  placeholder="Delivery Instructions"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.instructions || ''}
                />

                {/* <Checkbox
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="markDefault"
                  defaultChecked={values.markDefault}
                  colorScheme="customRed"
                >
                  <Text width="10%" as="span">
                    Make as a default
                  </Text>
                </Checkbox> */}
                <HStack p={3} alignSelf="flex-end">
                  <Button variant="cancel-button" onClick={closeAndResetValues}>
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
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
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

const AddEditAddressDetails = memo(
  connect(stateMapper, dispatchMapper)(AddEditAddressDetailsMemo),
);

export default AddEditAddressDetails;
