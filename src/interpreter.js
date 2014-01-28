var parser  = require('./parser');
var symbols = {};

// Executes the builtin functions 'print' and '-'
var execBuiltin = function(node) {
  var params = extractParameters(node.params);
  switch(node.name) {
    case 'print': 
      console.log(params[0]);
      return(params[0]);
    case 'minus':
      return(params[0] - params[1]);
  }
};

// Executes a conditional (if) statement
var execConditional = function(node) {
  if (internalEval(node.expr) === 0) {
    // false
    return internalEval(node.f);
  }
  return internalEval(node.t);
};

// Extracts a ParameterList into a JS array
var extractParameters = function(params) {
  return params.value.map(function(param) {
    return param.value.value;
  });
};

// Stores a function definition in our symbol table
var defineFunction = function(func) {
  symbols[func.name.value] = func;
  return func.name.value;
};

var callFunction = function(func) {
  var f = symbols[func.name.value];
  if (f) {
    var params = extractParameters(func.params);
  }
  console.error("No function found named '" + func.name.value + "'");
};

var internalEval = function(node) {
  switch(node.type) {
    case 'Symbol': 
    case 'Integer':
      return node.value;
    case 'Builtin':
      return execBuiltin(node);
    case 'Conditional':
      return execConditional(node);
    case 'Function':
      return defineFunction(node);
    case 'FunctionCall':
      return callFunction(node);
  }
};

module.exports = {
  evaluate: function(str) {
          var tree = parser.parse(str);
          console.log(JSON.stringify(tree));
          var result = tree.reduce(function(accum, node) {
            if (node.type !== 'Comment') {
              accum.push(internalEval(node));
            }
            return accum;
          }, []);
          return result;
        }
};

