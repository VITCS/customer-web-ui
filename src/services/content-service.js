import { graphqlOperation } from 'aws-amplify';
import { getPromotions } from '../graphql/queries';
import { graphql } from '../utils/api';

async function getAvailablePromotions() {
  try {
    const graphqlQuery = graphqlOperation(getPromotions);
    const res = await graphql(graphqlQuery);
    if (res?.data?.listCarouselData?.items.length > 0) {
      return {
        success: true,
        promotions: res.data.listCarouselData.items,
      };
    }
    return { success: true, promotions: [] };
  } catch (err) {
    return { success: false, error: err };
  }
}

export { getAvailablePromotions };
