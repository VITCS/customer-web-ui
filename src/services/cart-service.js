import { API, graphqlOperation } from 'aws-amplify';
import awsExports from '../aws-exports';
import {
  createCart as createCartQuery,
  deleteCart as deleteCartQuery,
  deleteCartShipment as deleteCartShipmentQuery,
  updateCart as updateCartQuery,
  updateCartShipment as updateCartShipmentQuery,
} from '../graphql/mutations';
import {
  getCart as getCartQuery,
  getStore as getStoreQuery,
} from '../graphql/queries';

const defaultStatusHistory = {
  fromStatus: 'fromStatus',
  toStatus: 'toStatus',
  updatedBy: 'updatedBy',
};

function prepareLineItem(selectedStore, product) {
  const newLineItem = {
    prodShortDesc: '',
    productId: product.id,
    productName: product.title,
    prodCategory: product.categoryName,
    size: 100,
    uom: 100,
    qtyPurchased: selectedStore.qtySelected,
    unitPrice: parseFloat(selectedStore.price).toFixed(2) * 1,
    totalPrice:
      parseFloat(selectedStore.price).toFixed(2) * selectedStore.qtySelected,
    storeItemId: selectedStore.storeItemId,
    storeItemDesc: selectedStore.storeItemDesc,
  };
  if (product && product.itemInvalid) {
    newLineItem.itemInvalid = product.itemInvalid;
  }
  return newLineItem;
}

function prepareCartShipment(selectedStore, product, user, deliveryAddress) {
  const tempLineItems = [prepareLineItem(selectedStore, product)];
  const subTotalProductAmount = tempLineItems
    .map((i) => i.totalPrice)
    .reduce((a, b) => a + b);

  const newCartShipment = {
    assignedStoreId: selectedStore.storeId,
    deliveryType: selectedStore.deliveryType,
    assignedStoreName: selectedStore.storeName,
    deliveryAddress: {
      addrLine1: user ? user.deliveryToAddress.addrLine1 : deliveryAddress ? deliveryAddress.addrLine1 : 'New Market Rd E',
      addrLine2: user ? user.deliveryToAddress.addrLine2 :  deliveryAddress ? deliveryAddress.addrLine2 :'a',
      city: user ? user.deliveryToAddress.city : deliveryAddress ? deliveryAddress.city : 'Immokalee',
      state: user ? user.deliveryToAddress.addrState : deliveryAddress ? deliveryAddress.addrState : 'Florida',
      country: user ? user.deliveryToAddress.country : 'USA',
      postCode: user ? user.deliveryToAddress.postCode : deliveryAddress ? deliveryAddress.postCode : 34142,
      latitude: user ? user.deliveryToAddress.latitude : deliveryAddress ? deliveryAddress.latitude : 40,
      longitude: user ? user.deliveryToAddress.longitude : deliveryAddress ? deliveryAddress.longitude : -71,
    },
    lineItems: tempLineItems,
    statusHistory: defaultStatusHistory,
    updatedBy: user ? user.userId : 1111111111111111,
    subOrderAmount: 0,
    subTotalDeliveryCharges: 0,
    // subTotalMerchantCharges: 0,
    subTotal1800platformfee: 0,
    subTotalCardProcessingFee: 0,
    subTotalAmount: 0,
    subTotalDiscount: 0,
    subTotalProductAmount: parseFloat(subTotalProductAmount).toFixed(2) * 1,
    subTotalTax: 0,
    subTotalTipAmount: 0,
    userId: user ? user.userId : 1111111111111111,
  };

  if (selectedStore && selectedStore.actionType) {
    newCartShipment.actionType = selectedStore.actionType;
    newCartShipment.cartId = selectedStore.cartId;
  }

  return newCartShipment;
}

