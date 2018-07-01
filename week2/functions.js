// Write a JavaScript program that declares a function but calls it 
// before it is declared. Because of function hoisting this will work 
// in JavaScript. 

hoistedFunc();

function hoistedFunc() {
  console.log('Hey I\'m a function that was written after I was called!');
}

// Also write a function which is assigned to a variable. 
// Call it before it is assigned and prove that this does not work.

try {
  hoistedFuncExpression();
} catch(e) {
  console.log(e.message);
  console.log('Cannot call a function expression before assigning it!');
}

const hoistedFuncExpression = () => {
  console.log('This log should not be shown on runtime!');
};
