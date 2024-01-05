import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { inputTextStyleProps } from '../../../../../utils/stylesProps';
import TextField from '../../../../common/text-field';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CategoryDetails = ({
  formik,
  contactCategory,
  customeValue,
  firstName,
  middleName,
  lastName,
  contactCustomType,
  phoneNumber,
  email,
}) => {
  const { handleBlur, handleChange, setFieldValue } = formik;
  const [contactCustomTypeDisable, setContactCustomTypeDisable] =
    useState(true);
  return (
    <Box mt="4">
      <HStack w="100%" alignItems="baseline">
        <FormControl id="" isRequired>
          <FormLabel>Choose Category</FormLabel>
          <Select
            border='1px solid #ACABAB !important'
            variant="filled"
            type="text"
            name="contactCategory"
            onBlur={handleBlur}
            value={contactCategory || ''}
            // onChange={handleChange}
            onChange={(event) => {
              setContactCustomTypeDisable(!(event.target.value === 'Custom'));
              setFieldValue('contactCustomType', '');
              setFieldValue('contactCategory', event.target.value);
              // handleChange();
            }}
          >
            <option value="">-Select-</option>
            {/* <option value="Self">Self</option> */}
            <option value="Family">Family</option>
            <option value="Friends">Friends</option>
            <option value="Colleagues">Colleagues</option>
            <option value="Mentor">Mentor</option>
            <option value="Customers">Customers</option>
            <option value="Employees">Employees</option>
            <option value="Partners">Partners</option>
            <option value="Custom">Custom</option>
          </Select>
          {formik.touched.contactCategory && formik.errors.contactCategory ? (
            <Box className="error">{formik.errors.contactCategory}</Box>
          ) : null}
        </FormControl>
        <FormControl id="">
          <FormLabel>&nbsp;</FormLabel>
          <Input
            variant="filled"
            isDisabled={contactCustomTypeDisable}
            type="text"
            name="contactCustomType"
            onBlur={handleBlur}
            value={contactCustomType || ''}
            placeholder="e.g. 1234567891"
            onChange={handleChange}
          />
        </FormControl>
        <TextField
          isRequired
          formik={formik}
          label="First Name"
          name="firstName"
          type="text"
          placeholder="First Name"
          onChange={handleChange}
          onBlur={handleBlur}
          value={firstName || ''}
        />
        <TextField
          formik={formik}
          label="Middle Name"
          name="middleName"
          type="text"
          placeholder="Middle Name"
          onChange={handleChange}
          onBlur={handleBlur}
          value={middleName || ''}
        />
        <TextField
          isRequired
          formik={formik}
          label="Last Name"
          name="lastName"
          type="text"
          placeholder="Last Name"
          onChange={handleChange}
          onBlur={handleBlur}
          value={lastName || ''}
        />
      </HStack>
      <HStack mt="4" alignItems="baseline">
        <FormControl id="mobile_number" isRequired>
          <FormLabel>Mobile Number</FormLabel>
          <HStack>
            {/* <Input
              variant="filled"
              type="text"
              width="70px"
              name="phoneNumberPrefix"
              onBlur={handleBlur}
              value={phoneNumberPrefix || '+1'}
              onChange={handleChange}
            />
            <Input
              variant="filled"
              type="text"
              name="phoneNumberMain"
              onBlur={handleBlur}
              value={phoneNumberMain || ''}
              placeholder="e.g. 1234567891"
              onChange={handleChange}
            /> */}
            {/* <PhoneInput
              style={{ width: '100%' }}
              international
              defaultCountry="US"
              name="phoneNumber"
              placeholder="Please Enter Mobile Number"
              value={phoneNumber}
              onBlur={handleBlur}
              onChange={(val) => {
                setFieldValue('phoneNumber', val);
              }} /> */}
                <PhoneInput
                  specialLabel={''}
                  countryCodeEditable={false}
                  country="us"
                  value={phoneNumber}
                  name="phoneNumber"
                  inputStyle={{ width: '100%' }}
                  onBlur={handleBlur}
                  onChange={(value, country, e, formattedValue) => {
                    const tempValue = `+${value}`;
                    setFieldValue('phoneNumber', tempValue);
                  }}
                />
          </HStack>
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
            <Box className="error">{formik.errors.phoneNumber}</Box>
          ) : null}
        </FormControl>
        <TextField
          isRequired
          formik={formik}
          label="Email Id"
          name="email"
          type="text"
          placeholder="Email Id"
          onChange={handleChange}
          onBlur={handleBlur}
          value={email || ''}
        />
      </HStack>
    </Box>
  );
};

export default CategoryDetails;
