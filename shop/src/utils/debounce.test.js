import { debounce } from './debounce';

describe('debounce', () => {
  vi.useFakeTimers();

  test('should debounce function calls', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc('a');
    debouncedFunc('b');
    debouncedFunc('c');

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('c');
  });

  test('should flush pending call', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc('test');
    expect(func).not.toHaveBeenCalled();

    debouncedFunc.flush();

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('test');

    // Ensure timer is cleared/invalidated
    vi.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should not flush if no pending call', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, 1000);

      debouncedFunc.flush();
      expect(func).not.toHaveBeenCalled();
  });
});
