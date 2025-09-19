// utils/fileValidation.ts
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg', 
  'image/jpg',
  'image/png'
];

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png'
];

export const validateDocumentFile = (file: Express.Multer.File): boolean => {
  return ALLOWED_DOCUMENT_TYPES.includes(file.mimetype);
};

export const validateImageFile = (file: Express.Multer.File): boolean => {
  return ALLOWED_IMAGE_TYPES.includes(file.mimetype);
};

