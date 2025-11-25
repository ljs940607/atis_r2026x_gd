/**
 * Custom hook to access the UWA object from the window.
 * @returns {object} An object containing the UWA object.
 */
export function useUWA() {
  let UWA = window.UWA;
  if (process.env.NODE_ENV !== 'production') {
    UWA = {
      log: (message) => {
        console.log(`${message}`);
      },
    };
  }
  return {
    UWA,
  };
}
