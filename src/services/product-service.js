import { API, graphqlOperation } from 'aws-amplify';
import awsExports from '../aws-exports';
import Product from '../entities/product';
import {
  searchProducts,
  searchProductsByCategory,
  searchStore,
  searchStoresByProductId,
} from '../graphql/queries';

async function search(searchText) {
  // Product Search
  const SearchableProductFilterInput = {
    filter: { prodFullName: { matchPhrase: searchText } },
  };
  const graphqlQueryProduct = graphqlOperation(searchProducts, {
    ...SearchableProductFilterInput,
    limit: 10,
  });
  const resProducts = await API.graphql({
    ...graphqlQueryProduct,
    authMode: 'API_KEY',
    authToken: awsExports.aws_appsync_apiKey,
  });
  const products = [];
  resProducts.data.searchProducts.items.forEach((eachResult) => {
    products.push(new Product(eachResult));
  });

  // Category Search
  // const SearchableCategoryFilterInput = {
  //   filter: { prodCategory: { matchPhrase: searchText } },
  // };
  // const graphqlQueryCategory = graphqlOperation(searchProducts, {
  //   ...SearchableCategoryFilterInput,
  //   limit: 10,
  // });
  // const resCategory = await graphql(graphqlQueryCategory);
  // const categories = [];
  // resCategory.data.searchProducts.items.forEach((eachResult) => {
  //   categories.push(new Product(eachResult));
  // });

  return {
    products,
    // categories,
  };
}

async function getProductDetails(productId) {
  const SearchableProductFilterInput = {
    filter: {
      or: [{ id: { eq: productId } }],
    },
  };

  const graphqlQuery = graphqlOperation(searchProducts, {
    ...SearchableProductFilterInput,
  });
  const res = await API.graphql({
    ...graphqlQuery,
    authMode: 'API_KEY',
    authToken: awsExports.aws_appsync_apiKey,
  });
  const product = new Product(res.data.searchProducts.items[0]);
  return product;
}
async function getProductDetailsList(productIdList) {
  // sample or: [{id: {eq: "UE_90034558"}},{id: {eq: "UE_87167016"}}],

  const SearchableProductFilterInput = {
    filter: {},
  };
  SearchableProductFilterInput.filter.or = [];

  productIdList.forEach((eachProductId) => {
    SearchableProductFilterInput.filter.or.push({
      id: { eq: eachProductId },
    });
  });

  const graphqlQuery = graphqlOperation(searchProducts, {
    ...SearchableProductFilterInput,
  });
  const res = await API.graphql({
    ...graphqlQuery,
    authMode: 'API_KEY',
    authToken: awsExports.aws_appsync_apiKey,
  });
  const products = [];
  res.data.searchProducts.items.forEach((eachResult) => {
    products.push(new Product(eachResult));
  });
  return {
    products,
  };
}

async function getProductsCategoryFilters(categoryName, parentCategoryName) {
  const SearchableProductFilterInput = {
    filter: {
      and: [
        { prodCategory: { eq: parentCategoryName } },
        { prodName: { matchPhrase: categoryName } },
      ],
    },
  };

  const graphqlQuery = graphqlOperation(searchProducts, {
    ...SearchableProductFilterInput,
  });

  const res = await API.graphql({
    ...graphqlQuery,
    authMode: 'API_KEY',
    authToken: awsExports.aws_appsync_apiKey,
  });

  const products = [];
  let filterList = [];
  res.data.searchProducts.items.forEach((eachResult) => {
    products.push(new Product(eachResult));
  });
  let i = 1;
  Object.entries(res.data?.searchProducts).forEach(([key, value], index) => {
    if (value && key !== 'items' && key !== 'nextToken') {
      filterList.push({
        id: i++,
        name: key,
        key: key,
        value: value,
      });
    }
  });

  return filterList;
}

