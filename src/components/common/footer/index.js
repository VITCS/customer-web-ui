import { Box, Divider, Flex, Link, Text } from '@chakra-ui/react';
import React from 'react';

export default function Footer() {
  return (
    <Box>
      <Box bg="brand.red" color="#fff" p="5">
        <Box m="auto">
          <Flex direction="row" justifyContent="space-between">
            <Flex
              direction={{ base: 'column', lg: 'row' }}
              h={{ base: 'max-content', lg: '20px' }}
              mb="2"
              justifyContent="top"
            >
              <Text as="p" size="sm" fontWeight="bold" pr="3">
                Quick Links :
              </Text>

              <Link href="/storelocator" pr="3">
                Stores Near me
              </Link>
              <Divider orientation="vertical" pr="3" />
              <Link
                href="http://merchant.1800spirits.com/"
                target="_blank"
                pr="3"
              >
                Merchant Portal
              </Link>
              <Divider orientation="vertical" pr="3" />
              <Link
                href="http://producer.1800spirits.com/"
                target="_blank"
                pr="3"
              >
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
            </Flex>
            <Flex
              direction="row"
              justifyContent="top"
              fontWeight="bold"
              textDecor="underline"
            >
              <Link href="/about-us" pr="3" target="_blank">
                About Us{' '}
              </Link>
              <Link target="_blank" href="/careers" pr="3">
                Careers{' '}
              </Link>{' '}
            </Flex>
          </Flex>
          <Flex direction="row" mt="3">
            <Text as="p" size="sm" mb="3" pr="3" fontWeight="bold">
              REACH US :
            </Text>
            <Text as="p">
              2162 Route 206, 2nd Floor, Montgomery NJ 0852, USA
            </Text>
          </Flex>
        </Box>
      </Box>
      <Box w="full" bg="Black" color="White" textAlign="center" pt="2" pb="2">
        Copyright &copy; 2023, 1800spirits
      </Box>
    </Box>
  );
}
