import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getAvailablePromotions } from '../../../services/content-service';
import { slickSettings } from '../../../utils/slick-settings';

export default function Promotions() {
  const [lstPromotions, setLstPromotions] = useState([]);

  const defaultWrapper = (children) => (
    <Flex direction="row" flexWrap="wrap" mt="4">
      {children}
    </Flex>
  );

  const ConditionalWrapper = ({ condition, wrapper, children }) =>
    condition ? wrapper(children) : defaultWrapper(children);

  const getData = async () => {
    const res = await getAvailablePromotions();
    if (res.success) {
      setLstPromotions(res.promotions);
    } else {
      console.log('error while getting the promotions', res.error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {lstPromotions.length > 0 ? (
        <Box mt="10">
          <Heading
            as="h2"
            color="brand.red"
            fontWeight="normal"
            textAlign="center"
            mb="5"
          >
            Promotions
          </Heading>
          <Box className="redBg" p="10" display="flex" justifyContent="center">
            <Box w="95%">
              <ConditionalWrapper
                condition
                wrapper={(children) => (
                  <Slider
                    {...slickSettings}
                    slidesToShow={1}
                    slidesToScroll={1}
                    style={{ width: '100%' }}
                  >
                    {children}
                  </Slider>
                )}
              >
                {lstPromotions.map((eachPromotion, i) => (
                  <Box key={`promotion-${i}`} textAlign="center" mb="8" mr="8">
                    <Box
                      className="productBox mainBg"
                      onClick={() => {
                        const promotionType = eachPromotion.tags.filter((a) => {
                          if (a.Key === 'promotionType') {
                            return a;
                          }
                        })[0].Value;

                        if (promotionType === 'product') {
                          navigate(
                            `/product/${
                              eachPromotion.tags.filter((a) => {
                                if (a.Key === 'productId') {
                                  return a;
                                }
                              })[0].Value
                            }`,
                          );
                        } else if (promotionType === 'brand') {
                          // Set the proper URL
                          navigate(
                            `/category/Beer/Alternative?size=n_20_n&filters[0][field]=brand&filters[0][values][0]=${
                              eachPromotion.tags.filter((a) => {
                                if (a.Key === 'brandName') {
                                  return a;
                                }
                              })[0].Value
                            }&filters[0][type]=any`,
                          );
                        }
                      }}
                    >
                      <Flex direction="column">
                        <Image
                          src={eachPromotion.imageUrl}
                          h="150px"
                          w="150px"
                          textAlign="center"
                          m="auto"
                        />{' '}
                        <Text
                          fontWeight="bold"
                          mt="3"
                          noOfLines={2}
                          height="45px"
                        >
                          {eachPromotion.name}
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                ))}
              </ConditionalWrapper>
            </Box>
          </Box>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}
