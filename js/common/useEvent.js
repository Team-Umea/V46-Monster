//Code to init html elements, like adding eventlisterners that is, goes here
export function useClickEvent(element, callback) {
  element.addEventListener("click", () => {
    callback();
  });
}

export function useClickEvents(elements, callback) {
  Array.from(elements).forEach((el) => {
    el.addEventListener("click", () => {
      callback();
    });
  });
}

export function useScrollEvent(element, callback) {
  element.addEventListener("scroll", () => {
    callback();
  });
}

export function useChangeEvent(element, callback) {
  element.addEventListener("change", () => {
    callback();
  });
}

export function useInputEvent(element, callback) {
  element.addEventListener("input", () => {
    callback();
  });
}

export function useMouseWheelEvent(element, callback) {
  element.addEventListener("wheel", () => {
    callback();
  });
}

export function useSubmitEvent(element, callback) {
  element.addEventListener("submit", (e) => {
    e.preventDefault();
    callback();
  });
}

export function useFocusEvent(element, callback) {
  element.addEventListener("focus", () => {
    callback();
  });
}
