import { InfoIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signInPage } from '../../../utils/resources-en';
import { inputTextStyleProps } from '../../../utils/stylesProps';

const SigninFormWithEmail = (props) => {
  const [passwordSecure, setPasswordSecure] = useState(false);
  const { errors, handleBlur, values, setFieldValue } = props.formik;

  const { emailId, passwordDesc } = signInPage;

  return (
    <Stack spacing={4}>
      <FormControl id="email" isInvalid={!!errors.email} isRequired>
        <FormLabel display="inline" mr="1">
          {emailId}
        </FormLabel>
        <Tooltip
          hasArrow
          label="Use Only verified Email"
          bg="brand.red"
        >
          <InfoIcon fontSize="s" color="brand.red" />
        </Tooltip>
        <Input
          variant="filled"
          mt="2"
          type="email"
          onBlur={handleBlur}
          value={values.email}
          onChange={(e) => {
            setFieldValue('email', e.target.value);
            props.setUserNameInput(e.target.value);
          }}
          placeholder="Please Enter EmailId"
        />
        <FormErrorMessage>{errors.email}</FormErrorMessage>
      </FormControl>
      <FormControl id="password" isInvalid={!!errors.password} isRequired>
        <FormLabel>{passwordDesc}</FormLabel>
        <InputGroup>
          <Input
            variant="filled"
            type={!passwordSecure ? 'password' : 'text'}
            onBlur={handleBlur}
            value={values.password}
            onChange={(e) => {
              setFieldValue('password', e.target.value);
              props.setPasswordInput(e.target.value);
            }}
            placeholder="Please Enter Password"
          />
          <InputRightElement>
            <Button
              tabIndex="-1"
              color="brand.grey"
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
    </Stack>
  );
};
export default SigninFormWithEmail;
