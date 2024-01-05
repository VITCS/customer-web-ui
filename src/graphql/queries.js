export const getOrder = /* GraphQL */ `
  query getOrder($id: ID!) {
    getOrder(id: $id) {
      cartId
      channel
      #closedAt
      #createdAt
      id
      orderShipment {
        items {
          actionType
          assignedStoreId
          assignedStoreName
          #createdAt
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
          deliveryType
          id
          orderId
          orderLineItems {
            id
            prodShortDesc
            productId
            productName
            qtyPurchased
            size
            totalPrice
            unitPrice
            uom
          }
          shipmentStatus
          subOrderAmount
          subTotalDeliveryCharges
          subTotal1800platformfee
          subTotalCardProcessingFee
          shipmentLevelReplacement
          shipmentLevelReplacementFee
          totalPayableAmount
          subTotalAmount
          subTotalDiscount
          subTotalProductAmount
          subTotalTax
          subTotalTipAmount
          #updatedAt
          updatedBy
          userId
        }
      }
      orderStatus
      totalAmount
      totalDeliveryCharges
      totalDiscount
      totalProductAmount
      totalTaxAmount
      totalTipAmount
      transactionId
      #updatedAt
      userAgent
      userId
    }
  }
`;

export const seachProductsElasic = /* GraphQL */ `
  query searchProducts($limit: Int, $filter: SearchableProductFilterInput) {
    searchProducts(filter: $filter, limit: $limit) {
      items {
        brandLine
        id
        prodName
        prodFullName
        images
      }
    }
  }
`;

export const getOrderByUserId = /* GraphQL */ `
  query getOrderByUserId(
    $userId: ID!
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getOrderByUserId(
      userId: $userId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      nextToken
      items {
        orderStatus
        orderShipment {
          items {
            actionType
            assignedStoreId
            deliveryType
            shipmentStatus
            assignedStoreName
            createdAt
            rejectionMsg
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
            id
            orderId
            orderLineItems {
              id
              prodShortDesc
              productId
              productName
              qtyPurchased
              size
              totalPrice
              unitPrice
              uom
            }
            statusHistory {
              fromStatus
              toStatus
              updatedBy
              updatedAt
            }
            subOrderAmount
            subTotalDeliveryCharges
            subTotalMerchantCharges
            subTotal1800platformfee
            subTotalCardProcessingFee
            shipmentLevelReplacement
            shipmentLevelReplacementFee
            totalPayableAmount
            subTotalAmount
            subTotalDiscount
            subTotalProductAmount
            subTotalTax
            subTotalTipAmount
            updatedAt
            updatedBy
            userId
          }
          nextToken
        }
        cartId
        channel
        #closedAt
        createdAt
        id
        totalAmount
        totalDeliveryCharges
        totalDiscount
        totalProductAmount
        totalTaxAmount
        totalTipAmount
        transactionId
        updatedAt
        userAgent
        userId
      }
    }
  }
`;
export const listOrdersByUserId = /* GraphQL */ `
  query listOrdersByUserId(
    $userId: String!
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrdersByUserId(
      userId: $userId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      nextToken
      items {
        orderStatus
        orderShipment {
          items {
            actionType
            assignedStoreId
            deliveryType
            shipmentStatus
            assignedStoreName
            createdAt
            rejectionMsg
            isUpdated
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
            id
            orderId
            orderLineItems {
              id
              prodShortDesc
              productId
              productName
              qtyPurchased
              size
              totalPrice
              unitPrice
              uom
            }
            statusHistory {
              fromStatus
              toStatus
              updatedBy
              updatedAt
            }
            subOrderAmount
            subTotalDeliveryCharges
            subTotal1800platformfee
            subTotalCardProcessingFee
            shipmentLevelReplacement
            shipmentLevelReplacementFee
            totalPayableAmount
            subTotalAmount
            subTotalDiscount
            subTotalProductAmount
            subTotalTax
            subTotalTipAmount
            updatedAt
            updatedBy
            userId
          }
          nextToken
        }
        cartId
        channel
        #closedAt
        createdAt
        id
        totalAmount
        totalDeliveryCharges
        totalDiscount
        totalProductAmount
        totalTaxAmount
        totalTipAmount
        transactionId
        updatedAt
        userAgent
        userId
      }
    }
  }
`;

