import { graphqlOperation } from '@aws-amplify/api-graphql';
import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { connect } from 'react-redux';
import { getS3SignedURL } from '../../../graphql/queries';
import { graphql } from '../../../utils/api';
import EditProfileDetails from '../edit-profile-details';

const ProfilePrimaryDetails = (props) => {
  const { user, profileImage, setProfileImageUrl } = props;

  const {
    isOpen: isEditUserModalOpen,
    onClose: onEditUserModalClose,
    onOpen: onEditUserModalOpen,
  } = useDisclosure();

  const displayImageRef = useRef(null);
  const imageInputRef = useRef(null);
  const toast = useToast();
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);
  const handleChangeImage = (e) => {
    setImage(e.target.files[0]);
    e.target.value = '';
    setShow(true);
  };

  const uploadToS3 = async (signedURL, file) => {
    try {
      const options = {
        headers: {
          'Content-Type': file.type,
        },
      };
      const resp = await axios.put(signedURL, file, options);

      setShow(false);

      toast({
        title: 'Success',
        description: 'successfully uploaded profile image.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.message || 'Something went wrong. Please try again',
        status: 'error',
      });
    }
  };

  const submit = async () => {
    try {
      const { name, type } = image;
      const res = await graphql(
        graphqlOperation(getS3SignedURL, {
          contentType: type,
          fileName: name,
          userId: user?.userId,
          requestType: 'put',
        }),
      );
      if (res && res.data?.getS3SignedURL) {
        const { signedURL } = res.data.getS3SignedURL;
        await uploadToS3(signedURL, image).then(() => {
          setProfileImageUrl({ profileImage: URL.createObjectURL(image) });
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.message || 'Something went wrong. Please try again',
        status: 'error',
      });
    }
  };

  return (
    <Grid
      mt="8"
      mr="8"
      columns={2}
      ml="12"
      templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
    >
      <GridItem mb="10">
        <Flex direction={{ base: 'column', lg: 'row' }}>
          <Box>
            <EditProfileDetails
              user={user}
              isOpen={isEditUserModalOpen}
              onClose={onEditUserModalClose}
            />
          </Box>
          <Box w={{ base: '100%', lg: '22%' }} mr="5" mb="3">
            <Stack align="center">
              <Image
                src={profileImage || require('../../../assets/defaultUser.png')}
                width="100px"
                height="100px"
                ref={displayImageRef}
              />
              {/* <Text fontSize="md">{user?.firstName}</Text> */}
              <input
                variant="filled"
                style={{ display: 'none' }}
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={handleChangeImage}
              />

              {image && show ? (
                <Box mt="2">
                  <Text>Image Preview: </Text>
                  <Box style={{ position: 'relative' }} mt="2">
                    <Image
                      src={
                        image
                          ? URL.createObjectURL(image)
                          : require('../../../assets/defaultUser.png')
                      }
                      width="100px"
                      height="100px"
                    />
                    <IconButton
                      style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        border: 'none',
                      }}
                      p="1"
                      color="brand.red"
                      variant="outline"
                      onClick={() => {
                        setShow(false);
                      }}
                      icon={<CloseIcon />}
                    />
                  </Box>

                  <Button onClick={submit} mt="3">
                    Upload Now
                  </Button>
                </Box>
              ) : (
                <Button
                  colorScheme="blue"
                  onClick={() => imageInputRef.current.click()}
                >
                  Browse
                </Button>
              )}
            </Stack>
          </Box>
          <Box w={{ base: '100%', lg: '100%' }}>
            <SimpleGrid columns={2} spacing={4} fontSize="lg">
              <Box fontWeight="bold">User Id</Box>
              <Box>{user.userId}</Box>
              <Box fontWeight="bold">User Name</Box>
              <Box>
                {user.firstName} {user.middleName} {user.lastName}
              </Box>

              <Box fontWeight="bold">Email - Id</Box>
              <Box>{user.email} </Box>

              <Box fontWeight="bold">Mobile Number</Box>
              <Box>{formatPhoneNumberIntl(user.phoneNumber)} </Box>
            </SimpleGrid>
          </Box>
        </Flex>
      </GridItem>
      <GridItem textAlign="right" mb="10">
        <Button
          onClick={() => {
            // setDrawerOpen(true);
            onEditUserModalOpen();
          }}
        >
          Edit
        </Button>
      </GridItem>
    </Grid>
  );
};

const stateMapper = (state) => ({
  user: state.auth.user,
  profileImage: state.auth.profileImage,
});

const dispatchMapper = (dispatch) => ({
  setProfileImageUrl: dispatch.auth.setProfileImageUrl,
});

export default connect(stateMapper, dispatchMapper)(ProfilePrimaryDetails);
