import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { API, Auth } from 'aws-amplify';
import Location from 'aws-sdk/clients/location';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { MdLocationOn } from 'react-icons/md';
import { connect } from 'react-redux';
import locatorBg from '../../../assets/home/locator_bg.png';
import awsExports from '../../../aws-exports';
import { searchAddress } from '../../../graphql/queries';

function DeliveryAddressSelector(props) {
  const { user, updateDeliveryAddress, deliveryAddress } = props;
  const [searchResults, setSearchResults] = useState([]);
  const [inputText, setInputText] = useState('');
  const [client, setClient] = useState(null);

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
    setSearchResults([]);
    setInputText('');

    const data = await searchPlace(e.target.innerText);
    let lat = data.Results[0].Place.Geometry.Point[1] || 40;
    let lon = data.Results[0].Place.Geometry.Point[0] || -70;

    const addressStr = e.target.innerText.split(',');
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
  };

  useEffect(() => {
    const createClient = async () => {
      const credentials = await Auth.currentCredentials();
      const tempClient = new Location({
        credentials,
        region: awsExports.aws_project_region,
      });

      setClient(tempClient);
    };

    createClient();
  }, []);

  return (
    <Box>
      <Flex
        w="full"
        h="344px"
        borderTopRadius="xl"
        style={{ backgroundImage: `url(${locatorBg})` }}
      >
        <VStack
          w="full"
          justify="center"
          alignItems="flex-end"
          borderTopRadius="xl"
          px={useBreakpointValue({ base: 4, md: 8 })}
          bgGradient="linear(to right,  transparent,#000 70%)"
        >
          <Stack maxW="lg" alignContent="flex-end">
            <Text fontSize="40px" lineHeight={1} color="#E5A004">
              You are in the right place
            </Text>
            <Text fontSize="lg" color="White">
              Order your favorite drink – Get it for best price and, get it
              delivered in 1 hr, or pre-order to pick-up, or gifting to your
              near & dear.
            </Text>
            {!user && !deliveryAddress ? (
              <VStack position="relative">
                <InputGroup rounded="lg" mt="3" className="blockBg">
                  <InputLeftElement
                    rounded="lg"
                    pointerEvents="none"
                    fontSize="lg"
                    children={<MdLocationOn color="#B72618" />}
                  />
                  <Input
                    variant="filled"
                    border="none"
                    placeholder="Enter full address"
                    value={inputText}
                    onChange={handleChange}
                  />
                  {/* <InputRightAddon
                      bg="White"
                      textAlign="right"
                      p="0"
                      border="none"
                      // eslint-disable-next-line react/no-children-prop
                      children={
                        <Flex alignItems="center" alignContent="flex-end">
                          <MdMyLocation color="#B72618" fontSize="lg" />
                          <Text ml="2">Locate me</Text>
                          <Box
                            bg="brand.red"
                            minH="100%"
                            p="2"
                            ml="2"
                            roundedRight="lg"
                          >
                            <FiSearch color="#FFF" fontSize="2xl" />
                          </Box>{' '}
                        </Flex>
                      }
                    /> */}
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
                    className="blockBg"
                    style={{ border: '1px solid #ACABAB' }}
                    p="5"
                    w="100%"
                    zIndex="99999"
                  >
                    <List spacing={3}>
                      {searchResults.map((eachResult, idx) => (
                        <ListItem
                          key={idx}
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
            ) : (
              <Box />
            )}
          </Stack>
        </VStack>
      </Flex>
    </Box>
  );
}

const stateMapper = (store) => ({
  user: store.auth?.user,
  deliveryAddress: store.deliveryAddress?.deliveryAddress,
});

const dispatchMapper = (dispatch) => ({
  updateDeliveryAddress: dispatch.deliveryAddress.updateDeliveryAddress,
});

export default connect(stateMapper, dispatchMapper)(DeliveryAddressSelector);
