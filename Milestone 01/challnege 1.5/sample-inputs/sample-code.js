// Sample code for token audit testing
// This is intentionally written with some issues for demonstration

function calculateSum(arr) {
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    sum = sum + arr[i];
  }
  return sum;
}

function findMax(arr) {
  var max = arr[0];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

// Global variable (bad practice)
var globalCounter = 0;

function incrementCounter() {
  globalCounter = globalCounter + 1;
  console.log("Counter is now: " + globalCounter);
}

// Function without proper error handling
function parseJSON(jsonString) {
  return JSON.parse(jsonString);
}

// Test
console.log(calculateSum([1, 2, 3, 4, 5]));
console.log(findMax([10, 20, 5, 30]));
incrementCounter();
incrementCounter();
