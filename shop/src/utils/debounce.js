export function debounce(func, wait) {
  let timeout;
  let args;
  let context;

  function debounced(...a) {
    args = a;
    context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
      timeout = null;
    }, wait);
  }

  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = null;
  };

  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      func.apply(context, args);
      timeout = null;
    }
  };

  return debounced;
}
