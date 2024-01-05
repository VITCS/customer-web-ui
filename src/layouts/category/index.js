import { useColorMode } from '@chakra-ui/react';
import {
  ErrorBoundary,
  Facet,
  Paging,
  PagingInfo,
  SearchBox,
  Results,
  ResultsPerPage,
  SearchProvider,
  Sorting,
  WithSearch,
} from '@elastic/react-search-ui';
import { Layout, MultiCheckboxFacet } from '@elastic/react-search-ui-views';
import '@elastic/react-search-ui-views/lib/styles/styles.css';
import React, { memo } from 'react';
import { connect } from 'react-redux';
import ProductView from '../../components/category/product-view';
import { ProductsConnector } from '../../services/elasticSearch';
import ResetFilters from './ResetFilters';
import styles from './styles.module.css';

const connector = new ProductsConnector();

const SORT_OPTIONS = [
  {
    name: 'Product Name - Ascending',
    value: [
      {
        field: 'prodFullName',
        direction: 'asc',
      },
    ],
  },
  {
    name: 'Product Name - Descending',
    value: [
      {
        field: 'prodFullName',
        direction: 'desc',
      },
    ],
  }
];

const CategoryPage = (props) => {
  const {
    categoryName,
    parentCategoryName,
    deliveryAddress,
    searchKeyword,
    user,
  } = props;

  const tempDeliveryAddress = {};
  tempDeliveryAddress.lat = user
    ? user?.deliveryToAddress?.latitude
    : deliveryAddress?.lat;
  tempDeliveryAddress.lon = user
    ? user?.deliveryToAddress?.longitude
    : deliveryAddress?.lon;

  const filters = [];

  if (parentCategoryName) {
    filters.push({
      field: 'prodCategory',
      values: [parentCategoryName],
      type: 'eq',
    });
  }
  if (searchKeyword) {
    // if (searchKeyword.indexOf(" ") > 0) {
    //   const searchTerms = searchKeyword.split(" ");
    //   // const searchTermsFilters = [];
    //   // searchTerms?.forEach(term => {
    //   //   {
    //   //     searchTermsFilters.push(
    //   //       {
    //   //         "prodFullName": {
    //   //           "matchPhrase": "Martini"
    //   //         }
    //   //       }
    //   //     )
    //   //   }
    //   // })
    //   // filters.push({
    //   //   "or": searchTermsFilters
    //   // })
    // }
    // else {
    filters.push({
      field: 'prodFullName',
      values: [searchKeyword],
      type: 'matchPhrase',
    });
    // }
  }

  const config = React.useMemo(
    () => ({
      debug: true,
      alwaysSearchOnInitialLoad: true,
      apiConnector: connector,
      hasA11yNotifications: true,
      searchQuery: {
        filters,
        deliveryAddress: tempDeliveryAddress,
        search_fields: {
          prodName: {
            weight: 1,
          },
        },
        result_fields: {
          prodName: { raw: {} },
          brandLine: { raw: {} },
        },
        facets: {},
      },
    }),
    [parentCategoryName, searchKeyword],
  );

  const { colorMode } = useColorMode();

  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ wasSearched, facets }) => ({
          wasSearched,
          facets,
        })}
      >
        {({ wasSearched, facets }) => (
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Layout
              className={colorMode === 'dark' ? 'layoutDark' : 'styles.layout'}
              sideContent={
                <div>
                  {wasSearched && (
                    <Sorting label="Sort by" sortOptions={SORT_OPTIONS} />
                  )}
                  {Object.keys(facets).map((facetKey, i) => (
                    <Facet
                      key={`facet-${i}`}
                      field={facetKey}
                      label={facetKey}
                      show="5"
                      view={MultiCheckboxFacet}
                      filterType="any"
                      isFilterable={
                        facets[facetKey][0].isFilterable !== undefined
                          ? facets[facetKey][0].isFilterable
                          : true
                      }
                    />
                  ))}
                </div>
              }
              bodyContent={
                <>
                  {/* <SearchBox debounceLength={0} /> */}
                  <ResetFilters />
                  <br />
                  <Results
                    titleField="prodName"
                    urlField="url"
                    thumbnailField="image_url"
                    shouldTrackClickThrough
                    view={({ children }) => (
                      <div className={styles.grid}>{children}</div>
                    )}
                    resultView={({ result, onClickLink }) => {
                      const {
                        id,
                        prodName,
                        prodFullName,
                        prodCategory,
                        price,
                      } = result;
                      return (
                        <ProductView
                          product={{
                            id,
                            title: prodFullName,
                            categoryName: prodCategory,
                            price,
                            rating: 5,
                          }}
                        />
                      );
                    }}
                  />
                </>
              }
              bodyHeader={
                <>
                  {wasSearched && <PagingInfo />}
                  {wasSearched && <ResultsPerPage />}
                </>
              }
              bodyFooter={<Paging />}
            />
          </ErrorBoundary>
        )}
      </WithSearch>
    </SearchProvider>
  );
};

const stateMapper = (state) => ({
  user: state.auth?.user,
  deliveryAddress: state.deliveryAddress?.deliveryAddress,
});

const dispatchMapper = () => ({});

export default connect(stateMapper, dispatchMapper)(memo(CategoryPage));
