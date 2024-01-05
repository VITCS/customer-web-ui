import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { inputTextStyleProps } from '../../utils/stylesProps';
import { updateChangePassword } from '../../graphql/mutations';

const ChangePasswordView = ({ onChangePasswordClose, isOpen }) => {
  const [passwordSecure, setPasswordSecure] = useState(false);
  const [oldPasswordSecure, setOldPasswordSecure] = useState(false);
  const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const toast = useToast();
  const cancelRef = useRef();

  const changePassword = async ({ oldPassword, newPassword }) => {
    try {
      setChangePasswordLoading(true);
      const userObj = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(userObj, oldPassword, newPassword);
      API.graphql(
        graphqlOperation(updateChangePassword, {input: {
          type: 'password',
          password: newPassword,
          username: userObj.username,
        }}),
      )
      setChangePasswordLoading(false);
      onChangePasswordClose();
      toast({
        title: 'Success',
        description: 'Successfully Changed Password',
      });
    } catch (error) {
      setChangePasswordLoading(false);
      console.log('error is ', error);
      if (error.code === 'UserNotFoundException') {
        // setIsSigningIn(false);
      }
      toast({
        title: 'Error',
        description: error?.message || 'Something went wrong. Please try again',
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string().required('Password is required'),
      confirmPassword: Yup.string()
        .required('Required')
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    }),
    onSubmit: (values) => {
      changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
    },
  });

  const { values, handleBlur, handleSubmit, handleChange } = formik;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onChangePasswordClose();
        formik.resetForm();
      }}
      size="3xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent minH="40%">
          <ModalHeader color="White" fontSize="lg" bg="brand.red">
            Change Password
          </ModalHeader>
          <ModalCloseButton color="White" />
          <ModalBody className="blockBg">
            <Box>
              <FormControl id="oldPassword" isRequired>
                <FormLabel> Old password</FormLabel>
                <InputGroup>
                  <Input
                    variant="filled"
                    type={!oldPasswordSecure ? 'password' : 'text'}
                    onBlur={handleBlur}
                    value={values.oldPassword}
                    name="oldPassword"
                    onChange={handleChange}
                    placeholder="Please enter old password"

                    // onChange={(e) => {
                    //   setFieldValue('newpassword', e.target.value);
                    // }}
                  />
                  <InputRightElement>
                    <Button
                      tabIndex="-1"
                      color="Black"
                      variant="link"
                      onClick={() => {
                        setOldPasswordSecure(!oldPasswordSecure);
                      }}
                    >
                      {oldPasswordSecure ? <FaEye /> : <FaEyeSlash />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="newPassword" isRequired mt="4">
                <FormLabel> New password</FormLabel>
                <InputGroup>
                  <Input
                    variant="filled"
                    type={!passwordSecure ? 'password' : 'text'}
                    onBlur={handleBlur}
                    value={values.newPassword}
                    name="newPassword"
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
                id="newPassword"
                isInvalid={
                  values.confirmPassword?.length > 0 &&
                  values.newPassword !== values.confirmPassword
                }
                isRequired
                mt="4"
              >
                <FormLabel>Confirm Password</FormLabel>
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
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onChangePasswordClose();
                formik.resetForm();
              }}
              variant="cancel-button"
            >
              Cancel
            </Button>
            <Button
              ml="2"
              isLoading={changePasswordLoading}
              type="submit"
              _hover={{ background: 'brand.red' }}
              // onClick={() => {
              //   handleSubmit();
              // }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
export default ChangePasswordView;
