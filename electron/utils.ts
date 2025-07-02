export const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true' || !process.env.NODE_ENV;

export const formatError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const sanitizeInput = (input: string): string => {
  // Basic sanitization - for more comprehensive sanitization, use security.ts
  return input.trim().replace(/[<>]/g, '');
}; 