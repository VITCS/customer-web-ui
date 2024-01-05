import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Flex,
  Link,
  Spacer,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from '@chakra-ui/react';
import React from 'react';

const ProductFilter = (props) => {
  const {
    filterList,
    selectedFilterList,
    selectedFilterObjList,
    getProductsByFilterName,
    productCategory,
    clearAll,
  } = props;

  const extendAccordian = filterList.length - 1;
  return (
    <>
      <Box p="3" rounded="xl" mb="10px" borderWidth="1px" className="mainBg">
        <Flex direction="row">
          <Text as="b" alignContent="left">
            Applied Filters
          </Text>
          <Spacer />
          <Text alignSelf="flex-end">
            <Link href="#" onClick={clearAll}>
              Clear All
            </Link>
          </Text>
        </Flex>
        <Flex wrap="wrap" gridGap="3" mt="3">
          {selectedFilterObjList.map((selectedFilterObj) => (
            <>
              {selectedFilterObj.value &&
                selectedFilterObj.value?.map((filterValue) => (
                  <Tag variant="outline" key={filterValue}>
                    <TagLabel>{filterValue}</TagLabel>
                    <TagCloseButton
                      onClick={() => {
                        getProductsByFilterName(
                          productCategory,
                          selectedFilterObj.key,
                          filterValue,
                          false,
                        );
                      }}
                    />
                  </Tag>
                ))}
            </>
          ))}
        </Flex>
      </Box>

      <Box shadow="md" borderWidth="1px" rounded="lg" className="mainBg">
        <Accordion defaultIndex={[7]} allowMultiple>
          {filterList.map((filterObj) => (
            <AccordionItem key={filterObj.name}>
              <h2>
                <AccordionButton textAlign="left">
                  <Text as="b" flex="1" alignContent="left">
                    {filterObj.name}
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              {filterObj.value &&
                filterObj.value?.map((filterValue) => (
                  <>
                    {filterValue.key && (
                      <AccordionPanel
                        pb={4}
                        textAlign="left"
                        key={filterValue.key}
                      >
                        <Checkbox
                          borderColor="#BDBDBD"
                          value={filterValue.key}
                          isChecked={selectedFilterList.includes(
                            filterValue.key,
                          )}
                          onChange={(e) => {
                            const { checked } = e.target;
                            getProductsByFilterName(
                              productCategory,
                              filterObj.key,
                              filterValue.key,
                              checked,
                            );
                          }}
                        >
                          {filterValue.key}
                        </Checkbox>
                      </AccordionPanel>
                    )}
                  </>
                ))}
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </>
  );
};

export default ProductFilter;
