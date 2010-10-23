
var b = exports;

var encode = function(input) {
  var tokens = [];
  if (typeof input == "number") {
    tokens.push('i');
    tokens.push(input.toString());
    tokens.push('e');
  } else if (typeof input == "string") {
    tokens.push(input.length.toString());
    tokens.push(':');
    tokens.push(input);
  } else if (input instanceof Array) {
    tokens.push('l');
    for (var i = 0; i < input.length; i++) {
      tokens.push(encode(input[i]));
    }
    tokens.push('e');
  } else if (typeof input == "object") {
    tokens.push('d');
    var keys = [];
    for (var k in input) {
      keys.push(k);
    }
    keys.sort();
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var v = input[k];
      tokens.push(encode(k));
      tokens.push(encode(v));
    }
    tokens.push('e');
  } else {
    throw new Error("Unknown type for bencode.");
  }
  return tokens.join('');
};

b.encode = encode;
