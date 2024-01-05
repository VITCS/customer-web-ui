import { Flex, Box } from '@chakra-ui/react';
import React from 'react';
import Slider from 'react-slick';
import { slickSettings } from '../../../utils/slick-settings';
import ProductView from '../product-view';

export default function ProductList(props) {
  const { productList, showSlider, sliesToShow } = props;
  const defaultWrapper = (children) => (
    <Flex direction="row" flexWrap="wrap" mt="4">
      {children}
    </Flex>
  );

  const ConditionalWrapper = ({ condition, wrapper, children }) =>
    condition ? wrapper(children) : defaultWrapper(children);
  return (
    <ConditionalWrapper
      condition={showSlider}
      wrapper={(children) => (
        <Slider
          {...slickSettings}
          slidesToShow={sliesToShow}
          slidesToScroll={sliesToShow}
          style={{ width: '100%' }}
        >
          {children}
        </Slider>
      )}
    >
      {productList.map((product) => (
        <Box key="product.id" textAlign="center" mb="8" mr="8">
          <ProductView product={product} />
        </Box>
      ))}
    </ConditionalWrapper>
  );
}
