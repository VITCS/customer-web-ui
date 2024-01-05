import { useState } from 'react';

const useUpload = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const handleChangeImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUploadImage = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', image);
    } catch (error) {
      console.log(error);
    } finally {
      setImage(null);
      setLoading(false);
    }
  };

  return {
    image,
    uploadedImage,
    loading,
    handleChangeImage,
    handleUploadImage,
  };
};

export default useUpload;
