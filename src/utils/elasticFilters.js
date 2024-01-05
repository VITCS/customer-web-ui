export const getMinMaxPrices = (priceRange) => {
  const flatendValues = priceRange.flatMap((price) => {
    return price.split('-');
  });
  const onlyNumbers = flatendValues.map((val) => parseInt(val));
  const sortedValues = onlyNumbers?.sort();
  return {
    minPrice: sortedValues[0],
    maxPrice: sortedValues[sortedValues.length - 1],
  };
};
