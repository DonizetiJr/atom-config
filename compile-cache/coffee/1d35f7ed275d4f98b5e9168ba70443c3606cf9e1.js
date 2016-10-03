(function() {
  module.exports = {
    MULTIPLY: function(v1, v2) {
      return v1 * v2 / 255;
    },
    SCREEN: function(v1, v2) {
      return v1 + v2 - (v1 * v2 / 255);
    },
    OVERLAY: function(v1, v2) {
      if (v1 < 128) {
        return 2 * v1 * v2 / 255;
      } else {
        return 255 - (2 * (255 - v1) * (255 - v2) / 255);
      }
    },
    DIFFERENCE: function(v1, v2) {
      return Math.abs(v1 - v2);
    },
    EXCLUSION: function(v1, v2) {
      var cb, cs;
      cb = v1 / 255;
      cs = v2 / 255;
      return (cb + cs - 2 * cb * cs) * 255;
    },
    AVERAGE: function(v1, v2) {
      return (v1 + v2) / 2;
    },
    NEGATION: function(v1, v2) {
      return 255 - Math.abs(v1 + v2 - 255);
    },
    SOFT_LIGHT: function(v1, v2) {
      var cb, cs, d, e;
      cb = v1 / 255;
      cs = v2 / 255;
      d = 1;
      e = cb;
      if (cs > 0.5) {
        e = 1;
        d = cb > 0.25 ? Math.sqrt(cb) : ((16 * cb - 12) * cb + 4) * cb;
      }
      return (cb - ((1 - (2 * cs)) * e * (d - cb))) * 255;
    },
    HARD_LIGHT: function(v1, v2) {
      return module.exports.OVERLAY(v2, v1);
    },
    COLOR_DODGE: function(v1, v2) {
      if (v1 === 255) {
        return v1;
      } else {
        return Math.min(255, (v2 << 8) / (255 - v1));
      }
    },
    COLOR_BURN: function(v1, v2) {
      if (v1 === 0) {
        return v1;
      } else {
        return Math.max(0, 255 - ((255 - v2 << 8) / v1));
      }
    },
    LINEAR_COLOR_DODGE: function(v1, v2) {
      return Math.min(v1 + v2, 255);
    },
    LINEAR_COLOR_BURN: function(v1, v2) {
      if (v1 + v2 < 255) {
        return 0;
      } else {
        return v1 + v2 - 255;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9ibGVuZC1tb2Rlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsRUFBRCxFQUFLLEVBQUwsR0FBQTthQUNSLEVBQUEsR0FBSyxFQUFMLEdBQVUsSUFERjtJQUFBLENBQVY7QUFBQSxJQUdBLE1BQUEsRUFBUSxTQUFDLEVBQUQsRUFBSyxFQUFMLEdBQUE7YUFDTixFQUFBLEdBQUssRUFBTCxHQUFVLENBQUMsRUFBQSxHQUFLLEVBQUwsR0FBVSxHQUFYLEVBREo7SUFBQSxDQUhSO0FBQUEsSUFNQSxPQUFBLEVBQVMsU0FBQyxFQUFELEVBQUssRUFBTCxHQUFBO0FBQ1AsTUFBQSxJQUFHLEVBQUEsR0FBSyxHQUFSO2VBQ0UsQ0FBQSxHQUFJLEVBQUosR0FBUyxFQUFULEdBQWMsSUFEaEI7T0FBQSxNQUFBO2VBR0UsR0FBQSxHQUFNLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBQSxHQUFNLEVBQVAsQ0FBSixHQUFpQixDQUFDLEdBQUEsR0FBTSxFQUFQLENBQWpCLEdBQThCLEdBQS9CLEVBSFI7T0FETztJQUFBLENBTlQ7QUFBQSxJQVlBLFVBQUEsRUFBWSxTQUFDLEVBQUQsRUFBSyxFQUFMLEdBQUE7YUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQUEsR0FBSyxFQUFkLEVBQVo7SUFBQSxDQVpaO0FBQUEsSUFjQSxTQUFBLEVBQVcsU0FBQyxFQUFELEVBQUssRUFBTCxHQUFBO0FBQ1QsVUFBQSxNQUFBO0FBQUEsTUFBQSxFQUFBLEdBQUssRUFBQSxHQUFLLEdBQVYsQ0FBQTtBQUFBLE1BQ0EsRUFBQSxHQUFLLEVBQUEsR0FBSyxHQURWLENBQUE7YUFFQSxDQUFDLEVB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

//# sourceURL=/home/junior/.atom/packages/pigments/lib/blend-modes.coffee
