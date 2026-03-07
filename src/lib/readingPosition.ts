export interface ScrollLikeElement {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

export interface ReadingPosition {
  progress: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const getMaxScrollTop = (element: ScrollLikeElement): number =>
  Math.max(0, element.scrollHeight - element.clientHeight);

export const captureReadingPosition = (element: ScrollLikeElement): ReadingPosition => {
  const maxScrollTop = getMaxScrollTop(element);

  if (maxScrollTop === 0) {
    return { progress: 0 };
  }

  return {
    progress: clamp(element.scrollTop / maxScrollTop, 0, 1)
  };
};

export const restoreReadingPosition = (
  element: ScrollLikeElement,
  position: ReadingPosition
): void => {
  const maxScrollTop = getMaxScrollTop(element);
  element.scrollTop = maxScrollTop * clamp(position.progress, 0, 1);
};
