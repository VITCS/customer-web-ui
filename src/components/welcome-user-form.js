import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { connect } from 'react-redux';

const WelcomeUserFormMemo = ({ nextStep, onBoardUser, backToLogin }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [name, setName] = useState('');

  return (
    <VStack
      align="flex-start"
      my={4}
      // w="md"
      as="form"
      spacing={4}
      onSubmit={async (e) => {
        try {
          setSubmitLoading(true);
          e.preventDefault();
          await onBoardUser(name);

          setSubmitLoading(true);

          nextStep();
        } catch (error) {
          setSubmitLoading(false);

          console.log('error is ', error);
        }
      }}
    >
      <Text fontSize="xl" mt="2">
        Account Setup
      </Text>

      <FormControl isRequired id="name">
        <FormLabel>Name</FormLabel>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>
      <HStack justify="space-between" w="full">
        <Button variant="outline" onClick={backToLogin}>
          Back to login
        </Button>
        <Button
          isLoading={submitLoading}
          type="submit"
          mb={3}
          width="full"
          _hover={{ background: 'brand.red' }}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );
};

const stateMapper = () => ({});

const dispatchMapper = (dispatch) => ({
  onBoardUser: dispatch.auth.onBoardUser,
});

export default connect(stateMapper, dispatchMapper)(WelcomeUserFormMemo);
