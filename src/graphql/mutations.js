export const saveCustomerCardQuery = /* GraphQL */ `
  mutation saveCustomerCard($input: SaveCardInput!) {
    saveCustomerCard(input: $input) {
      setUpIntent
    }
  }
`;

export const defaultPaymentMethodQuery = /* GraphQL */ `
  mutation defaultPaymentMethod($input: DefaultPaymentMethodInput!) {
    defaultPaymentMethod(input: $input) {
      defaultPaymentMethod
    }
  }
`;

export const deletePaymentMethodQuery = /* GraphQL */ `
  mutation deletePaymentMethod($input: DeletePaymentMethodInput!) {
    deletePaymentMethod(input: $input) {
      success
    }
  }
`;

export const createPaymentIntentQuery = /* GraphQL */ `
  mutation createPaymentIntent($input: CreatePaymentIntentInput!) {
    createPaymentIntent(input: $input) {
      publicKey
      clientSecret
      id
    }
  }
`;

export const paymentMethodsListQuery = /* GraphQL */ `
  mutation paymentMethodsList($input: PaymentMethodsListInput!) {
    paymentMethodsList(input: $input) {
      paymentMethods
      defaultPaymentMethodId
    }
  }
`;

export const createDeviceToken = /* GraphQL */ `
  mutation createDeviceToken($input: CreateDeviceTokenInput!) {
    createDeviceToken(input: $input) {
      userId
      deviceToken
    }
  }
`;

export const createOrderQuery = /* GraphQL */ `
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
    }
  }
`;

export const calculateTaxQuery = /* GraphQL */ `
  mutation calculateTax($input: [OrderShipmentInput]) {
    calculateTax(input: $input) {
      items {
        calculatedTax
        assignedStoreId
      }
    }
  }
`;

export const createCart = /* GraphQL */ `
  mutation createCart($input: CreateCartInput!) {
    createCart(input: $input) {
      anonymousId
      belongsTo
      channel
      id
      orderStatus
      totalAmount
      totalDeliveryCharges
      totalDiscount
      totalProductAmount
      totalTaxAmount
      totalTipAmount
      transactionId
      userAgent
      userId
      cartShipment {
        nextToken
        items {
          assignedStoreId
          assignedStoreName
          cartId
          deliveryType
          id
          shipmentStatus
          subOrderAmount
          subTotalDeliveryCharges
          subTotal1800platformfee
          subTotalCardProcessingFee
          subTotalAmount
          subTotalDiscount
          subTotalProductAmount
          subTotalTax
          subTotalTipAmount
          updatedBy
          userId
          deliveryAddress {
            addrLine1
            addrLine2
            city
            country
            latitude
            longitude
            postCode
            state
          }
          lineItems {
            id
            prodShortDesc
            productId
            productName
            qtyPurchased
            size
            totalPrice
            unitPrice
            uom
            storeItemId
            storeItemDesc
          }
        }
      }
    }
  }
`;

export const updateCart = /* GraphQL */ `
  mutation updateCart($input: UpdateCartInput!) {
    updateCart(input: $input) {
      anonymousId
      belongsTo
      channel
      id
      orderStatus
      totalAmount
      totalDeliveryCharges
      totalDiscount
      totalProductAmount
      totalTaxAmount
      totalTipAmount
      transactionId
      userAgent
      userId
      cartShipment {
        nextToken
        items {
          assignedStoreId
          assignedStoreName
          cartId
          deliveryType
          id
          shipmentStatus
          subOrderAmount
          subTotalDeliveryCharges
          subTotal1800platformfee
          subTotalCardProcessingFee
          subTotalAmount
          subTotalDiscount
          subTotalProductAmount
          subTotalTax
          subTotalTipAmount
          updatedBy
          userId
          deliveryAddress {
            addrLine1
            addrLine2
            city
            country
            latitude
            longitude
            postCode
            state
          }
          lineItems {
            id
            prodShortDesc
            productId
            productName
            qtyPurchased
            size
            itemInvalid
            totalPrice
            unitPrice
            uom
            storeItemId
            storeItemDesc
          }
        }
      }
    }
  }
`;

