// to get single element
export function find(selector) {
  return document.querySelector(selector);
}
// to get all element
export function findAll(selector) {
  return document.querySelectorAll(selector);
}

// export default { getElement, getAllElement };
