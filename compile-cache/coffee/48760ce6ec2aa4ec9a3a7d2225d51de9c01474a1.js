(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      executablePath: {
        "default": 'tidy',
        title: 'Full path to the `tidy` executable',
        type: 'string'
      }
    },
    activate: function() {
      require('atom-package-deps').install();
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.config.observe('linter-tidy.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var helpers, provider, regex;
      helpers = require('atom-linter');
      regex = /line (\d+) column (\d+) - (Warning|Error): (.+)/g;
      return provider = {
        grammarScopes: ['text.html.basic'],
        name: 'tidy',
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(textEditor) {
            var filePath, fileText;
            filePath = textEditor.getPath();
            fileText = textEditor.getText();
            return helpers.exec(_this.executablePath, ['-quiet', '-utf8', '-errors'], {
              stream: 'stderr',
              stdin: fileText,
              allowEmptyStderr: true
            }).then(function(output) {
              var col, line, match, messages, range;
              messages = [];
              match = regex.exec(output);
              while (match !== null) {
                line = match[1] - 1;
                col = match[2] - 1;
                range = helpers.rangeFromLineNumber(textEditor, line, col);
                messages.push({
                  type: match[3],
                  text: match[4],
                  filePath: filePath,
                  range: range
                });
                match = regex.exec(output);
              }
              return messages;
            });
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL2xpbnRlci10aWR5L2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLFNBQUEsRUFBUyxNQUFUO0FBQUEsUUFDQSxLQUFBLEVBQU8sb0NBRFA7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO09BREY7S0FERjtBQUFBLElBTUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFEakIsQ0FBQTthQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsNEJBQXBCLEVBQ2pCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLGNBQUQsR0FBQTtpQkFDRSxLQUFDLENBQUEsY0FBRCxHQUFrQixlQURwQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGlCLENBQW5CLEVBSFE7SUFBQSxDQU5WO0FBQUEsSUFhQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsRUFEVTtJQUFBLENBYlo7QUFBQSxJQWdCQSxhQUFBLEVBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSx3QkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxhQUFSLENBQVYsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLGtEQURSLENBQUE7YUFFQSxRQUFBLEdBQ0U7QUFBQSxRQUFBLGFBQUEsRUFBZSxDQUFDLGlCQUFELENBQWY7QUFBQSxRQUNBLElBQUEsRUFBTSxNQUROO0FBQUEsUUFFQSxLQUFBLEVBQU8sTUFGUDtBQUFBLFFBR0EsU0FBQSxFQUFXLElBSFg7QUFBQSxRQUlBLElBQUEsRUFBTSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsVUFBRCxHQUFBO0FBQ0osZ0JBQUEsa0JBQUE7QUFBQSxZQUFBLFFBQUEsR0FBVyxVQUFVLENBQUMsT0FBWCxDQUFBLENBQVgsQ0FBQTtBQUFBLFlBQ0EsUUFBQSxHQUFXLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FEWCxDQUFBO0FBRUEsbUJBQU8sT0FBTyxDQUFDLElBQVIsQ0FDTCxLQUFDLENBQUEsY0FESSxFQUVMLENBQUMsUUFBRCxFQUFXLE9BQVgsRUFBb0IsU0FBcEIsQ0FGSyxFQUdMO0FBQUEsY0FBQyxNQUFBLEVBQVEsUUFBVDtBQUFBLGNBQW1CLEtBQUEsRUFBTyxRQUExQjtBQUFBLGNBQW9DLGdCQUFBLEVBQWtCLElBQXREO2FBSEssQ0FJTixDQUFDLElBSkssQ0FJQSxTQUFDLE1BQUQsR0FBQTtBQUNMLGtCQUFBLGlDQUFBO0FBQUEsY0FBQSxRQUFBLEdBQVcsRUFBWCxDQUFBO0FBQUEsY0FDQSxLQUFBLEdBQVEsS0FBSyxDQUFDLElBQU4sQ0FBVyxNQUFYLENBRFIsQ0FBQTtBQUVBLHFCQUFNLEtBQUEsS0FBUyxJQUFmLEdBQUE7QUFDRSxnQkFBQSxJQUFBLEdBQU8sS0FBTSxDQUFBLENBQUEsQ0FBTixHQUFXLENBQWxCLENBQUE7QUFBQSxnQkFDQSxHQUFBLEdBQU0sS0FBTSxDQUFBLENBQUEsQ0FBTixHQUFXLENBRGpCLENBQUE7QUFBQSxnQkFFQSxLQUFBLEdBQVEsT0FBTyxDQUFDLG1CQUFSLENBQTRCLFVBQTVCLEVBQXdDLElBQXhDLEVBQThDLEdBQTlDLENBRlIsQ0FBQTtBQUFBLGdCQUdBLFFBQVEsQ0FBQyxJQUFULENBQWM7QUFBQSxrQkFDWixJQUFBLEVBQU0sS0FBTSxDQUFBLENBQUEsQ0FEQTtBQUFBLGtCQUVaLElBQUEsRUFBTSxLQUFNLENBQUEsQ0FBQSxDQUZBO0FBQUEsa0JBR1osVUFBQSxRQUhZO0FBQUEsa0JBSVosT0FBQSxLQUpZO2lCQUFkLENBSEEsQ0FBQTtBQUFBLGdCQVNBLEtBQUEsR0FBUSxLQUFLLENBQUMsSUFBTixDQUFXLE1BQVgsQ0FUUixDQURGO2NBQUEsQ0FGQTtBQWFBLHFCQUFPLFFBQVAsQ0FkSztZQUFBLENBSkEsQ0FBUCxDQUhJO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKTjtRQUpXO0lBQUEsQ0FoQmY7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/junior/.atom/packages/linter-tidy/lib/main.coffee
