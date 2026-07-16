export default `// Compute the Nth Fibonacci number
function fib(n) {
  // Base cases
  if (n <= 0) return 0;
  if (n === 1) return 1;
  
  // Dual recursive branch execution
  return fib(n - 1) + fib(n - 2);
}`;
