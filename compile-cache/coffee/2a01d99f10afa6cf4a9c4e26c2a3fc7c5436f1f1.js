(function() {
  var Dom;

  Dom = require(atom.packages.getLoadedPackage('seti-ui').path + '/lib/dom');

  module.exports = {
    addWhenFalse: function(obj) {
      if (!Array.isArray(obj.el)) {
        obj.el = [obj.el];
      }
      return obj.el.forEach(function(element) {
        var el;
        el = Dom.queryAll(element);
        if (!obj.bool) {
          return Dom.addClass(el, obj.className);
        } else {
          return Dom.removeClass(el, obj.className);
        }
      });
    },
    addWhenTrue: function(obj) {
      if (!Array.isArray(obj.el)) {
        obj.el = [obj.el];
      }
      return obj.el.forEach(function(element) {
        var el;
        el = Dom.queryAll(element);
        if (obj.bool) {
          return Dom.addClass(el, obj.className);
        } else {
          return Dom.removeClass(el, obj.className);
        }
      });
    },
    applySetting: function(obj) {
      atom.config.set(obj.config, obj.val);
      return this[obj.action]({
        el: obj.el,
        className: obj.className,
        bool: obj.val
      }, atom.config.onDidChange(obj.config, function(value) {
        if (value.oldValue !== value.newValue && typeof obj.cb === 'function') {
          return obj.cb(value.newValue);
        }
      }));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL3NldGktdWkvbGliL3V0aWxpdHkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEdBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsU0FBL0IsQ0FBeUMsQ0FBQyxJQUExQyxHQUFpRCxVQUF6RCxDQUFOLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUdFO0FBQUEsSUFBQSxZQUFBLEVBQWMsU0FBQyxHQUFELEdBQUE7QUFJWixNQUFBLElBQUcsQ0FBQSxLQUFNLENBQUMsT0FBTixDQUFjLEdBQUcsQ0FBQyxFQUFsQixDQUFKO0FBQ0UsUUFBQSxHQUFHLENBQUMsRUFBSixHQUFTLENBQUUsR0FBRyxDQUFDLEVBQU4sQ0FBVCxDQURGO09BQUE7YUFHQSxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQVAsQ0FBZSxTQUFDLE9BQUQsR0FBQTtBQUViLFlBQUEsRUFBQTtBQUFBLFFBQUEsRUFBQSxHQUFLLEdBQUcsQ0FBQyxRQUFKLENBQWEsT0FBYixDQUFMLENBQUE7QUFFQSxRQUFBLElBQUcsQ0FBQSxHQUFJLENBQUMsSUFBUjtpQkFDRSxHQUFHLENBQUMsUUFBSixDQUFhLEVBQWIsRUFBaUIsR0FBRyxDQUFDLFNBQXJCLEVBREY7U0FBQSxNQUFBO2lCQUdFLEdBQUcsQ0FBQyxXQUFKLENBQWdCLEVBQWhCLEVBQW9CLEdBQUcsQ0FBQyxTQUF4QixFQUhGO1NBSmE7TUFBQSxDQUFmLEVBUFk7SUFBQSxDQUFkO0FBQUEsSUFrQkEsV0FBQSxFQUFhLFNBQUMsR0FBRCxHQUFBO0FBSVgsTUFBQSxJQUFHLENBQUEsS0FBTSxDQUFDLE9BQU4sQ0FBYyxHQUFHLENBQUMsRUFBbEIsQ0FBSjtBQUNFLFFBQUEsR0FBRyxDQUFDLEVBQUosR0FBUyxDQUFFLEdBQUcsQ0FBQyxFQUFOLENBQVQsQ0FERjtPQUFBO2FBR0EsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFQLENBQWUsU0FBQyxPQUFELEdBQUE7QUFFYixZQUFBLEVBQUE7QUFBQSxRQUFBLEVBQUEsR0FBSyxHQUFHLENBQUMsUUFBSixDQUFhLE9BQWIsQ0FBTCxDQUFBO0FBRUEsUUFBQSxJQUFHLEdBQUcsQ0FBQyxJQUFQO2lCQUNFLEdBQUcsQ0FBQyxRQUFKLENBQWEsRUFBYixFQUFpQixHQUFHLENBQUMsU0FBckIsRUFERjtTQUFBLE1BQUE7aUJBR0UsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsRUFBaEIsRUFBb0IsR0FBRyxDQUFDLFNBQXhCLEVBSEY7U0FKYTtNQUFBLENBQWYsRUFQVztJQUFBLENBbEJiO0FBQUEsSUFtQ0EsWUFBQSxFQUFjLFNBQUMsR0FBRCxHQUFBO0FBSVosTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsR0FBRyxDQUFDLE1BQXBCLEVBQTRCLEdBQUcsQ0FBQyxHQUFoQyxDQUFBLENBQUE7YUFFQSxJQUFFLENBQUEsR0FBRyxDQUFDLE1BQUosQ0FBRixDQUNFO0FBQUEsUUFBQSxFQUFBLEVBQUksR0FBRyxDQUFDLEVBQVI7QUFBQSxRQUNBLFNBQUEsRUFBVyxHQUFHLENBQUMsU0FEZjtBQUFBLFFBRUEsSUFBQSxFQUFNLEdBQUcsQ0FBQyxHQUZWO09BREYsRUFLRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsR0FBRyxDQUFDLE1BQTVCLEVBQW9DLFNBQUMsS0FBRCxHQUFBO0FBQ2xDLFFBQUEsSUFBRyxLQUFLLENBQUMsUUFBTixLQUFrQixLQUFLLENBQUMsUUFBeEIsSUFBcUMsTUFBQSxDQUFBLEdBQVUsQ0FBQyxFQUFYLEtBQWlCLFVBQXpEO2lCQUNFLEdBQUcsQ0FBQyxFQUFKLENBQU8sS0FBSyxDQUFDLFFBQWIsRUFERjtTQURrQztNQUFBLENBQXBDLENBTEYsRUFOWTtJQUFBLENBbkNkO0dBTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/junior/.atom/packages/seti-ui/lib/utility.coffee