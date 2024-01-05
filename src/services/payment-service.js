import { API, graphqlOperation } from 'aws-amplify';
import awsExports from '../aws-exports';
import {
  createPaymentIntentQuery,
  defaultPaymentMethodQuery,
  deletePaymentMethodQuery,
  paymentMethodsListQuery,
  saveCustomerCardQuery,
} from '../graphql/mutations';

async function createPaymentIntent(paymentIntent) {
  try {
    const graphqlQueryProduct = graphqlOperation(createPaymentIntentQuery, {
      input: paymentIntent,
    });
    const res = await API.graphql({
      ...graphqlQueryProduct,
      // authMode: 'API_KEY',
      // authToken: awsExports.aws_appsync_apiKey,
    });
    if (res?.data.createPaymentIntent) {
      return {
        success: true,
        publicKey: res.data.createPaymentIntent.publicKey,
        clientSecret: res.data.createPaymentIntent.clientSecret,
        id: res.data.createPaymentIntent.id,
      };
    }
    return {
      success: false,
    };
  } catch (e) {
    return { success: false, error: e };
  }
}

async function getSavedPaymentMethods(customerId) {
  try {
    const graphqlQueryProduct = graphqlOperation(paymentMethodsListQuery, {
      input: customerId,
    });
    const res = await API.graphql({
      ...graphqlQueryProduct,
      // authMode: 'API_KEY',
      // authToken: awsExports.aws_appsync_apiKey,
    });
    if (res?.data.paymentMethodsList) {
      return {
        success: true,
        paymentMethods: res.data.paymentMethodsList,
      };
    }
    return {
      success: false,
    };
  } catch (e) {
    return { success: false, error: e };
  }
}

async function deletePaymentMethod(paymentMethodId) {
  try {
    const graphqlQueryProduct = graphqlOperation(deletePaymentMethodQuery, {
      input: { paymentMethodId },
    });
    const res = await API.graphql({
      ...graphqlQueryProduct,
      // authMode: 'API_KEY',
      // authToken: awsExports.aws_appsync_apiKey,
    });

    if (res?.data.deletePaymentMethod) {
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  } catch (e) {
    return { success: false, error: e };
  }
}

async function updateDefaultPaymentMethod(defaultPaymentMethod) {
  try {
    const graphqlQueryProduct = graphqlOperation(defaultPaymentMethodQuery, {
      input: defaultPaymentMethod,
    });
    const res = await API.graphql({
      ...graphqlQueryProduct,
      // authMode: 'API_KEY',
      // authToken: awsExports.aws_appsync_apiKey,
    });
    if (res?.data.defaultPaymentMethod) {
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  } catch (e) {
    return { success: false, error: e };
  }
}

async function saveCustomerCard(userId) {
  try {
    const graphqlQueryProduct = graphqlOperation(saveCustomerCardQuery, {
      input: { userId },
    });
    const res = await API.graphql({
      ...graphqlQueryProduct,
      // authMode: 'API_KEY',
      // authToken: awsExports.aws_appsync_apiKey,
    });
    if (res?.data.saveCustomerCard) {
      return {
        client_secret: JSON.parse(res?.data.saveCustomerCard?.setUpIntent)
          .client_secret,
        success: true,
      };
    }
    return {
      success: false,
    };
  } catch (e) {
    return { success: false, error: e };
  }
}

export {
  createPaymentIntent,
  getSavedPaymentMethods,
  deletePaymentMethod,
  updateDefaultPaymentMethod,
  saveCustomerCard,
};
