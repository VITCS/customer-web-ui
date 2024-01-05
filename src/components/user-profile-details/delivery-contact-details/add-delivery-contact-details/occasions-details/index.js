import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useRef, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/colors/red.css';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import * as Yup from 'yup';
import { inputTextStyleProps } from '../../../../../utils/stylesProps';
import moment from 'moment';

const OccasionsDetails = ({ setOccasionValues, occasionValues }) => {
  const [props, setProps] = useState({
    value: new Date(),
    format: 'MM/DD/YYYY',
  });

  const formik = useFormik({
    initialValues: {
      occasionTitle: '',
      occasionDate: '',
      reminder: 'true',
    },
    validationSchema: Yup.object({
      occasionTitle: Yup.string().required('Required'),
      occasionDate: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      // await onSubmit(values);
      const date = moment(values.occasionDate, 'MM/DD/YYYY').format(
        'YYYY-MM-DD',
      );
      setOccasionValues([...occasionValues, { ...values, occasionDate: date }]);
      // setOccasionValues([{...occasionValues, occasionDate:date}, values]);

      resetForm();
    },
  });
  const { values, handleBlur, handleChange, handleSubmit, setFieldValue } =
    formik;
  const calendarOccRef = useRef();
  const occDateRef = useRef();

  return (
    <Box mt="4">
      <HStack w="100%" alignItems="baseline">
        <FormControl id="" isRequired>
          <FormLabel>Occasion Name</FormLabel>
          <Input
            variant="filled"
            type="text"
            name="occasionTitle"
            value={values.occasionTitle}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {formik.touched.occasionTitle && formik.errors.occasionTitle ? (
            <Box className="error">{formik.errors.occasionTitle}</Box>
          ) : null}
        </FormControl>
        <FormControl id="" isRequired>
          <FormLabel>Choose Date</FormLabel>
          <InputGroup>
            <Input
              variant="filled"
              name="occasionDate"
              value={values.occasionDate}
              ref={occDateRef}
              onChange={handleChange}
              onBlur={handleBlur}
              readOnly
            />

            <InputRightElement>
              <FaCalendarAlt
                color="#B72618"
                onClick={() => {
                  calendarOccRef.current.openCalendar();
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
            ref={calendarOccRef}
            render={<Box />}
            onPropsChange={setProps}
            arrow={false}
            onChange={(dateObject) => {
              occDateRef.current.value = dateObject?.format();
              setFieldValue('occasionDate', dateObject?.format());
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
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </FormControl>
        <FormControl id="">
          <FormLabel>&nbsp;</FormLabel>
          <Button
            _hover={{ background: 'brand.red' }}
            type="submit"
            mr={3}
            onClick={() => {
              handleSubmit();
            }}
          >
            Add
          </Button>
        </FormControl>
      </HStack>

      {occasionValues.length > 0 ? (
        <Box>
          <Text as="h2" fontWeight="bold">
            Added Occasions
          </Text>
          <HStack spacing={4} mt="4">
            {occasionValues?.map((item, index) => (
              <Tag className="tagItem" key={item.occasionTitle}>
                <TagLabel>
                  {/* {item.occasionDate} */}
                  {moment(item.occasionDate).format('MM/DD/YYYY')}
                  <Text
                    mt="2"
                    fontSize="10px"
                    textTransform="uppercase"
                    color="brand.red"
                  >
                    {item.occasionTitle}
                  </Text>
                </TagLabel>
                <TagCloseButton
                  color="brand.red"
                  onClick={() => {
                    occasionValues.splice(index, 1);
                    setOccasionValues([...occasionValues]);
                  }}
                />
              </Tag>
            ))}
          </HStack>
        </Box>
      ) : (
        <Box />
      )}
    </Box>
  );
};
export default OccasionsDetails;