export const searchStores = /* GraphQL */ `
  query searchStores(
    $filter: SearchableStoreFilterInput
    $lat: Float!
    $lon: Float!
    $distance: Int!
  ) {
    searchStores(filter: $filter, lat: $lat, lon: $lon, distance: $distance) {
      items {
        id
        storeName
        scheduleHours {
          Fri
          Mon
          Sat
          Sun
          Thu
          Tue
          Wed
        }
        deliveryHours {
          Fri
          Mon
          Sat
          Sun
          Thu
          Tue
          Wed
        }
        address {
          addrLine1
          addrLine2
          city
          latitude
          longitude
          postCode
          state
        }
        deliveryScope {
          deliveryType
        }
        deliveryFee
        creditCardProcessingPercent
        creditCardProcessingFlatFee
        merchantFeeToCustomer
      }
    }
  }
`;

export const searchStore = /* GraphQL */ `
  query searchStore(
    $filter: SearchableStoreFilterInput
    $lat: Float!
    $lon: Float!
    $distance: Int!
    $showAll: Boolean
  ) {
    searchStore(
      filter: $filter
      lat: $lat
      lon: $lon
      distance: $distance
      showAll: $showAll
    ) {
      items {
        id
        storeName
        scheduleHours {
          Fri
          Mon
          Sat
          Sun
          Thu
          Tue
          Wed
        }
        deliveryHours {
          Fri
          Mon
          Sat
          Sun
          Thu
          Tue
          Wed
        }
        address {
          addrLine1
          addrLine2
          city
          latitude
          longitude
          postCode
          state
        }
        deliveryScope {
          deliveryType
        }
        deliveryFee
        creditCardProcessingPercent
        creditCardProcessingFlatFee
        merchantFeeToCustomer
      }
    }
  }
`;

export const getCart = /* GraphQL */ `
  query getCart($id: ID!) {
    getCart(id: $id) {
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
          deliveryFee
          creditCardProcessingPercent
          creditCardProcessingFlatFee
          id
          shipmentStatus
          subOrderAmount
          subTotalDeliveryCharges          
          subTotal1800platformfee
          subTotalCardProcessingFee
          merchantFeeToCustomer
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

export const getCartByUserId = /* GraphQL */ `
  query getCartByUserId($userId: String!) {
    getCartByUserId(userId: $userId) {
      items {
        id
      }
    }
  }
`;

export const getStore = /* GraphQL */ `
  query getStore($id: ID!) {
    getStore(id: $id) {
      businessHours {
        Fri
        Mon
        Sat
        Thu
        Sun
        Tue
        Wed
      }
      deliveryHours {
        Fri
        Mon
        Sat
        Thu
        Sun
        Tue
        Wed
      }
      scheduleHours {
        Fri
        Mon
        Sat
        Thu
        Sun
        Tue
        Wed
      }
      deliveryFee
      merchantFeeToCustomer
      creditCardProcessingPercent
      creditCardProcessingFlatFee
      deliveryScope {
        MinOrderSize
      }
    }
  }
`;

export const searchStoresByProductId = /* GraphQL */ `
  query searchPriceAndAvailabilitys(
    $filter: SearchablePriceAndAvailabilityFilterInput
    $lat: Float!
    $lon: Float!
    $distance: Int!
  ) {
    searchPriceAndAvailabilitys(
      filter: $filter
      lat: $lat
      lon: $lon
      distance: $distance
    ) {
      items {
        id
        storeId
        price
        storeItemId
        storeItemDesc
      }
    }
  }
`;

export const searchAddress = /* GraphQL */ `
  query searchAddress($input: SearchAddressInput!) {
    searchAddress(input: $input) {
      items {
        city
        entries
        secondary
        state
        street_line
        zipcode
      }
    }
  }
`;
export const searchProductsLambda = /* GraphQL */ `
  query searchProductsLambda(
    $filter: SearchableProductFilterInput
    $limit: Int
    $nextToken: String
    $distance: Int
    $from: Int
    $lat: Float
    $lon: Float
    $maxPrice: Float
    $minPrice: Float
    $sort: SearchableProductSortInput
  ) {
    searchProductsLambda(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      distance: $distance
      from: $from
      lat: $lat
      lon: $lon
      maxPrice: $maxPrice
      minPrice: $minPrice
      sort: $sort
    ) {
      items {
        id
        prodFullName
        prodName
        prodCategory
        imageFile
        brandLine
        manufacturer
        prodMinor
        region
        abv
        price
      }
      nextToken
      brand {
        key
        doc_count
      }
      ProdCategory {
        key
        doc_count
      }
      manufacturer {
        key
        doc_count
      }
      prodMajor {
        key
        doc_count
      }
      prodMinor {
        key
        doc_count
      }
      country {
        key
        doc_count
      }
      container {
        key
        doc_count
      }
      total
    }
  }
