import { Box } from '@chakra-ui/react';
import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';

const FilterPage = (props) => {
  const { retailertype, retailerid } = props;

  if (retailertype && retailerid) {
    sessionStorage.setItem('retailertype', retailertype);
    sessionStorage.setItem('retailerid', retailerid);
    navigate(`/category/Beer/Alternative`);
  }

  return (
    <Box
      className="blockBg"
      boxShadow=" 0px 0px 10px 2px rgba(0, 0, 0, 0.1)"
      borderRadius="7"
    />
  );
};

const stateMapper = (state) => ({
  user: state.auth?.user,
});

const dispatchMapper = () => ({});

export default connect(stateMapper, dispatchMapper)(FilterPage);
