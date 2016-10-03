(function() {
  var $, $$, CompositeDisposable, File, SassAutocompileView, View, fs, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  File = require('./helper/file');

  fs = require('fs');

  module.exports = SassAutocompileView = (function(_super) {
    __extends(SassAutocompileView, _super);

    SassAutocompileView.captionPrefix = 'SASS-Autocompile: ';

    SassAutocompileView.clickableLinksCounter = 0;

    SassAutocompileView.content = function() {
      return this.div({
        "class": 'sass-autocompile atom-panel panel-bottom'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'inset-panel'
          }, function() {
            _this.div({
              outlet: 'panelHeading',
              "class": 'panel-heading no-border'
            }, function() {
              _this.span({
                outlet: 'panelHeaderCaption',
                "class": 'header-caption'
              });
              _this.span({
                outlet: 'panelOpenNodeSassOutput',
                "class": 'open-node-sass-output hide',
                click: 'openNodeSassOutput'
              }, 'Show detailed output');
              _this.span({
                outlet: 'panelLoading',
                "class": 'inline-block loading loading-spinner-tiny hide'
              });
              return _this.div({
                outlet: 'panelRightTopOptions',
                "class": 'inline-block pull-right right-top-options'
              }, function() {
                return _this.button({
                  outlet: 'panelClose',
                  "class": 'btn btn-close',
                  click: 'hidePanel'
                }, 'Close');
              });
            });
            return _this.div({
              outlet: 'panelBody',
              "class": 'panel-body padded hide'
            });
          });
        };
      })(this));
    };

    function SassAutocompileView() {
      var args, options;
      options = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      SassAutocompileView.__super__.constructor.call(this, args);
      this.options = options;
      this.panel = atom.workspace.addBottomPanel({
        item: this,
        visible: false
      });
    }

    SassAutocompileView.prototype.initialize = function(serializeState) {};

    SassAutocompileView.prototype.destroy = function() {
      clearTimeout(this.automaticHidePanelTimeout);
      this.panel.destroy();
      return this.detach();
    };

    SassAutocompileView.prototype.updateOptions = function(options) {
      return this.options = options;
    };

    SassAutocompileView.prototype.startCompilation = function(args) {
      this.hasError = false;
      this.clearNodeSassOutput();
      if (this.options.showStartCompilingNotification) {
        if (args.isCompileDirect) {
          this.showInfoNotification('Start direct compilation');
        } else {
          this.showInfoNotification('Start compilation', args.inputFilename);
        }
      }
      if (this.options.showPanel) {
        this.showPanel(true);
        if (this.options.showStartCompilingNotification) {
          if (args.isCompileDirect) {
            return this.addText('Start direct compilation', 'terminal', 'info');
          } else {
            return this.addText(args.inputFilename, 'terminal', 'info', (function(_this) {
              return function(evt) {
                return _this.openFile(args.inputFilename, null, null, evt.target);
              };
            })(this));
          }
        }
      }
    };

    SassAutocompileView.prototype.warning = function(args) {
      if (this.options.showWarningNotification) {
        this.showWarningNotification('Warning', args.message);
      }
      if (this.options.showPanel) {
        this.showPanel();
        if (args.outputFilename) {
          return this.addText(args.message, 'issue-opened', 'warning', (function(_this) {
            return function(evt) {
              return _this.openFile(args.outputFilename, evt.target);
            };
          })(this));
        } else {
          return this.addText(args.message, 'issue-opened', 'warning');
        }
      }
    };

    SassAutocompileView.prototype.successfullCompilation = function(args) {
      var caption, details, fileSize, message, showAdditionalCompilationInfo;
      this.appendNodeSassOutput(args.nodeSassOutput);
      fileSize = File.fileSizeToReadable(args.statistics.after);
      caption = "Successfully compiled";
      details = args.outputFilename;
      if (this.options.showAdditionalCompilationInfo) {
        details += "\n \nOutput style: " + args.outputStyle;
        details += "\nDuration:     " + args.statistics.duration + " ms";
        details += "\nFile size:    " + fileSize.size + " " + fileSize.unit;
      }
      this.showSuccessNotification(caption, details);
      if (this.options.showPanel) {
        this.showPanel();
        showAdditionalCompilationInfo = this.options.showAdditionalCompilationInfo;
        message = $$(function() {
          return this.div({
            "class": 'success-text-wrapper'
          }, (function(_this) {
            return function() {
              _this.p({
                "class": 'icon icon-check text-success'
              }, function() {
                if (args.isCompileDirect) {
                  return _this.span({
                    "class": ''
                  }, 'Successfully compiled!');
                } else {
                  return _this.span({
                    "class": ''
                  }, args.outputFilename);
                }
              });
              if (showAdditionalCompilationInfo) {
                return _this.p({
                  "class": 'success-details text-info'
                }, function() {
                  _this.span({
                    "class": 'success-output-style'
                  }, function() {
                    _this.span('Output style: ');
                    return _this.span({
                      "class": 'value'
                    }, args.outputStyle);
                  });
                  _this.span({
                    "class": 'success-duration'
                  }, function() {
                    _this.span('Duration: ');
                    return _this.span({
                      "class": 'value'
                    }, args.statistics.duration + ' ms');
                  });
                  return _this.span({
                    "class": 'success-file-size'
                  }, function() {
                    _this.span('File size: ');
                    return _this.span({
                      "class": 'value'
                    }, fileSize.size + ' ' + fileSize.unit);
                  });
                });
              }
            };
          })(this));
        });
        return this.addText(message, 'check', 'success', (function(_this) {
          return function(evt) {
            return _this.openFile(args.outputFilename, evt.target);
          };
        })(this));
      }
    };

    SassAutocompileView.prototype.erroneousCompilation = function(args) {
      var caption, errorMessage, errorNotification;
      this.hasError = true;
      this.appendNodeSassOutput(args.nodeSassOutput);
      caption = 'Compilation error';
      if (args.message.file) {
        errorNotification = "ERROR:\n" + args.message.message;
        if (args.isCompileToFile) {
          errorNotification += "\n \nFILE:\n" + args.message.file;
        }
        errorNotification += "\n \nLINE:    " + args.message.line + "\nCOLUMN:  " + args.message.column;
      } else {
        errorNotification = args.message;
      }
      this.showErrorNotification(caption, errorNotification);
      if (this.options.showPanel) {
        this.showPanel();
        if (args.message.file) {
          errorMessage = $$(function() {
            return this.div({
              "class": 'open-error-file'
            }, (function(_this) {
              return function() {
                _this.p({
                  "class": "icon icon-alert text-error"
                }, function() {
                  _this.span({
                    "class": "error-caption"
                  }, 'Error:');
                  _this.span({
                    "class": "error-text"
                  }, args.message.message);
                  if (args.isCompileDirect) {
                    _this.span({
                      "class": 'error-line'
                    }, args.message.line);
                    return _this.span({
                      "class": 'error-column'
                    }, args.message.column);
                  }
                });
                if (args.isCompileToFile) {
                  return _this.p({
                    "class": 'error-details text-error'
                  }, function() {
                    return _this.span({
                      "class": 'error-file-wrapper'
                    }, function() {
                      _this.span('in:');
                      _this.span({
                        "class": 'error-file'
                      }, args.message.file);
                      _this.span({
                        "class": 'error-line'
                      }, args.message.line);
                      return _this.span({
                        "class": 'error-column'
                      }, args.message.column);
                    });
                  });
                }
              };
            })(this));
          });
          this.addText(errorMessage, 'alert', 'error', (function(_this) {
            return function(evt) {
              return _this.openFile(args.message.file, args.message.line, args.message.column, evt.target);
            };
          })(this));
        } else if (args.message.message) {
          this.addText(args.message.message, 'alert', 'error', (function(_this) {
            return function(evt) {
              return _this.openFile(args.inputFilename, null, null, evt.target);
            };
          })(this));
        } else {
          this.addText(args.message, 'alert', 'error', (function(_this) {
            return function(evt) {
              return _this.openFile(args.inputFilename, null, null, evt.target);
            };
          })(this));
        }
      }
      if (this.options.directlyJumpToError && args.message.file) {
        return this.openFile(args.message.file, args.message.line, args.message.column);
      }
    };

    SassAutocompileView.prototype.appendNodeSassOutput = function(output) {
      if (this.nodeSassOutput) {
        return this.nodeSassOutput += "\n\n--------------------\n\n" + output;
      } else {
        return this.nodeSassOutput = output;
      }
    };

    SassAutocompileView.prototype.clearNodeSassOutput = function() {
      return this.nodeSassOutput = void 0;
    };

    SassAutocompileView.prototype.finished = function(args) {
      if (this.hasError) {
        this.setCaption('Compilation error');
        if (this.options.autoHidePanelOnError) {
          this.hidePanel(true);
        }
      } else {
        this.setCaption('Successfully compiled');
        if (this.options.autoHidePanelOnSuccess) {
          this.hidePanel(true);
        }
      }
      this.hideThrobber();
      this.showRightTopOptions();
      if (this.nodeSassOutput) {
        this.panelOpenNodeSassOutput.removeClass('hide');
      }
      if (this.options.showNodeSassOutput) {
        return this.openNodeSassOutput();
      }
    };

    SassAutocompileView.prototype.openFile = function(filename, line, column, targetElement) {
      if (targetElement == null) {
        targetElement = null;
      }
      if (typeof filename === 'string') {
        return fs.exists(filename, (function(_this) {
          return function(exists) {
            var target;
            if (exists) {
              return atom.workspace.open(filename, {
                initialLine: line ? line - 1 : 0,
                initialColumn: column ? column - 1 : 0
              });
            } else if (targetElement) {
              target = $(targetElement);
              if (!target.is('p.clickable')) {
                target = target.parent();
              }
              return target.addClass('target-file-does-not-exist').removeClass('clickable').append($('<span>File does not exist!</span>').addClass('hint')).off('click').children(':first').removeClass('text-success text-warning text-info');
            }
          };
        })(this));
      }
    };

    SassAutocompileView.prototype.openNodeSassOutput = function() {
      var pane;
      if (this.nodeSassOutput) {
        if (!this.nodeSassOutputEditor) {
          return atom.workspace.open().then((function(_this) {
            return function(editor) {
              var subscriptions;
              _this.nodeSassOutputEditor = editor;
              editor.setText(_this.nodeSassOutput);
              subscriptions = new CompositeDisposable;
              subscriptions.add(editor.onDidSave(function() {
                return _this.nodeSassOutputEditor = null;
              }));
              return subscriptions.add(editor.onDidDestroy(function() {
                _this.nodeSassOutputEditor = null;
                return subscriptions.dispose();
              }));
            };
          })(this));
        } else {
          pane = atom.workspace.paneForItem(this.nodeSassOutputEditor);
          return pane.activateItem(this.nodeSassOutputEditor);
        }
      }
    };

    SassAutocompileView.prototype.showInfoNotification = function(title, message) {
      if (this.options.showInfoNotification) {
        return atom.notifications.addInfo(title, {
          detail: message,
          dismissable: !this.options.autoHideInfoNotification
        });
      }
    };

    SassAutocompileView.prototype.showSuccessNotification = function(title, message) {
      if (this.options.showSuccessNotification) {
        return atom.notifications.addSuccess(title, {
          detail: message,
          dismissable: !this.options.autoHideSuccessNotification
        });
      }
    };

    SassAutocompileView.prototype.showWarningNotification = function(title, message) {
      if (this.options.showWarningNotification) {
        return atom.notifications.addWarning(title, {
          detail: message,
          dismissable: !this.options.autoWarningInfoNotification
        });
      }
    };

    SassAutocompileView.prototype.showErrorNotification = function(title, message) {
      if (this.options.showErrorNotification) {
        return atom.notifications.addError(title, {
          detail: message,
          dismissable: !this.options.autoHideErrorNotification
        });
      }
    };

    SassAutocompileView.prototype.resetPanel = function() {
      this.setCaption('Processing...');
      this.showThrobber();
      this.hideRightTopOptions();
      this.panelOpenNodeSassOutput.addClass('hide');
      return this.panelBody.addClass('hide').empty();
    };

    SassAutocompileView.prototype.showPanel = function(reset) {
      if (reset == null) {
        reset = false;
      }
      clearTimeout(this.automaticHidePanelTimeout);
      if (reset) {
        this.resetPanel();
      }
      return this.panel.show();
    };

    SassAutocompileView.prototype.hidePanel = function(withDelay, reset) {
      if (withDelay == null) {
        withDelay = false;
      }
      if (reset == null) {
        reset = false;
      }
      clearTimeout(this.automaticHidePanelTimeout);
      if (withDelay === true) {
        return this.automaticHidePanelTimeout = setTimeout((function(_this) {
          return function() {
            _this.hideThrobber();
            _this.panel.hide();
            if (reset) {
              return _this.resetPanel();
            }
          };
        })(this), this.options.autoHidePanelDelay);
      } else {
        this.hideThrobber();
        this.panel.hide();
        if (reset) {
          return this.resetPanel();
        }
      }
    };

    SassAutocompileView.prototype.setCaption = function(text) {
      return this.panelHeaderCaption.html(SassAutocompileView.captionPrefix + text);
    };

    SassAutocompileView.prototype.addText = function(text, icon, textClass, clickCallback) {
      var clickCounter, spanClass, wrapper, wrapperClass;
      clickCounter = SassAutocompileView.clickableLinksCounter++;
      wrapperClass = clickCallback ? "clickable clickable-" + clickCounter : '';
      spanClass = '';
      if (icon) {
        spanClass = spanClass + (spanClass !== '' ? ' ' : '') + ("icon icon-" + icon);
      }
      if (textClass) {
        spanClass = spanClass + (spanClass !== '' ? ' ' : '') + ("text-" + textClass);
      }
      if (typeof text === 'object') {
        wrapper = $$(function() {
          return this.div({
            "class": wrapperClass
          });
        });
        wrapper.append(text);
        this.panelBody.removeClass('hide').append(wrapper);
      } else {
        this.panelBody.removeClass('hide').append($$(function() {
          return this.p({
            "class": wrapperClass
          }, (function(_this) {
            return function() {
              return _this.span({
                "class": spanClass
              }, text);
            };
          })(this));
        }));
      }
      if (clickCallback) {
        return this.find(".clickable-" + clickCounter).on('click', (function(_this) {
          return function(evt) {
            return clickCallback(evt);
          };
        })(this));
      }
    };

    SassAutocompileView.prototype.hideRightTopOptions = function() {
      return this.panelRightTopOptions.addClass('hide');
    };

    SassAutocompileView.prototype.showRightTopOptions = function() {
      return this.panelRightTopOptions.removeClass('hide');
    };

    SassAutocompileView.prototype.hideThrobber = function() {
      return this.panelLoading.addClass('hide');
    };

    SassAutocompileView.prototype.showThrobber = function() {
      return this.panelLoading.removeClass('hide');
    };

    return SassAutocompileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL3Nhc3MtYXV0b2NvbXBpbGUvbGliL3Nhc3MtYXV0b2NvbXBpbGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUVBQUE7SUFBQTs7c0JBQUE7O0FBQUEsRUFBQSxPQUFnQixPQUFBLENBQVEsc0JBQVIsQ0FBaEIsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxZQUFBLElBQVIsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUxMLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUYsMENBQUEsQ0FBQTs7QUFBQSxJQUFBLG1CQUFDLENBQUEsYUFBRCxHQUFpQixvQkFBakIsQ0FBQTs7QUFBQSxJQUNBLG1CQUFDLENBQUEscUJBQUQsR0FBeUIsQ0FEekIsQ0FBQTs7QUFBQSxJQUlBLG1CQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTywwQ0FBUDtPQUFMLEVBQXdELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3BELEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxhQUFQO1dBQUwsRUFBMkIsU0FBQSxHQUFBO0FBQ3ZCLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsTUFBQSxFQUFRLGNBQVI7QUFBQSxjQUF3QixPQUFBLEVBQU8seUJBQS9CO2FBQUwsRUFBK0QsU0FBQSxH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

//# sourceURL=/home/junior/.atom/packages/sass-autocompile/lib/sass-autocompile-view.coffee
