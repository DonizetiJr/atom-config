(function() {
  var ColorExpression, ExpressionsRegistry, SVGColors, colorRegexp, colors, comma, elmAngle, float, floatOrPercent, hexadecimal, insensitive, int, intOrPercent, namePrefixes, notQuote, optionalPercent, pe, percent, ps, registry, strip, variables, _ref, _ref1;

  _ref = require('./regexes'), int = _ref.int, float = _ref.float, percent = _ref.percent, optionalPercent = _ref.optionalPercent, intOrPercent = _ref.intOrPercent, floatOrPercent = _ref.floatOrPercent, comma = _ref.comma, notQuote = _ref.notQuote, hexadecimal = _ref.hexadecimal, ps = _ref.ps, pe = _ref.pe, variables = _ref.variables, namePrefixes = _ref.namePrefixes;

  _ref1 = require('./utils'), strip = _ref1.strip, insensitive = _ref1.insensitive;

  ExpressionsRegistry = require('./expressions-registry');

  ColorExpression = require('./color-expression');

  SVGColors = require('./svg-colors');

  module.exports = registry = new ExpressionsRegistry(ColorExpression);

  registry.createExpression('pigments:css_hexa_8', "#(" + hexadecimal + "{8})(?![\\d\\w])", 1, ['css', 'less', 'styl', 'stylus', 'sass', 'scss'], function(match, expression, context) {
    var hexa, _;
    _ = match[0], hexa = match[1];
    return this.hexRGBA = hexa;
  });

  registry.createExpression('pigments:argb_hexa_8', "#(" + hexadecimal + "{8})(?![\\d\\w])", ['*'], function(match, expression, context) {
    var hexa, _;
    _ = match[0], hexa = match[1];
    return this.hexARGB = hexa;
  });

  registry.createExpression('pigments:css_hexa_6', "#(" + hexadecimal + "{6})(?![\\d\\w])", ['*'], function(match, expression, context) {
    var hexa, _;
    _ = match[0], hexa = match[1];
    return this.hex = hexa;
  });

  registry.createExpression('pigments:css_hexa_4', "(?:" + namePrefixes + ")#(" + hexadecimal + "{4})(?![\\d\\w])", ['*'], function(match, expression, context) {
    var colorAsInt, hexa, _;
    _ = match[0], hexa = match[1];
    colorAsInt = context.readInt(hexa, 16);
    this.colorExpression = "#" + hexa;
    this.red = (colorAsInt >> 12 & 0xf) * 17;
    this.green = (colorAsInt >> 8 & 0xf) * 17;
    this.blue = (colorAsInt >> 4 & 0xf) * 17;
    return this.alpha = ((colorAsInt & 0xf) * 17) / 255;
  });

  registry.createExpression('pigments:css_hexa_3', "(?:" + namePrefixes + ")#(" + hexadecimal + "{3})(?![\\d\\w])", ['*'], function(match, expression, context) {
    var colorAsInt, hexa, _;
    _ = match[0], hexa = match[1];
    colorAsInt = context.readInt(hexa, 16);
    this.colorExpression = "#" + hexa;
    this.red = (colorAsInt >> 8 & 0xf) * 17;
    this.green = (colorAsInt >> 4 & 0xf) * 17;
    return this.blue = (colorAsInt & 0xf) * 17;
  });

  registry.createExpression('pigments:int_hexa_8', "0x(" + hexadecimal + "{8})(?!" + hexadecimal + ")", ['*'], function(match, expression, context) {
    var hexa, _;
    _ = match[0], hexa = match[1];
    return this.hexARGB = hexa;
  });

  registry.createExpression('pigments:int_hexa_6', "0x(" + hexadecimal + "{6})(?!" + hexadecimal + ")", ['*'], function(match, expression, context) {
    var hexa, _;
    _ = match[0], hexa = match[1];
    return this.hex = hexa;
  });

  registry.createExpression('pigments:css_rgb', strip("" + (insensitive('rgb')) + ps + "\\s* (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    this.red = context.readIntOrPercent(r);
    this.green = context.readIntOrPercent(g);
    this.blue = context.readIntOrPercent(b);
    return this.alpha = 1;
  });

  registry.createExpression('pigments:css_rgba', strip("" + (insensitive('rgba')) + ps + "\\s* (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var a, b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readIntOrPercent(r);
    this.green = context.readIntOrPercent(g);
    this.blue = context.readIntOrPercent(b);
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:stylus_rgba', strip("rgba" + ps + "\\s* (" + notQuote + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var a, baseColor, subexpr, _;
    _ = match[0], subexpr = match[1], a = match[2];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:css_hsl', strip("" + (insensitive('hsl')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['css', 'sass', 'scss', 'styl', 'stylus'], function(match, expression, context) {
    var h, hsl, l, s, _;
    _ = match[0], h = match[1], s = match[2], l = match[3];
    hsl = [context.readInt(h), context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:less_hsl', strip("hsl" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['less'], function(match, expression, context) {
    var h, hsl, l, s, _;
    _ = match[0], h = match[1], s = match[2], l = match[3];
    hsl = [context.readInt(h), context.readFloatOrPercent(s) * 100, context.readFloatOrPercent(l) * 100];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:css_hsla', strip("" + (insensitive('hsla')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var a, h, hsl, l, s, _;
    _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
    hsl = [context.readInt(h), context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:hsv', strip("(?:" + (insensitive('hsv')) + "|" + (insensitive('hsb')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var h, hsv, s, v, _;
    _ = match[0], h = match[1], s = match[2], v = match[3];
    hsv = [context.readInt(h), context.readFloat(s), context.readFloat(v)];
    if (hsv.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsv = hsv;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:hsva', strip("(?:" + (insensitive('hsva')) + "|" + (insensitive('hsba')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var a, h, hsv, s, v, _;
    _ = match[0], h = match[1], s = match[2], v = match[3], a = match[4];
    hsv = [context.readInt(h), context.readFloat(s), context.readFloat(v)];
    if (hsv.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsv = hsv;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:vec4', strip("vec4" + ps + "\\s* (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + pe), ['*'], function(match, expression, context) {
    var a, h, l, s, _;
    _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
    return this.rgba = [context.readFloat(h) * 255, context.readFloat(s) * 255, context.readFloat(l) * 255, context.readFloat(a)];
  });

  registry.createExpression('pigments:hwb', strip("" + (insensitive('hwb')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") (?:" + comma + "(" + float + "|" + variables + "))? " + pe), ['*'], function(match, expression, context) {
    var a, b, h, w, _;
    _ = match[0], h = match[1], w = match[2], b = match[3], a = match[4];
    this.hwb = [context.readInt(h), context.readFloat(w), context.readFloat(b)];
    return this.alpha = a != null ? context.readFloat(a) : 1;
  });

  registry.createExpression('pigments:cmyk', strip("" + (insensitive('cmyk')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var c, k, m, y, _;
    _ = match[0], c = match[1], m = match[2], y = match[3], k = match[4];
    return this.cmyk = [context.readFloat(c), context.readFloat(m), context.readFloat(y), context.readFloat(k)];
  });

  registry.createExpression('pigments:gray', strip("" + (insensitive('gray')) + ps + "\\s* (" + optionalPercent + "|" + variables + ") (?:" + comma + "(" + float + "|" + variables + "))? " + pe), 1, ['*'], function(match, expression, context) {
    var a, p, _;
    _ = match[0], p = match[1], a = match[2];
    p = context.readFloat(p) / 100 * 255;
    this.rgb = [p, p, p];
    return this.alpha = a != null ? context.readFloat(a) : 1;
  });

  colors = Object.keys(SVGColors.allCases);

  colorRegexp = "(?:" + namePrefixes + ")(" + (colors.join('|')) + ")\\b(?![ \\t]*[-\\.:=\\(])";

  registry.createExpression('pigments:named_colors', colorRegexp, ['css', 'less', 'styl', 'stylus', 'sass', 'scss'], function(match, expression, context) {
    var name, _;
    _ = match[0], name = match[1];
    this.colorExpression = this.name = name;
    return this.hex = context.SVGColors.allCases[name].replace('#', '');
  });

  registry.createExpression('pigments:darken', strip("darken" + ps + " (" + notQuote + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [h, s, context.clampInt(l - amount)];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:lighten', strip("lighten" + ps + " (" + notQuote + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [h, s, context.clampInt(l + amount)];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:fade', strip("(?:fade|alpha)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, subexpr, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = amount;
  });

  registry.createExpression('pigments:transparentize', strip("(?:transparentize|fadeout|fade-out|fade_out)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, subexpr, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = context.clamp(baseColor.alpha - amount);
  });

  registry.createExpression('pigments:opacify', strip("(?:opacify|fadein|fade-in|fade_in)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, subexpr, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = context.clamp(baseColor.alpha + amount);
  });

  registry.createExpression('pigments:stylus_component_functions', strip("(red|green|blue)" + ps + " (" + notQuote + ") " + comma + " (" + int + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, channel, subexpr, _;
    _ = match[0], channel = match[1], subexpr = match[2], amount = match[3];
    amount = context.readInt(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (isNaN(amount)) {
      return this.invalid = true;
    }
    return this[channel] = amount;
  });

  registry.createExpression('pigments:transparentify', strip("transparentify" + ps + " (" + notQuote + ") " + pe), ['*'], function(match, expression, context) {
    var alpha, bestAlpha, bottom, expr, processChannel, top, _, _ref2;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), top = _ref2[0], bottom = _ref2[1], alpha = _ref2[2];
    top = context.readColor(top);
    bottom = context.readColor(bottom);
    alpha = context.readFloatOrPercent(alpha);
    if (context.isInvalid(top)) {
      return this.invalid = true;
    }
    if ((bottom != null) && context.isInvalid(bottom)) {
      return this.invalid = true;
    }
    if (bottom == null) {
      bottom = new context.Color(255, 255, 255, 1);
    }
    if (isNaN(alpha)) {
      alpha = void 0;
    }
    bestAlpha = ['red', 'green', 'blue'].map(function(channel) {
      var res;
      res = (top[channel] - bottom[channel]) / ((0 < top[channel] - bottom[channel] ? 255 : 0) - bottom[channel]);
      return res;
    }).sort(function(a, b) {
      return a < b;
    })[0];
    processChannel = function(channel) {
      if (bestAlpha === 0) {
        return bottom[channel];
      } else {
        return bottom[channel] + (top[channel] - bottom[channel]) / bestAlpha;
      }
    };
    if (alpha != null) {
      bestAlpha = alpha;
    }
    bestAlpha = Math.max(Math.min(bestAlpha, 1), 0);
    this.red = processChannel('red');
    this.green = processChannel('green');
    this.blue = processChannel('blue');
    return this.alpha = Math.round(bestAlpha * 100) / 100;
  });

  registry.createExpression('pigments:hue', strip("hue" + ps + " (" + notQuote + ") " + comma + " (" + int + "deg|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (isNaN(amount)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [amount % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:stylus_sl_component_functions', strip("(saturation|lightness)" + ps + " (" + notQuote + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, channel, subexpr, _;
    _ = match[0], channel = match[1], subexpr = match[2], amount = match[3];
    amount = context.readInt(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (isNaN(amount)) {
      return this.invalid = true;
    }
    baseColor[channel] = amount;
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:adjust-hue', strip("adjust-hue" + ps + " (" + notQuote + ") " + comma + " (-?" + int + "deg|" + variables + "|-?" + optionalPercent + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [(h + amount) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:mix', "mix" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var amount, baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1], amount = _ref2[2];
    if (amount != null) {
      amount = context.readFloatOrPercent(amount);
    } else {
      amount = 0.5;
    }
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = context.mixColors(baseColor1, baseColor2, amount), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:stylus_tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['styl', 'stylus', 'less'], function(match, expression, context) {
    var amount, baseColor, subexpr, white, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    white = new context.Color(255, 255, 255);
    return this.rgba = context.mixColors(white, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:stylus_shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['styl', 'stylus', 'less'], function(match, expression, context) {
    var amount, baseColor, black, subexpr, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    black = new context.Color(0, 0, 0);
    return this.rgba = context.mixColors(black, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:sass_tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass', 'scss'], function(match, expression, context) {
    var amount, baseColor, subexpr, white, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    white = new context.Color(255, 255, 255);
    return this.rgba = context.mixColors(baseColor, white, amount).rgba;
  });

  registry.createExpression('pigments:sass_shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass', 'scss'], function(match, expression, context) {
    var amount, baseColor, black, subexpr, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    black = new context.Color(0, 0, 0);
    return this.rgba = context.mixColors(baseColor, black, amount).rgba;
  });

  registry.createExpression('pigments:desaturate', "desaturate" + ps + "(" + notQuote + ")" + comma + "(" + floatOrPercent + "|" + variables + ")" + pe, ['*'], function(match, expression, context) {
    var amount, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [h, context.clampInt(s - amount * 100), l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:saturate', strip("saturate" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [h, context.clampInt(s + amount * 100), l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:grayscale', "gr(?:a|e)yscale" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [h, 0, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:invert', "invert" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var b, baseColor, g, r, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.rgb, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    this.rgb = [255 - r, 255 - g, 255 - b];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:complement', "complement" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [(h + 180) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:spin', strip("spin" + ps + " (" + notQuote + ") " + comma + " (-?(" + int + ")(deg)?|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var angle, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], angle = match[2];
    baseColor = context.readColor(subexpr);
    angle = context.readInt(angle);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [(360 + h + angle) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:contrast_n_arguments', strip("contrast" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var base, baseColor, dark, expr, light, res, threshold, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), base = _ref2[0], dark = _ref2[1], light = _ref2[2], threshold = _ref2[3];
    baseColor = context.readColor(base);
    dark = context.readColor(dark);
    light = context.readColor(light);
    if (threshold != null) {
      threshold = context.readPercent(threshold);
    }
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (dark != null ? dark.invalid : void 0) {
      return this.invalid = true;
    }
    if (light != null ? light.invalid : void 0) {
      return this.invalid = true;
    }
    res = context.contrast(baseColor, dark, light);
    if (context.isInvalid(res)) {
      return this.invalid = true;
    }
    return _ref3 = context.contrast(baseColor, dark, light, threshold), this.rgb = _ref3.rgb, _ref3;
  });

  registry.createExpression('pigments:contrast_1_argument', strip("contrast" + ps + " (" + notQuote + ") " + pe), ['*'], function(match, expression, context) {
    var baseColor, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    return _ref2 = context.contrast(baseColor), this.rgb = _ref2.rgb, _ref2;
  });

  registry.createExpression('pigments:css_color_function', "(?:" + namePrefixes + ")(" + (insensitive('color')) + ps + "(" + notQuote + ")" + pe + ")", ['css', 'less', 'sass', 'scss', 'styl', 'stylus'], function(match, expression, context) {
    var cssColor, e, expr, k, rgba, v, _, _ref2;
    try {
      _ = match[0], expr = match[1];
      _ref2 = context.vars;
      for (k in _ref2) {
        v = _ref2[k];
        expr = expr.replace(RegExp("" + (k.replace(/\(/g, '\\(').replace(/\)/g, '\\)')), "g"), v.value);
      }
      cssColor = require('css-color-function');
      rgba = cssColor.convert(expr.toLowerCase());
      this.rgba = context.readColor(rgba).rgba;
      return this.colorExpression = expr;
    } catch (_error) {
      e = _error;
      return this.invalid = true;
    }
  });

  registry.createExpression('pigments:sass_adjust_color', "adjust-color" + ps + "(" + notQuote + ")" + pe, 1, ['*'], function(match, expression, context) {
    var baseColor, param, params, res, subexpr, subject, _, _i, _len;
    _ = match[0], subexpr = match[1];
    res = context.split(subexpr);
    subject = res[0];
    params = res.slice(1);
    baseColor = context.readColor(subject);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      param = params[_i];
      context.readParam(param, function(name, value) {
        return baseColor[name] += context.readFloat(value);
      });
    }
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:sass_scale_color', "scale-color" + ps + "(" + notQuote + ")" + pe, 1, ['*'], function(match, expression, context) {
    var MAX_PER_COMPONENT, baseColor, param, params, res, subexpr, subject, _, _i, _len;
    MAX_PER_COMPONENT = {
      red: 255,
      green: 255,
      blue: 255,
      alpha: 1,
      hue: 360,
      saturation: 100,
      lightness: 100
    };
    _ = match[0], subexpr = match[1];
    res = context.split(subexpr);
    subject = res[0];
    params = res.slice(1);
    baseColor = context.readColor(subject);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      param = params[_i];
      context.readParam(param, function(name, value) {
        var dif, result;
        value = context.readFloat(value) / 100;
        result = value > 0 ? (dif = MAX_PER_COMPONENT[name] - baseColor[name], result = baseColor[name] + dif * value) : result = baseColor[name] * (1 + value);
        return baseColor[name] = result;
      });
    }
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:sass_change_color', "change-color" + ps + "(" + notQuote + ")" + pe, 1, ['*'], function(match, expression, context) {
    var baseColor, param, params, res, subexpr, subject, _, _i, _len;
    _ = match[0], subexpr = match[1];
    res = context.split(subexpr);
    subject = res[0];
    params = res.slice(1);
    baseColor = context.readColor(subject);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      param = params[_i];
      context.readParam(param, function(name, value) {
        return baseColor[name] = context.readFloat(value);
      });
    }
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:stylus_blend', strip("blend" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return this.rgba = [baseColor1.red * baseColor1.alpha + baseColor2.red * (1 - baseColor1.alpha), baseColor1.green * baseColor1.alpha + baseColor2.green * (1 - baseColor1.alpha), baseColor1.blue * baseColor1.alpha + baseColor2.blue * (1 - baseColor1.alpha), baseColor1.alpha + baseColor2.alpha - baseColor1.alpha * baseColor2.alpha];
  });

  registry.createExpression('pigments:lua_rgba', strip("(?:" + namePrefixes + ")Color" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + pe), ['lua'], function(match, expression, context) {
    var a, b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readInt(r);
    this.green = context.readInt(g);
    this.blue = context.readInt(b);
    return this.alpha = context.readInt(a) / 255;
  });

  registry.createExpression('pigments:multiply', strip("multiply" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.MULTIPLY), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:screen', strip("screen" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.SCREEN), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:overlay', strip("overlay" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.OVERLAY), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:softlight', strip("softlight" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.SOFT_LIGHT), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:hardlight', strip("hardlight" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.HARD_LIGHT), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:difference', strip("difference" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.DIFFERENCE), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:exclusion', strip("exclusion" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.EXCLUSION), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:average', strip("average" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.AVERAGE), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:negation', strip("negation" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.NEGATION), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:elm_rgba', strip("rgba\\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var a, b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readInt(r);
    this.green = context.readInt(g);
    this.blue = context.readInt(b);
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:elm_rgb', strip("rgb\\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    this.red = context.readInt(r);
    this.green = context.readInt(g);
    return this.blue = context.readInt(b);
  });

  elmAngle = "(?:" + float + "|\\(degrees\\s+(?:" + int + "|" + variables + ")\\))";

  registry.createExpression('pigments:elm_hsl', strip("hsl\\s+ (" + elmAngle + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var elmDegreesRegexp, h, hsl, l, m, s, _;
    elmDegreesRegexp = new RegExp("\\(degrees\\s+(" + context.int + "|" + context.variablesRE + ")\\)");
    _ = match[0], h = match[1], s = match[2], l = match[3];
    if (m = elmDegreesRegexp.exec(h)) {
      h = context.readInt(m[1]);
    } else {
      h = context.readFloat(h) * 180 / Math.PI;
    }
    hsl = [h, context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:elm_hsla', strip("hsla\\s+ (" + elmAngle + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var a, elmDegreesRegexp, h, hsl, l, m, s, _;
    elmDegreesRegexp = new RegExp("\\(degrees\\s+(" + context.int + "|" + context.variablesRE + ")\\)");
    _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
    if (m = elmDegreesRegexp.exec(h)) {
      h = context.readInt(m[1]);
    } else {
      h = context.readFloat(h) * 180 / Math.PI;
    }
    hsl = [h, context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:elm_grayscale', "gr(?:a|e)yscale\\s+(" + float + "|" + variables + ")", ['elm'], function(match, expression, context) {
    var amount, _;
    _ = match[0], amount = match[1];
    amount = Math.floor(255 - context.readFloat(amount) * 255);
    return this.rgb = [amount, amount, amount];
  });

  registry.createExpression('pigments:elm_complement', strip("complement\\s+(" + notQuote + ")"), ['elm'], function(match, expression, context) {
    var baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [(h + 180) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:latex_gray', strip("\\[gray\\]\\{(" + float + ")\\}"), ['tex'], function(match, expression, context) {
    var amount, _;
    _ = match[0], amount = match[1];
    amount = context.readFloat(amount) * 255;
    return this.rgb = [amount, amount, amount];
  });

  registry.createExpression('pigments:latex_html', strip("\\[HTML\\]\\{(" + hexadecimal + "{6})\\}"), ['tex'], function(match, expression, context) {
    var hexa, _;
    _ = match[0], hexa = match[1];
    return this.hex = hexa;
  });

  registry.createExpression('pigments:latex_rgb', strip("\\[rgb\\]\\{(" + float + ")" + comma + "(" + float + ")" + comma + "(" + float + ")\\}"), ['tex'], function(match, expression, context) {
    var b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    r = Math.floor(context.readFloat(r) * 255);
    g = Math.floor(context.readFloat(g) * 255);
    b = Math.floor(context.readFloat(b) * 255);
    return this.rgb = [r, g, b];
  });

  registry.createExpression('pigments:latex_RGB', strip("\\[RGB\\]\\{(" + int + ")" + comma + "(" + int + ")" + comma + "(" + int + ")\\}"), ['tex'], function(match, expression, context) {
    var b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    r = context.readInt(r);
    g = context.readInt(g);
    b = context.readInt(b);
    return this.rgb = [r, g, b];
  });

  registry.createExpression('pigments:latex_cmyk', strip("\\[cmyk\\]\\{(" + float + ")" + comma + "(" + float + ")" + comma + "(" + float + ")" + comma + "(" + float + ")\\}"), ['tex'], function(match, expression, context) {
    var c, k, m, y, _;
    _ = match[0], c = match[1], m = match[2], y = match[3], k = match[4];
    c = context.readFloat(c);
    m = context.readFloat(m);
    y = context.readFloat(y);
    k = context.readFloat(k);
    return this.cmyk = [c, m, y, k];
  });

  registry.createExpression('pigments:latex_predefined', strip('\\{(black|blue|brown|cyan|darkgray|gray|green|lightgray|lime|magenta|olive|orange|pink|purple|red|teal|violet|white|yellow)\\}'), ['tex'], function(match, expression, context) {
    var name, _;
    _ = match[0], name = match[1];
    return this.hex = context.SVGColors.allCases[name].replace('#', '');
  });

  registry.createExpression('pigments:latex_mix', strip('\\{([^!\\n\\}]+[!][^\\}\\n]+)\\}'), ['tex'], function(match, expression, context) {
    var expr, mix, nextColor, op, triplet, _;
    _ = match[0], expr = match[1];
    op = expr.split('!');
    mix = function(_arg) {
      var a, b, colorA, colorB, p;
      a = _arg[0], p = _arg[1], b = _arg[2];
      colorA = a instanceof context.Color ? a : context.readColor("{" + a + "}");
      colorB = b instanceof context.Color ? b : context.readColor("{" + b + "}");
      percent = context.readInt(p);
      return context.mixColors(colorA, colorB, percent / 100);
    };
    if (op.length === 2) {
      op.push(new context.Color(255, 255, 255));
    }
    nextColor = null;
    while (op.length > 0) {
      triplet = op.splice(0, 3);
      nextColor = mix(triplet);
      if (op.length > 0) {
        op.unshift(nextColor);
      }
    }
    return this.rgb = nextColor.rgb;
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1leHByZXNzaW9ucy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNFBBQUE7O0FBQUEsRUFBQSxPQWNJLE9BQUEsQ0FBUSxXQUFSLENBZEosRUFDRSxXQUFBLEdBREYsRUFFRSxhQUFBLEtBRkYsRUFHRSxlQUFBLE9BSEYsRUFJRSx1QkFBQSxlQUpGLEVBS0Usb0JBQUEsWUFMRixFQU1FLHNCQUFBLGNBTkYsRUFPRSxhQUFBLEtBUEYsRUFRRSxnQkFBQSxRQVJGLEVBU0UsbUJBQUEsV0FURixFQVVFLFVBQUEsRUFWRixFQVdFLFVBQUEsRUFYRixFQVlFLGlCQUFBLFNBWkYsRUFhRSxvQkFBQSxZQWJGLENBQUE7O0FBQUEsRUFnQkEsUUFBdUIsT0FBQSxDQUFRLFNBQVIsQ0FBdkIsRUFBQyxjQUFBLEtBQUQsRUFBUSxvQkFBQSxXQWhCUixDQUFBOztBQUFBLEVBa0JBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx3QkFBUixDQWxCdEIsQ0FBQTs7QUFBQSxFQW1CQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQW5CbEIsQ0FBQTs7QUFBQSxFQW9CQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FwQlosQ0FBQTs7QUFBQSxFQXNCQSxNQUFNLENBQUMsT0FBUCxHQUNBLFFBQUEsR0FBZSxJQUFBLG1CQUFBLENBQW9CLGVBQXBCLENBdkJmLENBQUE7O0FBQUEsRUFrQ0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLHFCQUExQixFQUFrRCxJQUFBLEdBQUksV0FBSixHQUFnQixrQkFBbEUsRUFBcUYsQ0FBckYsRUFBd0YsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixNQUFoQixFQUF3QixRQUF4QixFQUFrQyxNQUFsQyxFQUEwQyxNQUEx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

//# sourceURL=/home/junior/.atom/packages/pigments/lib/color-expressions.coffee
