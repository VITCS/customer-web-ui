import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { API, Auth } from 'aws-amplify';
import Location from 'aws-sdk/clients/location';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { MdLocationOn } from 'react-icons/md';
import { connect } from 'react-redux';
import awsExports from '../../../aws-exports';
import { searchAddress } from '../../../graphql/queries';

function DeliveryAddressSelectorModal(props) {
  const { user, isOpen, deliveryAddrModalClose, updateDeliveryAddress } = props;
  const [searchResults, setSearchResults] = useState([]);
  const [inputText, setInputText] = useState('');
  const [client, setClient] = useState(null);
  const cancelRef = useRef();

  const searchAddressFunc = async (str) => {
    try {
      const data = await API.graphql({
        query: searchAddress,
        variables: {
          input: {
            searchStr: str,
          },
        },
        authMode: 'API_KEY',
        authToken: awsExports.aws_appsync_apiKey,
      });

      setSearchResults(data?.data?.searchAddress?.items);
    } catch (err) {
      console.log(err);
    }
  };

  const searchPlace = async (place) => {
    const params = {
      IndexName: awsExports.aws_geo_mapIndexName,
      MaxResults: 10,
      Text: place,
    };

    try {
      const addrData = await client.searchPlaceIndexForText(params).promise();
      return addrData;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const debounceSearch = debounce(
    (searchText) => searchAddressFunc(searchText),
    300,
  );

  const handleChange = (e) => {
    setInputText(e.target.value);
    debounceSearch(e.target.value);
  };

  const handleOnListItemClick = async (e) => {
    setInputText(e.target.innerText);
    setSearchResults([]);
  };

  const setDeliveryAddrAndClose = async () => {
    if (inputText.trim() !== '') {
      setInputText(inputText);
      const data = await searchPlace(inputText);
      const lat = data?.Results[0].Place.Geometry.Point[1] || 40;
      const lon = data?.Results[0].Place.Geometry.Point[0] || -70;

      const addressStr = inputText.split(',');
      if (data) {
        updateDeliveryAddress({
          address: {
            addrLine1: addressStr[0],
            city: addressStr[1],
            addrState: addressStr[2].trim(),
            postCode: addressStr[3].trim(),
            latitude: lat,
            longitude: lon,
          }, // Need to change
          lat,
          lon,
        });
      }

      deliveryAddrModalClose();
    }
  };
  useEffect(() => {
    const createClient = async () => {
      const credentials = await Auth.currentCredentials();
      const tempCient = new Location({
        credentials,
        region: awsExports.aws_project_region,
      });

      setClient(tempCient);
    };

    createClient();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody p="0" m="0" className="blockBg">
          <Flex
            direction="column"
            roundedTopLeft="10"
            roundedBottomRight="10"
            data-cy="deliveryAddressModal"
          >
            <Flex justifyContent="flex-end">
              <Box w="35%" h="5px" bg="brand.red" roundedBottomLeft="md" />
            </Flex>
            <VStack textAlign="center" spacing="3" p="10" h="350px" mt="5">
              <Image
                src={require('../../../assets/logo/Full-Logo.svg')}
                w="170px"
              />
              <Text color="brand.red" fontSize="lg">
                Welcome to 1800Spirits
              </Text>
              <Text as="h1" fontWeight="bold">
                Enter Delivery Address
              </Text>
              {!user ? (
                <>
                  <VStack position="relative" w="100%">
                    <InputGroup rounded="lg" mt="3" borderColor="brand.red">
                      <InputLeftElement
                        rounded="lg"
                        // bg="White"
                        pointerEvents="none"
                        fontSize="lg"
                        children={<MdLocationOn color="#B72618" />}
                      />
                      <Input
                        variant="filled"
                        // border="none"
                        placeholder="Enter full address"
                        // bg="White"
                        value={inputText}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <Text as="span" fontSize="sm" color="brand.red" mt="0">
                    Addresses on routes - type US Highway / route / state route - for accurate search
                    </Text>
                    {searchResults && searchResults.length > 0 ? (
                      <Box
                        alignItems="right"
                        position="absolute"
                        top="36px"
                        left="0px"
                        className="mainBg"
                        style={{
                          border: '1px solid #ACABAB',
                          textAlign: 'left',
                        }}
                        p="5"
                        w="100%"
                        zIndex="99999"
                      >
                        <List spacing={3}>
                          {searchResults.map((eachResult, id) => (
                            <ListItem
                              key={id}
                              cursor="pointer"
                              onClick={handleOnListItemClick}
                            >
                              {`${eachResult.street_line}, ${eachResult.city}, ${eachResult.state}, ${eachResult.zipcode}`}
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ) : (
                      <></>
                    )}
                  </VStack>
                  <Flex pt="5" pb="10">
                    <Button
                      ref={cancelRef}
                      onClick={deliveryAddrModalClose}
                      variant="cancel-button"
                    >
                      Cancel
                    </Button>
                    <Button
                      ml="2"
                      onClick={setDeliveryAddrAndClose}
                      type="submit"
                      _hover={{ background: 'brand.red' }}
                    >
                      {' '}
                      Set Default Address
                    </Button>
                  </Flex>
                </>
              ) : (
                <Box />
              )}
            </VStack>
            <Box
              w="35%"
              h="5px"
              bg="brand.red"
              roundedTopRight="md"
              alignItems="flex-end"
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const stateMapper = (store) => ({
  user: store.auth?.user,
});

const dispatchMapper = (dispatch) => ({
  updateDeliveryAddress: dispatch.deliveryAddress.updateDeliveryAddress,
});

export default connect(
  stateMapper,
  dispatchMapper,
)(DeliveryAddressSelectorModal);
