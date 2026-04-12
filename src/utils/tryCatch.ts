export const tryCatch = async <T>(
  fn: () => Promise<T>
): Promise<[T | null, unknown]> => {
  try {
    const data = await fn();
    return [data, null];
  } catch (error: unknown) {
    return [null, error];
  }
};