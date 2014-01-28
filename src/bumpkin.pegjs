{
  var debug = false;
  function log(msg) {
    if (debug) { console.log(JSON.stringify(msg)); }
  }
}

Start 
  = Program

Program
  = SourceLine*

SourceLine
  = line:Line LineTerminator? { return line }

Line
  = Expression / Comment

Expression
  = Integer / Conditional / Builtin / FunctionDef / FunctionCall

Conditional
  = OpenParens WhiteSpace*
    expr:Expression WhiteSpace*
    CloseParens WhiteSpace*
    t:Expression WhiteSpace*
    Else WhiteSpace*
    f:Expression
  {
    return {
      type: 'Conditional',
      expr: expr,
      t: t,
      f: f
    }
  }

Builtin = Print / Minus

ParameterList
  = WhiteSpace*
    LeftBracket
    parameters:Parameter*
    RightBracket
    WhiteSpace*
  {
    log({ParameterList: parameters});
    return {
      type: 'ParameterList',
      value: parameters
    }
  }

Parameter
  = WhiteSpace* 
    value:(Symbol / Expression)
    WhiteSpace*
  {
    log({Parameter: value});
    return {
      type: 'Parameter',
      value: value
    }
  }

Print
  = "print" param:ParameterList
  {
    log("Print");
    return {
      type: 'Builtin',
      name: 'print',
      params: param
    }
  }

Minus
  = "-" params:ParameterList 
  {
    log("Minus");
    return {
      type: 'Builtin',
      name: 'minus',
      params: params
    }
  }

FunctionCall
  = symbol:Symbol params:ParameterList
  {
    log({FunctionCall: {symbol: symbol, params: params}});
    return {
      type: 'FunctionCall',
      name: symbol,
      params: params
    }
  }

Symbol
  = WhiteSpace* symbol:$(SymbolChars+) WhiteSpace*
    {
      log({symbol: symbol});
      return {
        type: 'Symbol',
        value: symbol
      }
    }

DeclaredParameters
  = parameters:Symbol*
  {
    log({DeclaredParameters: parameters});
    return {
      type: 'DeclaredParameters',
      value: parameters
    }
  }

FunctionDef
 = name:Symbol parameters:DeclaredParameters Colon WhiteSpace* body:Expression
   {
     log({function: name});
     log({params: parameters});
     return {
       type: 'Function',
       name: name,
       params: parameters,
       body: body
     }
   }

Integer "integer"
  = digits:Digit+
    { 
      log({Integer: parseInt(digits.join(""), 10)});
      return { type: 'Integer', value: parseInt(digits.join(""), 10) }
    }

Comment
  = line:$("`" [^\n\r]*) LineTerminator?
    {
      log({Comment: line});
      return {
        type: 'Comment',
        value: line
      }
    }

WhiteSpace     "whitespace" = w:[ \t] { log("WhiteSpace [" + w + "]"); }
OpenParens     = "(" { log("OpenParens"); }
CloseParens    = ")" { log("CloseParens"); }
LeftBracket    = "[" { log("LeftBracket"); }
RightBracket   = "]" { log("RightBracket"); }
Else           = "|" { log("Else"); }
Colon          = ":" { log("Colon"); }
Digit          = [0-9]
LineTerminator = [\n\r\u2028\u2029]
SymbolChars    = [a-zA-Z\=]

