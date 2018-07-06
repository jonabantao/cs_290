// Problem: Running testList(); will alert 'item3 undefined' 3 times with this 
// block of code:

/*
function buildList(list) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
        var item = 'item' + list[i];
        result.push( function() {alert(item + ' ' + list[i])} );
    }
    return result;
}

function testList() {
    var fnlist = buildList([1,2,3]);
    // using j only to help prevent confusion - could use i
    for (var j = 0; j < fnlist.length; j++) {
        fnlist[j]();
    }
}
*/

// The issue resides in the buildList loop and var i being saved into the result
// array for the alert, which will be at 3.

// SOLUTION 1: IIFE - Will enclose own variable to own self-executing scope
function buildList(list) {
  var result = [];
  for (var i = 0; i < list.length; i++) {
    (function(k) {
      var item = 'item' + list[k];
      result.push(function () { alert(item + ' ' + list[k]) });
    })(i);
  }
  return result;
}

function testList() {
  var fnlist = buildList([1, 2, 3]);
  for (var j = 0; j < fnlist.length; j++) {
    fnlist[j]();
  }
}

// SOLUTION 2: ES6 variables - No need for IIFEs - let stored in block scope
function ES6BuildList(list) {
  let result = [];
  for (let i = 0; i < list.length; i++) {
    let item = 'item' + list[k];
    result.push(function () { alert(item + ' ' + list[k]) });
  }
  return result;
}

function ES6TestList() {
  let fnlist = buildList([1, 2, 3]);
  for (let j = 0; j < fnlist.length; j++) {
    fnlist[j]();
  }
}