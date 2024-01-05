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
  Text,
  useToast,
} from '@chakra-ui/react';
import { API, graphqlOperation } from 'aws-amplify';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { updateStore } from '../../graphql/mutations';
import { getStore } from '../../graphql/queries';
import { inputTextStyleProps } from '../../utils/stylesProps';

const StoreDetailsModal = ({
  isOpen,
  onClose,
  editEnabled,
  selectedStoreId,
}) => {
  // const [data, setData] = useState(null);
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      storeName: '',
      storeNumber: '',
    },
    onSubmit: async (values, helpers) => {
      try {
        const updateRes = await API.graphql(
          graphqlOperation(updateStore, {
            input: {
              storeName: values.storeName,
              storeNumber: values.storeNumber,
              id: selectedStoreId,
            },
          }),
        );

        helpers.resetForm();
        onClose();
        console.log('StoreDetailsModal::formik::updateRes', updateRes);
      } catch (error) {
        console.log('StoreDetailsModal::formik::error', error);

        toast({
          title: 'Error',
          description: 'Something went wrong in updating. Please try again',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
  });
  const { setValues, values, errors, handleSubmit, handleBlur, handleChange } =
    formik;
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    API.graphql(
      graphqlOperation(getStore, {
        id: selectedStoreId,
      }),
    ).then((re) => {
      const { getStore: res } = re.data;
      if (getStore) {
        setValues({
          storeName: res.storeName,
          storeNumber: res.storeNumber,
        });
      }
    });
  }, [isOpen, selectedStoreId, setValues]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="blockBg">
          {editEnabled ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <FormControl id="storeName" isInvalid={errors.storeName}>
                <FormLabel>Store name</FormLabel>
                <Input
                  variant="filled"
                  name="storeName"
                  onChange={handleChange}
                  value={values.storeName}
                  onBlur={handleBlur}
                />
              </FormControl>
              <FormControl id="storeNumber" isInvalid={errors.storeNumber}>
                <FormLabel>Store Number</FormLabel>
                <Input
                  variant="filled"
                  name="storeNumber"
                  onChange={handleChange}
                  value={values.storeNumber}
                  onBlur={handleBlur}
                />
              </FormControl>
              <Button type="submit">Edit </Button>
            </form>
          ) : (
            <Text>some test</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default StoreDetailsModal;
