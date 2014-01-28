var srcDir = [__dirname, '..', 'src'].join('/');
var sut    = [srcDir, 'interpreter'].join('/');
var interp = require(sut);

describe("A bumpkin interpreter", function() {
  it("should eval integers", function() {
    var result = interp.evaluate('123');
    expect(result[0]).toBe(123);
  });

  it("should eval the builtin print function", function() {
    var result = interp.evaluate('print[123]');
    expect(result[0]).toBe(123);
  });

  it("should eval the builtin minus function", function() {
    var result = interp.evaluate('-[1 3]');
    expect(result[0]).toBe(-2);
  });

  it("should evaluate true conditionals", function() {
    var result = interp.evaluate('(1) 1 | 0');
    expect(result[0]).toBe(1);
  });

  it("should evaluate false conditionals", function() {
    var result = interp.evaluate('(0) 1 | 0');
    expect(result[0]).toBe(0);
  });

  it("should evaluate conditionals containing a true expression", function() {
    var result = interp.evaluate('(-[1 0]) 1 | 0');
    expect(result[0]).toBe(1);
  });

  it("should evaluate conditionals containing a false expression", function() {
    var result = interp.evaluate('(-[1 1]) 1 | 0');
    expect(result[0]).toBe(0);
  });

  it("should evaluate true conditionals containing an expression result", function() {
    var result = interp.evaluate('(-[4 1]) -[4 1] | 0');
    expect(result[0]).toBe(3);
  });

  it("should evaluate false conditionals containing an expression result", function() {
    var result = interp.evaluate('(-[1 1]) 1 | -[4 1]');
    expect(result[0]).toBe(3);
  });

  it("should handle multi-line programs", function() {
    var result = interp.evaluate("`here is a comment\n(-[1 1]) 1 | -[4 1]\n`and another comment\n-[100 50]\n`and yet another comment");
    expect(result[0]).toBe(3);
    expect(result[1]).toBe(50);
  });

  it("should handle function definitions", function() {
    var result = interp.evaluate("= x y: (-[x y]) 0 | 1\n=[3 3]\n=[1 2]");
    expect(result[0]).toBe('=');
    expect(result[1]).toBe(true);
    expect(result[2]).toBe(false);
  });
});


