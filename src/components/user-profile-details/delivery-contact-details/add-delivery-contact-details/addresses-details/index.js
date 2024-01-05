/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  List,
  ListItem,
  Select,
  Text,
} from '@chakra-ui/react';
import { API, Auth } from 'aws-amplify';
import Location from 'aws-sdk/clients/location';
import { FieldArray } from 'formik';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { BsFillXSquareFill, BsPlus } from 'react-icons/bs';
import awsExports from '../../../../../aws-exports';
import { searchAddress } from '../../../../../graphql/queries';
import { inputTextStyleProps } from '../../../../../utils/stylesProps';
import TextField from '../../../../common/text-field';

const AddaddressesDetails = ({ formik, deliveryAddress }) => {
  const [addressCustomTypeDisable, setAddressCustomTypeDisable] =
    useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [client, setClient] = useState(null);

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
    debounceSearch(e.target.value);
  };

  useEffect(() => {
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
      values.addresses[1] = {
        addrLine1: address?.addrLine1,
        city: address?.city,
        addrState: address?.addrState,
        postCode: address?.postCode,
      };
      setValues({
        ...values,
      });
    }
  }, []);

  const { values, handleBlur, handleChange, setValues, setFieldValue } = formik;

  const handleOnListItemClick = async (e, index) => {
    setSearchResults([]);
    const prefillData = e.target.innerText.split(',');

    document.getElementById(`searchInput${index}`).value = '';
    const data = await searchPlace(e.target.innerText);
    const latLong = data.Results[0].Place.Geometry.Point;
    values.addresses[index] = {
      addrLine1: prefillData[0].trim(),
      city: prefillData[1].trim(),
      addrState: prefillData[2].trim(),
      postCode: prefillData[3].trim(),
      longitude: latLong[0],
      latitude: latLong[1],
    };
    setValues({
      ...values,
    });
  };

  return (
    <Box mt="4">
      <FieldArray
        name="addresses"
        render={({ insert, remove, push }) => (
          <Box mt="4">
            {/* add node button */}
            <Button
              h="145px"
              w="100%"
              variant="dottedBorder-button"
              onClick={() =>
                push({
                  addressType: '',
                  // customType: "",
                  firstName: '',
                  middleName: '',
                  lastName: '',
                  addrLine1: '',
                  addrLine2: '',
                  city: '',
                  addrState: '',
                  postCode: '',
                  longitude: '',
                  latitude: '',
                  country: 'USA',
                  instructions: '',
                  markDefault: '',
                })
              }
            >
              <BsPlus fontSize="3xl" />
              <Text as="span"> Add New</Text>
            </Button>
            {values?.addresses?.length > 0 &&
              values?.addresses.map((address, index) => (
                <Box mt="4" key={index} borderWidth="2px" p="4">
                  <Box key={index} position="relative">
                    <Input
                      variant="filled"
                      type="text"
                      id={`searchInput${index}`}
                      onChange={handleSearchInputChange}
                      placeholder="Type your address here"
                      mb="10px"
                      key={index}
                    />
                    <Text as="span" fontSize="sm" color="brand.red" mt="0">
                      Addresses on routes - type US Highway / route / state route - for accurate search
                    </Text>
                    {searchResults &&
                      searchResults.length > 0 &&
                      document.getElementById(`searchInput${index}`).value !==
                      '' ? (
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
                        id={`searchInput${index}`}
                      >
                        <List spacing={3}>
                          {searchResults.map((eachResult, idx) => (
                            <ListItem
                              key={idx}
                              cursor="pointer"
                              onClick={(e) => handleOnListItemClick(e, index)}
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
                  <HStack mt="4">
                    <FormControl id="" isRequired w="250px">
                      <FormLabel>Address Type</FormLabel>
                      <Select
                        border='1px solid #ACABAB !important'
                        type="text"
                        name={`addresses.${index}.addressType`}
                        onBlur={handleBlur}
                        value={values.addresses[index].addressType || ''}
                        // onChange={handleChange}
                        onChange={(event) => {
                          setAddressCustomTypeDisable(
                            !(event.target.value === 'Custom'),
                          );
                          setFieldValue(`addresses.${index}.customType`, '');
                          setFieldValue(
                            `addresses.${index}.addressType`,
                            event.target.value,
                          );
                          // handleChange();
                        }}
                      >
                        <option value="">-Select-</option>
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Custom">Custom</option>
                      </Select>
                      {formik.touched?.addresses && formik.errors?.addresses ? (
                        <Box className="error">
                          {formik.errors?.addresses[index]?.addressType}
                        </Box>
                      ) : null}
                    </FormControl>
                    <FormControl id="" w="250px">
                      <FormLabel>&nbsp;</FormLabel>
                      <Input
                        variant="filled"
                        isDisabled={addressCustomTypeDisable}
                        type="text"
                        name={`addresses.${index}.customType`}
                        onBlur={handleBlur}
                        value={values.addresses[index].customType}
                        placeholder="e.g. Custom Type"
                        onChange={handleChange}
                      />
                      {/* <TextField
                        formik={formik}
                        label=""
                        name={`addresses.${index}.customType`}
                        type="text"
                        placeholder="Custom"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.addresses[index].customType}
                      /> */}
                    </FormControl>
                    <FormControl id="" w="250px">
                      <FormLabel>&nbsp;</FormLabel>
                      <Checkbox
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={`addresses.${index}.markDefault`}
                        defaultChecked={values.addresses[index].markDefault}
                        colorScheme="customRed"
                      >
                        <Text width="10%" as="span">
                          Make as a default
                        </Text>
                      </Checkbox>
                    </FormControl>
                    <IconButton
                      _hover={{ background: 'brand.lightpink' }}
                      variant="outline"
                      onClick={() => remove(index)}
                      borderColor="brand.red"
                      icon={
                        <BsFillXSquareFill fontSize="20px" color="#B72618" />
                      }
                      p="2"
                    />
                  </HStack>
                  <HStack mt="4" alignItems="baseline">
                    <TextField
                      isRequired
                      formik={formik}
                      label="First Name"
                      name={`addresses.${index}.firstName`}
                      type="text"
                      placeholder="First Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.addresses[index].firstName}
                    />
                    <TextField
                      formik={formik}
                      label="Middle Name"
                      name={`addresses.${index}.middleName`}
                      type="text"
                      placeholder="Middle Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.addresses[index].middleName}
                    />
                    <TextField
                      isRequired
                      formik={formik}
                      label="Last Name"
                      name={`addresses.${index}.lastName`}
                      type="text"
                      placeholder="Last Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.addresses[index].lastName}
                    />
                  </HStack>
                  <HStack mt="4" alignItems="baseline">
                    <TextField
                      disabled
                      isRequired
                      formik={formik}
                      label="Address Line 1"
                      name={`addresses.${index}.addrLine1`}
                      type="text"
                      placeholder="Address Line 1"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.addresses[index].addrLine1}
                    />
                    <TextField
                      formik={formik}
                      label="Address Line 2"
                      name={`addresses.${index}.addrLine2`}
                      type="text"
                      placeholder="Address Line 2"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.addresses[index].addrLine2}
                    />
                    <TextField
                      disabled
                      isRequired
                      formik={formik}
                      label="City or Town"
                      name={`addresses.${index}.city`}
                      type="text"
                      placeholder="City or Town"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.addresses[index].city}
                    />

                    <FormControl id="" isRequired>
                      <TextField
                        disabled
                        isRequired
                        formik={formik}
                        label="State"
                        name={`addresses.${index}.addrState`}
                        type="text"
                        placeholder="State"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.addresses[index].addrState}
                      />
                      {/* <FormLabel>State</FormLabel>
                      <Select
                         
                        type="text"
                        name={`addresses.${index}.addrState`}
                        onBlur={handleBlur}
                        value={values.addresses[index].addrState}
                        onChange={(event) => {
                          setFieldValue(
                            `addresses.${index}.addrState`,
                            event.target.value,
                          );
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
                      name={`addresses.${index}.postCode`}
                      type="text"
                      placeholder="Zip Code"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.addresses[index].postCode}
                    />
                    <Input
                      variant="filled"
                      name={`addresses.${index}.longitude`}
                      type="hidden"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.addresses[index].longitude}
                    />
                    <Input
                      variant="filled"
                      name={`addresses.${index}.latitude`}
                      type="hidden"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.addresses[index].latitude}
                    />
                  </HStack>
                  <HStack mt="4" alignItems="baseline">
                    <TextField
                      formik={formik}
                      label="Delivery Instructions"
                      name={`addresses.${index}.instructions`}
                      type="text"
                      placeholder="Delivery Instructions"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.addresses[index].instructions}
                    />
                  </HStack>
                </Box>
              ))}
          </Box>
        )}
      />
    </Box>
  );
};

export default AddaddressesDetails;
