(function() {
  var Dom, Headers, Utility;

  Dom = require('./dom');

  Utility = require('./utility');

  Headers = require('./headers');

  module.exports = {
    init: function(state) {
      var self;
      self = this;
      self.tabSize(atom.config.get('seti-ui.compactView'));
      self.ignoredFiles(atom.config.get('seti-ui.displayIgnored'));
      self.fileIcons(atom.config.get('seti-ui.fileIcons'));
      self.hideTabs(atom.config.get('seti-ui.hideTabs'));
      self.setTheme(atom.config.get('seti-ui.themeColor'), false, false);
      self.font(atom.config.get('seti-ui.font'), false);
      self.animate(atom.config.get('seti-ui.disableAnimations'));
      atom.config.onDidChange('seti-ui.font', function(value) {
        return self.font(atom.config.get('seti-ui.font'), true);
      });
      return atom.config.onDidChange('seti-ui.themeColor', function(value) {
        return self.setTheme(value.newValue, value.oldValue, true);
      });
    },
    "package": atom.packages.getLoadedPackage('seti-ui'),
    refresh: function() {
      var self;
      self = this;
      self["package"].deactivate();
      return setImmediate(function() {
        return self["package"].activate();
      });
    },
    font: function(val, reload) {
      var el, self;
      self = this;
      el = Dom.query('atom-workspace');
      if (val === 'Roboto') {
        return el.classList.add('seti-roboto');
      } else {
        return el.classList.remove('seti-roboto');
      }
    },
    setTheme: function(theme, previous, reload) {
      var el, fs, path, pkg, self, themeData;
      self = this;
      el = Dom.query('atom-workspace');
      fs = require('fs');
      path = require('path');
      pkg = atom.packages.getLoadedPackage('seti-ui');
      themeData = '@seti-primary: @' + theme.toLowerCase() + ';';
      themeData = themeData + '@seti-primary-text: @' + theme.toLowerCase() + '-text;';
      themeData = themeData + '@seti-primary-highlight: @' + theme.toLowerCase() + '-highlight;';
      atom.config.set('seti-ui.themeColor', theme);
      return fs.writeFile(pkg.path + '/styles/user-theme.less', themeData, function(err) {
        if (!err) {
          if (previous) {
            el.classList.remove('seti-theme-' + previous.toLowerCase());
            el.classList.add('seti-theme-' + theme.toLowerCase());
          }
          if (reload) {
            return self.refresh();
          }
        }
      });
    },
    animate: function(val) {
      return Utility.applySetting({
        action: 'addWhenFalse',
        config: 'seti-ui.disableAnimations',
        el: ['atom-workspace'],
        className: 'seti-animate',
        val: val,
        cb: this.animate
      });
    },
    tabSize: function(val) {
      return Utility.applySetting({
        action: 'addWhenTrue',
        config: 'seti-ui.compactView',
        el: ['atom-workspace'],
        className: 'seti-compact',
        val: val,
        cb: this.tabSize
      });
    },
    hideTabs: function(val) {
      Utility.applySetting({
        action: 'addWhenTrue',
        config: 'seti-ui.hideTabs',
        el: ['atom-workspace'],
        className: 'seti-hide-tabs',
        val: val,
        cb: this.hideTabs
      });
    },
    fileIcons: function(val) {
      Utility.applySetting({
        action: 'addWhenTrue',
        config: 'seti-ui.fileIcons',
        el: ['atom-workspace'],
        className: 'seti-icons',
        val: val,
        cb: this.fileIcons
      });
    },
    ignoredFiles: function(val) {
      return Utility.applySetting({
        action: 'addWhenFalse',
        config: 'seti-ui.displayIgnored',
        el: ['.file.entry.list-item.status-ignored', '.directory.entry.list-nested-item.status-ignored'],
        className: 'seti-hide',
        val: val,
        cb: this.ignoredFiles
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL3NldGktdWkvbGliL3NldHRpbmdzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FEVixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBRlYsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxTQUFDLEtBQUQsR0FBQTtBQUVKLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLENBQWIsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsWUFBTCxDQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBQWxCLENBTEEsQ0FBQTtBQUFBLE1BT0EsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLENBQWYsQ0FQQSxDQUFBO0FBQUEsTUFTQSxJQUFJLENBQUMsUUFBTCxDQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQkFBaEIsQ0FBZCxDQVRBLENBQUE7QUFBQSxNQVdBLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQixDQUFkLEVBQXFELEtBQXJELEVBQTRELEtBQTVELENBWEEsQ0FBQTtBQUFBLE1BY0EsSUFBSSxDQUFDLElBQUws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

//# sourceURL=/home/junior/.atom/packages/seti-ui/lib/settings.coffee
