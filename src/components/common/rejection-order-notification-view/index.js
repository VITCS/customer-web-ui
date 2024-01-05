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
import { RiCloseCircleLine } from 'react-icons/ri';

const RejectionNotificationView = (props) => {
  const { rejectedOrderDetails, isRejectOrderOpen, onRejectOrderClose } = props;

  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={isRejectOrderOpen}
      leastDestructiveRef={cancelRef}
      onClose={onRejectOrderClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader color="White" fontSize="lg" bg="brand.red">
            Order Rejected
          </AlertDialogHeader>
          <AlertDialogCloseButton color="White" />
          <AlertDialogBody textAlign="center">
            <Box sx={{ width: '40px', margin: 'auto' }} color="brand.red">
              <RiCloseCircleLine fontSize="40px" />
            </Box>
            <Box color="brand.red" mt="3">
              Your order is Rejected!
            </Box>
            <Box>{rejectedOrderDetails.rejectionMsg}</Box>
            <Box mt="4">
              You can always track your orders in the "My Orders List" section
              under the my profile.
            </Box>
          </AlertDialogBody>
          <AlertDialogFooter sx={{ margin: 'auto' }}>
            <Button
              ref={cancelRef}
              onClick={onRejectOrderClose}
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
export default RejectionNotificationView;
