export default `// Search for a target key in sorted array
function binarySearch(arr, target, low, high) {
  // Base Case: Range exhausted
  if (low > high) return -1;
  
  const mid = Math.floor((low + high) / 2);
  
  // Base Case: Target found
  if (arr[mid] === target) return mid;
  
  // Tail recursive branching
  if (arr[mid] > target) {
    return binarySearch(arr, target, low, mid - 1);
  } else {
    return binarySearch(arr, target, mid + 1, high);
  }
}`;
