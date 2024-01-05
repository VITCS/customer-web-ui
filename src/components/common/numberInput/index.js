import { HStack, Input, useNumberInput } from '@chakra-ui/react';
import React from 'react';
import { BsFillDashCircleFill, BsFillPlusCircleFill } from 'react-icons/bs';

const NumberInput = (props) => {
  const { quantity } = props;
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: quantity,
      min: 1,
      max: 10,
      precision: 0,
      onChange: (value) => {
        props.onChange(parseInt(value, 10));
      },
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps({ isReadOnly: true });

  return (
    <HStack maxW="320px">
      <BsFillDashCircleFill {...dec} fontSize="xl" color="#B72618" />
      <Input
        {...input}
        w="48px"
        variant="outline"
        background="#fff"
        color="#000"
      />
      <BsFillPlusCircleFill {...inc} fontSize="xl" color="#B72618" />
    </HStack>
  );
};

export default NumberInput;