`;

export const searchProducts = /* GraphQL */ `
  query searchProducts(
    $filter: SearchableProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    searchProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        prodFullName
        prodName
        prodCategory
        imageFile
        brandLine
        manufacturer
        prodMinor
        region
        abv
      }
      nextToken
      brand {
        key
        doc_count
      }
      ProdCategory {
        key
        doc_count
      }
      manufacturer {
        key
        doc_count
      }
      ProdMajor {
        key
        doc_count
      }
      ProdMinor {
        key
        doc_count
      }
      majorType {
        key
        doc_count
      }
      country {
        key
        doc_count
      }
      container {
        key
        doc_count
      }
      total
    }
  }
`;

export const searchProductsByCategory = /* GraphQL */ `
  query searchProducts(
    $filter: SearchableProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    searchProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        prodFullName
        prodName
        prodCategory
        imageFile
        brandLine
        manufacturer
        prodMinor
        region
        abv
      }
      nextToken
    }
  }
`;

export const getCustomerProfile = /* GraphQL */ `
  query getCustomerProfile($userId: ID!) {
    getCustomerProfile(userId: $userId) {
      id
      phoneNumber
      firstName
      lastName
      middleName
      email
      userId
      profileImage
      deliveryToId
      customerContact {
        items {
          email
          id
          phoneNumber
          lastName
          firstName
        }
      }
      deliveryToAddress {
        customerContactId
        firstName
        lastName
        addressType
        id
        latitude
        longitude
        addrLine1
        addrLine2
        city
        addrState
        country
        postCode
      }
      subscribeToNotification
      orderLineitemReplacement
      customerId
    }
  }
`;

export const getCustomerPaymentByCustomerProfileId = /* GraphQL */ `
  query CustomerPaymentByCustomerProfileId($userId: ID!) {
    CustomerPaymentByCustomerProfileId(userId: $userId) {
      items {
        id
        bankName
        cardHolderName
        cardNumber
        expDate
        postalCode
        cardDefault
        userId
        customerId
      }
    }
  }
`;

export const getCustomerContacts = /* GraphQL */ `
  query CustomerContactsByCustomerProfileId(
    $userId: ID!
    $filter: ModelCustomerContactFilterInput
  ) {
    CustomerContactsByCustomerProfileId(userId: $userId, filter: $filter) {
      items {
        id
        contactCategory
        contactCustomType
        firstName
        lastName
        middleName
        phoneNumber
        email
        defaultAddressId
        deliveryAddress {
          items {
            id
            addrLine1
            addrLine2
            addressType
            firstName
            city
            instructions
            lastName
            markDefault
            middleName
            phoneNumber
            postCode
            addrState
            customType
            country
            latitude
            longitude
          }
        }
        occasions {
          items {
            occasionDate
            occasionTitle
            reminder
            id
          }
        }
      }
    }
  }
`;

export const getCustomerOccasions = /* GraphQL */ `
  query CustomerOccasionByCustomerContactId($id: ID!) {
    CustomerOccasionByCustomerContactId(id: $id) {
      items {
        id
        occasionTitle
        occasionDate
        reminder
        customerContactId
      }
    }
  }
`;

export const getCustomerAddresses = /* GraphQL */ `
  query CustomerAddressByCustomerContactId($id: ID!) {
    CustomerAddressByCustomerContactId(id: $id) {
      items {
        id
        instructions
        addrLine1
        addrLine2
        addressType
        city
        firstName
        lastName
        phoneNumber
        middleName
        postCode
        addrState
        markDefault
      }
    }
  }
`;

export const getS3SignedURL = /* GraphQL */ `
  query getS3SignedURL(
    $contentType: String!
    $fileName: String!
    $userId: String!
    $requestType: String!
  ) {
    getS3SignedURL(
      contentType: $contentType
      fileName: $fileName
      userId: $userId
      requestType: $requestType
    ) {
      fileName
      signedURL
    }
  }
`;
export const onRejectionNotificationUpdate = /* GraphQL */ `
  subscription onRejectionNotificationUpdate($userId: ID!) {
    onRejectionNotificationUpdate(userId: $userId) {
      rejectionMsg
      orderId
      id
    }
  }
`;

export const onUpdateOrderShipmentNotification = /* GraphQL */ `
  subscription onUpdateOrderShipmentNotification($userId: ID!) {
    onUpdateOrderShipmentNotification(userId: $userId) {
      orderId
      id
    }
  }
`;

export const getPromotions = /* GraphQL */ `
  query getPromotions {
    listCarouselData {
      imageUrl
      name
      tags {
        Key
        Value
      }
    }
  }
`;