async function getProductsByCategory(
  categoryName,
  parentCategoryName,
  nextToken,
) {
  const SearchableProductFilterInput = {
    filter: {
      and: [
        { prodCategory: { eq: parentCategoryName } },
        { prodName: { matchPhrase: categoryName } },
      ],
    },
  };

  const graphqlQuery = nextToken
    ? graphqlOperation(searchProducts, {
      ...SearchableProductFilterInput,
      limit: 20,
      nextToken,
    })
    : graphqlOperation(searchProducts, {
      ...SearchableProductFilterInput,
      limit: 20,
    });

  const res = await API.graphql({
    ...graphqlQuery,
    authMode: 'API_KEY',
    authToken: awsExports.aws_appsync_apiKey,
  });

  const products = [];
  nextToken = res?.data?.searchProducts?.nextToken;
  res.data.searchProducts.items.forEach((eachResult) => {
    products.push(new Product(eachResult));
  });

  return {
    products,
    nextToken,
  };
}

async function getProductsByCategoryFilter(
  productCategory,
  parentCategoryName,
  selectedFilterList,
  nextToken,
) {
  // const nextToken = null;
  const filterValue = [];

  selectedFilterList.map((filter) => {
    let filterKey = filter.key;
    if (filterKey === 'brand') {
      filterKey = 'brandLine';
    }
    filter.value.map((v) => {
      filterValue.push({ [filterKey]: { eq: v } });
    });
  });
  const SearchableProductFilterInput = {
    filter: {
      // and: { prodCategory: { eq: productCategory } },
      or: [
        ...filterValue,
        { prodCategory: { eq: productCategory } },
        { prodName: { matchPhrase: parentCategoryName } },
      ],
    },
  };

  if (filterValue && filterValue.length > 0) {
    SearchableProductFilterInput.filter.or = [...filterValue];
  }

  const graphqlQuery = nextToken
    ? graphqlOperation(searchProductsByCategory, {
      ...SearchableProductFilterInput,
      limit: 20,
      nextToken,
    })
    : graphqlOperation(searchProductsByCategory, {
      ...SearchableProductFilterInput,
      limit: 20,
    });
  const res = await API.graphql({
    ...graphqlQuery,
    authMode: 'API_KEY',
    authToken: awsExports.aws_appsync_apiKey,
  });

  const products = [];
  nextToken = res?.data?.searchProducts?.nextToken;
  res.data.searchProducts.items.forEach((eachResult) => {
    products.push(new Product(eachResult));
  });

  return {
    products,
    nextToken,
  };
}

async function getAvailableStoresByProductId(productId, distance, lat, lon, showAll) {
  // Product Available Store
  const searchStoresByProductIdQuery = graphqlOperation(
    searchStoresByProductId,
    {
      distance,
      lat,
      lon,
      filter: { id: { eq: productId } },
      showAll: (showAll !== undefined) ? showAll : true
    },
  );
  const res = await API.graphql({
    ...searchStoresByProductIdQuery,
    authMode: 'API_KEY',
    authToken: awsExports.aws_appsync_apiKey,
  });
  const lstSearchedStores = res.data.searchPriceAndAvailabilitys.items;

  // Search Stores For Store Names
  if (lstSearchedStores.length > 0) {
    const storeIds = lstSearchedStores.map((s) => s.storeId);

    const searchableStoreFilterInput = {
      distance,
      lat,
      lon,
      filter: {},
      showAll: (showAll !== undefined) ? showAll : true
    };
    searchableStoreFilterInput.filter.or = [];

    storeIds.forEach((eachStoreId) => {
      searchableStoreFilterInput.filter.or.push({
        id: { eq: eachStoreId },
        isDeliveryPaused: { ne: true },
        isOnboarded: { ne: false },
      });
    });

    const graphqlQuery = graphqlOperation(searchStore, {
      ...searchableStoreFilterInput,
    });
    const res1 = await API.graphql({
      ...graphqlQuery,
      authMode: 'API_KEY',
      authToken: awsExports.aws_appsync_apiKey,
    });
    const lstStoreDetails = res1.data.searchStore.items;

    const stores = [];
    lstSearchedStores.forEach((searchedStore) => {
      lstStoreDetails.forEach((storeDetailsObj) => {
        if (searchedStore.storeId === storeDetailsObj.id) {
          stores.push({
            ...searchedStore,
            storeName: storeDetailsObj.storeName,
          });
        }
      });
    });
    return stores;
  }
  return [];
}

export {
  search,
  getProductsByCategory,
  getProductDetails,
  getProductDetailsList,
  getProductsByCategoryFilter,
  getAvailableStoresByProductId,
  getProductsCategoryFilters,
};
