import { Box, Heading } from '@chakra-ui/react';
import React from 'react';
import productsJSON from '../../../assets/products.json';
import ProductList from '../../category/product-list';

export default function Recommendation() {
  const productList = productsJSON
    .sort(() => Math.random() - Math.random())
    .slice(0, 10);

  return (
    <Box mt="10">
      <Heading
        as="h2"
        color="brand.red"
        fontWeight="normal"
        textAlign="center"
        mb="5"
      >
        Recommendations
      </Heading>
      <Box className="redBg" p="10" display="flex" justifyContent="center">
        <Box w="95%">
          <ProductList productList={productList} showSlider sliesToShow="4" />
        </Box>
      </Box>
    </Box>
  );
}
