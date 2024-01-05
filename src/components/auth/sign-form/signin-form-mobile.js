import { InfoIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
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
// import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// import 'react-phone-number-input/style.css';

const SigninFormWithMobile = (props) => {
  const { phoneNumber, passwordDesc, signup, forgotPassword, login } =
    signInPage;
  const [passwordSecure, setPasswordSecure] = useState(false);

  const { errors, handleBlur, values, setFieldValue } = props.formik;
  return (
    <Stack color="#7e7c7c" spacing={4}>
      <FormControl id="phoneNumber" isInvalid={!!errors.phoneNumber} isRequired>
      <FormLabel display="inline">
                {phoneNumber}{' '}
                {/* <Text as="span" color="brand.red">
                  *
                </Text> */}
                
                </FormLabel>
                <Tooltip
                hasArrow
                label="Use Only Verified Mobile Number"
                bg="brand.red"
              >
                <InfoIcon fontSize="s" color="brand.red" />
              </Tooltip>
        {/* <PhoneInput
          defaultCountry="US"
          name="phoneNumber"
          international
          placeholder="Please Enter Mobile Number"
          value={values.phoneNumber}
          onBlur={handleBlur}
          onChange={(val) => {
            setFieldValue('phoneNumber', val);
            props.setUserNameInput(val);
          }} /> */}
            <PhoneInput
                   color="#363636"
                   specialLabel={''}
                   countryCodeEditable={false}
                   country="us"
                   value={values.phoneNumber}
                   name="phoneNumber"
                   inputStyle={{ width: '100%' }}
                   onBlur={handleBlur}
                   onChange={(value, country, e, formattedValue) => {
                     const tempValue = `+${value}`;
                     setFieldValue('phoneNumber', tempValue);
                     props.setUserNameInput(tempValue);
                   }}
                 />
        <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
      </FormControl>
      <FormControl id="password" isInvalid={!!errors.password} isRequired>
        <FormLabel>{passwordDesc}</FormLabel>
        <InputGroup>
          <Input variant='filled'
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

export default SigninFormWithMobile;
