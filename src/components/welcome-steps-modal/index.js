import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import React, { useEffect } from 'react';

export const WelcomeStepsModal = ({ isOpen, onClose, initialStep }) => {
  const { nextStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  useEffect(() => {
    if (initialStep === 1) {
      nextStep();
    } else {
      reset();
    }
  }, [initialStep]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Get started!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Steps activeStep={activeStep}>
            {/* <Step label="Account setup">
              <WelcomeUserForm {...{ nextStep }} />
            </Step> */}
            {/* <Step label="Bussiness Setup">
              <AddBusinessForm {...{ nextStep }} />
            </Step> */}
            <Step label="Confirm">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onClose();
                }}
              >
                <VStack align="center" my={4}>
                  <FormControl id="email" mb={3}>
                    <FormLabel>Sample Name</FormLabel>
                    <Input />
                  </FormControl>
                  <Button type="submit" mb={3} width="full" colorScheme="green">
                    Finish
                  </Button>
                </VStack>
              </form>
            </Step>
          </Steps>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WelcomeStepsModal;
