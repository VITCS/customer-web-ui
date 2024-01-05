/* eslint-disable class-methods-use-this */
import { graphqlOperation } from 'aws-amplify';
import { searchProductsLambda } from '../graphql/queries';
import { graphql } from '../utils/api';
import { getMinMaxPrices } from '../utils/elasticFilters';

const filterKeyMappings = {
  brand: 'brandLine',
  ProdCategory: 'prodCategory',
};

export class ProductsConnector {
  async onSearch(state, queryConfig) {
    try {
      const { searchTerm, current, filters, sortList, resultsPerPage } = state;
      const { deliveryAddress } = queryConfig;
      let priceRange = [];
      let fieldFilters = [];
      let sortFilters = { direction: 'asc', field: 'prodFullName' }; // default value

      if (sortList && sortList.length > 0) {
        sortFilters.direction = sortList[0].direction;
        sortFilters.field = sortList[0].field;
      }

      filters.forEach((eachFilter) => {
        const { field, values, type } = eachFilter;
        const fieldKey = filterKeyMappings[field] || field;
        if (fieldKey === 'price') {
          priceRange = values;
          return;
        }
        const conditionType = type === 'any' ? 'eq' : type;

        values.forEach((eachFilterValue) => {
          fieldFilters.push({
            [fieldKey]: {
              [conditionType]: eachFilterValue,
            },
          });
        });
      });
      const { minPrice, maxPrice } = getMinMaxPrices(priceRange);

      const operation = graphqlOperation(searchProductsLambda, {
        limit: resultsPerPage,
        // distance: 10,
        // lat: deliveryAddress?.lat,
        // lon: deliveryAddress?.lon,
        from: (current - 1) * resultsPerPage,
        maxPrice,
        minPrice,
        filter: {
          and: fieldFilters,
        },
        sort: sortFilters,
        merchantAccountId:
          sessionStorage.getItem('retailertype') === 'm'
            ? parseInt(sessionStorage.getItem('retailerid'), 10)
            : 0,
        storeId:
          sessionStorage.getItem('retailertype') === 's'
            ? parseInt(sessionStorage.getItem('retailerid'), 10)
            : 0,
      });

      const { data } = await graphql(operation);
      const {
        items = [],
        nextToken = null,
        total = 0,
        // brand = [],
        ...facets
      } = data?.searchProductsLambda || {};

      const formattedResults =
        items?.map((item) => ({
          ...item,
          url: `/product/${item.id}`,
        })) || [];

      let computedFacets = {};
      if (data?.searchProductsLambda?.items.length > 0) {
        computedFacets.price = [
          {
            isFilterable: false,
            data: [
              {
                value: '1-20',
                count: '',
              },
              {
                value: '20-50',
                count: '',
              },
              {
                value: '50-100',
                count: '',
              },
            ],
          },
        ];
      }
      Object.keys(facets).forEach((key) => {
        computedFacets[key] = [
          {
            data: facets[key]?.map(({ key, doc_count }) => ({
              value: key,
              count: doc_count,
            })),
          },
        ];
      });

      return {
        results: formattedResults,
        // facets: {
        //   brandLine: [
        //     {
        //       data: brand?.map((eachBrandCount) => ({
        //         value: eachBrandCount.key,
        //         count: eachBrandCount.doc_count,
        //       })),
        //     },
        //   ],
        // },
        facets: computedFacets,
        totalResults: total || 0,
        totalPages: total / resultsPerPage,
      };
    } catch (error) {
      console.log('elastic search error', error);
    }
  }

  async onAutocomplete(state, queryConfig) {
    // autocomplete is not needed for now
  }

  onResultClick(params) {
    console.log(
      'perform a call to the API to highlight a result has been clicked',
    );
  }

  onAutocompleteResultClick(params) {
    console.log(
      'perform a call to the API to highlight an autocomplete result has been clicked',
    );
  }
}

export default {};
