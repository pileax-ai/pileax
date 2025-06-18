/**
 * Misc
 *
 * @author Xman
 * @version 1.0
 */

// ================================================================================
// Common API
// ================================================================================
export function toggleClass (element: HTMLElement, className: string) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += ' ' + className;
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
  }
  classString = classString.trim();
  element.className = classString;
}

export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
