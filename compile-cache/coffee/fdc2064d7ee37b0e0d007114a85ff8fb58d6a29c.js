(function() {
  var ArgumentParser, InlineParameterParser, fs, path;

  path = require('path');

  fs = require('fs');

  ArgumentParser = require('./argument-parser');

  module.exports = InlineParameterParser = (function() {
    function InlineParameterParser() {}

    InlineParameterParser.prototype.parse = function(target, callback) {
      var firstLine, indexOfNewLine, text;
      if (typeof target === 'object' && target.constructor.name === 'TextEditor') {
        this.targetFilename = target.getURI();
        text = target.getText();
        indexOfNewLine = text.indexOf("\n");
        firstLine = text.substr(0, indexOfNewLine > -1 ? indexOfNewLine : void 0);
        return this.parseFirstLineParameter(firstLine, callback);
      } else if (typeof target === 'string') {
        this.targetFilename = target;
        return this.readFirstLine(this.targetFilename, (function(_this) {
          return function(firstLine, error) {
            if (error) {
              return callback(void 0, error);
            } else {
              return _this.parseFirstLineParameter(firstLine, callback);
            }
          };
        })(this));
      } else {
        return callback(false, 'Invalid parser call');
      }
    };

    InlineParameterParser.prototype.readFirstLine = function(filename, callback) {
      var called, line, reader;
      if (!fs.existsSync(filename)) {
        callback(null, "File does not exist: " + filename);
        return;
      }
      line = '';
      called = false;
      return reader = fs.createReadStream(filename).on('data', (function(_this) {
        return function(data) {
          var indexOfNewLine;
          line += data.toString();
          indexOfNewLine = line.indexOf("\n");
          if (indexOfNewLine > -1) {
            line = line.substr(0, indexOfNewLine);
            called = true;
            reader.close();
            return callback(line);
          }
        };
      })(this)).on('end', (function(_this) {
        return function() {
          if (!called) {
            return callback(line);
          }
        };
      })(this)).on('error', (function(_this) {
        return function(error) {
          return callback(null, error);
        };
      })(this));
    };

    InlineParameterParser.prototype.parseFirstLineParameter = function(line, callback) {
      var params;
      params = this.parseParameters(line);
      if (typeof params === 'object') {
        if (typeof params.main === 'string') {
          if (this.targetFilename && !path.isAbsolute(params.main)) {
            params.main = path.resolve(path.dirname(this.targetFilename), params.main);
          }
          return callback(params);
        } else {
          return callback(params);
        }
      } else {
        return callback(false);
      }
    };

    InlineParameterParser.prototype.parseParameters = function(str) {
      var argumentParser, i, key, match, params, regex, value, _i;
      regex = /^\s*(?:(?:\/\*\s*(.*?)\s*\*\/)|(?:\/\/\s*(.*)))/m;
      if ((match = regex.exec(str)) !== null) {
        str = match[2] ? match[2] : match[1];
      } else {
        return false;
      }
      argumentParser = new ArgumentParser();
      regex = /(?:(\!?[\w-\.]+)(?:\s*:\s*(?:(\[.*\])|({.*})|(?:'(.*?)')|(?:"(.*?)")|([^,;]+)))?)*/g;
      params = [];
      while ((match = regex.exec(str)) !== null) {
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        if (match[1] !== void 0) {
          key = match[1].trim();
          for (i = _i = 2; _i <= 6; i = ++_i) {
            if (match[i]) {
              value = match[i];
              break;
            }
          }
          if (key[0] === '!') {
            key = key.substr(1);
            if (value === void 0) {
              value = 'false';
            }
          }
          params[key] = argumentParser.parseValue(value);
        }
      }
      return params;
    };

    return InlineParameterParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL3Nhc3MtYXV0b2NvbXBpbGUvbGliL2hlbHBlci9pbmxpbmUtcGFyYW1ldGVycy1wYXJzZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFHQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQUhqQixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTt1Q0FFRjs7QUFBQSxvQ0FBQSxLQUFBLEdBQU8sU0FBQyxNQUFELEVBQVMsUUFBVCxHQUFBO0FBQ0gsVUFBQSwrQkFBQTtBQUFBLE1BQUEsSUFBRyxNQUFBLENBQUEsTUFBQSxLQUFpQixRQUFqQixJQUE4QixNQUFNLENBQUMsV0FBVyxDQUFDLElBQW5CLEtBQTJCLFlBQTVEO0FBQ0ksUUFBQSxJQUFDLENBQUEsY0FBRCxHQUFrQixNQUFNLENBQUMsTUFBUCxDQUFBLENBQWxCLENBQUE7QUFBQSxRQUdBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBSFAsQ0FBQTtBQUFBLFFBSUEsY0FBQSxHQUFpQixJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsQ0FKakIsQ0FBQTtBQUFBLFFBS0EsU0FBQSxHQUFZLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBWixFQUFrQixjQUFBLEdBQWlCLENBQUEsQ0FBcEIsR0FBNEIsY0FBNUIsR0FBZ0QsTUFBL0QsQ0FMWixDQUFBO2VBTUEsSUFBQyxDQUFBLHVCQUFELENBQXlCLFNBQXpCLEVBQW9DLFFBQXBDLEVBUEo7T0FBQSxNQVNLLElBQUcsTUFBQSxDQUFBLE1BQUEs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

//# sourceURL=/home/junior/.atom/packages/sass-autocompile/lib/helper/inline-parameters-parser.coffee
