import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import Footer from '../common/footer';
import TopBar from '../common/topbar';

export function Layout({ children }) {
  return (
    <Box>
      <Flex flexDirection="column">
        {/* <Sidebar /> */}
        <Box w="100%" minH="calc(100vh - 129px)">
          <TopBar />
          <Box borderTopRadius="xl" mt="3" p={{ base: '0', lg: '6' }} m="auto">
            {children}
          </Box>
        </Box>
        <Box height="129px">
          <Footer />
        </Box>
      </Flex>
    </Box>
  );
}

export const noop = 'value';
