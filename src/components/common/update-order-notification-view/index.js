import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
} from '@chakra-ui/react';
import React from 'react';

const UpdateNotificationView = (props) => {
  const { updatedOrderDetails, isUpdateOrderOpen, onUpdateOrderClose } = props;

  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={isUpdateOrderOpen}
      leastDestructiveRef={cancelRef}
      onClose={onUpdateOrderClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader color="White" fontSize="lg" bg="brand.red">
            Order Updated
          </AlertDialogHeader>
          <AlertDialogCloseButton color="White" />
          <AlertDialogBody textAlign="center">
            <Box color="brand.red" mt="3">
              Your order <b>{updatedOrderDetails.orderId}</b> is Updated!
            </Box>
            <Box mt="4">
              You can always track your orders in the "My Orders List" section
              under the my profile.
            </Box>
          </AlertDialogBody>
          <AlertDialogFooter sx={{ margin: 'auto' }}>
            <Button
              ref={cancelRef}
              onClick={onUpdateOrderClose}
              variant="cancel-button"
            >
              Okay
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
export default UpdateNotificationView;