function calculateTotals(cartObj, selectedStore, product) {
  // Update totalPrice, subTotalProductAmount, totalAmount & totalProductAmount
  cartObj.cartShipment
    .find(
      (eachCartShipment) =>
        eachCartShipment.assignedStoreId === selectedStore.storeId &&
        eachCartShipment.deliveryType === selectedStore.deliveryType,
    )
    .lineItems.find(
      (eachLineItem) => eachLineItem.productId === product.id,
    ).totalPrice =
    parseFloat(selectedStore.price).toFixed(2) * selectedStore.qtySelected;

  const subTotalProductAmount = cartObj.cartShipment
    .find(
      (eachCartShipment) =>
        eachCartShipment.assignedStoreId === selectedStore.storeId &&
        eachCartShipment.deliveryType === selectedStore.deliveryType,
    )
    .lineItems.map((i) => i.totalPrice)
    .reduce((a, b) => a + b);

  cartObj.cartShipment.find(
    (eachCartShipment) =>
      eachCartShipment.assignedStoreId === selectedStore.storeId &&
      eachCartShipment.deliveryType === selectedStore.deliveryType,
  ).subTotalProductAmount = parseFloat(subTotalProductAmount).toFixed(2) * 1;

  cartObj.totalAmount = 0;
  cartObj.totalProductAmount = 0;

  return cartObj;
}

function prepareCart(selectedStore, product, user, currentCart, deleteFlag, deliveryAddress) {
  let cartObj = {};
  deleteFlag = deleteFlag ? true : deleteFlag;
  if (currentCart) {
    cartObj = currentCart;
    cartObj.cartShipment = cartObj.cartShipment.items;

    // update cartShipment or lineItem
    const sameCartShipment = cartObj.cartShipment.find(
      (eachCartShipment) =>
        eachCartShipment.assignedStoreId === selectedStore.storeId &&
        eachCartShipment.deliveryType === selectedStore.deliveryType,
    );

    if (sameCartShipment) {
      // console.log('Same store');
      const sameProduct = sameCartShipment.lineItems.find(
        (eachLineItem) => eachLineItem.productId === product.id,
      );
      if (sameProduct) {
        // console.log('Same store and same product');
        // Update the quanity
        cartObj.cartShipment
          .find(
            (eachCartShipment) =>
              eachCartShipment.assignedStoreId === selectedStore.storeId &&
              eachCartShipment.deliveryType === selectedStore.deliveryType,
          )
          .lineItems.find(
            (eachLineItem) => eachLineItem.productId === product.id,
          ).qtyPurchased = selectedStore.qtySelected;

        cartObj.cartShipment
          .find(
            (eachCartShipment) =>
              eachCartShipment.assignedStoreId === selectedStore.storeId &&
              eachCartShipment.deliveryType === selectedStore.deliveryType,
          )
          .lineItems.find(
            (eachLineItem) => eachLineItem.productId === product.id,
          ).itemInvalid = false;
      } else {
        // console.log('Same store but different product');
        cartObj.cartShipment
          .find(
            (eachCartShipment) =>
              eachCartShipment.assignedStoreId === selectedStore.storeId &&
              eachCartShipment.deliveryType === selectedStore.deliveryType,
          )
          .lineItems.push(prepareLineItem(selectedStore, product));
      }
    } else {
      // console.log('Different store');
      cartObj.cartShipment.push(
        prepareCartShipment(selectedStore, product, user, deliveryAddress),
      );
    }
  } else {
    // create cart
    cartObj = {
      anonymousId: '',
      belongsTo: '',
      userId: user ? user.userId : 1111111111111111, // userProfileId - In Case of Anonymous
      totalAmount: 0,
      totalDeliveryCharges: 0,
      totalDiscount: 0,
      totalProductAmount: 0,
      totalTaxAmount: 0,
      totalTipAmount: 0,
      channel: 'direct',
      userAgent: navigator.userAgent,
      cartShipment: [prepareCartShipment(selectedStore, product, user, deliveryAddress)],
    };
  }

  cartObj = calculateTotals(cartObj, selectedStore, product);

  // Is this delete cartId necessary
  delete cartObj.cartId;

  cartObj.cartShipment.forEach((cs) => {
    if (!cs.actionType) {
      delete cs.cartId;
      if (deleteFlag) {
        delete cs.id;
      }
    }
    cs.lineItems.forEach((li) => {
      delete li.id;
      delete li.qtySelected;
      delete li.updateBtnDisabled;
    });
  });

  return cartObj;
}

