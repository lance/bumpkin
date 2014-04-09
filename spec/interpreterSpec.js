var srcDir = [__dirname, '..', 'src'].join('/');
var sut    = [srcDir, 'interpreter'].join('/');
var interp = require(sut);

describe("A bumpkin interpreter", function() {
  it("should eval integers", function() {
    var result = interp.evaluate('123');
    expect(result).toBe(123);
  });

  it("should eval the builtin print function", function() {
    var result = interp.evaluate('print[123]');
    expect(result).toBe(123);
  });

  it("should eval the builtin print function with an subexpression parameter", function() {
    var result = interp.evaluate('print[ -[123 23] ]');
    expect(result).toBe(100);
  });

  it("should eval the builtin minus function", function() {
    var result = interp.evaluate('-[1 3]');
    expect(result).toBe(-2);
  });

  it("should eval the builtin minus function with subexpressions", function() {
    var result = interp.evaluate('-[-[4 3] 3]');
    expect(result).toBe(-2);
  });

  it("should evaluate true conditionals", function() {
    var result = interp.evaluate('(1) 1 | 0');
    expect(result).toBe(1);
  });

  it("should evaluate false conditionals", function() {
    var result = interp.evaluate('(0) 1 | 0');
    expect(result).toBe(0);
  });

  it("should evaluate conditionals containing a true expression", function() {
    var result = interp.evaluate('(-[1 0]) 1 | 0');
    expect(result).toBe(1);
  });

  it("should evaluate conditionals containing a false expression", function() {
    var result = interp.evaluate('(-[1 1]) 1 | 0');
    expect(result).toBe(0);
  });

  it("should evaluate true conditionals containing an expression result", function() {
    var result = interp.evaluate('(-[4 1]) -[4 1] | 0');
    expect(result).toBe(3);
  });

  it("should evaluate false conditionals containing an expression result", function() {
    var result = interp.evaluate('(-[1 1]) 1 | -[4 1]');
    expect(result).toBe(3);
  });

  it("should handle multi-line programs", function() {
    var result = interp.evaluate(
      "`here is a comment\n" +
      "(-[1 1]) 1 | -[4 1]\n`" + 
      "and another comment\n" + 
      "-[100 50]\n" +
      "`and yet another comment");
    expect(result).toBe(50);
  });

  it("should evaluate user defined functions", function() {
    var program = '= x y: (-[x y]) 0 | 1\n=[3 3]';
    var result = interp.evaluate(program);
    expect(result).toBe(1);
    program = '= x y: (-[x y]) 0 | 1\n=[4 3]';
    result = interp.evaluate(program);
    expect(result).toBe(0);
    program = '= x y: (-[x y]) 0 | 1\n=[1 0]';
    result = interp.evaluate(program);
    expect(result).toBe(0);
  });

  it("should handle recursion", function() {
    var program = "r a: (-[a 1]) r[-[a 1]] | 0\n" + // a recursive function
                  "r[5]"; // call it
    var result = interp.evaluate(program);
    expect(result).toBe(0);
  });

  it("should handle factorial", function() {
    var program = 
        "= x y: (-[x y]) 0 | 1\n" + // define the = function
        "+ a b: -[a -[0 b]]\n" + // define the + function
        "* a b: (=[b 0]) 0 | +[a *[a -[b 1]]]\n" + // define the * function
        "! n: (=[n 1]) 1 | *[n ![-[n 1]]]\n" + // define the ! function
        "![4]"; // 4 factorial, please
    var result = interp.evaluate(program);
    expect(result).toBe(24);
  });

});



