import { useEffect, RefObject, DependencyList } from 'react';

export const useScrollToBottom = (
  ref: RefObject<HTMLElement | null>,
  dependencies: DependencyList
) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dependencies, ref]);
};
