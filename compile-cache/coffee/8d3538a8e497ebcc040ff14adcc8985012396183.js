(function() {
  var SassAutocompileOptions;

  module.exports = SassAutocompileOptions = (function() {
    SassAutocompileOptions.OPTIONS_PREFIX = 'sass-autocompile.';

    SassAutocompileOptions.get = function(name) {
      return atom.config.get(SassAutocompileOptions.OPTIONS_PREFIX + name);
    };

    SassAutocompileOptions.set = function(name, value) {
      return atom.config.set(SassAutocompileOptions.OPTIONS_PREFIX + name, value);
    };

    SassAutocompileOptions.unset = function(name) {
      return atom.config.unset(SassAutocompileOptions.OPTIONS_PREFIX + name);
    };

    function SassAutocompileOptions() {
      this.initialize();
    }

    SassAutocompileOptions.prototype.initialize = function() {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      this.compileOnSave = SassAutocompileOptions.get('compileOnSave');
      this.compileEverySassFiles = SassAutocompileOptions.get('compileFiles') === 'Every SASS file';
      this.compileOnlyFirstLineCommentFiles = SassAutocompileOptions.get('compileFiles') === 'Only with first-line-comment';
      this.compilePartials = SassAutocompileOptions.get('compilePartials');
      this.checkOutputFileAlreadyExists = SassAutocompileOptions.get('checkOutputFileAlreadyExists');
      this.directlyJumpToError = SassAutocompileOptions.get('directlyJumpToError');
      this.showCompileSassItemInTreeViewContextMenu = SassAutocompileOptions.get('showCompileSassItemInTreeViewContextMenu');
      this.compileCompressed = SassAutocompileOptions.get('compileCompressed');
      this.compileCompact = SassAutocompileOptions.get('compileCompact');
      this.compileNested = SassAutocompileOptions.get('compileNested');
      this.compileExpanded = SassAutocompileOptions.get('compileExpanded');
      this.compressedFilenamePattern = SassAutocompileOptions.get('compressedFilenamePattern');
      this.compactFilenamePattern = SassAutocompileOptions.get('compactFilenamePattern');
      this.nestedFilenamePattern = SassAutocompileOptions.get('nestedFilenamePattern');
      this.expandedFilenamePattern = SassAutocompileOptions.get('expandedFilenamePattern');
      this.indentType = SassAutocompileOptions.get('indentType');
      this.indentWidth = SassAutocompileOptions.get('indentWidth');
      this.linefeed = SassAutocompileOptions.get('linefeed');
      this.sourceMap = SassAutocompileOptions.get('sourceMap');
      this.sourceMapEmbed = SassAutocompileOptions.get('sourceMapEmbed');
      this.sourceMapContents = SassAutocompileOptions.get('sourceMapContents');
      this.sourceComments = SassAutocompileOptions.get('sourceComments');
      this.includePath = SassAutocompileOptions.get('includePath');
      this.precision = SassAutocompileOptions.get('precision');
      this.importer = SassAutocompileOptions.get('importer');
      this.functions = SassAutocompileOptions.get('functions');
      this.showInfoNotification = (_ref = SassAutocompileOptions.get('notifications')) === 'Notifications' || _ref === 'Panel, Notifications';
      this.showSuccessNotification = (_ref1 = SassAutocompileOptions.get('notifications')) === 'Notifications' || _ref1 === 'Panel, Notifications';
      this.showWarningNotification = (_ref2 = SassAutocompileOptions.get('notifications')) === 'Notifications' || _ref2 === 'Panel, Notifications';
      this.showErrorNotification = (_ref3 = SassAutocompileOptions.get('notifications')) === 'Notifications' || _ref3 === 'Panel, Notifications';
      this.autoHideInfoNotification = (_ref4 = SassAutocompileOptions.get('autoHideNotifications')) === 'Info, Success' || _ref4 === 'Info, Success, Error';
      this.autoHideSuccessNotification = (_ref5 = SassAutocompileOptions.get('autoHideNotifications')) === 'Info, Success' || _ref5 === 'Info, Success, Error';
      this.autoHideErrorNotification = (_ref6 = SassAutocompileOptions.get('autoHideNotifications')) === 'Error' || _ref6 === 'Info, Success, Error';
      this.showPanel = (_ref7 = SassAutocompileOptions.get('notifications')) === 'Panel' || _ref7 === 'Panel, Notifications';
      this.autoHidePanelOnSuccess = (_ref8 = SassAutocompileOptions.get('autoHidePanel')) === 'Success' || _ref8 === 'Success, Error';
      this.autoHidePanelOnError = (_ref9 = SassAutocompileOptions.get('autoHidePanel')) === 'Error' || _ref9 === 'Success, Error';
      this.autoHidePanelDelay = SassAutocompileOptions.get('autoHidePanelDelay');
      this.showStartCompilingNotification = SassAutocompileOptions.get('showStartCompilingNotification');
      this.showAdditionalCompilationInfo = SassAutocompileOptions.get('showAdditionalCompilationInfo');
      this.showNodeSassOutput = SassAutocompileOptions.get('showNodeSassOutput');
      this.showOldParametersWarning = SassAutocompileOptions.get('showOldParametersWarning');
      return this.nodeSassPath = SassAutocompileOptions.get('nodeSassPath');
    };

    return SassAutocompileOptions;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL3Nhc3MtYXV0b2NvbXBpbGUvbGliL29wdGlvbnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVGLElBQUEsc0JBQUMsQ0FBQSxjQUFELEdBQWtCLG1CQUFsQixDQUFBOztBQUFBLElBR0Esc0JBQUMsQ0FBQSxHQUFELEdBQU0sU0FBQyxJQUFELEdBQUE7QUFDRixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBc0IsQ0FBQyxjQUF2QixHQUF3QyxJQUF4RCxDQUFQLENBREU7SUFBQSxDQUhOLENBQUE7O0FBQUEsSUFPQSxzQkFBQyxDQUFBLEdBQUQsR0FBTSxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7YUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQXNCLENBQUMsY0FBdkIsR0FBd0MsSUFBeEQsRUFBOEQsS0FBOUQsRUFERTtJQUFBLENBUE4sQ0FBQTs7QUFBQSxJQVdBLHNCQUFDLENBQUEsS0FBRCxHQUFRLFNBQUMsSUFBRCxHQUFBO2FBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFaLENBQWtCLHNCQUFzQixDQUFDLGNBQXZCLEdBQXdDLElBQTFELEVBREk7SUFBQSxDQVhSLENBQUE7O0FBZWEsSUFBQSxnQ0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsVUFBRCxDQUFBLENBQUEsQ0FEUztJQUFBLENBZmI7O0FBQUEscUNBbUJBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFFUixVQUFBLG1FQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixlQUEzQixDQUFqQixDQUFBO0FBQUEsTUFD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

//# sourceURL=/home/junior/.atom/packages/sass-autocompile/lib/options.coffee
