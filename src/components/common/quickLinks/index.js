import { Box, Divider, Flex, Link, Text } from '@chakra-ui/react';
import React from 'react';

function QuickLinks() {
  return (
    <Box
      bg="brand.red"
      color="#fff"
      px="5"
      display={{ base: 'none', xl: 'block' }}
    >
      <Flex
        m="auto"
        justifyContent="space-between"
        direction={{ base: 'column', xl: 'row' }}
      >
        <Flex direction="row" mb="3" mt="3" justifyContent="top" h="20px">
          <Text as="p" size="sm" fontWeight="bold" pr="3">
            QUICK LINKS
          </Text>

          <Link href="/storelocator" pr="3">
            Stores Near me
          </Link>
          <Divider orientation="vertical" pr="3" />
          <Link href="http://merchant.1800spirits.com/" target="_blank" pr="3">
            Merchant Portal
          </Link>
          <Divider orientation="vertical" pr="3" />
          <Link href="http://producer.1800spirits.com/" target="_blank" pr="3">
            Producer Portal
          </Link>
          <Divider orientation="vertical" pr="3" />
          <Link
            href="http://promotional.1800spirits.com/"
            target="_blank"
            pr="3"
          >
            Partner with us{' '}
          </Link>
          <Divider orientation="vertical" pr="3" />
          <Link
            target="_blank"
            fontWeight="bold"
            textDecor="underline"
            href="/about-us"
            pr="3"
          >
            About Us{' '}
          </Link>
          <Divider orientation="vertical" pr="3" />
          <Link
            target="_blank"
            fontWeight="bold"
            textDecor="underline"
            href="/careers"
            pr="3"
          >
            Careers{' '}
          </Link>
        </Flex>

        <Flex direction="row" justifyContent="top" mb="3" mt="3">
          <Text as="p" size="sm" fontWeight="bold" pr="3">
            REACH US
          </Text>
          <Text as="p">2162 Route 206, 2nd Floor, Montgomery NJ 0852, USA</Text>
        </Flex>
      </Flex>
    </Box>
  );
}
export default QuickLinks;
