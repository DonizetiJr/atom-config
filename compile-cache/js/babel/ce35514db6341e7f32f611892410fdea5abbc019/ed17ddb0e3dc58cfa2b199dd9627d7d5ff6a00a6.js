Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _helpers = require('./helpers');

var _tinycolor2 = require('tinycolor2');

var _tinycolor22 = _interopRequireDefault(_tinycolor2);

var _colorTemplates = require('./color-templates');

var _colorTemplates2 = _interopRequireDefault(_colorTemplates);

'use babel';
'use strict';

function apply() {

    atom.config.onDidChange('atom-material-ui.colors.accentColor', function () {
        return _main2['default'].writeConfig();
    });

    atom.config.onDidChange('atom-material-ui.colors.abaseColor', function (value) {
        var baseColor = (0, _tinycolor22['default'])(value.newValue.toRGBAString());

        if (atom.config.get('atom-material-ui.colors.genAccent')) {
            var accentColor = baseColor.complement().saturate(20).lighten(5);
            return atom.config.set('atom-material-ui.colors.accentColor', accentColor.toRgbString());
        }

        _main2['default'].writeConfig();
    });

    atom.config.onDidChange('atom-material-ui.colors.predefinedColor', function (value) {
        var newValue = (0, _helpers.toCamelCase)(value.newValue);

        atom.config.set('atom-material-ui.colors.abaseColor', _colorTemplates2['default'][newValue].base);
        atom.config.set('atom-material-ui.colors.accentColor', _colorTemplates2['default'][newValue].accent);
    });
}

exports['default'] = { apply: apply };
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2p1bmlvci8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9jb2xvci1zZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBR2dCLFFBQVE7Ozs7dUJBQ0ksV0FBVzs7MEJBQ2pCLFlBQVk7Ozs7OEJBQ1AsbUJBQW1COzs7O0FBTjlDLFdBQVcsQ0FBQztBQUNaLFlBQVksQ0FBQzs7QUFPYixTQUFTLEtBQUssR0FBRzs7QUFFYixRQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxxQ0FBcUMsRUFBRTtlQUFNLGtCQUFJLFdBQVcsRUFBRTtLQUFBLENBQUMsQ0FBQzs7QUFFeEYsUUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsb0NBQW9DLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDckUsWUFBSSxTQUFTLEdBQUcsNkJBQVUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDOztBQUV6RCxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLEVBQUU7QUFDdEQsZ0JBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLG1CQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxFQUFFLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1NBQzVGOztBQUVELDBCQUFJLFdBQVcsRUFBRSxDQUFDO0tBQ3JCLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyx5Q0FBeUMsRUFBRSxVQUFDLEtBQUssRUFBSztBQUMxRSxZQUFJLFFBQVEsR0FBRywwQkFBWSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTNDLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxFQUFFLDRCQUFlLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JGLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxFQUFFLDRCQUFlLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzNGLENBQUMsQ0FBQztDQUNOOztxQkFFYyxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUiLCJmaWxlIjoiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL2NvbG9yLXNldHRpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBhbXUgZnJvbSAnLi9tYWluJztcbmltcG9ydCB7IHRvQ2FtZWxDYXNlIH0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCB0aW55Y29sb3IgZnJvbSAndGlueWNvbG9yMic7XG5pbXBvcnQgY29sb3JUZW1wbGF0ZXMgZnJvbSAnLi9jb2xvci10ZW1wbGF0ZXMnO1xuXG5mdW5jdGlvbiBhcHBseSgpIHtcblxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5hY2NlbnRDb2xvcicsICgpID0+IGFtdS53cml0ZUNvbmZpZygpKTtcblxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5hYmFzZUNvbG9yJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHZhciBiYXNlQ29sb3IgPSB0aW55Y29sb3IodmFsdWUubmV3VmFsdWUudG9SR0JBU3RyaW5nKCkpO1xuXG4gICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkuY29sb3JzLmdlbkFjY2VudCcpKSB7XG4gICAgICAgICAgICBsZXQgYWNjZW50Q29sb3IgPSBiYXNlQ29sb3IuY29tcGxlbWVudCgpLnNhdHVyYXRlKDIwKS5saWdodGVuKDUpO1xuICAgICAgICAgICAgcmV0dXJuIGF0b20uY29uZmlnLnNldCgnYXRvbS1tYXRlcmlhbC11aS5jb2xvcnMuYWNjZW50Q29sb3InLCBhY2NlbnRDb2xvci50b1JnYlN0cmluZygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFtdS53cml0ZUNvbmZpZygpO1xuICAgIH0pO1xuXG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2F0b20tbWF0ZXJpYWwtdWkuY29sb3JzLnByZWRlZmluZWRDb2xvcicsICh2YWx1ZSkgPT4ge1xuICAgICAgICB2YXIgbmV3VmFsdWUgPSB0b0NhbWVsQ2FzZSh2YWx1ZS5uZXdWYWx1ZSk7XG5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5hYmFzZUNvbG9yJywgY29sb3JUZW1wbGF0ZXNbbmV3VmFsdWVdLmJhc2UpO1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2F0b20tbWF0ZXJpYWwtdWkuY29sb3JzLmFjY2VudENvbG9yJywgY29sb3JUZW1wbGF0ZXNbbmV3VmFsdWVdLmFjY2VudCk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgYXBwbHkgfTtcbiJdfQ==
//# sourceURL=/home/junior/.atom/packages/atom-material-ui/lib/color-settings.js
