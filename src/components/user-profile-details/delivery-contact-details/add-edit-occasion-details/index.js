import { graphqlOperation } from '@aws-amplify/api-graphql';
import {
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
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { memo, useEffect, useRef, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-multi-date-picker';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import {
  createCustomerOccasion,
  updateCustomerOccasion,
} from '../../../../graphql/mutations';
import { graphql } from '../../../../utils/api';
import { inputTextStyleProps } from '../../../../utils/stylesProps';
import getFormErrorFocus from '../../../common/FormikOnError';
import TextField from '../../../common/text-field';
import moment from 'moment';

const AddEditOccasionMemo = (propValues) => {
  const { user, contactId, occasion, isOpen, onClose } = propValues;
  const toast = useToast();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [occasionValues, setOccasionValues] = useState([]);
  const calendarRef = useRef();
  const occasionDateRef = useRef();
  const [props, setProps] = useState({
    value: new Date(),
    format: 'MM/DD/YYYY',
  });
  const formik = useFormik({
    initialValues: {
      occasionTitle: '',
      occasionDate: '',
      reminder: 'yes',
    },
    validationSchema: Yup.object({
      occasionTitle: Yup.string().required('Occasion Name cannot be empty'),
      occasionDate: Yup.string().required('Occasion Date cannot be empty'),
    }),
    onSubmit: async (values, helpers) => {
      setSubmitLoading(true);
      values.reminder = values.reminder === 'yes';
      values.customerContactId = contactId;
      const date = moment(values.occasionDate, 'MM/DD/YYYY').format(
        'YYYY-MM-DD',
      );
      try {
        if (occasion) {
          values.id = occasion.id;
          await graphql(
            graphqlOperation(updateCustomerOccasion, {
              input: { ...values}
            }),
          );
          toast({
            title: 'Success',
            description: 'Customer Occasion  Updated successfully.',
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
        } else {
          await graphql(
            graphqlOperation(createCustomerOccasion, {
              input: { ...values, occasionDate: date },
            }),
          );
          toast({
            title: 'Success',
            description: 'Customer Occasion  Created successfully.',
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
        }

        onClose(true);
      } catch (error) {
        setSubmitLoading(false);
        console.log('Customer Contact Details ::addRes::error', error);
        toast({
          title: 'Error',
          description: 'Error in Customer Contact adding',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
      setSubmitLoading(false);
      helpers.resetForm();
    },
  });

  const {
    values,
    handleBlur,
    resetForm,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
  } = formik;
  const closeAndResetValues = (bool) => {
    setValues('');
    onClose(bool);
    resetForm();
  };

  useEffect(() => {
    console.log('I Am in Occassion form');
    if (occasion) {
      setValues(occasion);
      setFieldValue('reminder', occasion.reminder ? 'yes' : 'no');
    }
  }, [occasion, setValues, setFieldValue]);

  const handleAddressCallback = () => {};
  useEffect(() => {
    getFormErrorFocus(formik);
  }, [formik.isSubmitting]);

  return (
    <Box>
      <Drawer
        closeOnOverlayClick={false}
        closeOnEsc={false}
        placement="right"
        isOpen={isOpen}
        onClose={() => {
          closeAndResetValues();
        }}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton
            color="White"
            onClose={() => {
              closeAndResetValues();
            }}
          />
          <DrawerBody p="0" className="blockBg">
            <Box bg="brand.red" color="White" p="3" pl="4">
              <h2>{occasion ? 'Edit Occasion' : 'Add New Occasion'}</h2>
            </Box>
            <Stack align="flex-start" p="4">
              <TextField
                isRequired
                formik={formik}
                label="Occasion Name"
                name="occasionTitle"
                type="text"
                placeholder="Custom"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.occasionTitle || ''}
              />
              {/* <FormControl id="" isRequired mt="4">
                <FormLabel>Choose Date</FormLabel>
                <DatePicker render={<InputIcon />} className="rmdp-prime" />
              </FormControl> */}
              <FormControl id="" isRequired mt="4">
                <FormLabel>Choose Date</FormLabel>
                <InputGroup>
                  <Input
                    variant="filled"
                    name="occasionDate"
                    value={values.occasionDate ? moment(values.occasionDate)?.format('MM/DD/YYYY') : ''}
                    ref={occasionDateRef}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly
                  />

                  <InputRightElement>
                    <FaCalendarAlt
                      color="#B72618"
                      onClick={() => {
                        calendarRef.current.openCalendar();
                      }}
                    />
                  </InputRightElement>
                </InputGroup>{' '}
                {formik.touched.occasionDate && formik.errors.occasionDate ? (
                  <Box className="error">{formik.errors.occasionDate}</Box>
                ) : null}
                <DatePicker
                  {...props}
                  name="occasionDatePicker"
                  className="red"
                  ref={calendarRef}
                  render={<Box />}
                  arrow={false}
                  minDate={moment().toDate()}
                  onChange={(dateObject) => {
                    occasionDateRef.current.value = dateObject?.format();
                    setFieldValue('occasionDate', dateObject?.format());
                    // calendarRef.current.closeCalendar();
                  }}
                />
              </FormControl>
              <FormControl id="">
                <FormLabel>Reminder</FormLabel>
                <Select
                  name="reminder"
                  value={values.reminder}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
              </FormControl>
              <HStack p={3} alignSelf="flex-end">
                <Button variant="cancel-button" onClick={closeAndResetValues}>
                  Cancel
                </Button>
                <Button
                  _hover={{ background: 'brand.red' }}
                  type="submit"
                  mr={3}
                  isLoading={submitLoading}
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Save
                </Button>
              </HStack>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

const stateMapper = (state) => ({
  user: state.auth.user,
});

const dispatchMapper = () => ({});

const AddEditOccasionDetails = memo(
  connect(stateMapper, dispatchMapper)(AddEditOccasionMemo),
);

export default AddEditOccasionDetails;
