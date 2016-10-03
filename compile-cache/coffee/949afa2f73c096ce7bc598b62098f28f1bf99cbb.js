(function() {
  var CompositeDisposable, File, NodeSassCompiler, SassAutocompileOptions, SassAutocompileView;

  CompositeDisposable = require('atom').CompositeDisposable;

  SassAutocompileOptions = require('./options');

  SassAutocompileView = require('./sass-autocompile-view');

  NodeSassCompiler = require('./compiler');

  File = require('./helper/file');

  module.exports = {
    config: {
      compileOnSave: {
        title: 'Compile on Save',
        description: 'This option en-/disables auto compiling on save',
        type: 'boolean',
        "default": true,
        order: 10
      },
      compileFiles: {
        title: 'Compile files ...',
        description: 'Choose which SASS files you want this package to compile',
        type: 'string',
        "enum": ['Only with first-line-comment', 'Every SASS file'],
        "default": 'Every SASS file',
        order: 11
      },
      compilePartials: {
        title: 'Compile Partials',
        description: 'Controls compilation of Partials (underscore as first character in filename) if there is no first-line-comment',
        type: 'boolean',
        "default": false,
        order: 12
      },
      checkOutputFileAlreadyExists: {
        title: 'Ask for overwriting already existent files',
        description: 'If target file already exists, sass-autocompile will ask you before overwriting',
        type: 'boolean',
        "default": false,
        order: 13
      },
      directlyJumpToError: {
        title: 'Directly jump to error',
        description: 'If enabled and you compile an erroneous SASS file, this file is opened and jumped to the problematic position.',
        type: 'boolean',
        "default": false,
        order: 14
      },
      showCompileSassItemInTreeViewContextMenu: {
        title: 'Show \'Compile SASS\' item in Tree View context menu',
        description: 'If enbaled, Tree View context menu contains a \'Compile SASS\' item that allows you to compile that file via context menu',
        type: 'string',
        type: 'boolean',
        "default": true,
        order: 15
      },
      compileCompressed: {
        title: 'Compile with \'compressed\' output style',
        description: 'If enabled SASS files are compiled with \'compressed\' output style. Please define a corresponding output filename pattern or use inline parameter \'compressedFilenamePattern\'',
        type: 'boolean',
        "default": true,
        order: 30
      },
      compressedFilenamePattern: {
        title: 'Filename pattern for \'compressed\' compiled files',
        description: 'Define the replacement pattern for compiled filenames with \'compressed\' output style. Placeholders are: \'$1\' for basename of file and \'$2\' for original file extension.',
        type: 'string',
        "default": '$1.min.css',
        order: 31
      },
      compileCompact: {
        title: 'Compile with \'compact\' output style',
        description: 'If enabled SASS files are compiled with \'compact\' output style. Please define a corresponding output filename pattern or use inline parameter \'compactFilenamePattern\'',
        type: 'boolean',
        "default": false,
        order: 32
      },
      compactFilenamePattern: {
        title: 'Filename pattern for \'compact\' compiled files',
        description: 'Define the replacement pattern for compiled filenames with \'compact\' output style. Placeholders are: \'$1\' for basename of file and \'$2\' for original file extension.',
        type: 'string',
        "default": '$1.compact.css',
        order: 33
      },
      compileNested: {
        title: 'Compile with \'nested\' output style',
        description: 'If enabled SASS files are compiled with \'nested\' output style. Please define a corresponding output filename pattern or use inline parameter \'nestedFilenamePattern\'',
        type: 'boolean',
        "default": false,
        order: 34
      },
      nestedFilenamePattern: {
        title: 'Filename pattern for \'nested\' compiled files',
        description: 'Define the replacement pattern for compiled filenames with \'nested\' output style. Placeholders are: \'$1\' for basename of file and \'$2\' for original file extension.',
        type: 'string',
        "default": '$1.nested.css',
        order: 35
      },
      compileExpanded: {
        title: 'Compile with \'expanded\' output style',
        description: 'If enabled SASS files are compiled with \'expanded\' output style. Please define a corresponding output filename pattern or use inline parameter \'expandedFilenamePattern\'',
        type: 'boolean',
        "default": false,
        order: 36
      },
      expandedFilenamePattern: {
        title: 'Filename pattern for \'expanded\' compiled files',
        description: 'Define the replacement pattern for compiled filenames with \'expanded\' output style. Placeholders are: \'$1\' for basename of file and \'$2\' for original file extension.',
        type: 'string',
        "default": '$1.css',
        order: 37
      },
      indentType: {
        title: 'Indent type',
        description: 'Indent type for output CSS',
        type: 'string',
        "enum": ['Space', 'Tab'],
        "default": 'Space',
        order: 38
      },
      indentWidth: {
        title: 'Indent width',
        description: 'Indent width; number of spaces or tabs',
        type: 'integer',
        "enum": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "default": 2,
        minimum: 0,
        maximum: 10,
        order: 39
      },
      linefeed: {
        title: 'Linefeed',
        description: 'Used to determine whether to use \'cr\', \'crlf\', \'lf\' or \'lfcr\' sequence for line break',
        type: 'string',
        "enum": ['cr', 'crlf', 'lf', 'lfcr'],
        "default": 'lf',
        order: 40
      },
      sourceMap: {
        title: 'Build source map',
        description: 'If enabled a source map is generated',
        type: 'boolean',
        "default": false,
        order: 41
      },
      sourceMapEmbed: {
        title: 'Embed source map',
        description: 'If enabled source map is embedded as a data URI',
        type: 'boolean',
        "default": false,
        order: 42
      },
      sourceMapContents: {
        title: 'Include contents in source map information',
        description: 'If enabled contents are included in source map information',
        type: 'boolean',
        "default": false,
        order: 43
      },
      sourceComments: {
        title: 'Include additional debugging information in the output CSS file',
        description: 'If enabled additional debugging information are added to the output file as CSS comments. If CSS is compressed this feature is disabled by SASS compiler',
        type: 'boolean',
        "default": false,
        order: 44
      },
      includePath: {
        title: 'Include paths',
        description: 'Paths to look for imported files (@import declarations); comma separated, each path surrounded by quotes',
        type: 'string',
        "default": '',
        order: 45
      },
      precision: {
        title: 'Precision',
        description: 'Used to determine how many digits after the decimal will be allowed. For instance, if you had a decimal number of 1.23456789 and a precision of 5, the result will be 1.23457 in the final CSS',
        type: 'integer',
        "default": 5,
        minimum: 0,
        order: 46
      },
      importer: {
        title: 'Filename to custom importer',
        description: 'Path to .js file containing custom importer',
        type: 'string',
        "default": '',
        order: 47
      },
      functions: {
        title: 'Filename to custom functions',
        description: 'Path to .js file containing custom functions',
        type: 'string',
        "default": '',
        order: 48
      },
      notifications: {
        title: 'Notification type',
        description: 'Select which types of notifications you wish to see',
        type: 'string',
        "enum": ['Panel', 'Notifications', 'Panel, Notifications'],
        "default": 'Panel',
        order: 60
      },
      autoHidePanel: {
        title: 'Automatically hide panel on ...',
        description: 'Select on which event the panel should automatically disappear',
        type: 'string',
        "enum": ['Never', 'Success', 'Error', 'Success, Error'],
        "default": 'Success',
        order: 61
      },
      autoHidePanelDelay: {
        title: 'Panel-auto-hide delay',
        description: 'Delay after which panel is automatically hidden',
        type: 'integer',
        "default": 3000,
        order: 62
      },
      autoHideNotifications: {
        title: 'Automatically hide notifications on ...',
        description: 'Select which types of notifications should automatically disappear',
        type: 'string',
        "enum": ['Never', 'Info, Success', 'Error', 'Info, Success, Error'],
        "default": 'Info, Success',
        order: 63
      },
      showStartCompilingNotification: {
        title: 'Show \'Start Compiling\' Notification',
        description: 'If enabled a \'Start Compiling\' notification is shown',
        type: 'boolean',
        "default": false,
        order: 64
      },
      showAdditionalCompilationInfo: {
        title: 'Show additional compilation info',
        description: 'If enabled additiona infos like duration or file size is presented',
        type: 'boolean',
        "default": true,
        order: 65
      },
      showNodeSassOutput: {
        title: 'Show node-sass output after compilation',
        description: 'If enabled detailed output of node-sass command is shown in a new tab so you can analyse output',
        type: 'boolean',
        "default": false,
        order: 66
      },
      showOldParametersWarning: {
        title: 'Show warning when using old paramters',
        description: 'If enabled any time you compile a SASS file und you use old inline paramters, an warning will be occur not to use them',
        type: 'boolean',
        "default": true,
        order: 66
      },
      nodeSassPath: {
        title: 'Path to \'node-sass\' command',
        description: 'Absolute path where \'node-sass\' executable is placed. Please read documentation before usage!',
        type: 'string',
        "default": '',
        order: 80
      }
    },
    sassAutocompileView: null,
    mainSubmenu: null,
    contextMenuItem: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.editorSubscriptions = new CompositeDisposable;
      this.sassAutocompileView = new SassAutocompileView(new SassAutocompileOptions(), state.sassAutocompileViewState);
      this.isProcessing = false;
      if (SassAutocompileOptions.get('enabled')) {
        SassAutocompileOptions.set('compileOnSave', SassAutocompileOptions.get('enabled'));
        SassAutocompileOptions.unset('enabled');
      }
      if (SassAutocompileOptions.get('outputStyle')) {
        SassAutocompileOptions.unset('outputStyle');
      }
      if (SassAutocompileOptions.get('macOsNodeSassPath')) {
        SassAutocompileOptions.set('nodeSassPath', SassAutocompileOptions.get('macOsNodeSassPath'));
        SassAutocompileOptions.unset('macOsNodeSassPath');
      }
      this.registerCommands();
      this.registerTextEditorSaveCallback();
      this.registerConfigObserver();
      return this.registerContextMenuItem();
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.editorSubscriptions.dispose();
      return this.sassAutocompileView.destroy();
    },
    serialize: function() {
      return {
        sassAutocompileViewState: this.sassAutocompileView.serialize()
      };
    },
    registerCommands: function() {
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'sass-autocompile:compile-to-file': (function(_this) {
          return function(evt) {
            return _this.compileToFile(evt);
          };
        })(this),
        'sass-autocompile:compile-direct': (function(_this) {
          return function(evt) {
            return _this.compileDirect(evt);
          };
        })(this),
        'sass-autocompile:toggle-compile-on-save': (function(_this) {
          return function() {
            return _this.toggleCompileOnSave();
          };
        })(this),
        'sass-autocompile:toggle-output-style-nested': (function(_this) {
          return function() {
            return _this.toggleOutputStyle('Nested');
          };
        })(this),
        'sass-autocompile:toggle-output-style-compact': (function(_this) {
          return function() {
            return _this.toggleOutputStyle('Compact');
          };
        })(this),
        'sass-autocompile:toggle-output-style-expanded': (function(_this) {
          return function() {
            return _this.toggleOutputStyle('Expanded');
          };
        })(this),
        'sass-autocompile:toggle-output-style-compressed': (function(_this) {
          return function() {
            return _this.toggleOutputStyle('Compressed');
          };
        })(this),
        'sass-autocompile:compile-every-sass-file': (function(_this) {
          return function() {
            return _this.selectCompileFileType('every');
          };
        })(this),
        'sass-autocompile:compile-only-with-first-line-comment': (function(_this) {
          return function() {
            return _this.selectCompileFileType('first-line-comment');
          };
        })(this),
        'sass-autocompile:toggle-check-output-file-already-exists': (function(_this) {
          return function() {
            return _this.toggleCheckOutputFileAlreadyExists();
          };
        })(this),
        'sass-autocompile:toggle-directly-jump-to-error': (function(_this) {
          return function() {
            return _this.toggleDirectlyJumpToError();
          };
        })(this),
        'sass-autocompile:toggle-show-compile-sass-item-in-tree-view-context-menu': (function(_this) {
          return function() {
            return _this.toggleShowCompileSassItemInTreeViewContextMenu();
          };
        })(this),
        'sass-autocompile:close-message-panel': (function(_this) {
          return function(evt) {
            _this.closePanel();
            return evt.abortKeyBinding();
          };
        })(this)
      }));
    },
    compileToFile: function(evt) {
      var activeEditor, filename, isFileItem, target;
      filename = void 0;
      if (evt.target.nodeName.toLowerCase() === 'atom-text-editor') {
        activeEditor = atom.workspace.getActiveTextEditor();
        if (activeEditor) {
          filename = activeEditor.getURI();
        }
      } else {
        target = evt.target;
        if (evt.target.nodeName.toLowerCase() === 'span') {
          target = evt.target.parentNode;
        }
        isFileItem = target.getAttribute('class').split(' ').indexOf('file') >= 0;
        if (isFileItem) {
          filename = target.firstElementChild.getAttribute('data-path');
        }
      }
      if (this.isSassFile(filename)) {
        return this.compile(NodeSassCompiler.MODE_FILE, filename, false);
      }
    },
    compileDirect: function(evt) {
      if (!atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.compile(NodeSassCompiler.MODE_DIRECT);
    },
    toggleCompileOnSave: function() {
      SassAutocompileOptions.set('compileOnSave', !SassAutocompileOptions.get('compileOnSave'));
      if (SassAutocompileOptions.get('compileOnSave')) {
        atom.notifications.addInfo('SASS-AutoCompile: Enabled compile on save');
      } else {
        atom.notifications.addWarning('SASS-AutoCompile: Disabled compile on save');
      }
      return this.updateMenuItems();
    },
    toggleOutputStyle: function(outputStyle) {
      switch (outputStyle.toLowerCase()) {
        case 'compressed':
          SassAutocompileOptions.set('compileCompressed', !SassAutocompileOptions.get('compileCompressed'));
          break;
        case 'compact':
          SassAutocompileOptions.set('compileCompact', !SassAutocompileOptions.get('compileCompact'));
          break;
        case 'nested':
          SassAutocompileOptions.set('compileNested', !SassAutocompileOptions.get('compileNested'));
          break;
        case 'expanded':
          SassAutocompileOptions.set('compileExpanded', !SassAutocompileOptions.get('compileExpanded'));
      }
      return this.updateMenuItems();
    },
    selectCompileFileType: function(type) {
      if (type === 'every') {
        SassAutocompileOptions.set('compileFiles', 'Every SASS file');
      } else if (type === 'first-line-comment') {
        SassAutocompileOptions.set('compileFiles', 'Only with first-line-comment');
      }
      return this.updateMenuItems();
    },
    toggleCheckOutputFileAlreadyExists: function() {
      SassAutocompileOptions.set('checkOutputFileAlreadyExists', !SassAutocompileOptions.get('checkOutputFileAlreadyExists'));
      return this.updateMenuItems();
    },
    toggleDirectlyJumpToError: function() {
      SassAutocompileOptions.set('directlyJumpToError', !SassAutocompileOptions.get('directlyJumpToError'));
      return this.updateMenuItems();
    },
    toggleShowCompileSassItemInTreeViewContextMenu: function() {
      SassAutocompileOptions.set('showCompileSassItemInTreeViewContextMenu', !SassAutocompileOptions.get('showCompileSassItemInTreeViewContextMenu'));
      return this.updateMenuItems();
    },
    compile: function(mode, filename, minifyOnSave) {
      var options;
      if (filename == null) {
        filename = null;
      }
      if (minifyOnSave == null) {
        minifyOnSave = false;
      }
      if (this.isProcessing) {
        return;
      }
      options = new SassAutocompileOptions();
      this.isProcessing = true;
      this.sassAutocompileView.updateOptions(options);
      this.sassAutocompileView.hidePanel(false, true);
      this.compiler = new NodeSassCompiler(options);
      this.compiler.onStart((function(_this) {
        return function(args) {
          return _this.sassAutocompileView.startCompilation(args);
        };
      })(this));
      this.compiler.onWarning((function(_this) {
        return function(args) {
          return _this.sassAutocompileView.warning(args);
        };
      })(this));
      this.compiler.onSuccess((function(_this) {
        return function(args) {
          return _this.sassAutocompileView.successfullCompilation(args);
        };
      })(this));
      this.compiler.onError((function(_this) {
        return function(args) {
          return _this.sassAutocompileView.erroneousCompilation(args);
        };
      })(this));
      this.compiler.onFinished((function(_this) {
        return function(args) {
          _this.sassAutocompileView.finished(args);
          _this.isProcessing = false;
          _this.compiler.destroy();
          return _this.compiler = null;
        };
      })(this));
      return this.compiler.compile(mode, filename, minifyOnSave);
    },
    registerTextEditorSaveCallback: function() {
      return this.editorSubscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.subscriptions.add(editor.onDidSave(function() {
            if (!_this.isProcessing && editor && editor.getURI && _this.isSassFile(editor.getURI())) {
              return _this.compile(NodeSassCompiler.MODE_FILE, editor.getURI(), true);
            }
          }));
        };
      })(this)));
    },
    isSassFile: function(filename) {
      return File.hasFileExtension(filename, ['.scss', '.sass']);
    },
    registerConfigObserver: function() {
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'compileOnSave', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'compileFiles', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'checkOutputFileAlreadyExists', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'directlyJumpToError', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'showCompileSassItemInTreeViewContextMenu', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'compileCompressed', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'compileCompact', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'compileNested', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'compileExpanded', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
    },
    registerContextMenuItem: function() {
      var menuItem;
      menuItem = this.getContextMenuItem();
      return menuItem.shouldDisplay = (function(_this) {
        return function(evt) {
          var child, filename, isFileItem, showItemOption, target;
          showItemOption = SassAutocompileOptions.get('showCompileSassItemInTreeViewContextMenu');
          if (showItemOption) {
            target = evt.target;
            if (target.nodeName.toLowerCase() === 'span') {
              target = target.parentNode;
            }
            isFileItem = target.getAttribute('class').split(' ').indexOf('file') >= 0;
            if (isFileItem) {
              child = target.firstElementChild;
              filename = child.getAttribute('data-name');
              return _this.isSassFile(filename);
            }
          }
          return false;
        };
      })(this);
    },
    updateMenuItems: function() {
      var compileFileMenu, menu, outputStylesMenu;
      menu = this.getMainMenuSubmenu().submenu;
      if (!menu) {
        return;
      }
      menu[3].label = (SassAutocompileOptions.get('compileOnSave') ? '✔' : '✕') + '  Compile on Save';
      menu[4].label = (SassAutocompileOptions.get('checkOutputFileAlreadyExists') ? '✔' : '✕') + '  Check output file already exists';
      menu[5].label = (SassAutocompileOptions.get('directlyJumpToError') ? '✔' : '✕') + '  Directly jump to error';
      menu[6].label = (SassAutocompileOptions.get('showCompileSassItemInTreeViewContextMenu') ? '✔' : '✕') + '  Show \'Compile SASS\' item in tree view context menu';
      compileFileMenu = menu[8].submenu;
      if (compileFileMenu) {
        compileFileMenu[0].checked = SassAutocompileOptions.get('compileFiles') === 'Every SASS file';
        compileFileMenu[1].checked = SassAutocompileOptions.get('compileFiles') === 'Only with first-line-comment';
      }
      outputStylesMenu = menu[9].submenu;
      if (outputStylesMenu) {
        outputStylesMenu[0].label = (SassAutocompileOptions.get('compileCompressed') ? '✔' : '✕') + '  Compressed';
        outputStylesMenu[1].label = (SassAutocompileOptions.get('compileCompact') ? '✔' : '✕') + '  Compact';
        outputStylesMenu[2].label = (SassAutocompileOptions.get('compileNested') ? '✔' : '✕') + '  Nested';
        outputStylesMenu[3].label = (SassAutocompileOptions.get('compileExpanded') ? '✔' : '✕') + '  Expanded';
      }
      return atom.menu.update();
    },
    getMainMenuSubmenu: function() {
      var found, menu, submenu, _i, _j, _len, _len1, _ref, _ref1;
      if (this.mainSubmenu === null) {
        found = false;
        _ref = atom.menu.template;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          menu = _ref[_i];
          if (menu.label === 'Packages' || menu.label === '&Packages') {
            found = true;
            _ref1 = menu.submenu;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              submenu = _ref1[_j];
              if (submenu.label === 'SASS Autocompile') {
                this.mainSubmenu = submenu;
                break;
              }
            }
          }
          if (found) {
            break;
          }
        }
      }
      return this.mainSubmenu;
    },
    getContextMenuItem: function() {
      var found, item, items, _i, _j, _len, _len1, _ref, _ref1;
      if (this.contextMenuItem === null) {
        found = false;
        _ref = atom.contextMenu.itemSets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          items = _ref[_i];
          if (items.selector === '.tree-view') {
            _ref1 = items.items;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              item = _ref1[_j];
              if (item.id === 'sass-autocompile-context-menu-compile') {
                found = true;
                this.contextMenuItem = item;
                break;
              }
            }
          }
          if (found) {
            break;
          }
        }
      }
      return this.contextMenuItem;
    },
    closePanel: function() {
      return this.sassAutocompileView.hidePanel();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL3Nhc3MtYXV0b2NvbXBpbGUvbGliL3Nhc3MtYXV0b2NvbXBpbGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdGQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxzQkFBQSxHQUF5QixPQUFBLENBQVEsV0FBUixDQUZ6QixDQUFBOztBQUFBLEVBR0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSLENBSHRCLENBQUE7O0FBQUEsRUFJQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsWUFBUixDQUpuQixDQUFBOztBQUFBLEVBTUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBTlAsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBRUk7QUFBQSxJQUFBLE1BQUEsRUFJSTtBQUFBLE1BQUEsYUFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8saUJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxpREFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sRUFKUDtPQURKO0FBQUEsTUFPQSxZQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyxtQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDBEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsTUFBQSxFQUFNLENBQUMsOEJBQUQsRUFBaUMsaUJBQWpDLENBSE47QUFBQSxRQUlBLFNBQUEsRUFBUyxpQkFKVDtBQUFBLFFBS0EsS0FBQSxFQUFPLEVBTFA7T0FSSjtBQUFBLE1BZUEsZUFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8sa0JBQVA7QUFB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

//# sourceURL=/home/junior/.atom/packages/sass-autocompile/lib/sass-autocompile.coffee
