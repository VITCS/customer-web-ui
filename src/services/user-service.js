import { graphqlOperation } from 'aws-amplify';
import { updateCustomerProfileDeliveryToId } from '../graphql/mutations';
import { getCustomerContacts } from '../graphql/queries';
import { graphql } from '../utils/api';

async function getCustomerContactsByProfileId(userId) {
  try {
    const graphqlQuery = graphqlOperation(getCustomerContacts, {
      userId,
    });
    const contacts = await graphql(graphqlQuery);
    return {
      success: true,
      customerDeliveryContacts:
        contacts.data.CustomerContactsByCustomerProfileId,
    };
  } catch (err) {
    return { success: false, error: err };
  }
}

async function getCustomerContactStatus(userId, deliveryAddress) {
  try {
    let addrStatus = { status: 'add' };
    if (userId) {
      const deliveryContacts = await getCustomerContactsByProfileId(userId);
      if (deliveryContacts.success) {
        const addrContact =
          deliveryContacts.customerDeliveryContacts?.items?.forEach(
            (deliveryAddr) => {
              const existingDeliveryAddr =
                deliveryAddr?.deliveryAddress?.items?.find(
                  (addr) =>
                    addr.latitude === deliveryAddress.address.latitude &&
                    addr.longitude === deliveryAddress.address.longitude,
                );
              if (existingDeliveryAddr) {
                addrStatus = {
                  status: 'exists',
                  deliveryAddressId: existingDeliveryAddr.id,
                };
              }
            },
          );
        return addrStatus;
      }

      return { status: 'failure' };
    }
  } catch (err) {
    return { status: 'failure', error: err };
  }
}

async function updateDeliveryToId(userId, deliveryToId) {
  await graphql(
    graphqlOperation(updateCustomerProfileDeliveryToId, {
      input: {
        userId,
        deliveryToId,
      },
    }),
  );
}

export {
  getCustomerContactsByProfileId,
  getCustomerContactStatus,
  updateDeliveryToId,
};
