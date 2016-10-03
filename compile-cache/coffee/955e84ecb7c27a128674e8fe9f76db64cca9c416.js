(function() {
  var CompositeDisposable, path, prefixPath;

  CompositeDisposable = require('atom').CompositeDisposable;

  path = require('path');

  prefixPath = null;

  module.exports = {
    config: {
      noConfigDisable: {
        title: 'Disable when no sass-lint config file is found in your project root',
        type: 'boolean',
        description: 'and a .sass-lint.yml file is not specified in the .sass-lint.yml Path option',
        "default": false
      },
      resolvePathsRelativeToConfig: {
        title: 'Resolve paths in configuration relative to config file',
        type: 'boolean',
        description: 'Instead of the default where paths are resolved relative to the project root',
        "default": 'false'
      },
      configFile: {
        title: '.sass-lint.yml Config File',
        description: 'A .sass-lint.yml file to use/fallback to if no config file is found in the current project root',
        type: 'string',
        "default": ''
      },
      globalNodePath: {
        title: 'Global Node Installation Path',
        description: 'Run `npm get prefix` and paste the result here',
        type: 'string',
        "default": ''
      },
      globalSassLint: {
        title: 'Use global sass-lint installation',
        description: "The latest sass-lint is included in this package but if you\'d like to use a globally installed one enable it here.\n\nMake sure sass-lint is installed globally and is in your $PATH",
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      require('atom-package-deps').install();
      this.subs = new CompositeDisposable;
      this.subs.add(atom.config.observe('linter-sass-lint.noConfigDisable', (function(_this) {
        return function(noConfigDisable) {
          return _this.noConfigDisable = noConfigDisable;
        };
      })(this)));
      this.subs.add(atom.config.observe('linter-sass-lint.configFile', (function(_this) {
        return function(configFile) {
          return _this.configFile = configFile;
        };
      })(this)));
      this.subs.add(atom.config.observe('linter-sass-lint.globalSassLint', (function(_this) {
        return function(globalSassLint) {
          return _this.globalSassLint = globalSassLint;
        };
      })(this)));
      this.subs.add(atom.config.observe('linter-sass-lint.globalNodePath', (function(_this) {
        return function(globalNodePath) {
          return _this.globalPath = globalNodePath;
        };
      })(this)));
      return this.subs.add(atom.config.observe('linter-sass-lint.resolvePathsRelativeToConfig', (function(_this) {
        return function(resolvePathsRelativeToConfig) {
          return _this.resolvePathsRelativeToConfig = resolvePathsRelativeToConfig;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subs.dispose();
    },
    getFilePath: function(absolutePath, configFilePath) {
      path = require('path');
      if (this.resolvePathsRelativeToConfig) {
        return path.relative(path.dirname(configFilePath), absolutePath);
      } else {
        return atom.project.relativizePath(absolutePath)[1];
      }
    },
    findExecutable: function() {
      var consistentEnv, e, env, npmCommand, spawnSync;
      spawnSync = require('child_process').spawnSync;
      consistentEnv = require('consistent-env');
      if (!this.globalSassLint) {
        return require(path.join(__dirname, '..', 'node_modules', 'sass-lint'));
      }
      if (this.globalPath === '' && prefixPath === null) {
        npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        env = Object.assign({}, consistentEnv());
        try {
          prefixPath = spawnSync(npmCommand, ['get', 'prefix'], {
            env: env
          }).output[1].toString().trim();
        } catch (_error) {
          e = _error;
          throw new Error('prefix');
        }
      }
      if (process.platform === 'win32') {
        return require(path.join(this.globalPath || prefixPath, 'node_modules', 'sass-lint'));
      }
      return require(path.join(this.globalPath || prefixPath, 'lib', 'node_modules', 'sass-lint'));
    },
    provideLinter: function() {
      var find, globule, helpers, provider;
      find = require('atom-linter').find;
      globule = require('globule');
      helpers = require('./helpers');
      return provider = {
        name: 'sass-lint',
        grammarScopes: ['source.css.scss', 'source.scss', 'source.css.sass', 'source.sass'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(editor) {
            var colEndIdx, compiledConfig, config, configExt, error, filePath, globalConfig, line, lineIdx, linter, match, messages, projectConfig, relativePath, result, text;
            configExt = '.sass-lint.yml';
            filePath = editor.getPath();
            projectConfig = find(filePath, configExt);
            globalConfig = _this.configFile === '' ? null : _this.configFile;
            config = projectConfig !== null ? projectConfig : globalConfig;
            try {
              linter = _this.findExecutable();
            } catch (_error) {
              error = _error;
              if (error.message === 'prefix') {
                atom.notifications.addError("**Error getting $PATH - linter-sass-lint**\n\n\nYou've enabled using global sass-lint without specifying a prefix so we tried to.\nUnfortunately we were unable to execute `npm get prefix` for you..\n\nPlease make sure Atom is getting $PATH correctly or set it directly in the `linter-sass-lint` settings.", {
                  dismissable: true
                });
              }
              return [];
              atom.notifications.addWarning("**Sass-lint package missing**\n\nThe sass-lint package cannot be found, please check sass-lint is installed globally. \n\nYou can always use the sass-lint pacakage included with linter-sass-lint by disabling the\n`Use global sass-lint installation` option", {
                dismissable: true
              });
              return [];
            }
            if (config !== null && path.extname(config) !== '.yml') {
              atom.notifications.addWarning("**Config File Error**\n\nThe config file you specified doesn't seem to be a .yml file.\n\nPlease see the sass-lint [documentation](https://github.com/sasstools/sass-lint/tree/master/docs) on how to create a config file.");
            }
            if (config === null && _this.noConfigDisable === false) {
              return [
                {
                  type: 'Info',
                  text: 'No .sass-lint.yml config file detected or specified. Please check your settings',
                  filePath: filePath,
                  range: [[0, 0], [0, 0]]
                }
              ];
            } else if (config === null && _this.noConfigDisable === true) {
              return [];
            }
            try {
              compiledConfig = linter.getConfig({}, config);
              relativePath = _this.getFilePath(filePath, config);
              if (globule.isMatch(compiledConfig.files.include, relativePath) && !globule.isMatch(compiledConfig.files.ignore, relativePath)) {
                result = linter.lintText({
                  text: editor.getText(),
                  format: helpers.getFileSyntax(filePath),
                  filename: filePath
                }, {}, config);
              }
            } catch (_error) {
              error = _error;
              messages = [];
              match = error.message.match(/Parsing error at [^:]+: (.*) starting from line #(\d+)/);
              if (match) {
                text = "Parsing error: " + match[1] + ".";
                lineIdx = Number(match[2]) - 1;
                line = editor.lineTextForBufferRow(lineIdx);
                colEndIdx = line ? line.length : 1;
                return [
                  {
                    type: 'Error',
                    text: text,
                    filePath: filePath,
                    range: [[lineIdx, 0], [lineIdx, colEndIdx]]
                  }
                ];
              } else {
                console.log('linter-sass-lint', error);
                return [
                  {
                    type: 'Error',
                    text: 'Unexpected parse error in file',
                    filePath: filePath,
                    range: [[lineIdx, 0], [lineIdx, colEndIdx]]
                  }
                ];
              }
              return [];
            }
            if (result) {
              return result.messages.map(function(msg) {
                var col, html, ruleHref;
                line = msg.line ? msg.line - 1 : 0;
                col = msg.column ? msg.column - 1 : 0;
                text = msg.message ? ' ' + msg.message : 'Unknown Error';
                ruleHref = helpers.getRuleURI(msg.ruleId);
                html = '<a href="' + ruleHref + '" class="badge badge-flexible sass-lint">' + msg.ruleId + '</a>' + text;
                result = {
                  type: msg.severity === 1 ? 'Warning' : msg.severity === 2 ? 'Error' : 'Info',
                  html: html,
                  filePath: filePath,
                  range: [[line, col], [line, col + 1]]
                };
                return result;
              });
            }
            return [];
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zYXNzLWxpbnQvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLElBRmIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsZUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8scUVBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxXQUFBLEVBQWEsOEVBRmI7QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhUO09BREY7QUFBQSxNQUtBLDRCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyx3REFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFdBQUEsRUFBYSw4RUFGYjtBQUFBLFFBR0EsU0FBQSxFQUFTLE9BSFQ7T0FORjtBQUFBLE1BVUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sNEJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxpR0FEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxFQUhUO09BWEY7QUFBQSxNQWVBLGNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLCtCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsZ0RBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsRUFIVDtPQWhCRjtBQUFBLE1Bb0JBLGNBQUEsRUFDRTtB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

//# sourceURL=/home/junior/.atom/packages/linter-sass-lint/lib/main.coffee
