import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import React from 'react';
import DeliveryAll from '../../components/delivery-to/delivery-all';
import DeliveryRecent from '../../components/delivery-to/delivery-recent';
import DeliverySelf from '../../components/delivery-to/delivery-self';

const DeliveryTo = ({
  isOpen,
  onClose,
  // setLocalDeliveryToId,
  setIsDeliveryOpen,
}) => {
  // const [isAllOpen, setIsAllOpen] = useState(false);

  const handleChange = () => {
    // if (value === 2) {
    //   setIsAllOpen(true);
    // } else {
    //   setIsAllOpen(false);
    // }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent minH="80%">
        <ModalHeader
          color="White"
          fontSize="lg"
          bg="brand.red"
          fontWeight="normal"
        >
          Delivery To
        </ModalHeader>
        <ModalCloseButton
          color="White"
          onClick={() => {
            setIsDeliveryOpen(false);
          }}
        />
        <ModalBody p="0" m="0" className="blockBg">
          <Tabs isLazy onChange={handleChange}>
            <TabList>
              <Tab
                w="150px"
                value={0}
                _selected={{
                  color: 'brand.red',
                  fontWeight: 'bold',
                  borderColor: 'brand.red',
                }}
              >
                Self
              </Tab>
              <Tab
                w="150px"
                value={1}
                _selected={{
                  color: 'brand.red',
                  fontWeight: 'bold',
                  borderColor: 'brand.red',
                }}
              >
                Recent Contacts
              </Tab>
              <Tab
                w="150px"
                value={2}
                _selected={{
                  color: 'brand.red',
                  fontWeight: 'bold',
                  borderColor: 'brand.red',
                }}
              >
                All Contacts
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel p="4" m="0">
                <DeliverySelf
                  {...{ handleChange }}
                  // setLocalDeliveryToId={setLocalDeliveryToId}
                  setIsDeliveryOpen={setIsDeliveryOpen}
                />
              </TabPanel>
              <TabPanel p="4" m="0">
                <DeliveryRecent setIsDeliveryOpen={setIsDeliveryOpen} />
              </TabPanel>
              <TabPanel p="4" m="0">
                <DeliveryAll setIsDeliveryOpen={setIsDeliveryOpen} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        {/* <ModalFooter>
          {isAllOpen ? null : (
            <>
              <Button ref={cancelRef} onClick={onClose} variant="cancel-button">
                Cancel
              </Button>
              <Button _hover={{ background: 'brand.red' }} ml={3}>
                Save
              </Button>
            </>
          )}
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
};

export default DeliveryTo;
