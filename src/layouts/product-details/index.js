import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Table,
  Td,
  Text,
  Tr,
  useRadioGroup,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { MdStar, MdStarBorder } from 'react-icons/md';
import Rating from 'react-rating';
import { connect } from 'react-redux';
import defaultProductImg from '../../assets/default-product.png';
import productsJSON from '../../assets/products.json';
import ProductList from '../../components/category/product-list';
import * as ProductService from '../../services/product-service';
import RadioCard from '../../utils/radioCard';
import AvailableStores from './available-stores';

const ProductDetailsPage = (props) => {
  const { productId, deliveryAddress } = props;
  const productList = productsJSON
    .sort(() => Math.random() - Math.random())
    .slice(0, 10);

  let variants = ['750 ml', '1.75 l', '375 ml', '200 ml', '50 ml'];
  variants = [];

  const [variantValue, setVariantValue] = useState('');
  const { getRadioProps } = useRadioGroup({
    name: 'variant',
    value: variantValue,
    onChange: setVariantValue,
  });

  const [productdetails, setProductDetails] = useState([]);
  const getProductDetails = async (_productId) => {
    const res = await ProductService.getProductDetails(_productId);
    setProductDetails(res);
  };

  useEffect(() => {
    if (productId) {
      getProductDetails(productId);
    }
  }, [productId]);

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} pb="10">
      <Box className="blockBg" rounded="lg" p="5" flexGrow="2" mb="5">
        {productdetails ? (
          <Box>
            <Box>
              Home
              {' > '}
              {productdetails.categoryName}
              {` > `}
              {productdetails.title}
            </Box>
            {/* <Breadcrumb separator=">">
              <BreadcrumbItem>
                <BreadcrumbLink>Home</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink>{productdetails.categoryName}</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink> {productdetails.title}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb> */}

            <Box mt="3">
              <Flex direction={{ base: 'column', md: 'row' }}>
                <Box>
                  <Image
                    src={
                      productdetails.imageSrc
                        ? productdetails.imageSrc
                        : defaultProductImg
                    }
                    w="290px"
                    h="300px"
                  />
                </Box>
                <Box flexGrow="2" ml="5">
                  <Heading as="h1" fontSize="xl">
                    {productdetails.title}
                  </Heading>
                  <Flex mt="2" direction={{ base: 'column', md: 'row' }}>
                    <Box mt="1" mr="5">
                      <Rating
                        initialRating={productdetails.rating}
                        readonly
                        emptySymbol={
                          <MdStarBorder fontSize="lg" color="#FB8200" />
                        }
                        fullSymbol={<MdStar fontSize="lg" color="#FB8200" />}
                      />
                      <Text ml="2" as="span">
                        {productdetails.rating}
                      </Text>
                    </Box>
                    <Box>
                      <Text as="span" color="brand.grey">
                        ( {productdetails.reviewCount} Reviews)
                      </Text>
                    </Box>
                  </Flex>
                  <Box color="brand.grey">{productdetails.title}</Box>
                  <Table variant="spiritTable" mt="3" w="max-content">
                    <Tr>
                      <Td fontWeight="bold">Category</Td>
                      <Td>{productdetails.categoryName}</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="bold">Region</Td>
                      <Td>{productdetails.region}</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="bold">ABV</Td>
                      <Td>{productdetails.abv}</Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="bold">Ingredients</Td>
                      <Td>{productdetails.ingredients}</Td>
                    </Tr>
                  </Table>

                  <Grid
                    columns={3}
                    mt="3"
                    templateColumns="repeat(3, 1fr)"
                    columnGap="5"
                  >
                    {variants.map((variant) => {
                      const radio = getRadioProps({ value: variant });
                      return (
                        <GridItem key={variant}>
                          <RadioCard {...radio}>{variant}</RadioCard>
                        </GridItem>
                      );
                    })}
                  </Grid>
                </Box>
              </Flex>
            </Box>

            <Box mt="5">
              <Text textTransform="uppercase" fontWeight="bold">
                Product Details
              </Text>
              <Box mt="3" wordBreak="normal">
                {productdetails.title}
              </Box>
            </Box>

            <Box
              mt="5"
              boxShadow="xl"
              p="6"
              className="blockBg"
              display={{ base: 'none', md: 'block' }}
            >
              <Text textTransform="uppercase" fontWeight="bold" mb="3">
                You May Also Like
              </Text>
              <Box w="800px" m="auto">
                <ProductList
                  productList={productList}
                  showSlider
                  sliesToShow="3"
                />
              </Box>
            </Box>
          </Box>
        ) : (
          <Box> Product Not Found</Box>
        )}
      </Box>
      {productdetails ? (
        <Box
          className="blockBg"
          rounded="lg"
          ml={{ base: '0', md: '5' }}
          w={{ base: '100%', lg: '350px' }}
        >
          <AvailableStores product={productdetails} />
        </Box>
      ) : null}
    </Flex>
  );
};

const stateMapper = (state) => ({
  deliveryAddress: state.deliveryAddress?.deliveryAddress,
});

const dispatchMapper = () => ({});

export default connect(stateMapper, dispatchMapper)(ProductDetailsPage);