export const updateCartShipment = /* GraphQL */ `
  mutation updateCartShipment($input: UpdateCartShipmentInput!) {
    updateCartShipment(input: $input) {
      id
    }
  }
`;

export const deleteCartShipment = /* GraphQL */ `
  mutation deleteCartShipment($input: DeleteCartShipmentInput!) {
    deleteCartShipment(input: $input) {
      id
    }
  }
`;

export const deleteCart = /* GraphQL */ `
  mutation deleteCart($input: DeleteCartInput!) {
    deleteCart(input: $input) {
      id
    }
  }
`;

export const createPaymentDetails = /* GraphQL */ `
  mutation createCustomerPayment($input: CreateCustomerPaymentInput!) {
    createCustomerPayment(input: $input) {
      bankName
      cardDefault
      cardHolderName
      cardNumber
      expDate
      postalCode
      userId
      id
    }
  }
`;

export const updatePaymentDetails = /* GraphQL */ `
  mutation updateCustomerPayment($input: UpdateCustomerPaymentInput!) {
    updateCustomerPayment(input: $input) {
      bankName
      cardDefault
      cardHolderName
      cardNumber
      expDate
      postalCode
      id
    }
  }
`;

export const createUserSocial = `
  mutation createUserSocial($input: CreateUserSocialInput!) {
    createUserSocial(input: $input) {
      customerProfile {
        id
      }
    }
  }
`;

export const createCustomerContactAddressOccasion = `
  mutation createCustomerContactAddressOccasion($input: CreateCustomerContactAddressOccasionInput!) {
    createCustomerContactAddressOccasion(input: $input) {
      customerContact {
        id
      }
    }
  }
`;

export const createCustomerContact = `
  mutation createCustomerContact($input: CreateCustomerContactInput!) {
    createCustomerContact(input: $input) {
        id
    }
  }
`;

export const createCustomerOccasion = /* GraphQL */ `
  mutation createCustomerOccasion($input: CreateCustomerOccasionInput!) {
    createCustomerOccasion(input: $input) {
      id
    }
  }
`;

export const updateCustomerOccasion = /* GraphQL */ `
  mutation updateCustomerOccasion($input: UpdateCustomerOccasionInput!) {
    updateCustomerOccasion(input: $input) {
      id
    }
  }
`;

export const updateOccasionsReminder = /* GraphQL */ `
  mutation updateOccasionsReminder($input: UpdateOccasionsReminderInput!) {
    updateOccasionsReminder(input: $input) {
      customerContactId
    }
  }
`;

export const updateCustomerContact = /* GraphQL */ `
  mutation updateCustomerContact($input: UpdateCustomerContactInput!) {
    updateCustomerContact(input: $input) {
      id
    }
  }
`;

export const deletePaymentDetails = /* GraphQL */ `
  mutation deleteCustomerPayment($input: DeleteCustomerPaymentInput!) {
    deleteCustomerPayment(input: $input) {
      id
    }
  }
`;

export const createUser = /* GraphQL */ `
  mutation createCustomerProfile($input: CreateCustomerProfileInput!) {
    createCustomerProfile(input: $input) {
      id
      userId
      firstName
      lastName
      middleName
      phoneNumber
      email
      deliveryToId
      deliveryTo
      subscribeToNotification
      orderLineitemReplacement
    }
  }
`;

export const updateCustomerProfile = /* GraphQL */ `
  mutation updateCustomerProfile($input: UpdateCustomerProfileInput!) {
    updateCustomerProfile(input: $input) {
      userId
      deliveryToId
      firstName
      lastName
      middleName
      email
      phoneNumber
    }
  }
`;

export const updateCustomerProfileDeliveryToId = /* GraphQL */ `
  mutation updateCustomerProfile($input: UpdateCustomerProfileInput!) {
    updateCustomerProfile(input: $input) {
      userId
      deliveryToId
    }
  }
`;

