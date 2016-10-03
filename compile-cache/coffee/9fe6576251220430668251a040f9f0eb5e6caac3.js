(function() {
  var File, fs, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  path = require('path');

  module.exports = File = (function() {
    function File() {}

    File["delete"] = function(files) {
      var e, file, _i, _len, _results;
      if (typeof files === 'string') {
        files = [files];
      }
      if (typeof files === 'object') {
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          if (fs.existsSync(file)) {
            try {
              _results.push(fs.unlinkSync(file));
            } catch (_error) {
              e = _error;
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    File.getFileSize = function(filenames) {
      var fileSize, filename, sizes, _i, _len;
      fileSize = function(filename) {
        if (fs.existsSync(filename)) {
          return fs.statSync(filename)['size'];
        } else {
          return -1;
        }
      };
      if (typeof filenames === 'string') {
        return fileSize(filenames);
      } else {
        sizes = {};
        for (_i = 0, _len = filenames.length; _i < _len; _i++) {
          filename = filenames[_i];
          sizes[filename] = fileSize(filename);
        }
        return sizes;
      }
    };

    File.getTemporaryFilename = function(prefix, outputPath, fileExtension) {
      var filename, os, uniqueId, uuid;
      if (prefix == null) {
        prefix = "";
      }
      if (outputPath == null) {
        outputPath = null;
      }
      if (fileExtension == null) {
        fileExtension = 'tmp';
      }
      os = require('os');
      uuid = require('node-uuid');
      while (true) {
        uniqueId = uuid.v4();
        filename = "" + prefix + uniqueId + "." + fileExtension;
        if (!outputPath) {
          outputPath = os.tmpdir();
        }
        filename = path.join(outputPath, filename);
        if (!fs.existsSync(filename)) {
          break;
        }
      }
      return filename;
    };

    File.ensureDirectoryExists = function(paths) {
      var folder, p, parts, tmpPath, _i, _len, _results;
      if (typeof paths === 'string') {
        paths = [paths];
      }
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        p = paths[_i];
        if (fs.existsSync(p)) {
          continue;
        }
        parts = p.split(path.sep);
        tmpPath = '';
        if (parts[0] === '') {
          parts.shift();
          tmpPath = path.sep;
        }
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = parts.length; _j < _len1; _j++) {
            folder = parts[_j];
            tmpPath += (tmpPath === '' || tmpPath === path.sep ? '' : path.sep) + folder;
            if (!fs.existsSync(tmpPath)) {
              _results1.push(fs.mkdirSync(tmpPath));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      }
      return _results;
    };

    File.fileSizeToReadable = function(bytes, decimals) {
      var dividend, divisor, i, readable, unitIndex, units, _i, _ref;
      if (decimals == null) {
        decimals = 2;
      }
      if (typeof bytes === 'number') {
        bytes = [bytes];
      }
      units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      unitIndex = 0;
      decimals = Math.pow(10, decimals);
      dividend = bytes[0];
      divisor = 1024;
      while (dividend >= divisor) {
        divisor = divisor * 1024;
        unitIndex++;
      }
      divisor = divisor / 1024;
      for (i = _i = 0, _ref = bytes.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        bytes[i] = Math.round(bytes[i] * decimals / divisor) / decimals;
      }
      readable = {
        size: bytes,
        unit: units[unitIndex],
        divisor: divisor
      };
      return readable;
    };

    File.hasFileExtension = function(filename, extension) {
      var fileExtension, _ref;
      fileExtension = path.extname(filename);
      if (typeof extension === 'string') {
        extension = [extension];
      }
      return _ref = fileExtension.toLowerCase(), __indexOf.call(extension, _ref) >= 0;
    };

    return File;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL3Nhc3MtYXV0b2NvbXBpbGUvbGliL2hlbHBlci9maWxlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007c0JBRUY7O0FBQUEsSUFBQSxJQUFDLENBQUEsUUFBQSxDQUFELEdBQVMsU0FBQyxLQUFELEdBQUE7QUFHTCxVQUFBLDJCQUFBO0FBQUEsTUFBQSxJQUFHLE1BQUEsQ0FBQSxLQUFBLEtBQWdCLFFBQW5CO0FBQ0ksUUFBQSxLQUFBLEdBQVEsQ0FBQyxLQUFELENBQVIsQ0FESjtPQUFBO0FBR0EsTUFBQSxJQUFHLE1BQUEsQ0FBQSxLQUFBLEtBQWdCLFFBQW5CO0FBQ0k7YUFBQSw0Q0FBQTsyQkFBQTtBQUNJLFVBQUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLElBQWQsQ0FBSDtBQUNJO0FBQ0ksNEJBQUEsRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFkLEVBQUEsQ0FESjthQUFBLGNBQUE7QUFFTSxjQUFBLFVBQUEsQ0FGTjthQURKO1dBQUEsTUFBQTtrQ0FBQTtXQURKO0FBQUE7d0JBREo7T0FOSztJQUFBLENBQVQsQ0FBQTs7QUFBQSxJQWVBLElBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxTQUFELEdBQUE7QUFDVixVQUFBLG1DQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7QUFDUCxRQUFBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFkLENBQUg7QUFDSSxpQkFBTyxFQUFFLENBQUMs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

//# sourceURL=/home/junior/.atom/packages/sass-autocompile/lib/helper/file.coffee
