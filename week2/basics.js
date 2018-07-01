// To make sure you can execute some JavaScript, copy this code into a file, update the name variable, run it somewhere and use the results for activity credit this week.

/*
console.log("Lets make sure JavaScript is working.");
var name = "Your First Name"; //Replace this with your first name
console.log("The unicode characters of your name are:")
for (var i = 0; i < name.length; i++){
	console.log(name.charCodeAt(i));
}
console.log("Copy and paste these values for activity credit.")
*/

function nameToUnicode(name) {
  console.log('Lets make sure JavaScript is working.');
  console.log('The unicode characters of your name are:');
  for (let i = 0; i < name.length; i++) {
    console.log(name.charCodeAt(i));
  }
  console.log('Copy and paste these values for your activity credit.');
}

nameToUnicode('Jonathan');
