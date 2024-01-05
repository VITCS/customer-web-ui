import {
  Box,
  Button,
  Flex,
  Image,
  List,
  ListItem,
  Text,
  useToast,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { API, graphqlOperation } from 'aws-amplify';
import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import awsExports from '../../aws-exports';
import StoreLocatorMap from '../../components/store-locator-map';
import { searchStore } from '../../graphql/queries';

const StoreLocator = (props) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedmiles, setSelectedMiles] = useState(5);
  const toast = useToast();
  const { user, deliveryAddress } = props;
  const [searchStoreResults, setSearchStoreResults] = useState([]);

  async function getStores(distance) {
    setSubmitLoading(true);
    const lat = user?.deliveryToAddress?.latitude || deliveryAddress?.lat || 40;
    const lon =
      user?.deliveryToAddress?.longitude || deliveryAddress?.lon || -70;
    const graphqlQueryStores = graphqlOperation(searchStore, {
      lat,
      lon,
      distance,
      showAll: true,
      filter: { isDeliveryPaused: { ne: true }, isOnboarded: { ne: false } },
    });
    const resStores = await API.graphql({
      ...graphqlQueryStores,
      authMode: 'API_KEY',
      authToken: awsExports.aws_appsync_apiKey,
    });

    setSearchStoreResults(resStores.data.searchStore.items);
    setSubmitLoading(false);
  }

  useEffect(() => {
    try {
      getStores(5);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error in Searching',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }, [deliveryAddress, user]);

  const coordiantes = useMemo(
    () =>
      searchStoreResults
        .filter((s) => s?.address?.latitude)
        .map((s) => ({
          latitude: s?.address?.latitude,
          longitude: s?.address?.longitude,
          selected: selectedStore ? selectedStore.id === s.id : false,
        })),
    [searchStoreResults, selectedStore, setSelectedStore],
  );

  return (
    <Box>
      <Box
        className="blockBg "
        py="4"
        boxShadow="lg"
        rounded="10"
        px={{ base: '1', lg: '4' }}
      >
        <Flex alignItems="center" direction={{ base: 'column', lg: 'row' }}>
          <Box fontSize="xl" fontWeight="bold" mb="4" mr="4">
            Stores Near Me
          </Box>
          <Box>
            <Button
              variant="outline"
              mr="1"
              bg={selectedmiles === 5 ? 'brand.red' : ' '}
              color={selectedmiles === 5 ? 'White' : ''}
              onClick={() => {
                setSelectedMiles(5);
                getStores(5);
              }}
            >
              5 Miles
            </Button>
            <Button
              variant="outline"
              mr="1"
              bg={selectedmiles === 10 ? 'brand.red' : ' '}
              color={selectedmiles === 10 ? 'White' : ''}
              onClick={() => {
                setSelectedMiles(10);
                getStores(10);
              }}
            >
              10 Miles
            </Button>
            <Button
              variant="outline"
              bg={selectedmiles === 15 ? 'brand.red' : ' '}
              color={selectedmiles === 15 ? 'White' : ''}
              mr="1"
              onClick={() => {
                setSelectedMiles(15);
                getStores(15);
              }}
            >
              15 Miles
            </Button>
            <Button
              variant="outline"
              bg={selectedmiles === 20 ? 'brand.red' : ' '}
              color={selectedmiles === 20 ? 'White' : ''}
              onClick={() => {
                setSelectedMiles(20);
                getStores(20);
              }}
            >
              20 Miles
            </Button>
          </Box>
        </Flex>
      </Box>
      <Box className="blockBg" p="5" boxShadow="lg" rounded="10" mt="10">
        <Flex>
          <Box mr="6" mt="5" w="300px">
            <List>
              <Box
                bg="brand.lightpink"
                _dark={{ bg: '#4B1F1A' }}
                px={3}
                py={2}
                rounded="sm"
              >
                <Text fontWeight="semibold">
                  Stores List - (Nearest 10 Stores){' '}
                </Text>
              </Box>
              {submitLoading ? (
                <Box mt="10" ml="2">
                  <Spinner /> Loading{' '}
                </Box>
              ) : (
                <VStack
                  direction="row"
                  spacing="4"
                  alignItems="flex-start"
                  w="md"
                >
                  {searchStoreResults?.length > 0 ? (
                    searchStoreResults.map((i) => (
                      <ListItem
                        key={i.id}
                        as="button"
                        onClick={() => {
                          setSelectedStore(i);
                        }}
                        shadow="md"
                        display="flex"
                        px={2}
                        py={2}
                        borderLeft={4}
                        borderStyle="solid"
                        borderColor={
                          selectedStore && i.id === selectedStore?.id
                            ? 'brand.red'
                            : 'White'
                        }
                        _dark={{
                          borderColor:
                            selectedStore && i.id === selectedStore?.id
                              ? 'brand.red'
                              : '#363636',
                        }}
                      >
                        <Image
                          src={require('../../assets/placeholder.png')}
                          fallbackSrc={require('../../assets/placeholder.png')}
                          alt={i.storeName}
                          mr="2"
                          boxSize="70px"
                          objectFit="cover"
                        />
                        <Box textAlign="left" w="203px">
                          <Text
                            style={{
                              fontWeight: 'bold',
                            }}
                          >
                            {i?.storeName}
                          </Text>
                          <Text>
                            {i?.address?.addrLine1} {i?.address?.addrLine2}{' '}
                            {i?.address?.city} {i?.address?.state}{' '}
                            {i?.address?.country} {i?.address?.postCode}
                          </Text>
                        </Box>

                        {/* </Button> */}
                      </ListItem>
                    ))
                  ) : (
                    <Text>No stores available yet</Text>
                  )}
                </VStack>
              )}{' '}
            </List>
          </Box>
          <Box flex="1">
            <StoreLocatorMap {...{ coordiantes }} />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

const stateMapper = (state) => ({
  user: state.auth?.user,
  deliveryAddress: state.deliveryAddress?.deliveryAddress,
});

const dispatchMapper = () => ({});

export default connect(stateMapper, dispatchMapper)(StoreLocator);
