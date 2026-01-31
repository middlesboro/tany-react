import { debounce } from './debounce';

describe('debounce', () => {
  jest.useFakeTimers();

  test('should debounce function calls', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc('a');
    debouncedFunc('b');
    debouncedFunc('c');

    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('c');
  });

  test('should flush pending call', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc('test');
    expect(func).not.toHaveBeenCalled();

    debouncedFunc.flush();

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('test');

    // Ensure timer is cleared/invalidated
    jest.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should not flush if no pending call', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 1000);

      debouncedFunc.flush();
      expect(func).not.toHaveBeenCalled();
  });
});
