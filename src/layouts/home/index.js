import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { connect } from 'react-redux';
import AboutUs from '../../components/home/aboutUs';
import ClassicBrand from '../../components/home/classicBrand';
import ClientTestimonials from '../../components/home/clientTestimonials';
import DeliveryAddressSelector from '../../components/home/deliveryAddressSelector';
import DiscountsnDeals from '../../components/home/discountsnDeals';
import Promotions from '../../components/home/promotions';
import QuickCategories from '../../components/home/quickCategories';
import RecentOrders from '../../components/home/recentOrders';
import Recommendation from '../../components/home/recommendation';

const HomePage = (props) => {
  const { user } = props;

  return (
    <Box
      className="blockBg"
      boxShadow=" 0px 0px 10px 2px rgba(0, 0, 0, 0.1)"
      borderRadius="7"
    >
      <Box>
        <DeliveryAddressSelector />
        {user ? (
          <Box px="10" py="5">
            <Text as="h2" color="brand.red" fontWeight="bold">
              Welcome back {user?.firstName}!
            </Text>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justifyContent="space-between"
            >
              <RecentOrders />
              <QuickCategories />
              <DiscountsnDeals />
            </Flex>
          </Box>
        ) : (
          <></>
        )}
        <ClassicBrand />
        <AboutUs />
      </Box>
      <Recommendation />
      <Promotions />
      <ClientTestimonials />
    </Box>
  );
};

const stateMapper = (state) => ({
  user: state.auth?.user,
});

const dispatchMapper = () => ({});

export default connect(stateMapper, dispatchMapper)(HomePage);