function prepareUpdatedCart(selectedStore, product, qty, user, currentCart) {
  // Remove the product from the existing cart
  let cartShipments = {};
  if (currentCart) {
    cartShipments = currentCart.cartShipment.items;

    // Find the existing product - Remove the cart shipment if empty lineitems exist
    const sameCartShipment = cartShipments.map((eachCartShipment) => {
      let deleteFlag = false;
      eachCartShipment.lineItems.forEach((li, liIndex) => {
        if (
          li.productId === product.id &&
          selectedStore.storeId !== eachCartShipment.assignedStoreId
        ) {
          deleteFlag = true;
          eachCartShipment.lineItems.splice(liIndex, 1);
        }
      });

      if (deleteFlag && eachCartShipment.lineItems.length <= 0) {
        eachCartShipment = {
          ...eachCartShipment,
          actionType: 'delete',
          cartId: currentCart.id,
        };
      } else {
        eachCartShipment = {
          ...eachCartShipment,
          actionType: 'update',
          cartId: currentCart.id,
        };
      }
      return eachCartShipment;
    });

    const newCartShipment = sameCartShipment?.find(
      (eachCartShipment) =>
        eachCartShipment.assignedStoreId !== selectedStore.storeId,
    );

    if (newCartShipment) {
      selectedStore = {
        ...selectedStore,
        actionType: 'create',
        cartId: currentCart.id,
      };
    }

    const tempCart = currentCart;
    tempCart.cartShipment.items = sameCartShipment;

    // Updating the product Qty
    selectedStore.qtySelected = qty;
    // Sending the delete flag to not removing the cartId and cartShipmentId
    const deleteFlag = false;
    // Update the cart with new details

    const updateCartInput = prepareCart(
      selectedStore,
      { ...product, itemInvalid: 'false' },
      user,
      tempCart,
      deleteFlag,
      null
    );

    return updateCartInput;
  }
}

async function getCart(cartId) {
  const graphqlQuery = graphqlOperation(getCartQuery, {
    id: cartId,
  });
  const res = await API.graphql({
    ...graphqlQuery,
    authMode: 'API_KEY',
    authToken: awsExports.aws_appsync_apiKey,
  });
  const cartData = res.data.getCart;

  // unitPrice & totalPrice has to be float from the api response
  if (cartData !== null) {
    cartData.cartShipment.items.forEach((eachCartShipment) => {
      eachCartShipment.lineItems.forEach((li) => {
        li.unitPrice = parseFloat(li.unitPrice).toFixed(2) * 1;
        li.totalPrice = parseFloat(li.totalPrice).toFixed(2) * 1;
      });
    });
  }

  return cartData;
}

async function addToCart(selectedStore, product, user, deliveryAddress, currentCart) {
  const createCartInput = prepareCart(
    selectedStore,
    product,
    user,
    currentCart,
    null,
    deliveryAddress
  );

  try {
    const graphqlQueryProduct = graphqlOperation(createCartQuery, {
      input: createCartInput,
    });
    const res = await API.graphql({
      ...graphqlQueryProduct,
      authMode: 'API_KEY',
      authToken: awsExports.aws_appsync_apiKey,
    });

    const cartData = res.data.createCart;

    // unitPrice & totalPrice has to be float from the api response
    if (cartData !== null) {
      cartData.cartShipment.items.forEach((eachCartShipment) => {
        eachCartShipment.lineItems.forEach((li) => {
          li.unitPrice = parseFloat(li.unitPrice).toFixed(2) * 1;
          li.totalPrice = parseFloat(li.totalPrice).toFixed(2) * 1;
        });
      });
    }

    return {
      success: true,
      cart: cartData,
    };
  } catch (e) {
    return { success: false, error: e };
  }
}

async function deleteCart(cartId) {
  try {
    const graphqlQuery = graphqlOperation(deleteCartQuery, {
      input: {
        id: cartId,
      },
    });
    await API.graphql({
      ...graphqlQuery,
      authMode: 'API_KEY',
      authToken: awsExports.aws_appsync_apiKey,
    });

    // deleteCart res need to be handle it properly
    // console.log('deleteCart res', res);
    return { success: true, cart: null };
  } catch (e) {
    return { success: false, error: e };
  }
}

async function updateCart(selectedStore, product, qty, user, currentCart) {
  const updateCartInput = prepareUpdatedCart(
    selectedStore,
    product,
    qty,
    user,
    currentCart,
  );

  try {
    const graphqlQueryProduct = graphqlOperation(updateCartQuery, {
      input: updateCartInput,
    });
    const res = await API.graphql({
      ...graphqlQueryProduct,
      authMode: 'API_KEY',
      authToken: awsExports.aws_appsync_apiKey,
    });

    const cartData = res.data.updateCart;

    // unitPrice & totalPrice has to be float from the api response
    if (cartData !== null) {
      cartData.cartShipment.items.forEach((eachCartShipment) => {
        eachCartShipment.lineItems.forEach((li) => {
          li.unitPrice = parseFloat(li.unitPrice).toFixed(2) * 1;
          li.totalPrice = parseFloat(li.totalPrice).toFixed(2) * 1;
        });
      });
    }

    return {
      success: true,
      cart: cartData,
    };
  } catch (e) {
    return { success: false, error: e };
  }
}

