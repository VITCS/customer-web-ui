/* eslint-disable no-nested-ternary */
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signInPage } from '../../../utils/resources-en';
import { inputTextStyleProps } from '../../../utils/stylesProps';

const SigninFormWithUserId = (props) => {
  const [passwordSecure, setPasswordSecure] = useState(false);
  const { errors, handleBlur, values, setFieldValue } = props.formik;

  const { userId, passwordDesc } = signInPage;
  return (
    <Stack spacing={4}>
      <FormControl id="userId" isInvalid={!!errors.userId} isRequired>
        <FormLabel>{userId}</FormLabel>
        <Input
          variant="filled"
          type="text"
          name="userId"
          onBlur={handleBlur}
          value={values.userId}
          onChange={(e) => {
            setFieldValue('userId', e.target.value);
            props.setUserNameInput(e.target.value);
          }}
          placeholder="Please Enter UserId"
        />
        <FormErrorMessage>{errors.userId}</FormErrorMessage>
      </FormControl>
      <FormControl id="password" isInvalid={!!errors.password} isRequired>
        <FormLabel>{passwordDesc}</FormLabel>
        <InputGroup>
          <Input
            variant="filled"
            type={!passwordSecure ? 'password' : 'text'}
            onBlur={handleBlur}
            name="password"
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
export default SigninFormWithUserId;
// export default SigninFormWithUserId;
