(function() {
  var utils;

  utils = {
    fill: function(str, length, filler) {
      if (filler == null) {
        filler = '0';
      }
      while (str.length < length) {
        str = filler + str;
      }
      return str;
    },
    strip: function(str) {
      return str.replace(/\s+/g, '');
    },
    clamp: function(n) {
      return Math.min(1, Math.max(0, n));
    },
    clampInt: function(n, max) {
      if (max == null) {
        max = 100;
      }
      return Math.min(max, Math.max(0, n));
    },
    insensitive: function(s) {
      return s.split(/(?:)/).map(function(c) {
        return "(?:" + c + "|" + (c.toUpperCase()) + ")";
      }).join('');
    },
    readFloat: function(value, vars, color) {
      var res;
      if (vars == null) {
        vars = {};
      }
      res = parseFloat(value);
      if (isNaN(res) && (vars[value] != null)) {
        color.usedVariables.push(value);
        res = parseFloat(vars[value].value);
      }
      return res;
    },
    readInt: function(value, vars, color, base) {
      var res;
      if (vars == null) {
        vars = {};
      }
      if (base == null) {
        base = 10;
      }
      res = parseInt(value, base);
      if (isNaN(res) && (vars[value] != null)) {
        color.usedVariables.push(value);
        res = parseInt(vars[value].value, base);
      }
      return res;
    },
    countLines: function(string) {
      return string.split(/\r\n|\r|\n/g).length;
    },
    readIntOrPercent: function(value, vars, color) {
      var res;
      if (vars == null) {
        vars = {};
      }
      if (!/\d+/.test(value) && (vars[value] != null)) {
        color.usedVariables.push(value);
        value = vars[value].value;
      }
      if (value == null) {
        return NaN;
      }
      if (value.indexOf('%') !== -1) {
        res = Math.round(parseFloat(value) * 2.55);
      } else {
        res = parseInt(value);
      }
      return res;
    },
    readFloatOrPercent: function(amount, vars, color) {
      var res;
      if (vars == null) {
        vars = {};
      }
      if (!/\d+/.test(amount) && (vars[amount] != null)) {
        color.usedVariables.push(amount);
        amount = vars[amount].value;
      }
      if (amount == null) {
        return NaN;
      }
      if (amount.indexOf('%') !== -1) {
        res = parseFloat(amount) / 100;
      } else {
        res = parseFloat(amount);
      }
      return res;
    },
    findClosingIndex: function(s, startIndex, openingChar, closingChar) {
      var curStr, index, nests;
      if (startIndex == null) {
        startIndex = 0;
      }
      if (openingChar == null) {
        openingChar = "[";
      }
      if (closingChar == null) {
        closingChar = "]";
      }
      index = startIndex;
      nests = 1;
      while (nests && index < s.length) {
        curStr = s.substr(index++, 1);
        if (curStr === closingChar) {
          nests--;
        } else if (curStr === openingChar) {
          nests++;
        }
      }
      if (nests === 0) {
        return index - 1;
      } else {
        return -1;
      }
    },
    split: function(s, sep) {
      var a, c, i, l, previousStart, start;
      if (sep == null) {
        sep = ",";
      }
      a = [];
      l = s.length;
      i = 0;
      start = 0;
      previousStart = start;
      whileLoop: //;
      while (i < l) {
        c = s.substr(i, 1);
        switch (c) {
          case "(":
            i = utils.findClosingIndex(s, i + 1, c, ")");
            if (i === -1) {
              break whileLoop;
            }
            break;
          case ")":
            break whileLoop;
            break;
          case "[":
            i = utils.findClosingIndex(s, i + 1, c, "]");
            if (i === -1) {
              break whileLoop;
            }
            break;
          case "":
            i = utils.findClosingIndex(s, i + 1, c, "");
            if (i === -1) {
              break whileLoop;
            }
            break;
          case sep:
            a.push(utils.strip(s.substr(start, i - start)));
            start = i + 1;
            if (previousStart === start) {
              break whileLoop;
            }
            previousStart = start;
        }
        i++;
      }
      a.push(utils.strip(s.substr(start, i - start)));
      return a.filter(function(s) {
        return (s != null) && s.length;
      });
    }
  };

  module.exports = utils;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi91dGlscy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsS0FBQTs7QUFBQSxFQUFBLEtBQUEsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxNQUFkLEdBQUE7O1FBQWMsU0FBTztPQUN6QjtBQUFtQixhQUFNLEdBQUcsQ0FBQyxNQUFKLEdBQWEsTUFBbkIsR0FBQTtBQUFuQixRQUFBLEdBQUEsR0FBTSxNQUFBLEdBQVMsR0FBZixDQUFtQjtNQUFBLENBQW5CO2FBQ0EsSUFGSTtJQUFBLENBQU47QUFBQSxJQUlBLEtBQUEsRUFBTyxTQUFDLEdBQUQsR0FBQTthQUFTLEdBQUcsQ0FBQyxPQUFKLENBQVksTUFBWixFQUFvQixFQUFwQixFQUFUO0lBQUEsQ0FKUDtBQUFBLElBTUEsS0FBQSxFQUFPLFNBQUMsQ0FBRCxHQUFBO2FBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixDQUFaLEVBQVA7SUFBQSxDQU5QO0FBQUEsSUFRQSxRQUFBLEVBQVUsU0FBQyxDQUFELEVBQUksR0FBSixHQUFBOztRQUFJLE1BQUk7T0FBUTthQUFBLElBQUksQ0FBQyxHQUFMLENBQVMsR0FBVCxFQUFjLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosQ0FBZCxFQUFoQjtJQUFBLENBUlY7QUFBQSxJQVVBLFdBQUEsRUFBYSxTQUFDLENBQUQsR0FBQTthQUNYLENBQUMsQ0FBQyxLQUFGLENBQVEsTUFBUixDQUFlLENBQUMsR0FBaEIsQ0FBb0IsU0FBQyxDQUFELEdBQUE7ZUFBUSxLQUFBLEdBQUssQ0FBTCxHQUFPLEdBQVAsR0FBUyxDQUFD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

//# sourceURL=/home/junior/.atom/packages/pigments/lib/utils.coffee
