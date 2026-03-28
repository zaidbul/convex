export function getDOMRangeRect(nativeSelection: Selection, rootElement: HTMLElement): DOMRect {
  if (nativeSelection.rangeCount === 0) {
    return rootElement.getBoundingClientRect();
  }

  const domRange = nativeSelection.getRangeAt(0);

  let rect;

  if (nativeSelection.anchorNode === rootElement) {
    let inner = rootElement;
    while (inner.firstElementChild != null) {
      inner = inner.firstElementChild as HTMLElement;
    }
    rect = inner.getBoundingClientRect();
  } else {
    rect = domRange.getBoundingClientRect();
  }

  return rect;
}
