var srcDir = [__dirname, '..', 'src'].join('/');
var sut    = [srcDir, 'parser'].join('/');
var parser = require(sut);

describe("A bumpkin parser", function() {
  it("should read integers", function() {
    var result = parser.parse('123');
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('Integer');
    expect(result[0].value).toBe(123);
  });

  it("should recognize comments", function() {
    var result = parser.parse("` a comment");
    expect(result.length).toBe(1);
    expect(result[0]).toBe(null);
  });

  it("should handle multi-line programs", function() {
    var program = "123\n456\n789";
    var result = parser.parse(program);
    expect(result.length).toBe(3);
    result.map(function(i) {
      expect(i.type).toBe('Integer');
    });
  });

  it("should handle multi-line programs with comments", function() {
    var program = "123\n`here is a comment\n789";
    var result = parser.parse(program);
    expect(result.length).toBe(3);
  });

  it("should parse conditional expressions", function() {
    var program = "(0) 1 | 2";
    var result = parser.parse(program);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('Conditional');
    expect(result[0].expr.type).toBe('Integer');
    expect(result[0].t.type).toBe('Integer');
    expect(result[0].f.type).toBe('Integer');
  });

  it("should recognize the builtin print function", function() {
    var program = 'print [1234]';
    var result = parser.parse(program);

    expect(result.length).toBe(1);
    expect(result[0].type).toBe('Builtin');
    expect(result[0].name).toBe('print');

    var params = result[0].params;
    expect(params.length).toBe(1);
    expect(params[0].type).toBe('Integer');
    expect(params[0].value).toBe(1234);
  });

  it("should recognize the builtin minus function", function() {
    var program = '-[5 3]';
    var result = parser.parse(program);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('Builtin');
    expect(result[0].name).toBe('minus');

    var params = result[0].params;
    expect(params.length).toBe(2);
    expect(params[0].type).toBe('Integer');
    expect(params[0].value).toBe(5);
    expect(params[1].type).toBe('Integer');
    expect(params[1].value).toBe(3);
  });

  it("should parse expressions as function parameters", function() {
    var program = '-[-[7 2] 3]';
    var result = parser.parse(program);
    var params = result[0].params;
    expect(params.length).toBe(2);
    expect(params[0].type).toBe('Builtin');
    expect(params[0].name).toBe('minus');
    expect(params[1].type).toBe('Integer');
    expect(params[1].value).toBe(3);

    program = 'print[-[7 2] 3]';
    result = parser.parse(program);
    params = result[0].params;
    expect(params.length).toBe(2);
    expect(params[0].type).toBe('Builtin');
    expect(params[0].name).toBe('minus');
    expect(params[1].type).toBe('Integer');
    expect(params[1].value).toBe(3);
  });

  it("should parse function defintions", function() {
    var program = '= x y: (-[x y]) 0 | 1';
    var result = parser.parse(program);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('Function');
    expect(result[0].name).toBe('=');
    expect(result[0].params.length).toBe(2);
    log(result);
  });

  it("should allow functions named '+'", function() {
    var program = '+ a b: -[a -[0 b]]';
    var result = parser.parse(program);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('Function');
    expect(result[0].name).toBe('+');
    expect(result[0].params.length).toBe(2);
  });

  it("should handle functions named '*'", function() {
    var program = "* y: 100";
    var result = parser.parse(program);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('Function');
    expect(result[0].name).toBe('*');
    expect(result[0].params.length).toBe(1);
  });

  it("should handle crazy nested shit", function() {
    var program = "= x y: (-[x y]) 0 | 1\n+ a b: -[a -[0 b]]\n* a b: (=[b 0]) 0 | +[a *[a -[b 1]]]";
    var result = parser.parse(program);
    expect(result.length).toBe(3);
  });
});
