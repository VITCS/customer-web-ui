import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import DeliveryContactDetails from '../../components/user-profile-details/delivery-contact-details';
import MyOrderDetails from '../../components/user-profile-details/myorder-details';
import Payments from '../../components/user-profile-details/payments';
import ProfilePrimaryDetails from '../../components/user-profile-details/profile-primary-details';
import Settings from '../../components/user-profile-details/settings';

const UserInfoPage = (props) => {
  const { user, activeTab } = props;

  const tabObject = {
    primary: 0,
    deliverycontacts: 1,
    payments: 2,
    myorders: 3,
    settings: 4,
  };
  const tabRoutes = {
    0: '/profile',
    1: '/deliverycontacts',
    2: '/payments',
    3: '/myorders',
    4: '/settings',
  };
  const tabIndex = activeTab ? tabObject[activeTab] : 0;
  if (!user) {
    return null;
  }
  return (
    <Box className="blockBg" boxShadow="lg" rounded="10">
      <Tabs
        isLazy
        defaultIndex={tabIndex}
        index={tabIndex}
        onChange={(newTabIndex) => {
          navigate('/userprofile' + tabRoutes[newTabIndex]);
        }}
      >
        <TabList
          style={{
            '-webkit-overflow-scrolling': 'touch',
            'overflow-x': 'auto',
            'overflow-y': 'hidden',
          }}
        >
          <Tab
            _selected={{
              color: 'brand.red',
              fontWeight: 'bold',
              borderColor: 'brand.red',
            }}
          >
            <Text as="h2" p="1" whiteSpace="nowrap">
              Profile
            </Text>
          </Tab>
          <Tab
            _selected={{
              color: 'brand.red',
              fontWeight: 'bold',
              borderColor: 'brand.red',
            }}
          >
            <Text as="h2" p="1" whiteSpace="nowrap">
              Delivery Contacts
            </Text>
          </Tab>
          <Tab
            _selected={{
              color: 'brand.red',
              fontWeight: 'bold',
              borderColor: 'brand.red',
            }}
          >
            <Text as="h2" p="1" whiteSpace="nowrap">
              Payments
            </Text>
          </Tab>
          <Tab
            _selected={{
              color: 'brand.red',
              fontWeight: 'bold',
              borderColor: 'brand.red',
            }}
          >
            <Text as="h2" p="1" whiteSpace="nowrap">
              My Orders
            </Text>
          </Tab>
          <Tab
            _selected={{
              color: 'brand.red',
              fontWeight: 'bold',
              borderColor: 'brand.red',
            }}
          >
            <Text as="h2" p="1" whiteSpace="nowrap">
              Settings
            </Text>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0" m="0">
            <ProfilePrimaryDetails user={user} />
          </TabPanel>
          <TabPanel p="5" m="0 ">
            <DeliveryContactDetails user={user} />
          </TabPanel>
          <TabPanel p="0" m="0" pb="10">
            <Payments user={user} />
          </TabPanel>
          <TabPanel p="0" m="0">
            <MyOrderDetails user={user} />
          </TabPanel>
          <TabPanel p="0" m="0">
            <Settings user={user} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

const stateMapper = (state) => ({
  user: state.auth.user,
});

const dispatchMapper = () => ({});

export default connect(stateMapper, dispatchMapper)(UserInfoPage);
