(function() {
  var SASSLINT_DOC_URL, VALID_SYNTAXES, path, _ref;

  path = require('path');

  _ref = require('./constants.coffee'), SASSLINT_DOC_URL = _ref.SASSLINT_DOC_URL, VALID_SYNTAXES = _ref.VALID_SYNTAXES;

  module.exports = {

    /**
     * Function to construct the rule URI from the rule ID provided
     * @param {string} ruleId - The rule name / id
     * @return {string} The rule URL
     */
    getRuleURI: function(ruleId) {
      return SASSLINT_DOC_URL + '/' + ruleId + '.md';
    },

    /**
     * Function to check a file base / extension for valid extensions to use with sass-lint
     * @param {string} syntax - The syntax to check
     * @return {boolean} Whether or not the syntax is valid for sass-lint
     */
    isValidSyntax: function(syntax) {
      return VALID_SYNTAXES.indexOf(syntax) !== -1;
    },

    /**
     * Function to check a file base / extension for valid extensions to use with sass-lint
     * @param {string} filePath - The filepath to check
     * @return {string} The syntax we wish to pass to sass-lint
     */
    getFileSyntax: function(filePath) {
      var base, existingSyntax, item, syntax;
      existingSyntax = path.extname(filePath).slice(1);
      if (this.isValidSyntax(existingSyntax) === false) {
        base = path.parse(filePath).base.split('.');
        syntax = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = base.length; _i < _len; _i++) {
            item = base[_i];
            if (this.isValidSyntax(item)) {
              _results.push(item);
            }
          }
          return _results;
        }).call(this);
        if (syntax.length) {
          return syntax[0];
        }
      }
      return existingSyntax;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zYXNzLWxpbnQvbGliL2hlbHBlcnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQXFDLE9BQUEsQ0FBUSxvQkFBUixDQUFyQyxFQUFDLHdCQUFBLGdCQUFELEVBQW1CLHNCQUFBLGNBRG5CLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUE7QUFBQTs7OztPQUFBO0FBQUEsSUFLQSxVQUFBLEVBQVksU0FBQyxNQUFELEdBQUE7QUFDVixhQUFPLGdCQUFBLEdBQW1CLEdBQW5CLEdBQXlCLE1BQXpCLEdBQWtDLEtBQXpDLENBRFU7SUFBQSxDQUxaO0FBUUE7QUFBQTs7OztPQVJBO0FBQUEsSUFhQSxhQUFBLEVBQWUsU0FBQyxNQUFELEdBQUE7QUFDYixhQUFPLGNBQWMsQ0FBQyxPQUFmLENBQXVCLE1BQXZCLENBQUEsS0FBb0MsQ0FBQSxDQUEzQyxDQURhO0lBQUEsQ0FiZjtBQWdCQTtBQUFBOzs7O09BaEJBO0FBQUEsSUFxQkEsYUFBQSxFQUFlLFNBQUMsUUFBRCxHQUFBO0FBQ2IsVUFBQSxrQ0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsQ0FBc0IsQ0FBQyxLQUF2QixDQUE2QixDQUE3QixDQUFqQixDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxhQUFELENBQWUsY0FBZixDQUFBLEtBQWtDLEtBQXJDO0FBQ0UsUUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxRQUFYLENBQW9CLENBQUMsSUFBSSxDQUFDLEtBQTFCLENBQWdDLEdBQWhDLENBQVAsQ0FBQTtBQUFBLFFBQ0EsTUFBQTs7QUFBVTtlQUFBLDJDQUFBOzRCQUFBO2dCQUEyQixJQUFDLENBQUEsYUFBRCxDQUFlLElBQWY7QUFBM0IsNEJBQUEsS0FBQTthQUFBO0FBQUE7O3FCQURWLENBQUE7QUFFQSxRQUFBLElBQUcsTUFBTSxDQUFDLE1BQVY7QUFDRSxpQkFBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBREY7U0FIRjtPQURBO0FBT0EsYUFBTyxjQUFQLENBUmE7SUFBQSxDQXJCZjtHQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/junior/.atom/packages/linter-sass-lint/lib/helpers.coffee
