import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import React from 'react';

const ConfirmationView = ({
  onConfirmClose,
  message,
  callbackFunction,
  submitLoading,
  cancelRef,
  isOpen,
  submitBtnText,
}) => {
  const BtnText = submitBtnText || 'Delete';
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onConfirmClose}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader color="White" fontSize="lg" bg="brand.red">
            Confirmation
          </AlertDialogHeader>

          <AlertDialogBody>{message}</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onConfirmClose}
              variant="cancel-button"
            >
              Cancel
            </Button>
            <Button
              _hover={{ background: 'brand.red' }}
              onClick={callbackFunction}
              ml={3}
              isLoading={submitLoading}
            >
              {BtnText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
export default ConfirmationView;
