import { Button, HStack, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export const calcNoOfPages = (totalSize, chunkSize) => {
  const noOfPages = Math.floor(totalSize / chunkSize);
  const lastPageCount = totalSize % chunkSize;

  return {
    noOfPages: lastPageCount > 0 ? noOfPages + 1 : noOfPages,
    // lastPageCount
  };
};
const Pagination_old = ({
  listSize = 50,
  countPerPage = 10,
  currentPage,
  goToPage,
  prevPage,
  nextPage,
}) => {
  const pages = useMemo(() => {
    const { noOfPages } = calcNoOfPages(listSize, countPerPage);
    return new Array(noOfPages).fill(0);
  }, [listSize, countPerPage]);
  return (
    <HStack>
      <Button bg="brand.red" color="white">
        <FaArrowLeft />
      </Button>

      {pages.map((page, pageIndex) => (
        <Text key={pageIndex}>{pageIndex + 1}</Text>
      ))}
      <Button bg="brand.red" color="white">
        <FaArrowRight />
      </Button>
    </HStack>
  );
};

export default Pagination_old;
