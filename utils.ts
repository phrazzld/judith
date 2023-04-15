export const countWords = (str: string) => str.trim().split(/\s+/).length;

export const debug = (...args: any) => {
  if (process.env.NODE_ENV === "development") {
    console.debug(args);
  }
}
