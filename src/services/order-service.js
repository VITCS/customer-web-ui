import { API, graphqlOperation } from 'aws-amplify';
import { utimes } from 'fs';
import {
  calculateTaxQuery,
  createOrderQuery,
  updateOrderShipment,
} from '../graphql/mutations';
import { getOrder, listOrdersByUserId } from '../graphql/queries';
import { graphql } from '../utils/api';

const defaultStatusHistory = {
  fromStatus: 'fromStatus',
  toStatus: 'toStatus',
  updatedBy: 'updatedBy',
};

async function getOrderDetails(orderId) {
  const graphqlQuery = graphqlOperation(getOrder, {
    id: orderId,
  });
  const res = await graphql(graphqlQuery);
  const orderDetails = res.data.getOrder;
  return orderDetails;
}
async function createOrder(cart, user) {
  const createOrderInput = {
    cartId: cart.id,
    channel: 'direct',
    orderShipment: [],
    orderStatus: 'Created', // enum: Created,Open,Closed
    totalAmount: 0,
    totalDeliveryCharges: 0,
    totalDiscount: 0,
    totalProductAmount: 0,
    totalTaxAmount: 0,
    totalTipAmount: 0,
    transactionId: cart.id, // transactionId same as cart if still payment gateway integration is completed
    userAgent: cart.userAgent,
    userId: cart.userId,
    clientInterface: 'website'
  };

  //getting the Customer delivery Contact Phone number abd email 
  const customerContactDeails = user?.customerContact?.items?.filter(item => item?.id === user?.deliveryToAddress?.customerContactId);


  const cartShipments = cart.cartShipment.items;
  cartShipments.forEach((eachCartShipment) => {

    const tempOrderShipment = {
      assignedStoreId: eachCartShipment.assignedStoreId,
      assignedStoreName: eachCartShipment.assignedStoreName,
      phoneNumber: customerContactDeails[0].phoneNumber, email: customerContactDeails[0].email,
      deliveryAddress: {
        addrLine1: eachCartShipment.deliveryAddress.addrLine1,
        addrLine2: eachCartShipment.deliveryAddress.addrLine1,
        city: eachCartShipment.deliveryAddress.city,
        state: eachCartShipment.deliveryAddress.state,
        country: eachCartShipment.deliveryAddress.country,
        postCode: eachCartShipment.deliveryAddress.postCode,
        latitude: eachCartShipment.deliveryAddress.latitude,
        longitude: eachCartShipment.deliveryAddress.longitude,
      },
      deliveryType: eachCartShipment.deliveryType,
      orderLineItems: [],
      paymentIntentId: eachCartShipment.paymentIntentId,
      paymentIntentRes: eachCartShipment.paymentIntentRes,
      shipmentStatus: 'Placed', // enum: Placed,Assigned,Accepted,Picked,Delivered,
      statusHistory: defaultStatusHistory,
      subOrderAmount: eachCartShipment.subOrderAmount,
      subTotalDeliveryCharges: eachCartShipment.subTotalDeliveryCharges,
      subTotalMerchantCharges: eachCartShipment.subTotalMerchantCharges,
      subTotal1800platformfee: eachCartShipment.subTotal1800platformfee,
      subTotalCardProcessingFee: eachCartShipment.subTotalCardProcessingFee,
      subTotalAmount: eachCartShipment.subTotalAmount,
      shipmentLevelReplacement: eachCartShipment.shipmentLevelReplacement,
      shipmentLevelReplacementFee: eachCartShipment.shipmentLevelReplacementFee,
      totalPayableAmount: eachCartShipment.totalPayableAmount,
      subTotalDiscount: eachCartShipment.subTotalDiscount,
      subTotalProductAmount: eachCartShipment.subTotalProductAmount,
      subTotalTax: eachCartShipment.subTotalTax,
      subTotalTipAmount: eachCartShipment.subTotalTipAmount,
      scheduledDeliveryDt: eachCartShipment.scheduledDeliveryDt,
      scheduledTimeSlot: eachCartShipment.scheduledTimeSlot,
      updatedBy: eachCartShipment.userId,
      userId: eachCartShipment.userId,
    };

    eachCartShipment.lineItems.forEach((eachLineItem) => {
      tempOrderShipment.orderLineItems.push({
        prodShortDesc: eachLineItem.prodShortDesc,
        productId: eachLineItem.productId,
        productName: eachLineItem.productName,
        qtyPurchased: eachLineItem.qtyPurchased,
        size: eachLineItem.size,
        totalPrice: eachLineItem.totalPrice,
        unitPrice: eachLineItem.unitPrice,
        uom: eachLineItem.uom,
        storeItemId: eachLineItem.storeItemId,
        storeItemDesc: eachLineItem.storeItemDesc,
      });
    });

    createOrderInput.orderShipment.push(tempOrderShipment);
  });

  try {
    const graphqlQueryProduct = graphqlOperation(createOrderQuery, {
      input: createOrderInput,
    });
    const res = await API.graphql({
      ...graphqlQueryProduct,
    });

    return {
      success: true,
      orderId: res.data.createOrder.id,
    };
  } catch (e) {
    return { success: false, error: e };
  }
}

async function getOrdersByUserId(userId, nextToken, limit, filter) {
  const ModelOrderFilterInput = filter;
  const graphqlQuery = graphqlOperation(listOrdersByUserId, {
    ...ModelOrderFilterInput,
    userId,
    nextToken,
    limit,
  });
  const res = await graphql(graphqlQuery);
  const ordersList = res.data.listOrdersByUserId;
  return ordersList;
}

async function calculateTaxes(tempCartShipments) {
  try {
    const graphqlQueryProduct = graphqlOperation(calculateTaxQuery, {
      input: tempCartShipments,
    });
    const res = await API.graphql({
      ...graphqlQueryProduct,
    });

    if (res?.data.calculateTax?.items.length > 0) {
      return {
        success: true,
        calculatedTaxes: res.data.calculateTax.items,
      };
    }
    return {
      success: false,
    };
  } catch (e) {
    return { success: false, error: e };
  }
}

async function updateShipment(updateOrderShipmentInput) {
  try {
    await graphql(
      graphqlOperation(updateOrderShipment, {
        input: { ...updateOrderShipmentInput },
      }),
    );

    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
}

export {
  getOrderDetails,
  createOrder,
  getOrdersByUserId,
  calculateTaxes,
  updateShipment,
};
