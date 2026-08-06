export const debounce = <A>(action: (args: A) => void, delayMs: number): typeof action => {
  let timeoutId: number;

  return (actionArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => action(actionArgs), delayMs);
  };
};
