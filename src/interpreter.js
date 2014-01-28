var parser  = require('./parser');
var _ = require('underscore');
var symbols = {};

// Executes the builtin functions 'print' and '-'
var builtin = function(node) {
  var params = extractParameters(node.params);
  switch(node.name) {
    case 'print': 
      var val = internalEval(params[0]);
      console.log(val);
      return(val);
    case 'minus':
      return(internalEval(params[0]) - internalEval(params[1]));
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

// Extracts an array of Expression nodes from a ParameterList
var extractParameters = function(params) {
  return _.pluck(_.where(params.value, {type:"Parameter"}), 'value');
};

// Stores a function definition in our symbol table
// returns the function name
var defineFunction = function(func) {
  symbols[internalEval(func.name)] = func;
  return func.name.value;
};

var callFunction = function(func) {
  var f = symbols[internalEval(func.name)];
  if (f) {
    var binding = _.pluck(extractParameters(func.params), 'value');
    // creates an array of symbol names from the function declaration
    // and binds the symbol to a value
    _.each(_.pluck(f.params.value, 'value'), function(sym, idx) {
      symbols[sym] = binding[idx];
    });
    return internalEval(f.body);
  }
  console.error("No function found named '" + func.name.value + "'");
};

var internalEval = function(node) {
  switch(node.type) {
    case 'Symbol': 
      return symbols[node.value];
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
  }
};

module.exports = {
  evaluate: function(str) {
          var tree = parser.parse(str);
          var result = tree.reduce(function(accum, node) {
            if (node.type !== 'Comment') {
              accum.push(internalEval(node));
            }
            return accum;
          }, []);
          return result;
        }
};

