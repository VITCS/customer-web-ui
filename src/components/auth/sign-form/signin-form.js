import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { ImFacebook } from 'react-icons/im';
import { connect } from 'react-redux';
import { getCustomerContactStatus } from '../../../services/user-service';
import { signInPage } from '../../../utils/resources-en';
import VerifyForm from '../verify-form';
import SigninFormWithEmail from './signin-form-email';
import SigninFormWithMobile from './signin-form-mobile';
import SigninFormWithUserId from './signin-form-userId';

const { signin, userId, mobileNumber, emailId, signup, forgotPassword, login } =
  signInPage;

const SignInForm = (props) => {
  const {
    fetchAndSetUser,
    fetchAndSetCart,
    switchToSignUp,
    switchToForgotPassword,
    onLoginViewClose,
    deliveryAddress,
    cart,
    updateDeliveryAddressStatus,
  } = props;
  const [signInState, setSigninState] = useState('signinUserId');
  const [userName, setUserName] = useState('');
  const [userNameInput, setUserNameInput] = useState();
  const [passwordInput, setPasswordInput] = useState();
  const toast = useToast();
  const [loginLoading, setLoginLoading] = useState(false);

  function signInStateChange(signInStateValue, userNameValue) {
    setSigninState(signInStateValue);
    setUserName(userNameValue);
  }

  const signIn = async ({ username, password }) => {
    try {
      setLoginLoading(true);

      await Auth.signIn({
        username,
        password,
      });

      await Auth.currentAuthenticatedUser();
      const user = await fetchAndSetUser();
      if (user) {
        await fetchAndSetCart(user.userId);
      }

      toast({
        title: 'Success',
        description: '',
      });

      navigate('/');
      onLoginViewClose();
      setLoginLoading(false);

      // If Cart exists and DeliveryTo added then redirect to pages after login.
      if (cart && deliveryAddress && deliveryAddress.address) {
        const contactsRes = await getCustomerContactStatus(
          username,
          deliveryAddress,
        );
        updateDeliveryAddressStatus(contactsRes);
        if (contactsRes.status === 'add') {
          navigate('/userprofile/delivery');
        }
      }
    } catch (error) {
      setLoginLoading(false);

      if (error.code === 'UserNotConfirmedException') {
        signInStateChange('verification', username);
      } else {
        toast({
          title: 'Error',
          description:
            error?.message || 'Something went wrong. Please try again',
          status: 'error',
        });
      }
    }
  };

  const formik = useFormik({
    initialValues: { userId: '', password: '', countryCode: '+1' },
    onSubmit: () => {
      signIn({
        username: userNameInput,
        password: passwordInput,
      });
    },
  });

  const handleSocialLogin = async (providerName) => {
    try {
      setLoginLoading(true);
      await Auth.federatedSignIn({
        provider: providerName,
      });
      setLoginLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const { handleSubmit } = formik;

  return (
    <Stack px={12}>
      {signInState === 'signinUserId' ? (
        <>
          <Stack>
            <h1>{signin}</h1>
          </Stack>
          <form onSubmit={handleSubmit}>
            <Box>
              <Stack spacing={4} mt="3">
                <Tabs isFitted isLazy>
                  <TabList>
                    <Tab
                      fontWeight="bold"
                      _selected={{
                        color: 'brand.red',
                        borderBottomColor: 'brand.red',
                        boxShadow: 'none',
                      }}
                    >
                      <h2> {userId}</h2>
                    </Tab>
                    <Tab
                      fontWeight="bold"
                      _selected={{
                        color: 'brand.red',
                        borderBottomColor: 'brand.red',
                        boxShadow: 'none',
                      }}
                    >
                      <h2> {mobileNumber}</h2>
                    </Tab>
                    <Tab
                      fontWeight="bold"
                      _selected={{
                        color: 'brand.red',
                        borderBottomColor: 'brand.red',
                        boxShadow: 'none',
                      }}
                    >
                      <h2> {emailId}</h2>
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel alignItems="start">
                      <SigninFormWithUserId
                        formik={formik}
                        setUserNameInput={setUserNameInput}
                        setPasswordInput={setPasswordInput}
                      />
                    </TabPanel>
                    <TabPanel>
                      <SigninFormWithMobile
                        formik={formik}
                        setUserNameInput={setUserNameInput}
                        setPasswordInput={setPasswordInput}
                      />
                    </TabPanel>
                    <TabPanel>
                      <SigninFormWithEmail
                        formik={formik}
                        setUserNameInput={setUserNameInput}
                        setPasswordInput={setPasswordInput}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Stack>
              <Stack spacing={4}>
                <Stack align="flex-end" justify="space-between">
                  <Button
                    color="brand.red"
                    variant="link"
                    fontWeight="normal"
                    onClick={() => switchToForgotPassword()}
                  >
                    {forgotPassword}
                  </Button>
                </Stack>
                <Flex pb="8" direction="row">
                  <Box flexGrow="2">
                    <Button
                      variant="cancel-button"
                      data-cy="skipNowBtn"
                      onClick={() => onLoginViewClose()}
                    >
                      Skip Now
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      variant="cancel-button"
                      onClick={() => switchToSignUp()}
                      data-cy="signUpBtn"
                    >
                      {signup}
                    </Button>
                  </Box>
                  <Box ml="3">
                    <Button
                      isLoading={loginLoading}
                      type="submit"
                      _hover={{ background: 'brand.red' }}
                      data-cy="loginBtn"
                    >
                      {login}
                    </Button>
                  </Box>
                </Flex>
              </Stack>
            </Box>

            <Stack direction="row" justifyContent="right" alignItems="center">
              <Divider
                orientation="horizontal"
                width="50px"
                borderColor="#767676"
              />
              <Text>Or sign in using one of these sites</Text>
            </Stack>
            <HStack spacing={5} justifyContent="flex-end" mt="15px" mb="20px">
              <Button
                variant="outline"
                onClick={() =>
                  handleSocialLogin(CognitoHostedUIIdentityProvider.Google)
                }
                boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
              >
                <FcGoogle className="socialIcon" />
              </Button>
              {/* Facebook */}
              <Button
                variant="outline"
                onClick={() =>
                  handleSocialLogin(CognitoHostedUIIdentityProvider.Facebook)
                }
                boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
              >
                <ImFacebook className="socialIcon" color="#385C8E" />
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  handleSocialLogin(CognitoHostedUIIdentityProvider.Apple)
                }
                boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
              >
                <FaApple className="socialIcon" />
              </Button>
            </HStack>
          </form>
        </>
      ) : signInState === 'verification' ? (
        <VerifyForm
          username={userName}
          switchToSignIn={() => setSigninState('signinUserId')}
          verifyFromSignIn="true"
        />
      ) : null}
    </Stack>
  );
};

const stateMapper = (state) => ({
  deliveryAddress: state.deliveryAddress?.deliveryAddress,
  cart: state.cart.cart,
});

const dispatchMapper = (dispatch) => ({
  fetchAndSetUser: dispatch.auth.fetchAndSetUser,
  fetchAndSetCart: dispatch.cart.fetchAndSetCart,
  updateDeliveryAddressStatus:
    dispatch.deliveryAddress.updateDeliveryAddressStatus,
});

export default connect(stateMapper, dispatchMapper)(SignInForm);
