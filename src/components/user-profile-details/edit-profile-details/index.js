import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import  { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { updateCustomerProfile, updateEmailVerification } from '../../../graphql/mutations';
import getFormErrorFocus from '../../common/FormikOnError';

const EditProfileDetails = (props) => {
  const { user, fetchAndSetUser, isOpen, onClose } = props;
  const [submitLoading, setSubmitLoading] = useState(false);
  const toast = useToast();
  const [isConfirmOpen, setConfirmOpen] = React.useState(false);
  const [verifyAttr, setVerifyAttr] = useState('');
  const emailRegex = new RegExp('[a-z0-9]+@[a-z0-9]+[.][a-z]{2,3}');

  function validateEmail(elementValue) {
    return emailRegex.test(elementValue);
  }

  const onConfirmClose = () => {
    setConfirmOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
      phone_number: user.phoneNumber,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name cannot be empty'),
      lastName: Yup.string().required('Last name cannot be empty'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email address cannot be empty'),
      phone_number: Yup.string().required(
        'Please enter Mobile Number',
      ).test('editPhoneValidation', 'Invalid Mobile Number Format', (val) => {
        if (val && val.length > 3) {
          return isValidPhoneNumber(val);
        }
      }),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitLoading(true);
        const userInput = {
          userId: user ? user.userId : '',
          firstName: values.firstName,
          lastName: values.lastName,
          middleName: values.middleName,
          email: values.email,
          phoneNumber: values.phone_number,
        };

        await API.graphql(
          graphqlOperation(updateCustomerProfile, {
            input: userInput,
          }),
        );

        fetchAndSetUser();

        toast({
          title: 'Success',
          description: 'Details updated successfully.',
          status: 'success',
          isClosable: true,
          duration: 5000,
        });
        setSubmitLoading(false);
        closeAndResetValues(true);
      } catch (err) {
        closeAndResetValues(true);
        setSubmitLoading(false);
        toast({
          title: 'Error',
          description:
            'Something went wrong in updated user details. Please try again',
          status: 'error',
          isClosable: true,
          duration: 5000,
        });
      }
    },
  });

  const {
    handleChange,
    resetForm,
    handleBlur,
    values,
    handleSubmit,
    setValues,
    setFieldValue,
  } = formik;

  const closeAndResetValues = (bool) => {
    setValues('');
    onClose(bool);
    resetForm();
  };

  // Verify User Email
  const verify = async (username, attribute) => {
    if (username && attribute) {
      try {
        let user = await Auth.currentAuthenticatedUser();
        let objAttr = {}
        if(attribute === 'phone_number'){
          objAttr = {
            'phone_number': username,
          }
        } else {
          objAttr = {
            'email': username,
          }
        }
        let result = await Auth.updateUserAttributes(user,objAttr);
        await Auth.verifyCurrentUserAttribute(attribute);
        setConfirmOpen(true);
        setVerifyAttr(attribute);
      } catch (error) {
        toast({
          title: 'Error',
          description:
            error?.message || 'Something went wrong. Please try again',
        });
      }
    }
  };

  const verifyFormik = useFormik({
    initialValues: {
      verificationCode: '',
    },
    onSubmit: async (_values) => {
      try {
        await Auth.verifyCurrentUserAttributeSubmit(
          verifyAttr,
          _values.verificationCode,
        );
        if (verifyAttr === 'email') {
          await API.graphql(
              graphqlOperation(updateEmailVerification, {input: {
                type: 'email verification',
                email: values.verifyAttr,
                // firstName: values.firstName,
                // lastName: values.lastName,
                // phoneNumber: values.phone_number,
                // username: user.userId,
              }}),
            )
          }
        toast({
          title: `Successfully verified your ${verifyAttr === 'email' ? 'Email' : 'Mobile Number'
            }`,
          status: 'success',
        });
        setConfirmOpen(false);
        setVerifyAttr('');
      } catch (error) {
        toast({
          title: 'Something went wrong in verifying ',
          description: 'Please try again',
          status: 'error',
        });
      }
    },
  });

  const {
    handleChange: handleVerifyChange,
    resetForm: resetVerifyForm,
    handleBlur: handleVerifyBlur,
    values: verifyValues,
    errors: verifyErrors,
    handleSubmit: handleVerifySubmit,
    setValues: setVerifyValues,
  } = verifyFormik;

  useEffect(() => {
    const { firstName, lastName, middleName, phoneNumber, email } = user;
    setValues({
      firstName,
      lastName,
      middleName,
      email,
      phone_number: phoneNumber,
    });
  }, [user, setValues]);

  useEffect(() => {
    getFormErrorFocus(formik);
  }, [formik.isSubmitting]);

  return (
    <>
      <Drawer
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        placement="right"
        onClose={onClose}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton color="White" />
          <DrawerBody p="0" className="blockBg" fontSize="16px">
            <Box>
              <Box bg="brand.red" color="White" p="3">
                Edit Primary Details
              </Box>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <Stack align="flex-start" p="4">
                  <FormControl isRequired>
                    <FormLabel display="inline">User ID</FormLabel>
                    {user.userId}
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      variant="filled"
                      name="firstName"
                      value={values.firstName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {formik.touched.firstName && formik.errors.firstName ? (
                      <Box className="error">{formik.errors.firstName}</Box>
                    ) : null}
                  </FormControl>
                  <FormControl>
                    <FormLabel>Middle Name</FormLabel>
                    <Input
                      variant="filled"
                      name="middleName"
                      value={values.middleName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      variant="filled"
                      name="lastName"
                      value={values.lastName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {formik.touched.lastName && formik.errors.lastName ? (
                      <Box className="error">{formik.errors.lastName}</Box>
                    ) : null}
                  </FormControl>
                  <HStack>
                    <FormControl id="phone_number" isRequired>
                      <FormLabel>Mobile Number</FormLabel>
                      <HStack>
                        {/* <PhoneInput
                          international
                          defaultCountry="US"
                          name="phone_number"
                          placeholder="Please Enter Mobile Number"
                          value={values.phone_number}
                          onBlur={handleBlur}
                          onChange={(val) => {
                            setFieldValue('phone_number', val);
                          }}
                        /> */}
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
                    setFieldValue('phone_number', tempValue);
                  }}
                />
                        <Button
                          onChange={handleChange}
                          onClick={() => {
                            if (isValidPhoneNumber(values.phone_number)) {
                              verify(
                                values.phone_number,
                                'phone_number',
                              );
                            }
                          }}
                        >
                          Verify
                        </Button>
                      </HStack>
                      {formik.touched.phone_number &&
                        formik.errors.phone_number ? (
                        <Box className="error">
                          {formik.errors.phone_number}
                        </Box>
                      ) : null}
                    </FormControl>
                  </HStack>
                  <FormControl isRequired>
                    <FormLabel>Email Id</FormLabel>
                    <HStack>
                      <Input
                        variant="filled"
                        w="72%"
                        name="email"
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      <Button
                        ml="2"
                        onChange={handleChange}
                        onClick={() => {
                          if (validateEmail(values.email)) {
                            verify(values.email, 'email');
                          }
                        }}
                      >
                        Verify
                      </Button>
                    </HStack>
                    {formik.touched.email && formik.errors.email ? (
                      <Box className="error">{formik.errors.email}</Box>
                    ) : null}
                  </FormControl>
                  <HStack p={3} alignSelf="flex-end">
                    <Button
                      onClick={closeAndResetValues}
                      variant="cancel-button"
                    >
                      Cancel
                    </Button>
                    <Button
                      _hover={{ background: 'brand.red' }}
                      type="submit"
                      mr={3}
                      isLoading={submitLoading}
                    >
                      Save
                    </Button>
                  </HStack>
                </Stack>
              </form>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={isConfirmOpen}
        onClose={() => {
          onConfirmClose();
          verifyFormik.resetForm();
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerifySubmit();
          }}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader color="White" fontSize="lg" bg="brand.red">
                Verify {verifyAttr === 'email' ? 'Email' : 'Mobile'}
              </AlertDialogHeader>
              <AlertDialogCloseButton color="White" />
              <AlertDialogBody>
                <Text color="brand.red">
                  Verification code sent to your{' '}
                  {verifyAttr === 'email' ? 'Email' : 'Mobile'}
                </Text>
                <Box mt="4">
                  <FormControl isRequired>
                    <FormLabel> Enter verification code </FormLabel>
                    <Input
                      variant="filled"
                      name="verificationCode"
                      value={verifyValues.verificationCode}
                      onBlur={handleVerifyBlur}
                      onChange={handleVerifyChange}
                    />
                  </FormControl>
                </Box>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button 
                onClick={() => {
                    onConfirmClose();
                    verifyFormik.resetForm();
                  }} 
                  variant="cancel-button">
                  Cancel
                </Button>
                <Button
                  _hover={{ background: 'brand.red' }}
                  ml={3}
                  isLoading={submitLoading}
                  type="submit"
                >
                  Submit
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </form>
      </AlertDialog>
    </>
  );
};

const stateMapper = (state) => ({
  user: state.auth.user,
});

const dispatchMapper = (dispatch) => ({
  fetchAndSetUser: dispatch.auth.fetchAndSetUser,
});

export default connect(stateMapper, dispatchMapper)(EditProfileDetails);
