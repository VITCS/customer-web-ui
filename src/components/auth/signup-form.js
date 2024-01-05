import { InfoIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  List,
  ListItem,
  Select,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useToast,
  VStack,
  InputRightElement,
  InputGroup,
  Switch,
  RadioGroup,
} from '@chakra-ui/react';
import { API, Auth } from 'aws-amplify';
import Location from 'aws-sdk/clients/location';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import awsExports from '../../aws-exports';
import { searchAddress } from '../../graphql/queries';
import { signUpPage } from '../../utils/resources-en';
import { inputTextStyleProps } from '../../utils/stylesProps';
import VerifyForm from './verify-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const {
  userId,
  firstName,
  middleName,
  lastName,
  passwordDesc,
  confirmPassword,
  phoneNumber,
  emailId,
  next,
} = signUpPage;

const SignUpForm = (props) => {
  const toast = useToast();
  const { switchToSignIn, signup, initialStep, deliveryAddress } = props;
  const [showFinish, setShowFinish] = useState(false);
  const [searchAddrInput, setSearchAddrInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [client, setClient] = useState(null);
  // const passwordSecure = false;
  const [ passwordSecure, setPasswordSecure] = useState(false);
  const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(false);
  // const confirmPasswordSecure = false;
  const [signupState, setSignupState] = useState('signup');
  const [signupLoading, setSignupLoading] = useState(false);
  const [phoneNum, setPhoneNum] = useState('');
  const [addressCustomTypeDisable, setAddressCustomTypeDisable] =
    useState(true);
  const [longLat, setLongLat] = useState([]);
  const [value, setValue] = useState('1');
  const phoneNumberRegex = new RegExp(
    '^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$',
  );
 
  const contactValidationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email')
      .required('Email cannot be empty'),
    password: Yup.string().required('Password cannot be empty'),
    confirmPassword: Yup.string().required('confirmPassword cannot be empty')
      .when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          " Password and Confirm password do not match"
        )
      }),
    username: Yup.string().required('User id cannot be empty'),
    given_name: Yup.string().required('Required'),
    family_name: Yup.string().required('Required'),
    phone_number: Yup.string()
    .required('Please enter Mobile Number')
    .test('editPhoneValidation', 'Invalid Mobile Number Format', (val) => {
      if (val) {
        return !(val.replace(/\ /g, '').length < 12);
      }
    }),
  });

  const [validationSchema, setValidationSchema] = useState(
    contactValidationSchema,
  );

  const formik = useFormik({
    initialValues: {
      username: '',
      given_name: '',
      middle_name: '',
      family_name: '',
      password: '',
      confirmPassword: '',
      country_code: '',
      phone_number: '',
      email: '',
      addressType: '',
      ContactCategory: '',
      firstName: '',
      middleName: '',
      lastName: '',
      addrLine1: '',
      addrLine2: '',
      city: '',
      addrState: '',
      postCode: '',
      country: 'USA',
      cardHolderName: '',
      cardNumber: '',
      ExpDate: '',
      paymentPostCode: '',
      // orderLineitemReplacement: false,
      // subscribeToNotification: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (showFinish) {
          setSignupLoading(true);
          const res = await signup({
            username: values.username,
            given_name: values.given_name,
            middle_name: values.middle_name,
            family_name: values.family_name,
            password: values.password,
            phone_number: values.phone_number,
            email: values.email,
            firstName: values.given_name,
            middleName: values.middle_name,
            lastName: values.family_name,
            addlSignupData: JSON.stringify({
              deliveryContact: {
                addressType: values.addressType,
                ContactCategory: values.ContactCategory,
                address: {
                  addrLine1: values.addrLine1,
                  addrLine2: values.addrLine2,
                  city: values.city,
                  addrState: values.addrState,
                  postCode: values.postCode,
                  country: 'USA',
                  longitude: longLat[0],
                  latitude: longLat[1],
                  markDefault: true,
                },
              },
            }),
            addlPaymentDetails: JSON.stringify({
              paymentSetup: {
                cardHolderName: values.cardHolderName,
                cardNumber: values.cardNumber,
                ExpDate: values.ExpDate,
                postCode: values.paymentPostCode,
              },
            }),
          });

          setPhoneNum(res?.codeDeliveryDetails?.Destination);
          setSignupState('information');

          toast({
            title: 'Successfully created account',
            description: 'Verify with code from your Mobile to move forward',
          });
          setSignupLoading(false);
        }
      } catch (error) {
        setSignupLoading(false);
        toast({
          title: 'Error',
          description:
            error?.message || 'Something went wrong. Please try again',
        });
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setFieldValue,
    validateForm,
    setFieldTouched,
  } = formik;

  const handleOnListItemClick = async (e) => {
    setSearchResults([]);
    const itemClickedStr = e.target.innerText.split(', ');
    setValues({
      ...values,
      addrLine1: itemClickedStr[0],
      city: itemClickedStr[1],
      addrState: itemClickedStr[2].trim(),
      postCode: itemClickedStr[3].trim(),
    });
    setSearchAddrInput('');
    const data = await searchPlace(e.target.innerText);
    setLongLat(data.Results[0].Place.Geometry.Point);
  };

  const validateAddressDetails = () => {
    const valid =
      (values.addressType &&
        // values.firstName &&
        // values.lastName &&
        values.addrLine1 &&
        values.city &&
        values.postCode) !== '';

    if (!valid) {
      toast({
        title: 'Warning',
        description: 'Please enter the required address values',
        duration: 3000,
        isClosable: true,
      });
    }
    return valid;
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

  const handleChangeSearchInput = (e) => {
    setSearchAddrInput(e.target.value);
    debounceSearch(e.target.value);
  };

  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  useEffect(() => {
    if (initialStep === 1) {
      nextStep();
    } else {
      reset();
    }

    const createClient = async () => {
      const credentials = await Auth.currentCredentials();
      const clientData = new Location({
        credentials,
        region: awsExports.aws_project_region,
      });

      setClient(clientData);
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
  }, [initialStep]);

  useEffect(() => {
    validateForm();
  }, [validationSchema]);

  return (
    <Stack px={12}>
      {signupState === 'signup' ? (
        <form onSubmit={handleSubmit}>
          <Stack>
            <h1>Account Setup</h1>
          </Stack>
          <Steps activeStep={activeStep}>
            {/* STEP-1 SignUp */}
            <Step>
              <Stack spacing={4} mt="3">
                <FormControl
                  id="username"
                  isInvalid={!!errors.username && !!touched.username}
                  isRequired
                >
                  <FormLabel display="inline" mr="1">
                    {userId}
                  </FormLabel>
                  <Tooltip
                    hasArrow
                    label="(Ex:-sakula,sridhar420) -  Should be unique &amp; no special charecter allowed."
                    bg="brand.red"
                  >
                    <InfoIcon fontSize="s" color="brand.red" />
                  </Tooltip>
                  <Input
                    variant="filled"
                    autoFocus="true"
                    type="text"
                    name="username"
                    onBlur={handleBlur}
                    value={values.username}
                    onChange={(e) => {
                      setFieldValue('username', e.target.value);
                    }}
                    placeholder="e.g. Michel88"
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>
                <HStack>
                  <FormControl
                    id="given_name"
                    isInvalid={!!errors.given_name && !!touched.given_name}
                    isRequired
                  >
                    <FormLabel>{firstName}</FormLabel>
                    <Input
                      variant="filled"
                      type="text"
                      name="given_name"
                      onBlur={handleBlur}
                      value={values.given_name}
                      onChange={(e) => {
                        setFieldValue('given_name', e.target.value);
                      }}
                      placeholder="e.g. Michel"
                    />
                    <Box h="15px">
                      {' '}
                      <FormErrorMessage>{errors.given_name}</FormErrorMessage>
                    </Box>
                  </FormControl>
                  <FormControl id="middle_name">
                    <FormLabel>{middleName}</FormLabel>
                    <Input
                      variant="filled"
                      type="text"
                      onBlur={handleBlur}
                      value={values.middle_name}
                      onChange={(e) => {
                        setFieldValue('middle_name', e.target.value);
                      }}
                    />
                    <Box h="15px"> </Box>
                  </FormControl>
                  <FormControl
                    id="family_name"
                    isInvalid={!!errors.family_name && !!touched.family_name}
                  >
                    <FormLabel>
                      {lastName}{' '}
                      <Text as="span" color="brand.red">
                        *
                      </Text>
                    </FormLabel>
                    <Input
                      variant="filled"
                      type="text"
                      name="family_name"
                      onBlur={handleBlur}
                      value={values.family_name}
                      onChange={(e) => {
                        setFieldValue('family_name', e.target.value);
                      }}
                      placeholder="e.g. Bryn"
                    />
                    <Box h="15px">
                      {' '}
                      <FormErrorMessage> {errors.family_name}</FormErrorMessage>
                    </Box>
                  </FormControl>
                </HStack>
                <FormControl
                  id="password"
                  isInvalid={!!errors.password && !!touched.password}
                  isRequired
                >
                  <FormLabel display="inline" mr="1">
                    {passwordDesc}
                  </FormLabel>
                  <Tooltip
                    hasArrow
                    label="Min Length 6, One Numerical, One Caps, One Special Chatacter."
                    bg="brand.red"
                  >
                    <InfoIcon fontSize="s" color="brand.red" />
                  </Tooltip>
                  <InputGroup>
                  <Input
                    variant="filled"
                    type={!passwordSecure ? 'password' : 'text'}
                    onBlur={handleBlur}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="Please enter password"
                  />
                  <InputRightElement>
            <Button
              tabIndex="-1"
              color="brand.black"
              variant="link"
              onClick={() => {
                setPasswordSecure(!passwordSecure);
              }}
            >
              {passwordSecure ? <FaEye /> : <FaEyeSlash />}
            </Button>
          </InputRightElement>
          </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <FormControl
                  id="confirmPassword"
                  isInvalid={
                    !!errors.confirmPassword && touched.confirmPassword
                  }
                  isRequired
                >
                  <FormLabel display="inline">{confirmPassword}</FormLabel>
                   <InputGroup>
                  <Input
                    variant="filled"
                    type={!confirmPasswordSecure ? 'password' : 'text'}
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onChange={handleChange}
                    placeholder="Please Re-enter password"
                  />
                   <InputRightElement>
            <Button
              tabIndex="-1"
              color="brand.black"
              variant="link"
              onClick={() => {
                setConfirmPasswordSecure(!confirmPasswordSecure);
              }}
            >
              {confirmPasswordSecure ? <FaEye /> : <FaEyeSlash />}
            </Button>
          </InputRightElement>
          </InputGroup>
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>
                <FormControl
                  id="email"
                  isInvalid={!!errors.email && !!touched.email}
                  isRequired
                >
                  <FormLabel>{emailId}</FormLabel>
                  <Input
                    variant="filled"
                    type="email"
                    name="email"
                    onBlur={handleBlur}
                    value={values.email}
                    onChange={(e) => {
                      setFieldValue('email', e.target.value);
                    }}
                    placeholder="e.g. example@1800spirits.com"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <HStack color="#7e7c7c">
                  <FormControl
                    id="phone_number"
                    isInvalid={!!errors.phone_number && !!touched.phone_number}
                    isRequired
                  >
                    <FormLabel>
                      {phoneNumber}
                    </FormLabel>
                    {/* <HStack>
                      <Input variant='filled'
                        type="text"
                        width="70px"
                        onBlur={handleBlur}
                        id="country_code"
                        name="country_code"
                        value={values.country_code}
                        onChange={(e) => {
                          setFieldValue('country_code', e.target.value);
                        }}
                        placeholder="+1"
                      />
                      <Input
                        variant="filled"
                        type="text"
                        onBlur={handleBlur}
                        value={values.phone_number}
                        onChange={(e) => {
                          setFieldValue('phone_number', e.target.value);
                        }}
                        placeholder="e.g. 1234567891"
                      />
                    </HStack> */}
                    <PhoneInput
                  color="#363636"
                  specialLabel={''}
                  countryCodeEditable={false}
                  country="us"
                  value={values.phone_number}
                  name="phone_number"
                  inputStyle={{ width: '100%' }}
                  onBlur={() => {
                    setFieldTouched('phone_number', true);
                  }}
                  onChange={(value, country, e, formattedValue) => {
                    const tempValue = `+${value}`;
                    setFieldValue('phone_number', tempValue);
                  }}
                />
                    <FormErrorMessage>{errors.phone_number}</FormErrorMessage>
                  </FormControl>
                </HStack>
              </Stack>
            </Step>
            {/* STEP-2 SignUp */}
            <Step>
              <Stack spacing={4} mt="3">
                <Box position="relative">
                  <FormControl id="searchAddressInput">
                    <Input
                      variant="filled"
                      type="text"
                      onChange={handleChangeSearchInput}
                      placeholder="Type your address here"
                      value={searchAddrInput}
                    />
                    <Text as="span" fontSize="sm" color="brand.red">
                      Addresses on routes - type US Highway / route / state route - for accurate search
                    </Text>
                  </FormControl>
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
                <HStack>
                  <FormControl
                    id="addressType"
                    isInvalid={!!errors.addressType && !!touched.addressType}
                    isRequired
                  >
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
                        setFieldValue('contactCategory', '');
                        setFieldValue('addressType', event.target.value);
                      }}
                    >
                      <option value="">-Select-</option>
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Custom">Custom</option>
                    </Select>
                    <FormErrorMessage>{errors.addressType}</FormErrorMessage>
                  </FormControl>
                  <FormControl id="ContactCategory">
                    <FormLabel>&nbsp;</FormLabel>
                    <Input
                      variant="filled"
                      isDisabled={addressCustomTypeDisable}
                      type="text"
                      name="contactCategory"
                      onBlur={handleBlur}
                      value={values.ContactCategory}
                      onChange={(e) => {
                        setFieldValue('ContactCategory', e.target.value);
                      }}
                    />
                  </FormControl>
                </HStack>
                <HStack>
                  <FormControl
                    id="addrLine1"
                    isInvalid={!!errors.addrLine1 && !!touched.addrLine1}
                    isRequired
                  >
                    <FormLabel>Address Line 1</FormLabel>
                    <Input
                      variant="filled"
                      disabled
                      type="text"
                      name="addrLine1"
                      onBlur={handleBlur}
                      value={values.addrLine1}
                      onChange={(e) => {
                        setFieldValue('addrLine1', e.target.value);
                      }}
                      placeholder="e.g. addrLine1"
                    />
                    <FormErrorMessage>{errors.addrLine1}</FormErrorMessage>
                  </FormControl>
                  <FormControl id="addrLine2">
                    <FormLabel>Address Line 2</FormLabel>
                    <Input
                      variant="filled"
                      type="text"
                      onBlur={handleBlur}
                      value={values.addrLine2}
                      onChange={(e) => {
                        setFieldValue('addrLine2', e.target.value);
                      }}
                    />
                  </FormControl>
                </HStack>
                <HStack>
                  <FormControl
                    id="city"
                    isInvalid={!!errors.city && !!touched.city}
                    isRequired
                  >
                    <FormLabel>City or Town</FormLabel>
                    <Input
                      variant="filled"
                      type="text"
                      disabled
                      onBlur={handleBlur}
                      name="city"
                      value={values.city}
                      onChange={(e) => {
                        setFieldValue('city', e.target.value);
                      }}
                      placeholder="e.g. city"
                    />{' '}
                    <FormErrorMessage>{errors.city}</FormErrorMessage>
                  </FormControl>

                  <FormControl id="" isRequired>
                    <FormLabel>State</FormLabel>
                    <Input
                      variant="filled"
                      type="text"
                      disabled
                      onBlur={handleBlur}
                      name="addrState"
                      value={values.addrState}
                      onChange={(e) => {
                        setFieldValue('addrState', e.target.value);
                      }}
                      placeholder="e.g. State"
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
                    </Select> */}
                  </FormControl>

                  <FormControl
                    id="postCode"
                    isInvalid={!!errors.postCode && !!touched.postCode}
                    isRequired
                  >
                    <FormLabel>Zip Code</FormLabel>
                    <Input
                      variant="filled"
                      type="text"
                      disabled
                      onBlur={handleBlur}
                      name="postCode"
                      value={values.postCode}
                      onChange={(e) => {
                        setFieldValue('postCode', e.target.value);
                      }}
                      placeholder="e.g. postCode"
                    />{' '}
                    <FormErrorMessage>{errors.postCode}</FormErrorMessage>
                  </FormControl>
                </HStack>
              </Stack>
            </Step>
            <Step>
              <Stack spacing={4} mt="8" mb='10'>
                {/* <h2 color="brand.red">Optional </h2> */}
                <HStack>
                <Text fontSize="md">
                Automatically replace out of stock product in an order with
              similar product
            </Text>
            <Switch size='md' name='orderLineitemReplacement'
            isChecked={values.orderLineitemReplacement}
            onChange={(event) => {
              setFieldValue('orderLineitemReplacement', event.target.checked);
            }} />
            </HStack>

            <HStack>
               <Text fontSize="md">
               Subscribe to notifications/text messages
               </Text>
               <Switch size='md' name='subscribeToNotification' 
               isChecked={values.subscribeToNotification}
               onChange={(event) => {
                 setFieldValue('subscribeToNotification', event.target.checked);
               }} />
               </HStack>
              </Stack>
            </Step>
          </Steps>

          <Stack spacing={10}>
            <Flex pb="8" mt="4">
              <Box>
                <Button
                  variant="cancel-button"
                  onClick={() => switchToSignIn()}
                  borderColor="brand.red"
                  color="brand.red"
                >
                  Back to Login
                </Button>
              </Box>
              <Spacer />
              <Box>
                {activeStep >= 1 ? (
                  <>
                    <Button
                      onClick={() => {
                        setShowFinish(false);
                        prevStep(1);
                      }}
                    >
                      Previous
                    </Button>
                    {showFinish ? (
                      <Button
                        isLoading={signupLoading}
                        onClick={() => {
                          handleSubmit();
                        }}
                        ml="2"
                      >
                        Finish
                      </Button>
                    ) : (
                      <Button
                        ml="2"
                        onClick={() => {
                          if (validateAddressDetails()) {
                            nextStep(1);
                            setShowFinish(true);
                          }
                        }}
                      >
                        {next}
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    {activeStep !== 0 ? (
                      <Button
                        onClick={() => {
                          setShowFinish(false);
                          prevStep(1);
                        }}
                      >
                        Previous
                      </Button>
                    ) : (
                      <></>
                    )}

                    <Button
                      ml="2"
                      onClick={() => {
                        handleSubmit();
                        if (formik.isValid) {
                          nextStep(1);
                        }
                      }}
                    >
                      {next}
                    </Button>
                  </>
                )}
              </Box>
            </Flex>
          </Stack>
        </form>
      ) : signupState === 'verification' ? (
        <VerifyForm
          username={values.username}
          phoneNumberValue={phoneNum}
          switchToSignIn={switchToSignIn}
        />
      ) : signupState === 'information' ? (
        <Flex direction="column" roundedTopLeft="10" roundedBottomRight="10">
          <VStack textAlign="center" spacing="3" p="10" h="400px" mt="10">
            <Text fontSize="xl">
              We took the previlage of enabling notifications/text messages and
              automatically replacing with similiar product in case of any item
              in your order is out of stock, You can always change these setting
              from your my account settings
            </Text>
            <Flex pb="8" direction="row" pt="5">
              <Box>
                <Button
                  type="submit"
                  _hover={{ background: 'brand.red' }}
                  onClick={() => {
                    setSignupState('verification');
                  }}
                  data-cy="verifyNotificationBtn"
                >
                  Ok
                </Button>
              </Box>
            </Flex>
          </VStack>
        </Flex>
      ) : null}
    </Stack>
  );
};

const stateMapper = (state) => ({
  deliveryAddress: state.deliveryAddress?.deliveryAddress,
});

const dispatchMapper = (dispatch) => ({
  signup: dispatch.auth.signUp,
});

export default connect(stateMapper, dispatchMapper)(SignUpForm);
