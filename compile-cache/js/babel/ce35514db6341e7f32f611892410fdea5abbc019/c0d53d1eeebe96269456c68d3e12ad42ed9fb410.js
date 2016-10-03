Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tabsSettings = require('./tabs-settings');

var _tabsSettings2 = _interopRequireDefault(_tabsSettings);

'use babel';
'use strict';

var panels = document.querySelectorAll('atom-panel-container');
var observerConfig = { childList: true };
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
        return toggleBlendTreeView(atom.config.get('atom-material-ui.treeView.blendTabs'));
    });
});

// Observe panels for DOM mutations
Array.prototype.forEach.call(panels, function (panel) {
    return observer.observe(panel, observerConfig);
});

function getTreeViews() {
    var treeViews = [document.querySelector('.tree-view-resizer'), document.querySelector('.remote-ftp-view'), (function () {
        var nuclideTreeView = document.querySelector('.nuclide-file-tree');

        if (nuclideTreeView) {
            return nuclideTreeView.closest('.nuclide-ui-panel-component');
        }
    })()];

    return treeViews;
}

function removeBlendingEl() {
    var treeViews = getTreeViews();

    treeViews.forEach(function (treeView) {
        if (treeView) {
            var blendingEl = treeView.querySelector('.tabBlender');

            if (blendingEl) {
                treeView.removeChild(blendingEl);
            }
        }
    });
}

function toggleBlendTreeView(bool) {
    var treeViews = getTreeViews();

    setImmediate(function () {
        treeViews.forEach(function (treeView) {
            if (treeView) {
                var blendingEl = document.createElement('div');
                var title = document.createElement('span');

                blendingEl.classList.add('tabBlender');
                blendingEl.appendChild(title);

                if (treeView && bool) {
                    if (treeView.querySelector('.tabBlender')) {
                        removeBlendingEl();
                    }
                    treeView.insertBefore(blendingEl, treeView.firstChild);
                } else if (treeView && !bool) {
                    removeBlendingEl();
                } else if (!treeView && bool) {
                    if (atom.packages.getActivePackage('tree-view') || atom.packages.getActivePackage('Remote-FTP') || atom.packages.getActivePackage('nuclide')) {
                        return setTimeout(function () {
                            toggleBlendTreeView(bool);
                            setImmediate(function () {
                                return _tabsSettings2['default'].apply();
                            });
                        }, 2000);
                    }
                }
            }
        });
    });
}

