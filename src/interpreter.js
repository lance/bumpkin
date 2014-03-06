var parser  = require('./parser');
var _ = require('underscore');
var symbols = {};

// Executes the builtin functions 'print' and '-'
var builtin = function(node) {
  var params = node.params;
  switch(node.name) {
    case 'print': 
      var val = internalEval(params[0]);
      console.log(val);
      return(val);
    case 'minus':
      var x = internalEval(params[0]);
      var s = (internalEval(params[0]) - internalEval(params[1]));
      return s;
  }
};

// Executes a conditional (if) statement
var conditional = function(node) {
  if (internalEval(node.expr) === 0) {
    // false
    return internalEval(node.f);
  }
  return internalEval(node.t);
};

// Stores a function definition in our symbol table
// returns the function name
var defineFunction = function(func) {
  symbols[func.name] = func;
  return func.name;
};

var callFunction = function(func) {
  var defn = symbols[func.name];
  if (defn) {
    var binding = _.map(func.params, function(p) {
      return internalEval(p);
    });
    // creates an array of symbol names from the function declaration
    // and binds the symbol to a value
    _.each(defn.params, function(sym, idx) {
      if (binding[idx]) {
        symbols[sym] = internalEval(binding[idx]);
      }
    });
    var x = internalEval(defn.body);
    //console.log("func name " + func.name);
    //console.log("func params " + JSON.stringify(binding));
    //console.log("func result " + x);
    return x;
  }
  console.error("No function found named '" + func.name.value + "'");
};

var internalEval = function(node) {
  switch(node.type) {
    case 'Integer':
      return node.value;
    case 'Builtin':
      return builtin(node);
    case 'Conditional':
      return conditional(node);
    case 'Function':
      return defineFunction(node);
    case 'FunctionCall':
      return callFunction(node);
    case undefined:
      if (symbols[node]) { return symbols[node]; } 
      else { return node; }
  }
};

module.exports = {
  evaluate: function(str) {
          var tree = parser.parse(str);
          var result = tree.reduce(function(accum, node) {
            if (node) {
              accum.push(internalEval(node));
            }
            return accum;
          }, []);
          return result.pop();
        }
};