export const updateCustomerProfileSubscribeToNotification = /* GraphQL */ `
  mutation updateCustomerProfile($input: UpdateCustomerProfileInput!) {
    updateCustomerProfile(input: $input) {
      userId
      subscribeToNotification
    }
  }
`;

export const updateCustomerProfileOrderLineitemReplacement = /* GraphQL */ `
  mutation updateCustomerProfile($input: UpdateCustomerProfileInput!) {
    updateCustomerProfile(input: $input) {
      userId
      orderLineitemReplacement
    }
  }
`;

export const updateCustomerProfileOccasionReminderProfile = /* GraphQL */ `
  mutation updateCustomerProfile($input: UpdateCustomerProfileInput!) {
    updateCustomerProfile(input: $input) {
      userId
      occasionReminderProfile
    }
  }
`;

export const deleteContactDetails = /* GraphQL */ `
  mutation deleteCustomerContact($input: DeleteCustomerContactInput!) {
    deleteCustomerContact(input: $input) {
      id
    }
  }
`;

export const createCustomerAddress = /* GraphQL */ `
  mutation createCustomerAddress($input: CreateCustomerAddressInput!) {
    createCustomerAddress(input: $input) {
      id
      addressType
      firstName
      lastName
      middleName
      phoneNumber
      instructions
      addrLine1
      addrLine2
      city
      addrState
      postCode
      customerContactId
      markDefault
      country
      customType
      longitude
      latitude
    }
  }
`;

export const deleteCustomerOccasion = /* GraphQL */ `
  mutation deleteCustomerOccasion($input: DeleteCustomerOccasionInput!) {
    deleteCustomerOccasion(input: $input) {
      id
    }
  }
`;

export const deleteCustomerAddress = /* GraphQL */ `
  mutation deleteCustomerAddress($input: DeleteCustomerAddressInput!) {
    deleteCustomerAddress(input: $input) {
      id
    }
  }
`;

export const updateCustomerAddress = /* GraphQL */ `
  mutation updateCustomerAddress($input: UpdateCustomerAddressInput!) {
    updateCustomerAddress(input: $input) {
      id
      addressType
      firstName
      lastName
      middleName
      phoneNumber
      instructions
      addrLine1
      addrLine2
      city
      addrState
      postCode
      customerContactId
      markDefault
      country
      customType
      longitude
      latitude
    }
  }
`;

export const updateOrderShipment = /* GraphQL */ `
  mutation updateOrderShipment($input: UpdateOrderShipmentInput!) {
    updateOrderShipment(input: $input) {
      id
    }
  }
`;

export const getPDFDownload = /* GraphQL */ `
  mutation getPDFDownload($shipmentId: String!, $userId: String!) {
    getPDFDownload(shipmentId: $shipmentId, userId: $userId)
  }
`;


export const createUserWest = /* GraphQL */ `
  mutation createUserWest($email: String!, $firstName: String!, $lastName: String!, $password: String!, $phoneNumber: String!, $username: String!) {
    createUserWest(email: $email, firstName: $firstName, lastName: $lastName, password: $password, phoneNumber: $phoneNumber, username: $username)
  }
`;

export const updateChangePassword = /* GraphQL */ `
  mutation updateChangePassword($input: UpdateChangePasswordInput!) {
    updateChangePassword(input: $input)
  }
`;

export const updateEmailVerification = /* GraphQL */ `
  mutation updateEmailVerification($input: UpdateEmailVerificationInput!) {
    updateEmailVerification(input: $input)
  }
`;

export const updateForgetPassword = /* GraphQL */ `
  mutation updateForgetPassword($input: UpdateForgetPasswordInput!) {
    updateForgetPassword(input: $input)
  }
`;

export const updateConfirmSignup = /* GraphQL */ `
  mutation updateConfirmSignup($input: UpdateConfirmSignupInput!) {
    updateConfirmSignup(input: $input)
  }
  `;