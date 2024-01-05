/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String!) {
    onCreateUser(owner: $owner) {
      userName
      name
      email
      phoneNumber
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String!) {
    onUpdateUser(owner: $owner) {
      userName
      name
      email
      phoneNumber
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String!) {
    onDeleteUser(owner: $owner) {
      userName
      name
      email
      phoneNumber
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateAddress = /* GraphQL */ `
  subscription OnCreateAddress($owner: String!) {
    onCreateAddress(owner: $owner) {
      id
      addrLine1
      addrLine2
      addrLine3
      city
      state
      country
      postCode
      latitude
      longitude
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateAddress = /* GraphQL */ `
  subscription OnUpdateAddress($owner: String!) {
    onUpdateAddress(owner: $owner) {
      id
      addrLine1
      addrLine2
      addrLine3
      city
      state
      country
      postCode
      latitude
      longitude
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteAddress = /* GraphQL */ `
  subscription OnDeleteAddress($owner: String!) {
    onDeleteAddress(owner: $owner) {
      id
      addrLine1
      addrLine2
      addrLine3
      city
      state
      country
      postCode
      latitude
      longitude
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateMerchantAccount = /* GraphQL */ `
  subscription OnCreateMerchantAccount($owner: String!) {
    onCreateMerchantAccount(owner: $owner) {
      id
      companyName
      contactName
      contactPhoneNumber
      contactEmail
      billingAddress {
        id
        addrLine1
        addrLine2
        addrLine3
        city
        state
        country
        postCode
        latitude
        longitude
        createdAt
        updatedAt
        owner
      }
      accountSatus
      accountStatusReason
      approvedAt
      approvedBy
      Stores {
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateMerchantAccount = /* GraphQL */ `
  subscription OnUpdateMerchantAccount($owner: String!) {
    onUpdateMerchantAccount(owner: $owner) {
      id
      companyName
      contactName
      contactPhoneNumber
      contactEmail
      billingAddress {
        id
        addrLine1
        addrLine2
        addrLine3
        city
        state
        country
        postCode
        latitude
        longitude
        createdAt
        updatedAt
        owner
      }
      accountSatus
      accountStatusReason
      approvedAt
      approvedBy
      Stores {
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteMerchantAccount = /* GraphQL */ `
  subscription OnDeleteMerchantAccount($owner: String!) {
    onDeleteMerchantAccount(owner: $owner) {
      id
      companyName
      contactName
      contactPhoneNumber
      contactEmail
      billingAddress {
        id
        addrLine1
        addrLine2
        addrLine3
        city
        state
        country
        postCode
        latitude
        longitude
        createdAt
        updatedAt
        owner
      }
      accountSatus
      accountStatusReason
      approvedAt
      approvedBy
      Stores {
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateStore = /* GraphQL */ `
  subscription OnCreateStore($owner: String!) {
    onCreateStore(owner: $owner) {
      id
      storeNumber
      storeName
      address {
        id
        addrLine1
        addrLine2
        addrLine3
        city
        state
        country
        postCode
        latitude
        longitude
        createdAt
        updatedAt
        owner
      }
      merchantAccountId
      merchantAccount {
        id
        companyName
        contactName
        contactPhoneNumber
        contactEmail
        accountSatus
        accountStatusReason
        approvedAt
        approvedBy
        createdAt
        updatedAt
        owner
      }
      status
      statusReason
      statusUpdatedAt
      statusUpdatedBy
      storePhotos
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateStore = /* GraphQL */ `
  subscription OnUpdateStore($owner: String!) {
    onUpdateStore(owner: $owner) {
      id
      storeNumber
      storeName
      address {
        id
        addrLine1
        addrLine2
        addrLine3
        city
        state
        country
        postCode
        latitude
        longitude
        createdAt
        updatedAt
        owner
      }
      merchantAccountId
      merchantAccount {
        id
        companyName
        contactName
        contactPhoneNumber
        contactEmail
        accountSatus
        accountStatusReason
        approvedAt
        approvedBy
        createdAt
        updatedAt
        owner
      }
      status
      statusReason
      statusUpdatedAt
      statusUpdatedBy
      storePhotos
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteStore = /* GraphQL */ `
  subscription OnDeleteStore($owner: String!) {
    onDeleteStore(owner: $owner) {
      id
      storeNumber
      storeName
      address {
        id
        addrLine1
        addrLine2
        addrLine3
        city
        state
        country
        postCode
        latitude
        longitude
        createdAt
        updatedAt
        owner
      }
      merchantAccountId
      merchantAccount {
        id
        companyName
        contactName
        contactPhoneNumber
        contactEmail
        accountSatus
        accountStatusReason
        approvedAt
        approvedBy
        createdAt
        updatedAt
        owner
      }
      status
      statusReason
      statusUpdatedAt
      statusUpdatedBy
      storePhotos
      createdAt
      updatedAt
      owner
    }
  }
`;
