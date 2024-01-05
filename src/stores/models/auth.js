import { Auth, graphqlOperation } from 'aws-amplify';
import { getMessaging, getToken } from 'firebase/messaging';
import awsExports from '../../aws-exports';
import { createDeviceToken, createUserSocial, createUserWest } from '../../graphql/mutations';
import { getCustomerProfile, getS3SignedURL } from '../../graphql/queries';
import { graphql } from '../../utils/api';

const authStore = {
  state: {
    user: null,
  },
  reducers: {
    SET_USER(state, payload) {
      return {
        ...state,
        profileImage: payload.profileImage || null,
        user: payload.user || null,
      };
    },
    SET_ACCOUNT_CREATED(state, payload) {
      return {
        ...state,
        accountCreated: payload,
      };
    },
    SET_DELIVERYTO(state, payload) {
      return {
        ...state,
        user: payload,
      };
    },
    SET_PROFILEIMAGE(state, payload) {
      return {
        ...state,
        profileImage: payload.profileImage,
      };
    },
  },
  effects: (dispatch) => ({
    setDeliveryTo(payload) {
      dispatch.auth.SET_DELIVERYTO(payload);
    },
    setProfileImageUrl(payload) {
      this.SET_PROFILEIMAGE(payload);
    },
    async fetchAndSetUser() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const dbUser = await graphql(
          graphqlOperation(getCustomerProfile, {
            userId: user.username,
          }),
        );
        let s3SignedURL = '';
        let userObj = dbUser?.data?.getCustomerProfile;
        if (userObj?.userId) {
          const userId = userObj?.userId;
          let socialUser = false;
          socialUser = ['Google', 'Facebook', 'Apple'].find((e) =>
            userId.startsWith(e),
          );
          if (socialUser) {
            userObj = { ...userObj, isSocialLogin: true };
          } else {
            userObj = { ...userObj, isSocialLogin: false };
          }
        }

        if (userObj?.profileImage) {
          await graphql(
            graphqlOperation(getS3SignedURL, {
              contentType: 'image/jpeg',
              fileName: userObj?.profileImage,
              userId: userObj?.userId,
              requestType: 'get',
            }),
          ).then((r) => {
            if (r.data?.getS3SignedURL?.signedURL) {
              s3SignedURL = r.data?.getS3SignedURL?.signedURL;
            }
          });
        }

        const messaging = getMessaging();
        getToken(messaging, {
          vapidKey: awsExports.firebase_vapidKey,
        })
          .then((fcmToken) => {
            const CreateDeviceTokenInput = {
              deviceToken: fcmToken,
              userId: userObj?.userId,
              userPool: 'Customer',
              userType: 'SignedIn',
            };

            const graphqlQueryProduct = graphqlOperation(createDeviceToken, {
              input: CreateDeviceTokenInput,
            });

            graphql({
              ...graphqlQueryProduct,
              authMode: 'API_KEY',
              authToken: awsExports.aws_appsync_apiKey,
            })
              .then((res) => {
                console.log('Device token saved successfully', res);
              })
              .catch((err) => {
                console.log('Error while saving device token', err);
              });
          })
          .catch((err) => {
            console.log('Error getToken for firebase', err);
          });

        dispatch.auth.SET_USER({
          user: userObj,
          profileImage: s3SignedURL,
        });
        return userObj;
      } catch (error) {
        console.log('fetchAndSetUser', error);
      }
    },
    async signUp(payload) {
      const {
        email,
        phone_number,
        given_name,
        middle_name,
        family_name,
        firstName,
        middleName,
        lastName,
        addlSignupData,
        addlPaymentDetails,
        username,
        password,
      } = payload;

      const tempSignUpObj = {
        attributes: {
          email,
          phone_number,
          given_name,
          middle_name,
          family_name,
          'custom:fullName': `${firstName} ${middleName} ${lastName}`,
          'custom:addlSignupData': addlSignupData,
          'custom:addlPaymentDetails': addlPaymentDetails,
        },
        username,
        password,
      };

      const res = await Auth.signUp(tempSignUpObj);

      const createUserWestResp = graphqlOperation(createUserWest, {
        email,
        firstName: given_name,
        lastName: family_name,
        password,
        phoneNumber: phone_number,
        username,
      });

      graphql({
        ...createUserWestResp,
        authMode: 'API_KEY',
        authToken: awsExports.aws_appsync_apiKey,
      }).then((res) => {
        console.log('User saved successfully', res);
      })
      .catch((err) => {
        console.log('Error while saving user', err);
      });

      return res;
    },

    async createCustomerProfile(payload) {
      try {
        const {
          email,
          phone_number,
          given_name,
          middle_name,
          family_name,
          firstName,
          middleName,
          lastName,
          username,
          addressType,
          ContactCategory,
          addrLine1,
          addrLine2,
          city,
          addrState,
          postCode,
          country,
          longitude,
          latitude,
          markDefault,
          subscribeToNotification,
          orderLineitemReplacement,
        } = payload;

        const profileInput = {
          userId: username,
          firstName: given_name,
          lastName: family_name,
          middleName: middle_name,
          phoneNumber: phone_number,
          email,
          deliveryTo: true,
          // subscribeToNotification,
          // orderLineitemReplacement,
        };

        const contactInput = {
          userId: username,
          firstName: given_name,
          lastName: family_name,
          middleName: middle_name,
          phoneNumber: phone_number,
          email,
          addressType,
          contactCategory: 'Self',
        };

        const addressInput = {
          firstName,
          middleName,
          lastName,
          addressType,
          customType: ContactCategory,
          addrLine1,
          addrLine2,
          city,
          addrState,
          postCode,
          longitude,
          latitude,
          country,
          markDefault,
        };

        const customerInput = {
          createCustomerProfileInput: profileInput,
          createCustomerContactInput: contactInput,
          createCustomerAddressInput: addressInput,
        };
        const res = await graphql(
          graphqlOperation(createUserSocial, {
            input: customerInput,
          }),
        );

        return res;
      } catch (error) {
        console.log('createCustomerProfile', error);
      }
    },

    async signOut() {
      await Auth.signOut();

      dispatch.auth.SET_USER({
        user: null,
      });
    },
  }),
};

export default authStore;
