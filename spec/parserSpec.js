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
    expect(result[0].type).toBe('Comment');
    expect(result[0].value).toBe("` a comment");
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
    expect(params.type).toBe('ParameterList');
    expect(params.value.length).toBe(1);
    expect(params.value[0].value.type).toBe('Integer');
    expect(params.value[0].value.value).toBe(1234);
  });

  it("should recognize the builtin minus function", function() {
    var program = '-[5 3]';
    var result = parser.parse(program);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('Builtin');
    expect(result[0].name).toBe('minus');

    var params = result[0].params;
    expect(params.type).toBe('ParameterList');
    expect(params.value.length).toBe(2);
    expect(params.value[0].value.type).toBe('Integer');
    expect(params.value[0].value.value).toBe(5);
    expect(params.value[1].value.type).toBe('Integer');
    expect(params.value[1].value.value).toBe(3);
  });

  it("should parse function defintions", function() {
    var program = '= x y: (-[x y]) 0 | 1';
    var result = parser.parse(program);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('Function');
    expect(result[0].name.value).toBe('=');
    expect(result[0].params.type).toBe('DeclaredParameters');
  });
});
