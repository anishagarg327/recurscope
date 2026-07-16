export default `// Compute the factorial of a number
function factorial(n) {
  // Base case: n reaches 1 or 0
  if (n <= 1) {
    return 1;
  }
  
  // Recursive relation: n * (n-1)!
  return n * factorial(n - 1);
}`;
