(function() {
  var ArgumentParser, Emitter, File, InlineParameterParser, NodeSassCompiler, SassAutocompileOptions, exec, fs, path;

  Emitter = require('event-kit').Emitter;

  SassAutocompileOptions = require('./options');

  InlineParameterParser = require('./helper/inline-parameters-parser');

  File = require('./helper/file');

  ArgumentParser = require('./helper/argument-parser');

  fs = require('fs');

  path = require('path');

  exec = require('child_process').exec;

  module.exports = NodeSassCompiler = (function() {
    NodeSassCompiler.MODE_DIRECT = 'direct';

    NodeSassCompiler.MODE_FILE = 'to-file';

    function NodeSassCompiler(options) {
      this.options = options;
      this.emitter = new Emitter();
    }

    NodeSassCompiler.prototype.destroy = function() {
      this.emitter.dispose();
      return this.emitter = null;
    };

    NodeSassCompiler.prototype.compile = function(mode, filename, compileOnSave) {
      if (filename == null) {
        filename = null;
      }
      if (compileOnSave == null) {
        compileOnSave = false;
      }
      this.compileOnSave = compileOnSave;
      this.childFiles = {};
      return this._compile(mode, filename);
    };

    NodeSassCompiler.prototype._compile = function(mode, filename, compileOnSave) {
      var parameterParser, parameterTarget;
      if (filename == null) {
        filename = null;
      }
      if (compileOnSave == null) {
        compileOnSave = false;
      }
      this.mode = mode;
      this.targetFilename = filename;
      this.inputFile = void 0;
      this.outputFile = void 0;
      parameterParser = new InlineParameterParser();
      parameterTarget = this.getParameterTarget();
      return parameterParser.parse(parameterTarget, (function(_this) {
        return function(params, error) {
          var errorMessage;
          if (_this.compileOnSave && _this.prohibitCompilationOnSave(params)) {
            _this.emitFinished();
            return;
          }
          if (params === false && _this.options.compileOnlyFirstLineCommentFiles) {
            _this.emitFinished();
            return;
          }
          if (error) {
            _this.emitMessageAndFinish('error', error, true);
            return;
          }
          _this.setupInputFile(filename);
          if ((errorMessage = _this.validateInputFile()) !== void 0) {
            _this.emitMessageAndFinish('error', errorMessage, true);
            return;
          }
          if (params === false && _this.isPartial() && !_this.options.compilePartials) {
            _this.emitFinished();
            return;
          }
          if (typeof params.main === 'string') {
            if (params.main === _this.inputFile.path || _this.childFiles[params.main] !== void 0) {
              return _this.emitMessageAndFinish('error', 'Following the main parameter ends in a loop.');
            } else if (_this.inputFile.isTemporary) {
              return _this.emitMessageAndFinish('error', '\'main\' inline parameter is not supported in direct compilation.');
            } else {
              _this.childFiles[params.main] = true;
              return _this._compile(_this.mode, params.main);
            }
          } else {
            _this.emitStart();
            if (_this.isCompileToFile() && !_this.ensureFileIsSaved()) {
              _this.emitMessageAndFinish('warning', 'Compilation cancelled');
              return;
            }
            _this.updateOptionsWithInlineParameters(params);
            _this.outputStyles = _this.getOutputStylesToCompileTo();
            if (_this.outputStyles.length === 0) {
              _this.emitMessageAndFinish('warning', 'No output style defined! Please enable at least one style in options or use inline parameters.');
              return;
            }
            return _this.doCompile();
          }
        };
      })(this));
    };

    NodeSassCompiler.prototype.getParameterTarget = function() {
      if (typeof this.targetFilename === 'string') {
        return this.targetFilename;
      } else {
        return atom.workspace.getActiveTextEditor();
      }
    };

    NodeSassCompiler.prototype.prohibitCompilationOnSave = function(params) {
      var _ref;
      if (params && ((_ref = params.compileOnSave) === true || _ref === false)) {
        this.options.compileOnSave = params.compileOnSave;
      }
      return !this.options.compileOnSave;
    };

    NodeSassCompiler.prototype.isPartial = function() {
      var filename;
      filename = path.basename(this.inputFile.path);
      return filename[0] === '_';
    };

    NodeSassCompiler.prototype.setupInputFile = function(filename) {
      var activeEditor, syntax;
      if (filename == null) {
        filename = null;
      }
      this.inputFile = {
        isTemporary: false
      };
      if (filename) {
        return this.inputFile.path = filename;
      } else {
        activeEditor = atom.workspace.getActiveTextEditor();
        if (!activeEditor) {
          return;
        }
        if (this.isCompileDirect()) {
          syntax = this.askForInputSyntax();
          if (syntax) {
            this.inputFile.path = File.getTemporaryFilename('sass-autocompile.input.', null, syntax);
            this.inputFile.isTemporary = true;
            return fs.writeFileSync(this.inputFile.path, activeEditor.getText());
          } else {
            return this.inputFile.path = void 0;
          }
        } else {
          this.inputFile.path = activeEditor.getURI();
          if (!this.inputFile.path) {
            return this.inputFile.path = this.askForSavingUnsavedFileInActiveEditor();
          }
        }
      }
    };

    NodeSassCompiler.prototype.askForInputSyntax = function() {
      var dialogResultButton, syntax;
      dialogResultButton = atom.confirm({
        message: "Is the syntax if your inout SASS or SCSS?",
        buttons: ['SASS', 'SCSS', 'Cancel']
      });
      switch (dialogResultButton) {
        case 0:
          syntax = 'sass';
          break;
        case 1:
          syntax = 'scss';
          break;
        default:
          syntax = void 0;
      }
      return syntax;
    };

    NodeSassCompiler.prototype.askForSavingUnsavedFileInActiveEditor = function() {
      var activeEditor, dialogResultButton, error, filename;
      activeEditor = atom.workspace.getActiveTextEditor();
      dialogResultButton = atom.confirm({
        message: "In order to compile this SASS file to a CSS file, you have do save it before. Do you want to save this file?",
        detailedMessage: "Alternativly you can use 'Direct Compilation' for compiling without creating a CSS file.",
        buttons: ["Save", "Cancel"]
      });
      if (dialogResultButton === 0) {
        filename = atom.showSaveDialogSync();
        try {
          activeEditor.saveAs(filename);
        } catch (_error) {
          error = _error;
        }
        filename = activeEditor.getURI();
        return filename;
      }
      return void 0;
    };

    NodeSassCompiler.prototype.validateInputFile = function() {
      var errorMessage;
      errorMessage = void 0;
      if (!this.inputFile.path) {
        errorMessage = 'Invalid file: ' + this.inputFile.path;
      }
      if (!fs.existsSync(this.inputFile.path)) {
        errorMessage = 'File does not exist: ' + this.inputFile.path;
      }
      return errorMessage;
    };

    NodeSassCompiler.prototype.ensureFileIsSaved = function() {
      var dialogResultButton, editor, editors, filename, _i, _len;
      editors = atom.workspace.getTextEditors();
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        if (editor && editor.getURI && editor.getURI() === this.inputFile.path && editor.isModified()) {
          filename = path.basename(this.inputFile.path);
          dialogResultButton = atom.confirm({
            message: "'" + filename + "' has changes, do you want to save them?",
            detailedMessage: "In order to compile SASS you have to save changes.",
            buttons: ["Save and compile", "Cancel"]
          });
          if (dialogResultButton === 0) {
            editor.save();
            break;
          } else {
            return false;
          }
        }
      }
      return true;
    };

    NodeSassCompiler.prototype.updateOptionsWithInlineParameters = function(params) {
      var outputStyle, _ref, _ref1;
      if (typeof params.out === 'string' || typeof params.outputStyle === 'string' || typeof params.compress === 'boolean') {
        if (this.options.showOldParametersWarning) {
          this.emitMessage('warning', 'Please don\'t use \'out\', \'outputStyle\' or \'compress\' parameter any more. Have a look at the documentation for newer parameters');
        }
        outputStyle = 'compressed';
        if (params.compress === false) {
          outputStyle = 'nested';
        }
        if (params.compress === true) {
          outputStyle = 'compressed';
        }
        if (params.outputStyle) {
          outputStyle = typeof params.outputStyle === 'string' ? params.outputStyle.toLowerCase() : 'compressed';
        }
        this.options.compileCompressed = outputStyle === 'compressed';
        if (outputStyle === 'compressed' && typeof params.out === 'string' && params.out.length > 0) {
          this.options.compressedFilenamePattern = params.out;
        }
        this.options.compileCompact = outputStyle === 'compact';
        if (outputStyle === 'compact' && typeof params.out === 'string' && params.out.length > 0) {
          this.options.compactFilenamePattern = params.out;
        }
        this.options.compileNested = outputStyle === 'nested';
        if (outputStyle === 'nested' && typeof params.out === 'string' && params.out.length > 0) {
          this.options.nestedFilenamePattern = params.out;
        }
        this.options.compileExpanded = outputStyle === 'expanded';
        if (outputStyle === 'expanded' && typeof params.out === 'string' && params.out.length > 0) {
          this.options.expandedFilenamePattern = params.out;
        }
      }
      if (params.compileCompressed || params.compileCompact || params.compileNested || params.compileExpanded) {
        this.options.compileCompressed = false;
        this.options.compileCompact = false;
        this.options.compileNested = false;
        this.options.compileExpanded = false;
      }
      if (params.compileCompressed === true || params.compileCompressed === false) {
        this.options.compileCompressed = params.compileCompressed;
      } else if (typeof params.compileCompressed === 'string') {
        this.options.compileCompressed = true;
        this.options.compressedFilenamePattern = params.compileCompressed;
      }
      if (typeof params.compressedFilenamePattern === 'string' && params.compressedFilenamePattern.length > 1) {
        this.options.compressedFilenamePattern = params.compressedFilenamePattern;
      }
      if (params.compileCompact === true || params.compileCompact === false) {
        this.options.compileCompact = params.compileCompact;
      } else if (typeof params.compileCompact === 'string') {
        this.options.compileCompact = true;
        this.options.compactFilenamePattern = params.compileCompact;
      }
      if (typeof params.compactFilenamePattern === 'string' && params.compactFilenamePattern.length > 1) {
        this.options.compactFilenamePattern = params.compactFilenamePattern;
      }
      if (params.compileNested === true || params.compileNested === false) {
        this.options.compileNested = params.compileNested;
      } else if (typeof params.compileNested === 'string') {
        this.options.compileNested = true;
        this.options.nestedFilenamePattern = params.compileNested;
      }
      if (typeof params.nestedFilenamePattern === 'string' && params.nestedFilenamePattern.length > 1) {
        this.options.nestedFilenamePattern = params.nestedFilenamePattern;
      }
      if (params.compileExpanded === true || params.compileExpanded === false) {
        this.options.compileExpanded = params.compileExpanded;
      } else if (typeof params.compileExpanded === 'string') {
        this.options.compileExpanded = true;
        this.options.expandedFilenamePattern = params.compileExpanded;
      }
      if (typeof params.expandedFilenamePattern === 'string' && params.expandedFilenamePattern.length > 1) {
        this.options.expandedFilenamePattern = params.expandedFilenamePattern;
      }
      if (typeof params.indentType === 'string' && ((_ref = params.indentType.toLowerCase()) === 'space' || _ref === 'tab')) {
        this.options.indentType = params.indentType.toLowerCase();
      }
      if (typeof params.indentWidth === 'number' && params.indentWidth <= 10 && indentWidth >= 0) {
        this.options.indentWidth = params.indentWidth;
      }
      if (typeof params.linefeed === 'string' && ((_ref1 = params.linefeed.toLowerCase()) === 'cr' || _ref1 === 'crlf' || _ref1 === 'lf' || _ref1 === 'lfcr')) {
        this.options.linefeed = params.linefeed.toLowerCase();
      }
      if (params.sourceMap === true || params.sourceMap === false || (typeof params.sourceMap === 'string' && params.sourceMap.length > 1)) {
        this.options.sourceMap = params.sourceMap;
      }
      if (params.sourceMapEmbed === true || params.sourceMapEmbed === false) {
        this.options.sourceMapEmbed = params.sourceMapEmbed;
      }
      if (params.sourceMapContents === true || params.sourceMapContents === false) {
        this.options.sourceMapContents = params.sourceMapContents;
      }
      if (params.sourceComments === true || params.sourceComments === false) {
        this.options.sourceComments = params.sourceComments;
      }
      if ((typeof params.includePath === 'string' && params.includePath.length > 1) || Array.isArray(params.includePath)) {
        this.options.includePath = params.includePath;
      } else if ((typeof params.includePaths === 'string' && params.includePaths.length > 1) || Array.isArray(params.includePaths)) {
        this.options.includePath = params.includePaths;
      }
      if (typeof params.precision === 'number' && params.precision >= 0) {
        this.options.precision = params.precision;
      }
      if (typeof params.importer === 'string' && params.importer.length > 1) {
        this.options.importer = params.importer;
      }
      if (typeof params.functions === 'string' && params.functions.length > 1) {
        return this.options.functions = params.functions;
      }
    };

    NodeSassCompiler.prototype.getOutputStylesToCompileTo = function() {
      var dialogResultButton, outputStyles;
      outputStyles = [];
      if (this.options.compileCompressed) {
        outputStyles.push('compressed');
      }
      if (this.options.compileCompact) {
        outputStyles.push('compact');
      }
      if (this.options.compileNested) {
        outputStyles.push('nested');
      }
      if (this.options.compileExpanded) {
        outputStyles.push('expanded');
      }
      if (this.isCompileDirect() && outputStyles.length > 1) {
        outputStyles.push('Cancel');
        dialogResultButton = atom.confirm({
          message: "For direction compilation you have to select a single output style. Which one do you want to use?",
          buttons: outputStyles
        });
        if (dialogResultButton < outputStyles.length - 1) {
          outputStyles = [outputStyles[dialogResultButton]];
        } else {
          outputStyles = [];
        }
      }
      return outputStyles;
    };

    NodeSassCompiler.prototype.getOutputFile = function(outputStyle) {
      var basename, fileExtension, filename, outputFile, outputPath, pattern;
      outputFile = {
        style: outputStyle,
        isTemporary: false
      };
      if (this.isCompileDirect()) {
        outputFile.path = File.getTemporaryFilename('sass-autocompile.output.', null, 'css');
        outputFile.isTemporary = true;
      } else {
        switch (outputFile.style) {
          case 'compressed':
            pattern = this.options.compressedFilenamePattern;
            break;
          case 'compact':
            pattern = this.options.compactFilenamePattern;
            break;
          case 'nested':
            pattern = this.options.nestedFilenamePattern;
            break;
          case 'expanded':
            pattern = this.options.expandedFilenamePattern;
            break;
          default:
            throw new Error('Invalid output style.');
        }
        basename = path.basename(this.inputFile.path);
        fileExtension = path.extname(basename).replace('.', '');
        filename = basename.replace(new RegExp('^(.*?)\.(' + fileExtension + ')$', 'gi'), pattern);
        if (!path.isAbsolute(path.dirname(filename))) {
          outputPath = path.dirname(this.inputFile.path);
          filename = path.join(outputPath, filename);
        }
        outputFile.path = filename;
      }
      return outputFile;
    };

    NodeSassCompiler.prototype.checkOutputFileAlreadyExists = function(outputFile) {
      var dialogResultButton;
      if (this.options.checkOutputFileAlreadyExists) {
        if (fs.existsSync(outputFile.path)) {
          dialogResultButton = atom.confirm({
            message: "The output file already exists. Do you want to overwrite it?",
            detailedMessage: "Output file: '" + outputFile.path + "'",
            buttons: ["Overwrite", "Skip", "Cancel"]
          });
          switch (dialogResultButton) {
            case 0:
              return 'overwrite';
            case 1:
              return 'skip';
            case 2:
              return 'cancel';
          }
        }
      }
      return 'overwrite';
    };

    NodeSassCompiler.prototype.ensureOutputDirectoryExists = function(outputFile) {
      var outputPath;
      if (this.isCompileToFile()) {
        outputPath = path.dirname(outputFile.path);
        return File.ensureDirectoryExists(outputPath);
      }
    };

    NodeSassCompiler.prototype.tryToFindNodeSassInstallation = function(callback) {
      var checkNodeSassExists, devNull, existanceCheckCommand, possibleNodeSassPaths;
      devNull = process.platform === 'win32' ? 'nul' : '/dev/null';
      existanceCheckCommand = "node-sass --version >" + devNull + " 2>&1 && (echo found) || (echo fail)";
      possibleNodeSassPaths = [''];
      if (typeof this.options.nodeSassPath === 'string' && this.options.nodeSassPath.length > 1) {
        possibleNodeSassPaths.push(this.options.nodeSassPath);
      }
      if (process.platform === 'win32') {
        possibleNodeSassPaths.push(path.join(process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'], 'AppData\\Roaming\\npm'));
      }
      if (process.platform === 'linux') {
        possibleNodeSassPaths.push('/usr/local/bin');
      }
      if (process.platform === 'darwin') {
        possibleNodeSassPaths.push('/usr/local/bin');
      }
      checkNodeSassExists = (function(_this) {
        return function(foundInPath) {
          var command, environment, searchPath;
          if (typeof foundInPath === 'string') {
            if (foundInPath === _this.options.nodeSassPath) {
              callback(true, false);
            } else if (_this.askAndFixNodeSassPath(foundInPath)) {
              callback(true, true);
            } else {
              callback(false, false);
            }
            return;
          }
          if (possibleNodeSassPaths.length === 0) {
            callback(false, false);
            return;
          }
          searchPath = possibleNodeSassPaths.shift();
          command = path.join(searchPath, existanceCheckCommand);
          environment = Object.create(process.env);
          if (typeof searchPath === 'string' && searchPath.length > 1) {
            environment.PATH += ":" + searchPath;
          }
          return exec(command, {
            env: environment
          }, function(error, stdout, stderr) {
            if (stdout.trim() === 'found') {
              return checkNodeSassExists(searchPath);
            } else {
              return checkNodeSassExists();
            }
          });
        };
      })(this);
      return checkNodeSassExists();
    };

    NodeSassCompiler.prototype.askAndFixNodeSassPath = function(nodeSassPath) {
      var detailedMessage, dialogResultButton;
      if (nodeSassPath === '' && this.options.nodeSassPath !== '') {
        detailedMessage = "'Path to node-sass command' option will be cleared, because node-sass is accessable without absolute path.";
      } else if (nodeSassPath !== '' && this.options.nodeSassPath === '') {
        detailedMessage = "'Path to node-sass command' option will be set to '" + nodeSassPath + "', because command was found there.";
      } else if (nodeSassPath !== '' && this.options.nodeSassPath !== '') {
        detailedMessage = "'Path to node-sass command' option will be replaced with '" + nodeSassPath + "', because command was found there.";
      }
      dialogResultButton = atom.confirm({
        message: "'node-sass' command could not be found with current configuration, but it can be automatically fixed. Fix it?",
        detailedMessage: detailedMessage,
        buttons: ["Fix it", "Cancel"]
      });
      switch (dialogResultButton) {
        case 0:
          SassAutocompileOptions.set('nodeSassPath', nodeSassPath);
          this.options.nodeSassPath = nodeSassPath;
          return true;
        case 1:
          return false;
      }
    };

    NodeSassCompiler.prototype.doCompile = function() {
      var child, emitterParameters, error, execParameters, outputFile, outputStyle;
      if (this.outputStyles.length === 0) {
        this.emitFinished();
        if (this.inputFile.isTemporary) {
          File["delete"](this.inputFile.path);
        }
        return;
      }
      outputStyle = this.outputStyles.pop();
      outputFile = this.getOutputFile(outputStyle);
      emitterParameters = this.getBasicEmitterParameters({
        outputFilename: outputFile.path,
        outputStyle: outputFile.style
      });
      try {
        if (this.isCompileToFile()) {
          switch (this.checkOutputFileAlreadyExists(outputFile)) {
            case 'overwrite':
              break;
            case 'cancel':
              throw new Error('Compilation cancelled');
              break;
            case 'skip':
              emitterParameters.message = 'Compilation skipped: ' + outputFile.path;
              this.emitter.emit('warning', emitterParameters);
              this.doCompile();
              return;
          }
        }
        this.ensureOutputDirectoryExists(outputFile);
        this.startCompilingTimestamp = new Date().getTime();
        execParameters = this.prepareExecParameters(outputFile);
        return child = exec(execParameters.command, {
          env: execParameters.environment
        }, (function(_this) {
          return function(error, stdout, stderr) {
            if (child.exitCode > 0) {
              return _this.tryToFindNodeSassInstallation(function(found, fixed) {
                if (fixed) {
                  return _this._compile(_this.mode, _this.targetFilename);
                } else {
                  _this.onCompiled(outputFile, error, stdout, stderr);
                  return _this.doCompile();
                }
              });
            } else {
              _this.onCompiled(outputFile, error, stdout, stderr);
              return _this.doCompile();
            }
          };
        })(this));
      } catch (_error) {
        error = _error;
        emitterParameters.message = error;
        this.emitter.emit('error', emitterParameters);
        this.outputStyles = [];
        return this.doCompile();
      }
    };

    NodeSassCompiler.prototype.onCompiled = function(outputFile, error, stdout, stderr) {
      var compiledCss, emitterParameters, errorJson, errorMessage, statistics;
      emitterParameters = this.getBasicEmitterParameters({
        outputFilename: outputFile.path,
        outputStyle: outputFile.style
      });
      statistics = {
        duration: new Date().getTime() - this.startCompilingTimestamp
      };
      try {
        emitterParameters.nodeSassOutput = stdout ? stdout : stderr;
        if (error !== null) {
          if (error.message.indexOf('"message":') > -1) {
            errorJson = error.message.match(/{\n(.*?(\n))+}/gm);
            errorMessage = JSON.parse(errorJson);
          } else {
            errorMessage = error.message;
          }
          emitterParameters.message = errorMessage;
          this.emitter.emit('error', emitterParameters);
          return this.outputStyles = [];
        } else {
          statistics.before = File.getFileSize(this.inputFile.path);
          statistics.after = File.getFileSize(outputFile.path);
          statistics.unit = 'Byte';
          if (this.isCompileDirect()) {
            compiledCss = fs.readFileSync(outputFile.path);
            atom.workspace.getActiveTextEditor().setText(compiledCss.toString());
          }
          emitterParameters.statistics = statistics;
          return this.emitter.emit('success', emitterParameters);
        }
      } finally {
        if (outputFile.isTemporary) {
          File["delete"](outputFile.path);
        }
      }
    };

    NodeSassCompiler.prototype.prepareExecParameters = function(outputFile) {
      var command, environment, nodeSassParameters;
      nodeSassParameters = this.buildNodeSassParameters(outputFile);
      command = 'node-sass ' + nodeSassParameters.join(' ');
      environment = Object.create(process.env);
      if (typeof this.options.nodeSassPath === 'string' && this.options.nodeSassPath.length > 1) {
        command = path.join(this.options.nodeSassPath, command);
        environment.PATH += ":" + this.options.nodeSassPath;
      }
      return {
        command: command,
        environment: environment
      };
    };

    NodeSassCompiler.prototype.buildNodeSassParameters = function(outputFile) {
      var argumentParser, basename, execParameters, fileExtension, functionsFilename, i, importerFilename, includePath, sourceMapFilename, workingDirectory, _i, _ref;
      execParameters = [];
      workingDirectory = path.dirname(this.inputFile.path);
      execParameters.push('--output-style ' + outputFile.style);
      if (typeof this.options.indentType === 'string' && this.options.indentType.length > 0) {
        execParameters.push('--indent-type ' + this.options.indentType.toLowerCase());
      }
      if (typeof this.options.indentWidth === 'number') {
        execParameters.push('--indent-width ' + this.options.indentWidth);
      }
      if (typeof this.options.linefeed === 'string' && this.options.linefeed.lenght > 0) {
        execParameters.push('--linefeed ' + this.options.linefeed);
      }
      if (this.options.sourceComments === true) {
        execParameters.push('--source-comments');
      }
      if (this.options.sourceMap === true || (typeof this.options.sourceMap === 'string' && this.options.sourceMap.length > 0)) {
        if (this.options.sourceMap === true) {
          sourceMapFilename = outputFile.path + '.map';
        } else {
          basename = path.basename(outputFile.path);
          fileExtension = path.extname(basename).replace('.', '');
          sourceMapFilename = basename.replace(new RegExp('^(.*?)\.(' + fileExtension + ')$', 'gi'), this.options.sourceMap);
        }
        execParameters.push('--source-map "' + sourceMapFilename + '"');
      }
      if (this.options.sourceMapEmbed === true) {
        execParameters.push('--source-map-embed');
      }
      if (this.options.sourceMapContents === true) {
        execParameters.push('--source-map-contents');
      }
      if (this.options.includePath) {
        includePath = this.options.includePath;
        if (typeof includePath === 'string') {
          argumentParser = new ArgumentParser();
          includePath = argumentParser.parseValue('[' + includePath + ']');
          if (!Array.isArray(includePath)) {
            includePath = [includePath];
          }
        }
        for (i = _i = 0, _ref = includePath.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (!path.isAbsolute(includePath[i])) {
            includePath[i] = path.join(workingDirectory, includePath[i]);
          }
          execParameters.push('--include-path "' + includePath[i] + '"');
        }
      }
      if (typeof this.options.precision === 'number') {
        execParameters.push('--precision ' + this.options.precision);
      }
      if (typeof this.options.importer === 'string' && this.options.importer.length > 0) {
        importerFilename = this.options.importer;
        if (!path.isAbsolute(importerFilename)) {
          importerFilename = path.join(workingDirectory, importerFilename);
        }
        execParameters.push('--importer "' + path.resolve(importerFilename) + '"');
      }
      if (typeof this.options.functions === 'string' && this.options.functions.length > 0) {
        functionsFilename = this.options.functions;
        if (!path.isAbsolute(functionsFilename)) {
          functionsFilename = path.join(workingDirectory, functionsFilename);
        }
        execParameters.push('--functions "' + path.resolve(functionsFilename) + '"');
      }
      execParameters.push('"' + this.inputFile.path + '"');
      execParameters.push('"' + outputFile.path + '"');
      return execParameters;
    };

    NodeSassCompiler.prototype.emitStart = function() {
      return this.emitter.emit('start', this.getBasicEmitterParameters());
    };

    NodeSassCompiler.prototype.emitFinished = function() {
      this.deleteTemporaryFiles();
      return this.emitter.emit('finished', this.getBasicEmitterParameters());
    };

    NodeSassCompiler.prototype.emitMessage = function(type, message) {
      return this.emitter.emit(type, this.getBasicEmitterParameters({
        message: message
      }));
    };

    NodeSassCompiler.prototype.emitMessageAndFinish = function(type, message, emitStartEvent) {
      if (emitStartEvent == null) {
        emitStartEvent = false;
      }
      if (emitStartEvent) {
        this.emitStart();
      }
      this.emitMessage(type, message);
      return this.emitFinished();
    };

    NodeSassCompiler.prototype.getBasicEmitterParameters = function(additionalParameters) {
      var key, parameters, value;
      if (additionalParameters == null) {
        additionalParameters = {};
      }
      parameters = {
        isCompileToFile: this.isCompileToFile(),
        isCompileDirect: this.isCompileDirect()
      };
      if (this.inputFile) {
        parameters.inputFilename = this.inputFile.path;
      }
      for (key in additionalParameters) {
        value = additionalParameters[key];
        parameters[key] = value;
      }
      return parameters;
    };

    NodeSassCompiler.prototype.deleteTemporaryFiles = function() {
      if (this.inputFile && this.inputFile.isTemporary) {
        File["delete"](this.inputFile.path);
      }
      if (this.outputFile && this.outputFile.isTemporary) {
        return File["delete"](this.outputFile.path);
      }
    };

    NodeSassCompiler.prototype.isCompileDirect = function() {
      return this.mode === NodeSassCompiler.MODE_DIRECT;
    };

    NodeSassCompiler.prototype.isCompileToFile = function() {
      return this.mode === NodeSassCompiler.MODE_FILE;
    };

    NodeSassCompiler.prototype.onStart = function(callback) {
      return this.emitter.on('start', callback);
    };

    NodeSassCompiler.prototype.onSuccess = function(callback) {
      return this.emitter.on('success', callback);
    };

    NodeSassCompiler.prototype.onWarning = function(callback) {
      return this.emitter.on('warning', callback);
    };

    NodeSassCompiler.prototype.onError = function(callback) {
      return this.emitter.on('error', callback);
    };

    NodeSassCompiler.prototype.onFinished = function(callback) {
      return this.emitter.on('finished', callback);
    };

    return NodeSassCompiler;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL3Nhc3MtYXV0b2NvbXBpbGUvbGliL2NvbXBpbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4R0FBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLFdBQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFDQSxzQkFBQSxHQUF5QixPQUFBLENBQVEsV0FBUixDQUR6QixDQUFBOztBQUFBLEVBR0EscUJBQUEsR0FBd0IsT0FBQSxDQUFRLG1DQUFSLENBSHhCLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FKUCxDQUFBOztBQUFBLEVBS0EsY0FBQSxHQUFpQixPQUFBLENBQVEsMEJBQVIsQ0FMakIsQ0FBQTs7QUFBQSxFQU9BLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQVBMLENBQUE7O0FBQUEsRUFRQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FSUCxDQUFBOztBQUFBLEVBU0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsSUFUaEMsQ0FBQTs7QUFBQSxFQVlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFRixJQUFBLGdCQUFDLENBQUEsV0FBRCxHQUFlLFFBQWYsQ0FBQTs7QUFBQSxJQUNBLGdCQUFDLENBQUEsU0FBRCxHQUFhLFNBRGIsQ0FBQTs7QUFJYSxJQUFBLDBCQUFDLE9BQUQsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxPQUFBLENBQUEsQ0FEZixDQURTO0lBQUEsQ0FKYjs7QUFBQSwrQkFTQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ0wsTUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FB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

//# sourceURL=/home/junior/.atom/packages/sass-autocompile/lib/compiler.coffee
