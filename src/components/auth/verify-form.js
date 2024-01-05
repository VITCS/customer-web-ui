/* eslint-disable no-nested-ternary */
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { signUpPage } from '../../utils/resources-en';
import { inputTextStyleProps } from '../../utils/stylesProps';
import { updateConfirmSignup } from '../../graphql/mutations';
import awsExports from '../../aws-exports';

const { verfication, mobileVerification, verificationCodeText, resentOTP } =
  signUpPage;

const VerifyForm = (props) => {
  const toast = useToast();
  const { switchToSignIn, username, phoneNumberValue, verifyFromSignIn } =
    props;
  const [phoneNum, setPhoneNum] = useState(phoneNumberValue);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      code: '',
    },
    onSubmit: async (values) => {
      try {
        setVerifyLoading(true);
        await Auth.confirmSignUp(username, values.code);
        const confirmSignupResp = graphqlOperation(updateConfirmSignup, {input: {
          username,
        }});
        API.graphql({
          ...confirmSignupResp,
          authMode: 'API_KEY',
          authToken: awsExports.aws_appsync_apiKey,
        });
        toast({
          title: 'Successfully verified your mobile',
          status: 'success',
          description: 'Sign in to get started',
        });
        setTimeout(() => {
          setVerifyLoading(false);
          switchToSignIn();
        }, 1000);
      } catch (error) {
        setVerifyLoading(false);
        toast({
          title: 'Something went wrong in verifying ',
          description: 'Please try again',
          status: 'error',
        });
        // setSignupState("signup")
      }
    },
  });

  const { values, handleBlur, handleSubmit, setFieldValue } = formik;

  const [counter, setCounter] = useState(59);
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const resendVerifyCode = useCallback(async () => {
    if (username) {
      try {
        const res = await Auth.resendSignUp(username);
        setCounter(59);
        setPhoneNum(res?.CodeDeliveryDetails?.Destination);
        toast({
          title: 'Successfully verified your mobile',
          status: 'success',
          description: 'Sign in to get started',
        });
      } catch (error) {
        if (error.code === 'UserNotFoundException') {
          // setIsSigningIn(false);
        }
        toast({
          title: 'Error',
          description:
            error?.message || 'Something went wrong. Please try again',
        });
      }
    }
  }, [username, toast]);

  useEffect(() => {
    if (verifyFromSignIn === 'true') {
      resendVerifyCode();
    }
  }, [resendVerifyCode, verifyFromSignIn]);

  return (
    <Stack px={12}>
      <form onSubmit={handleSubmit}>
        <Stack>
          <Heading fontSize="xl">{verfication}</Heading>
        </Stack>
        <Stack direction="column" pb="10">
          <Text
            alignItems="initial"
            color="brand.red"
          >{`${verificationCodeText} ${phoneNum}`}</Text>
          <FormControl id="code">
            <FormLabel>{mobileVerification}</FormLabel>
            <Input
              variant="filled"
              value={values.code}
              onBlur={handleBlur}
              onChange={(e) => {
                setFieldValue('code', e.target.value);
              }}
              placeholder="Please enter OTP"
            />
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
                  onClick={() => switchToSignIn()}
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
                  data-cy="verifyBtn"
                >
                  Verify
                </Button>
              </Box>
            </Flex>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

const stateMapper = () => ({});

const dispatchMapper = (dispatch) => ({
  signup: dispatch.auth.signUp,
});

export default connect(stateMapper, dispatchMapper)(VerifyForm);
