import bcrypt from 'bcryptjs';

// Hash function using bcrypt with salt
export const hash = async (plainPassword: string): Promise<string> => {
  // Generate a salt with cost factor 12 (can be adjusted based on security needs)
  const salt = await bcrypt.genSalt(12);
  // Hash password with the generated salt
  return bcrypt.hash(plainPassword, salt);
};

// Compare function using bcrypt's built-in compare
export const compare = async (
  plainPassword: string,
  encryptedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, encryptedPassword);
};
