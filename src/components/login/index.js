import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spacer,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ForgotPasswordForm from '../auth/forget-password';
import SignInForm from '../auth/sign-form/signin-form';
import SignUpForm from '../auth/signup-form';
import SocialSignUpForm from '../auth/social-login-signup';

const LoginView = ({
  user,
  initUser,
  onLoginViewClose,
  isOpen,
  viewState = 'signin',
  setViewState,
  userObj,
  socialLoginViewClose,
}) => {
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        setPageLoading(true);
        if (!user) {
          setPageLoading(false);
          return;
        }
        await Auth.currentAuthenticatedUser();
        initUser().then(() => {
          navigate('/');
          setPageLoading(false);
        });
      } catch (error) {
        setPageLoading(false);
      }
    }
    check();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody p="0" m="0" className="blockBg" borderRadius="20px">
          <Stack>
            <Flex>
              <Box p="4" />
              <Spacer />
              <Box
                px="4"
                bg="brand.red"
                color="White"
                roundedBottomLeft="lg"
                lineHeight="30px"
                fontSize="lg"
                letterSpacing="0.25em"
                height="31px"
              >
                Customer Login
              </Box>
            </Flex>

            {pageLoading ? (
              <VStack>
                <Spinner />
                <Text>Loading...</Text>
              </VStack>
            ) : pageError ? (
              <Text>Something went wrong... Please try refreshing</Text>
            ) : (
              <>
                {viewState === 'signin' ? (
                  <SignInForm
                    onLoginViewClose={onLoginViewClose}
                    switchToSignUp={() => setViewState('signup')}
                    switchToForgotPassword={() =>
                      setViewState('forgot-password')
                    }
                  />
                ) : viewState === 'signup' ? (
                  <SignUpForm
                    onLoginViewClose={onLoginViewClose}
                    switchToSignIn={() => setViewState('signin')}
                    initialStep={0}
                  />
                ) : viewState === 'forgot-password' ? (
                  <ForgotPasswordForm
                    onLoginViewClose={onLoginViewClose}
                    swichToLogin={() => setViewState('signin')}
                  />
                ) : viewState === 'socialsignup' ? (
                  <SocialSignUpForm
                    onLoginViewClose={onLoginViewClose}
                    swichToLogin={() => setViewState('signin')}
                    initialStep={0}
                    userObj={userObj}
                    socialLoginViewClose={socialLoginViewClose}
                  />
                ) : null}
              </>
            )}

            <Box w="35%" h="1" bg="brand.red" roundedTopRight="md" />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const stateMapper = (state) => ({
  user: state.auth?.user,
});

const dispatchMapper = (dispatch) => ({
  // fetchAndSetUser: dispatch.auth.fetchAndSetUser,
});

export default connect(stateMapper, dispatchMapper)(LoginView);
