const cloudinary = require('cloudinary').v2;

// Utility function to extract the Cloudinary public ID from the image URL
const extractPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const publicIdWithExtension = parts[parts.length - 1]; // Get the file name with extension
  const publicId = publicIdWithExtension.split('.')[0]; // Remove the extension
  return `${parts[parts.length - 2]}/${publicId}`; // Return folderName/publicId
};

// Utility function to delete an image from Cloudinary
const deleteCloudinaryImage = async (avatarUrl) => {
  try {
    const publicId = extractPublicIdFromUrl(avatarUrl);
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted Cloudinary image with public_id: ${publicId}`);
  } catch (error) {
    console.error('Error deleting Cloudinary image:', error);
    throw new Error('Failed to delete Cloudinary image');
  }
};

module.exports = { deleteCloudinaryImage };