import { Button } from '@chakra-ui/button';
import { navigate, useLocation } from '@reach/router';
import React, { memo, useMemo } from 'react';

const SideMenuItem = ({ label, href }) => {
  const location = useLocation();

  const isMatched = useMemo(() => {
    console.log('location changed', location.pathname, href);
    return location.pathname === href;
    // return false;
  }, [href, location.pathname]);
  return (
    <Button
      variant="link"
      fontSize="xl"
      //   bg={isMatched ? "teal.200" : "white"}
      color={isMatched ? 'teal.500' : 'gray.700'}
      onClick={() => {
        navigate(href);
      }}
    >
      {label}
    </Button>
  );
};
export default memo(SideMenuItem);
