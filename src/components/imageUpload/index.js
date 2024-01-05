import { Button, Image, VStack } from '@chakra-ui/react';
import React, { useRef } from 'react';
import useUpload from './useUpload';

const ImageUpload = () => {
  const imageRef = useRef(null);
  const { loading, image, handleChangeImage, handleUploadImage } = useUpload();

  return (
    <>
      <Input
        variant="filled"
        style={{ display: 'none' }}
        type="file"
        accept="image/*"
        ref={imageRef}
        onChange={handleChangeImage}
      />
      {image && (
        <VStack my="4">
          <Image
            src={URL.createObjectURL(image)}
            width="300px"
            height="300px"
            alt="selected image..."
          />
          <Button
            onClick={handleUploadImage}
            variant="outline"
            colorScheme="green"
            isLoading={loading}
          >
            Upload
          </Button>
        </VStack>
      )}
      <VStack>
        <Button onClick={() => imageRef.current.click()} colorScheme="blue">
          Select Image
        </Button>
      </VStack>
    </>
  );
};

export default ImageUpload;
