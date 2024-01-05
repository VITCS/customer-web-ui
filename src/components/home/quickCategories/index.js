import { Box } from '@chakra-ui/react';
import React from 'react';

export default function QuickCategories() {
  return (
    <Box w={{ base: '100%', md: '32%' }} className="grid" mr="5" mt="5">
      <Box
        className="gridHeader"
        fontWeight="bold"
        fontSize="lg"
        h="43px"
        pl="15px"
      >
        Quick Categories
      </Box>
      <Box p="5">
        Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
        sint. Velit officia consequat duis enim velit mollit.
      </Box>
    </Box>
  );
}
