import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signUpPage } from '../../utils/resources-en';
import { inputTextStyleProps } from '../../utils/stylesProps';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { updateForgetPassword } from '../../graphql/mutations';
import awsExports from '../../aws-exports';

export const USER_QUERY = `
  query getUser($userId:ID!){
    getMerchantUser(userId:$userId) {
        firstName
    }
  }
`;

const { confirmPassword, resentOTP } = signUpPage;

const ForgotPasswordForm = (props) => {
  const { swichToLogin } = props;
  const toast = useToast();
  const [passwordSecure, setPasswordSecure] = useState(false);
  const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(false);
  const [forgotPasswordState, setForgotPasswordState] = useState('signup');
  const [sendVerifyCodeLoading, setsendVerifyCodeLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [value, setValue] = useState('mobileNumber');
  const requestforgotPassword = async ({ username }) => {
    try {
      setsendVerifyCodeLoading(true);
      const forgotPasswordRes = await Auth.forgotPassword(username);
      setForgotPasswordState('verification');
      toast({
        title: 'Success',
        description: value === "emailId" ? 'Verify with code from emailId to set New Password' : "Verify with code from phone to set New Password",
      });
      setsendVerifyCodeLoading(false);
    } catch (error) {
      setsendVerifyCodeLoading(false);
      console.log('error is ', error);
      toast({
        title: 'Error',
        description: error?.message || 'Something went wrong. Please try again',
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      code: '',
      newpassword: '',
      confirmPassword: '',
    },
    onSubmit: (values) => {
      requestforgotPassword({
        username: values.username,
      });
    },
  });

  const { values, handleBlur, handleSubmit, handleChange, setFieldValue } = formik;
  const verifyCode = async () => {
    try {
      if(values.confirmPassword?.length > 0 &&
        values.newpassword === values.confirmPassword){
      setVerifyLoading(true);
      const res = await Auth.forgotPasswordSubmit(
        values.username,
        values.code,
        values.newpassword,
      );
      const updatePassWestResp = graphqlOperation(updateForgetPassword, {input: {
        type: 'password',
        password: values.newpassword,
        username: values.username,
      }});
      API.graphql({
        ...updatePassWestResp,
        authMode: 'API_KEY',
        authToken: awsExports.aws_appsync_apiKey,
      });
      toast({
        title: 'Successfully Created New Password',
        status: 'success',
        description: 'Sign in to get started',
      });
      setTimeout(() => {
        setVerifyLoading(false);
        swichToLogin();
      }, 1000);
    }
    } catch (error) {
      setVerifyLoading(false);
      toast({
        title: 'Something went wrong in verifying ',
        description: 'Please try again',
        status: 'error',
      });
    }
  };

  const [counter, setCounter] = useState(59);
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const resendVerifyCode = async () => {
    try {
      setVerifyLoading(true);
      const res = await Auth.forgotPassword(values.username);
      setCounter(59);
      toast({
        title: 'Successfully',
        status: 'success',
        description: 'Successfully sent verificationcode',
      });
      setTimeout(() => {
        setVerifyLoading(false);
      }, 1000);
    } catch (error) {
      setVerifyLoading(false);
      console.log('[verifyCode] :: error ', error);
      toast({
        title: 'Something went wrong in verifying ',
        description: 'Please try again',
        status: 'error',
      });
    }
  };

  return (
    <Box px={12}>
      {forgotPasswordState === 'signup' ? (
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Forgot Password Request
          </Text>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Text fontWeight="bold" mb={2}>
                Choose below options to send verification code
              </Text>
              <RadioGroup onChange={(val)=>{
                setFieldValue('username', '');
                setValue(val);}} value={value}>
                <Stack direction="row">
                  <Radio value="mobileNumber" colorScheme="red">
                    Mobile Number
                  </Radio>
                  <Radio value="emailId" colorScheme="red">
                    Email Id
                  </Radio>
                </Stack>
              </RadioGroup>
              {value === 'mobileNumber' && (
                <>
                  <FormControl id="mobileNumberValue" isRequired>
                    <FormLabel>Enter Mobile Number</FormLabel>
                    {/* <PhoneInput
                      defaultCountry="US"
                      name="username"
                      international
                      placeholder="Please Enter Mobile Number"
                      value={values.username}
                      onBlur={handleBlur}
                      onChange={(val) => {
                        setFieldValue('username', val);
                      }} /> */}
                      <PhoneInput
                  specialLabel={''}
                  countryCodeEditable={false}
                  country="us"
                  value={values.phone_number}
                  name="phone_number"
                  inputStyle={{ width: '100%' }}
                  onBlur={handleBlur}
                  onChange={(value, country, e, formattedValue) => {
                    const tempValue = `+${value}`;
                    setFieldValue('username', tempValue);
                  }}
                />
                  </FormControl>
                </>
              )}
              {value === 'emailId' && (
                <>
                  <FormControl id="emailId" isRequired>
                    <FormLabel>Enter Email Id</FormLabel>
                    <Input
                      variant="filled"
                      type="text"
                      onBlur={handleBlur}
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      placeholder="Please enter email id"
                    />
                  </FormControl>
                </>
              )}

              <Stack spacing={10}>
                <Flex pb="8">
                  <Box>
                    <Button
                      variant="cancel-button"
                      borderColor="brand.red"
                      color="brand.red"
                      onClick={() => swichToLogin()}
                    >
                      Back to Login
                    </Button>
                  </Box>
                  <Spacer />
                  <Box>
                    <Button
                      isLoading={sendVerifyCodeLoading}
                      type="submit"
                      _hover={{ background: 'brand.red' }}
                    >
                      Send
                    </Button>
                  </Box>
                </Flex>
              </Stack>
            </Stack>
          </form>
        </Box>
      ) : forgotPasswordState === 'verification' ? (
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Verification process
          </Text>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyCode();
            }}
          >
            <Stack direction="column" spacing={3}>
              <Text mb={2} color="brand.red" align="start">
                Verification code sent to your Email & Mobile
              </Text>
              <FormControl id="code" isRequired>
                <FormLabel>Enter verification code</FormLabel>
                <Input
                  variant="filled"
                  placeholder="Enter verification code"
                  value={values.code}
                  onBlur={handleBlur}
                  name="code"
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel> New password</FormLabel>
                <InputGroup>
                  <Input
                    variant="filled"
                    type={!passwordSecure ? 'password' : 'text'}
                    onBlur={handleBlur}
                    value={values.newpassword}
                    name="newpassword"
                    onChange={handleChange}
                    placeholder="Please enter password"
                  />
                  <InputRightElement>
                    <Button
                      tabIndex="-1"
                      color="Black"
                      variant="link"
                      onClick={() => {
                        setPasswordSecure(!passwordSecure);
                      }}
                    >
                      {passwordSecure ? <FaEye /> : <FaEyeSlash />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl
                id="password"
                isInvalid={
                  values.confirmPassword?.length > 0 &&
                  values.newpassword !== values.confirmPassword
                }
                isRequired
              >
                <FormLabel>{confirmPassword}</FormLabel>
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
                      color="Black"
                      variant="link"
                      onClick={() => {
                        setConfirmPasswordSecure(!confirmPasswordSecure);
                      }}
                    >
                      {confirmPasswordSecure ? <FaEye /> : <FaEyeSlash />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {' '}
                  Password and confirm password do not match{' '}
                </FormErrorMessage>
              </FormControl>
              <Stack spacing={4}>
                <Stack align="flex-end" justify="space-between">
                  <HStack>
                    <Text color="brand.red">00:{counter}</Text>
                    <Button
                      color="brand.red"
                      variant="link"
                      disabled={counter !== 0}
                      onClick={() => resendVerifyCode()}
                    >
                      {resentOTP}
                    </Button>
                  </HStack>
                </Stack>
                <Flex pb="8">
                  <Box>
                    <Button
                      variant="cancel-button"
                      borderColor="brand.red"
                      color="brand.red"
                      onClick={() => swichToLogin()}
                    >
                      Back to Login
                    </Button>
                  </Box>
                  <Spacer />
                  <Box>
                    <Button
                      isLoading={verifyLoading}
                      type="submit"
                      _hover={{ background: 'brand.red' }}
                    >
                      Verify
                    </Button>
                  </Box>
                </Flex>
              </Stack>
            </Stack>
          </form>
        </Box>
      ) : null
      }
    </Box >
  );
};

export default ForgotPasswordForm;
