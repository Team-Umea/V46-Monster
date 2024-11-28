//Code to init html elements, like adding eventlisterners that is, goes here
export function useClickEvent(element, callback) {
  element.addEventListener("click", () => {
    callback();
  });
}

export function useScrollEvent(element, callback) {
  element.addEventListener("scroll", () => {
    callback();
  });
}