exports['default'] = { toggleBlendTreeView: toggleBlendTreeView };
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2p1bmlvci8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi90cmVlLXZpZXctc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OzRCQUd5QixpQkFBaUI7Ozs7QUFIMUMsV0FBVyxDQUFDO0FBQ1osWUFBWSxDQUFDOztBQUliLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQy9ELElBQUksY0FBYyxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ3pDLElBQUksUUFBUSxHQUFHLElBQUksZ0JBQWdCLENBQUMsVUFBQyxTQUFTLEVBQUs7QUFDbEQsYUFBUyxDQUFDLE9BQU8sQ0FBQztlQUFNLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7S0FBQSxDQUFDLENBQUM7Q0FDckcsQ0FBQyxDQUFDOzs7QUFHSCxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSztXQUFLLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQztDQUFBLENBQUMsQ0FBQzs7QUFFekYsU0FBUyxZQUFZLEdBQUc7QUFDcEIsUUFBSSxTQUFTLEdBQUcsQ0FDWixRQUFRLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLEVBQzVDLFFBQVEsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsRUFDMUMsQ0FBQyxZQUFZO0FBQ1QsWUFBSSxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOztBQUVuRSxZQUFJLGVBQWUsRUFBRTtBQUNqQixtQkFBTyxlQUFlLENBQUMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDakU7S0FDSixDQUFBLEVBQUcsQ0FDUCxDQUFDOztBQUVGLFdBQU8sU0FBUyxDQUFDO0NBQ3BCOztBQUVELFNBQVMsZ0JBQWdCLEdBQUc7QUFDeEIsUUFBSSxTQUFTLEdBQUcsWUFBWSxFQUFFLENBQUM7O0FBRS9CLGFBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDNUIsWUFBSSxRQUFRLEVBQUU7QUFDVixnQkFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFdkQsZ0JBQUksVUFBVSxFQUFFO0FBQ1osd0JBQVEsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDcEM7U0FDSjtLQUNKLENBQUMsQ0FBQztDQUNOOztBQUVELFNBQVMsbUJBQW1CLENBQUMsSUFBSSxFQUFFO0FBQy9CLFFBQUksU0FBUyxHQUFHLFlBQVksRUFBRSxDQUFDOztBQUUvQixnQkFBWSxDQUFDLFlBQU07QUFDZixpQkFBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUM1QixnQkFBSSxRQUFRLEVBQUU7QUFDVixvQkFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQyxvQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFM0MsMEJBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZDLDBCQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUU5QixvQkFBSSxRQUFRLElBQUksSUFBSSxFQUFFO0FBQ2xCLHdCQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDdkMsd0NBQWdCLEVBQUUsQ0FBQztxQkFDdEI7QUFDRCw0QkFBUSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUMxRCxNQUFNLElBQUksUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQzFCLG9DQUFnQixFQUFFLENBQUM7aUJBQ3RCLE1BQU0sSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQUU7QUFDMUIsd0JBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDMUksK0JBQU8sVUFBVSxDQUFDLFlBQU07QUFDcEIsK0NBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUIsd0NBQVksQ0FBQzt1Q0FBTSwwQkFBYSxLQUFLLEVBQUU7NkJBQUEsQ0FBQyxDQUFDO3lCQUM1QyxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUNaO2lCQUNKO2FBQ0o7U0FDSixDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7Q0FDTjs7cUJBRWMsRUFBRSxtQkFBbUIsRUFBbkIsbUJBQW1CLEVBQUUiLCJmaWxlIjoiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL3RyZWUtdmlldy1zZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdGFic1NldHRpbmdzIGZyb20gJy4vdGFicy1zZXR0aW5ncyc7XG5cbnZhciBwYW5lbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhdG9tLXBhbmVsLWNvbnRhaW5lcicpO1xudmFyIG9ic2VydmVyQ29uZmlnID0geyBjaGlsZExpc3Q6IHRydWUgfTtcbnZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcblx0bXV0YXRpb25zLmZvckVhY2goKCkgPT4gdG9nZ2xlQmxlbmRUcmVlVmlldyhhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkudHJlZVZpZXcuYmxlbmRUYWJzJykpKTtcbn0pO1xuXG4vLyBPYnNlcnZlIHBhbmVscyBmb3IgRE9NIG11dGF0aW9uc1xuQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChwYW5lbHMsIChwYW5lbCkgPT4gb2JzZXJ2ZXIub2JzZXJ2ZShwYW5lbCwgb2JzZXJ2ZXJDb25maWcpKTtcblxuZnVuY3Rpb24gZ2V0VHJlZVZpZXdzKCkge1xuICAgIHZhciB0cmVlVmlld3MgPSBbXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50cmVlLXZpZXctcmVzaXplcicpLFxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVtb3RlLWZ0cC12aWV3JyksXG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbnVjbGlkZVRyZWVWaWV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm51Y2xpZGUtZmlsZS10cmVlJyk7XG5cbiAgICAgICAgICAgIGlmIChudWNsaWRlVHJlZVZpZXcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVjbGlkZVRyZWVWaWV3LmNsb3Nlc3QoJy5udWNsaWRlLXVpLXBhbmVsLWNvbXBvbmVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpXG4gICAgXTtcblxuICAgIHJldHVybiB0cmVlVmlld3M7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUJsZW5kaW5nRWwoKSB7XG4gICAgdmFyIHRyZWVWaWV3cyA9IGdldFRyZWVWaWV3cygpO1xuXG4gICAgdHJlZVZpZXdzLmZvckVhY2goKHRyZWVWaWV3KSA9PiB7XG4gICAgICAgIGlmICh0cmVlVmlldykge1xuICAgICAgICAgICAgdmFyIGJsZW5kaW5nRWwgPSB0cmVlVmlldy5xdWVyeVNlbGVjdG9yKCcudGFiQmxlbmRlcicpO1xuXG4gICAgICAgICAgICBpZiAoYmxlbmRpbmdFbCkge1xuICAgICAgICAgICAgICAgIHRyZWVWaWV3LnJlbW92ZUNoaWxkKGJsZW5kaW5nRWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUJsZW5kVHJlZVZpZXcoYm9vbCkge1xuICAgIHZhciB0cmVlVmlld3MgPSBnZXRUcmVlVmlld3MoKTtcblxuICAgIHNldEltbWVkaWF0ZSgoKSA9PiB7XG4gICAgICAgIHRyZWVWaWV3cy5mb3JFYWNoKCh0cmVlVmlldykgPT4ge1xuICAgICAgICAgICAgaWYgKHRyZWVWaWV3KSB7XG4gICAgICAgICAgICAgICAgdmFyIGJsZW5kaW5nRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbiAgICAgICAgICAgICAgICBibGVuZGluZ0VsLmNsYXNzTGlzdC5hZGQoJ3RhYkJsZW5kZXInKTtcbiAgICAgICAgICAgICAgICBibGVuZGluZ0VsLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgICAgICAgICAgICAgIGlmICh0cmVlVmlldyAmJiBib29sKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmVlVmlldy5xdWVyeVNlbGVjdG9yKCcudGFiQmxlbmRlcicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVCbGVuZGluZ0VsKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdHJlZVZpZXcuaW5zZXJ0QmVmb3JlKGJsZW5kaW5nRWwsIHRyZWVWaWV3LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHJlZVZpZXcgJiYgIWJvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQmxlbmRpbmdFbCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRyZWVWaWV3ICYmIGJvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZSgndHJlZS12aWV3JykgfHwgYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdSZW1vdGUtRlRQJykgfHwgYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdudWNsaWRlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVCbGVuZFRyZWVWaWV3KGJvb2wpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEltbWVkaWF0ZSgoKSA9PiB0YWJzU2V0dGluZ3MuYXBwbHkoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgdG9nZ2xlQmxlbmRUcmVlVmlldyB9O1xuIl19
//# sourceURL=/home/junior/.atom/packages/atom-material-ui/lib/tree-view-settings.js
