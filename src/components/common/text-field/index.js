import { Box, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';
import { inputTextStyleProps } from '../../../utils/stylesProps';

const TextField = ({ label, isRequired, formik, ...props }) => {
  const meta = formik.getFieldMeta(props.name);
  return (
    <FormControl isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Input {...props} variant="filled" />
      {meta.touched && meta.error ? (
        <Box className="error">{meta.error}</Box>
      ) : null}
    </FormControl>
  );
};
export default TextField;
