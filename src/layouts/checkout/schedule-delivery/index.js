import { Box, FormControl, FormLabel, Select, FormErrorMessage } from '@chakra-ui/react';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState,forwardRef,useImperativeHandle } from 'react';
import * as Yup from 'yup';

function ScheduleDeliveryTime(props, ref) {
  const { cartShipment, setScheduleDate, setScheduleTime } = props;
  const [scheduleDates, setScheduleDates] = useState([]);
  const [scheduleTimes, setScheduleTimes] = useState([]);
  const { deliveryHours, scheduleHours } = cartShipment;

  const scheduleOrderDates = () => {
    const startDate = moment();
    const toDate = moment().add(13, 'days');
    const dates = [];
    while (startDate.isBefore(toDate)) {
      startDate.add(1, 'days');
      dates.push(startDate.format('DD/MM/YYYY'));
    }
    setScheduleDates(dates);
    return dates;
  };

  const scheduleOrderTime = (date, deliveryHours, scheduleHours) => {
    setFieldValue('scheduleDate', date);
    setScheduleDate(date);
    const times = [];
    if(date){
    const check = moment(date, 'DD/MM/YYYY');
    const day = check.format('ddd');
    const timeArr = deliveryHours[day];
    const scheduleTime = scheduleHours ? scheduleHours[day] : 1;
    const startDate = moment(timeArr[0], 'h:mma');
    const toDate = moment(timeArr[1], 'h:mma');
    while (startDate.isSameOrBefore(toDate)) {
      const hour = startDate.hour();
      const sTime = moment({ hour, minute: 0 }).format('h:mm A');
      const etime = moment({ hour, minute: 59 }).format('h:mm A');
      const time = `${sTime} - ${etime}`;
      times.push(time);
      startDate.add(moment.duration(scheduleTime, 'hours'));
    }
    }
    setScheduleTimes(times);
    return times;
  };
  const  validationSchemaSch = Yup.object({
    scheduleDate: Yup.string().required('select the delivery date'),
    scheduleTime: Yup.string().required('select the delivery time'),
  });
  const [validationSchema, setValidationSchema] = useState(
    validationSchemaSch,
  );

  const formik = useFormik({
    initialValues: {
      scheduleDate: '',
      scheduleTime: '',
    },
    validationSchema,
  });

  const { values, handleBlur, handleChange, handleSubmit, setFieldValue, isValid, errors, validateForm } =
    formik;

  useImperativeHandle(ref, () => ({
    validationFunc() {
      // handleSubmit();
      return formik;
    }
  }))
  
  useEffect(() => {
    scheduleOrderDates();
  }, []);

  useEffect(() => {
    validateForm();
  }, [validationSchema]);

  return (
    <Box>
      <Box
        className="mainBg"
        bg="brand.red"
        roundedTop="lg"
        color="White"
        py="3"
        fontSize="lg"
        px="4"
      >
        Schedule Delivery
      </Box>

      <Box className="mainBg" roundedBottom="lg">
        <FormControl id="scheduleDate"
                    isInvalid={!!formik.errors.scheduleDate && !!formik.touched.scheduleDate}
                    isRequired mr="10">
          <FormLabel p="3">Select Date</FormLabel>
          <Box px={7} alignSelf="center">
            <Select
              name="scheduleDate"
              //onBlur={handleBlur}
              //value={values.scheduleDate}
              onChange={(event) =>
                scheduleOrderTime(
                  event.target.value,
                  deliveryHours,
                  scheduleHours,
                )
              }
            >
              <option value="">-Select-</option>
              <option value={moment().format('DD/MM/YYYY')}>Today</option>
              {scheduleDates?.map((d) => (
                <option value={d}>{d}</option>
              ))}
            </Select>
            <Box className="error"><FormErrorMessage>{errors.scheduleDate}</FormErrorMessage></Box>            
            {/* {formik.touched.scheduleDate && formik.errors.scheduleDate ? (
              <Box className="error">{formik.errors.scheduleDate}</Box>
            ) : null} */}
          </Box>
        </FormControl>
        <FormControl id="scheduleTime"
                    isInvalid={!!formik.errors.scheduleTime && !!formik.touched.scheduleTime}
                    isRequired mr="10">
          <FormLabel p="3">Select Time</FormLabel>
          <Box px={7} alignSelf="center">
            <Select
              name="scheduleTime"
              //onBlur={handleBlur}
              onChange={(event) => {
                setFieldValue('scheduleTime', event.target.value);
                setScheduleTime(event.target.value);
              }}
            >
              <option value="">-Select-</option>
              <option value="ASAP">ASAP</option>
              {scheduleTimes?.map((d) => (
                <option value={d}>{d}</option>
              ))}
            </Select>
            <Box className="error"><FormErrorMessage>{errors.scheduleTime}</FormErrorMessage></Box>
           {/*  {formik.touched.scheduleTime && formik.errors.scheduleTime ? (
              <Box className="error">{formik.errors.scheduleTime}</Box>
            ) : null} */}
          </Box>
        </FormControl>
        <Box p="3" />
      </Box>
    </Box>
  );
}

export default forwardRef(ScheduleDeliveryTime);
