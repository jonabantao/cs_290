// Deep Comparison

// The == operator compares objects by identity. But sometimes 
// you’d prefer to compare the values of their actual properties.

// Write a function deepEqual that takes two values and returns true 
// only if they are the same value or are objects with the same 
// properties, where the values of the properties are equal when 
// compared with a recursive call to deepEqual.

// To find out whether values should be compared directly 
// (use the === operator for that) or have their properties compared,
//  you can use the typeof operator. If it produces "object" for both 
// values, you should do a deep comparison. But you have to take one 
// silly exception into account: because of a historical accident, 
// typeof null also produces "object".

// The Object.keys function will be useful when you need to go over 
// the properties of objects to compare them.


// Iterates through the first object and returns true if all of the
// first objects property's are in the second object
function checkMatchingKeys(obj1, obj2) {
  return Object.keys(obj1).every(prop => obj2.hasOwnProperty(prop)) &&
    Object.keys(obj2).every(prop => obj1.hasOwnProperty(prop));
}

// Returns true if both params have the same values or have same object,
// with same properties and values
function deepEqual(val1, val2) {
  // Only true if both val are objects and neither are null
  if ((typeof val1 === 'object' && val1 !== null) &&
   (typeof val2 === 'object' && val2 !== null)) {
    if (!checkMatchingKeys(val1, val2)) {
      return false;
    }

    // Can safely iterate through only one object since already checked
    // if both objects have same properties
    return Object.keys(val1).every(prop => {
      const objOneValue = val1[prop];
      const objTwoValue = val2[prop];

      return deepEqual(objOneValue, objTwoValue);
    });
  }

  // At least one val is not an object, directly check equality
  return val1 === val2;
}

let obj = { here: { is: "an" }, object: 2 };
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, { here: 1, object: 2 }));
// → false
console.log(deepEqual(obj, { here: { is: "an" }, object: 2 }));
// → true
console.log(deepEqual(obj, null));
// → false