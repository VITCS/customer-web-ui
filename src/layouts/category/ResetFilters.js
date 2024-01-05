import { Box, Button, Flex, Tag, TagLabel, Text } from '@chakra-ui/react';
import { withSearch } from '@elastic/react-search-ui';
import React from 'react';

function ResetFilters({ filters, clearFilters }) {
  return (
    <Box>
      {filters.length > 0 ? (
        <>
          <Flex mt="5">
            {filters.map((filter, i) => (
              <Tag variant="outline" key={`filter-${i}`} mr="3">
                <TagLabel>
                  <Text textTransform="uppercase" as="span">
                    {filter.field}
                  </Text>
                  : {filter.values.toString()}
                </TagLabel>
              </Tag>
            ))}
            <Button onClick={() => clearFilters()}>Clear Filters</Button>
          </Flex>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default withSearch(({ filters, clearFilters }) => ({
  filters,
  clearFilters,
}))(ResetFilters);
