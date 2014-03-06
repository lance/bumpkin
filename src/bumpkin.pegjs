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
  = lparen
    expr:Expression
    rparen
    t:Expression ws*
    Else ws*
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

Parameter
  = Expression / Symbol

Print
  = "print" lbr param:Parameter* rbr
  {
    return {
      type: 'Builtin',
      name: 'print',
      params: param
    }
  }

Minus
  = "-" lbr params:Parameter* rbr
  {
    return {
      type: 'Builtin',
      name: 'minus',
      params: params
    }
  }

FunctionCall
  = symbol:Symbol lbr params:Parameter* rbr
  {
    return {
      type: 'FunctionCall',
      name: symbol,
      params: params
    }
  }

Symbol
  = ws* symbol:$(SymbolChars+) ws*
    {
      return symbol;
    }

FunctionDef
 = name:Symbol parameters:Symbol* Colon body:Expression
   {
     return {
       type: 'Function',
       name: name,
       params: parameters,
       body: body
     }
   }

Integer
  = ws* digits:Digit+ ws*
    { 
      return { type: 'Integer', value: parseInt(digits.join(""), 10) }
    }

Comment
  = line:$("`" [^\n\r]*) LineTerminator?
    { return null }

ws "whitespace" = w:[ \t]
lparen          = ws* "(" ws*
rparen          = ws* ")" ws*
lbr             = ws* "[" ws*
rbr             = ws* "]" ws*
Else            = ws* "|" ws*
Colon           = ws* ":" ws*
Digit           = [0-9]
LineTerminator  = [\n\r\u2028\u2029]
SymbolChars     = [a-zA-Z\=+*!]