async function deleteCartShipment(cartShipmentId) {
  try {
    const graphqlQuery = graphqlOperation(deleteCartShipmentQuery, {
      input: {
        id: cartShipmentId,
      },
    });
    await API.graphql({
      ...graphqlQuery,
      authMode: 'API_KEY',
      authToken: awsExports.aws_appsync_apiKey,
    });

    // deleteCartShipment res need to be handle it properly
    // console.log('deleteCartShipment res', res);
    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
}

async function updateCartShipment(updatedCartShipmentObj) {
  try {
    let subTotalProductAmount = 0;
    updatedCartShipmentObj.lineItems.forEach((li) => {
      li.totalPrice = parseFloat(li.unitPrice).toFixed(2) * li.qtySelected;
      subTotalProductAmount += li.totalPrice;
      li.qtyPurchased = li.qtySelected;
      delete li.id;
      delete li.qtySelected;
      delete li.updateBtnDisabled;
    });
    updatedCartShipmentObj.subTotalProductAmount = subTotalProductAmount;

    const graphqlQuery = graphqlOperation(updateCartShipmentQuery, {
      input: updatedCartShipmentObj,
    });
    await API.graphql({
      ...graphqlQuery,
      authMode: 'API_KEY',
      authToken: awsExports.aws_appsync_apiKey,
    });

    // updateCartShipment res need to be handle it properly
    // console.log('updateCartShipment res', res);
    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
}

async function removeCartShipmentLineItem(cart, cartShipmentId, lineItemId) {
  if (cart.cartShipment.items.length === 1) {
    // console.log('Only 1 cart shipment so delete complete cart');
    if (cart.cartShipment.items[0].lineItems.length === 1)
      return deleteCart(cart.id);
  }

  const filteredCartShipment = cart.cartShipment.items.find(
    (eachCartShipment) => eachCartShipment.id === cartShipmentId,
  );
  if (filteredCartShipment.lineItems.length === 1) {
    // console.log(
    //   'Only 1 line items in cart shipment, so delete only cart shipment',
    // );
    return deleteCartShipment(filteredCartShipment.id);
  }

  // console.log('Delete the line item and update only the cartShipment');
  const lineItemIndex = filteredCartShipment.lineItems.findIndex(
    (eachLineItem) => eachLineItem.id === lineItemId,
  );
  filteredCartShipment.lineItems.splice(lineItemIndex, 1);
  return updateCartShipment(filteredCartShipment);
}

async function getInvalidCartFlag(cart) {
  let cartInvalidFlag = false;
  cart.cartShipment.items.forEach((eachCartShipment) => {
    eachCartShipment.lineItems.forEach((product) => {
      if (product.itemInvalid) {
        cartInvalidFlag = true;
      }
    });
  });
  return cartInvalidFlag;
}

async function setInvalidCartFlag(cart) {
  // Update the cart by adding itemInvalid true
  const updatedCart = cart;
  updatedCart.cartShipment.items.forEach(async (eachCartShipment) => {
    eachCartShipment.lineItems.forEach((product) => {
      product.itemInvalid = true;
    });
    await updateCartShipment(eachCartShipment);
  });
  const cartFlag = await getInvalidCartFlag(updatedCart);
  return cartFlag;
}

async function getStore(storeId) {
  const graphqlQuery = graphqlOperation(getStoreQuery, {
    id: storeId,
  });
  const res = await API.graphql({
    ...graphqlQuery,
    authMode: 'API_KEY',
    authToken: awsExports.aws_appsync_apiKey,
  });
  const storeData = res.data.getStore;
  return storeData;
}

export {
  getCart,
  addToCart,
  updateCart,
  removeCartShipmentLineItem,
  updateCartShipment,
  deleteCart,
  getInvalidCartFlag,
  setInvalidCartFlag,
  prepareCart,
  getStore,
};
