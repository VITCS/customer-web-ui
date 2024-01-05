import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React from 'react';
import { MdStar, MdStarBorder } from 'react-icons/md';
import Rating from 'react-rating';
import defaultProductImg from '../../../assets/default-product.png';

export default function ProductView({
  product: {
    id,
    imageSrc = defaultProductImg,
    title,
    categoryName,
    price,
    rating,
  } = {},
}) {
  // const { product } = props;
  // const {
  //   id,
  //   imageSrc = defaultProductImg,
  //   title,
  //   categoryName,
  //   price,
  //   rating,
  // } = product || {};

  return (
    <Box
      className="productBox mainBg"
      onClick={() => {
        navigate(
          `/product/${id}`,
          );
      }}
    >
      <Flex direction="column">
        <Image src={imageSrc} h="150px" w="150px" textAlign="center" m="auto" />{' '}
        {/* <Tooltip label={title} aria-label="A tooltip" bg="brand.red"> */}
        <Text fontWeight="bold" mt="3" noOfLines={2} height="45px">
          {title}
        </Text>
        {/* </Tooltip> */}
        <Text mt="1"> {categoryName}</Text>
        <Box mt="3">
          <Text color="brand.red" fontSize="sm" fontWeight="bold">
            Starts From
          </Text>
          <Text fontSize="md" fontWeight="bold">
            ${price}
          </Text>
        </Box>
        <Flex mt="1" alignItems="center">
          <Box mt="1">
            <Rating
              alignItems="center"
              initialRating={rating}
              readonly
              emptySymbol={<MdStarBorder fontSize="lg" color="#FB8200" />}
              fullSymbol={<MdStar fontSize="lg" color="#FB8200" />}
            />
          </Box>
          <Box
            alignItems="center"
            fontSize="md"
            as="span"
            ml="2"
            fontWeight="bold"
          >
            {rating}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
