'use babel';
var lint = require('../lib/main.coffee').provideLinter().lint;

describe('The sass-lint provider for Linter - scss', function () {
  var configFile = __dirname + '/fixtures/config/.sass-lint.yml';

  beforeEach(function () {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(function () {
      atom.packages.activatePackage('linter-sass-lint');
      return atom.packages.activatePackage('language-sass');
    });
  });

  describe('checks failure.scss and', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        atom.config.set('linter-sass-lint.configFile', configFile);
        return atom.workspace.open(__dirname + '/fixtures/files/failure.scss').then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('finds at least one message', function () {
      var messages = lint(editor);
      expect(messages.length).toBeGreaterThan(0);
    });

    it('verifies the first message', function () {
      var messages = lint(editor);
      var slDocUrl = 'https://github.com/sasstools/sass-lint/tree/master/docs/rules/no-ids.md';
      var attributes = 'href="' + slDocUrl + '" class="badge badge-flexible sass-lint"';
      var warningMarkup = '<a ' + attributes + '>no-ids</a>';
      var warnId = ' ID selectors not allowed';
      expect(messages[0].type).toBeDefined();
      expect(messages[0].type).toEqual('Error');
      expect(messages[0].html).toBeDefined();
      expect(messages[0].html).toEqual('' + warningMarkup + warnId);
      expect(messages[0].filePath).toBeDefined();
      expect(messages[0].filePath).toMatch(/.+failure\.scss$/);
      expect(messages[0].range).toBeDefined();
      expect(messages[0].range.length).toEqual(2);
      expect(messages[0].range).toEqual([[0, 0], [0, 1]]);
    });

    it('verifies the second message', function () {
      var messages = lint(editor);
      var slDocUrl = 'https://github.com/sasstools/sass-lint/tree/master/docs/rules/no-color-literals.md';
      var attributes = 'href="' + slDocUrl + '" class="badge badge-flexible sass-lint"';
      var warningMarkup = '<a ' + attributes + '>no-color-literals</a>';
      var warnId = ' Color literals such as \'red\' should only be used in variable declarations';
      expect(messages[1].type).toBeDefined();
      expect(messages[1].type).toEqual('Warning');
      expect(messages[1].html).toBeDefined();
      expect(messages[1].html).toEqual('' + warningMarkup + warnId);
      expect(messages[1].filePath).toBeDefined();
      expect(messages[1].filePath).toMatch(/.+failure\.scss$/);
      expect(messages[1].range).toBeDefined();
      expect(messages[1].range.length).toEqual(2);
      expect(messages[1].range).toEqual([[1, 9], [1, 10]]);
    });
  });

  describe('checks pass.scss and', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        atom.config.set('linter-sass-lint.configFile', configFile);
        return atom.workspace.open(__dirname + '/fixtures/files/pass.scss').then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('finds nothing wrong with the valid file', function () {
      var messages = lint(editor);
      expect(messages.length).toEqual(0);
    });
  });

  describe('opens ignored.scss and', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        atom.config.set('linter-sass-lint.configFile', configFile);
        return atom.workspace.open(__dirname + '/fixtures/files/ignored.scss').then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('ignores the file and reports no warnings', function () {
      var messages = lint(editor);
      expect(messages.length).toEqual(0);
    });
  });

  describe('opens failure.scss and sets pacakage to not lint if no config file present', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        atom.config.set('linter-sass-lint.noConfigDisable', true);
        atom.config.set('linter-sass-lint.configFile', '');
        return atom.workspace.open(__dirname + '/fixtures/files/failure.scss').then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('doesn\'t lint the file as there\'s no config file present', function () {
      var messages = lint(editor);
      expect(messages.length).toEqual(0);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2p1bmlvci8uYXRvbS9wYWNrYWdlcy9saW50ZXItc2Fzcy1saW50L3NwZWMvbGludGVyLXNhc3MtbGludC1zY3NzLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDO0FBQ1osSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDOztBQUVoRSxRQUFRLENBQUMsMENBQTBDLEVBQUUsWUFBTTtBQUN6RCxNQUFNLFVBQVUsR0FBTSxTQUFTLG9DQUFpQyxDQUFDOztBQUVqRSxZQUFVLENBQUMsWUFBTTtBQUNmLFFBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUN2QyxtQkFBZSxDQUFDLFlBQU07QUFDcEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNsRCxhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3ZELENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMseUJBQXlCLEVBQUUsWUFBTTtBQUN4QyxRQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbEIsY0FBVSxDQUFDLFlBQU07QUFDZixxQkFBZSxDQUFDLFlBQU07QUFDcEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDM0QsZUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBSSxTQUFTLGtDQUErQixDQUFDLElBQUksQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUN4RixnQkFBTSxHQUFHLFVBQVUsQ0FBQztTQUNyQixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLDRCQUE0QixFQUFFLFlBQU07QUFDckMsVUFBTSxRQUFRLEdBQUcsSUFBSSxD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QUFDOUIsWUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEMsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2p1bmlvci8uYXRvbS9wYWNrYWdlcy9saW50ZXItc2Fzcy1saW50L3NwZWMvbGludGVyLXNhc3MtbGludC1zY3NzLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbmNvbnN0IGxpbnQgPSByZXF1aXJlKCcuLi9saWIvbWFpbi5jb2ZmZWUnKS5wcm92aWRlTGludGVyKCkubGludDtcblxuZGVzY3JpYmUoJ1RoZSBzYXNzLWxpbnQgcHJvdmlkZXIgZm9yIExpbnRlciAtIHNjc3MnLCAoKSA9PiB7XG4gIGNvbnN0IGNvbmZpZ0ZpbGUgPSBgJHtfX2Rpcm5hbWV9L2ZpeHR1cmVzL2NvbmZpZy8uc2Fzcy1saW50LnltbGA7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmVJdGVtKCk7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsaW50ZXItc2Fzcy1saW50Jyk7XG4gICAgICByZXR1cm4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLXNhc3MnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NoZWNrcyBmYWlsdXJlLnNjc3MgYW5kJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItc2Fzcy1saW50LmNvbmZpZ0ZpbGUnLCBjb25maWdGaWxlKTtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oYCR7X19kaXJuYW1lfS9maXh0dXJlcy9maWxlcy9mYWlsdXJlLnNjc3NgKS50aGVuKG9wZW5FZGl0b3IgPT4ge1xuICAgICAgICAgIGVkaXRvciA9IG9wZW5FZGl0b3I7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZHMgYXQgbGVhc3Qgb25lIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGxpbnQoZWRpdG9yKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKTtcbiAgICB9KTtcblxuICAgIGl0KCd2ZXJpZmllcyB0aGUgZmlyc3QgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gbGludChlZGl0b3IpO1xuICAgICAgY29uc3Qgc2xEb2NVcmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL3Nhc3N0b29scy9zYXNzLWxpbnQvdHJlZS9tYXN0ZXIvZG9jcy9ydWxlcy9uby1pZHMubWQnO1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IGBocmVmPVwiJHtzbERvY1VybH1cIiBjbGFzcz1cImJhZGdlIGJhZGdlLWZsZXhpYmxlIHNhc3MtbGludFwiYDtcbiAgICAgIGNvbnN0IHdhcm5pbmdNYXJrdXAgPSBgPGEgJHthdHRyaWJ1dGVzfT5uby1pZHM8L2E+YDtcbiAgICAgIGNvbnN0IHdhcm5JZCA9ICcgSUQgc2VsZWN0b3JzIG5vdCBhbGxvd2VkJztcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50eXBlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnR5cGUpLnRvRXF1YWwoJ0Vycm9yJyk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uaHRtbCkudG9CZURlZmluZWQoKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5odG1sKS50b0VxdWFsKGAke3dhcm5pbmdNYXJrdXB9JHt3YXJuSWR9YCk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZmlsZVBhdGgpLnRvQmVEZWZpbmVkKCk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZmlsZVBhdGgpLnRvTWF0Y2goLy4rZmFpbHVyZVxcLnNjc3MkLyk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0ucmFuZ2UpLnRvQmVEZWZpbmVkKCk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0ucmFuZ2UubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnJhbmdlKS50b0VxdWFsKFtbMCwgMF0sIFswLCAxXV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3ZlcmlmaWVzIHRoZSBzZWNvbmQgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gbGludChlZGl0b3IpO1xuICAgICAgY29uc3Qgc2xEb2NVcmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL3Nhc3N0b29scy9zYXNzLWxpbnQvdHJlZS9tYXN0ZXIvZG9jcy9ydWxlcy9uby1jb2xvci1saXRlcmFscy5tZCc7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gYGhyZWY9XCIke3NsRG9jVXJsfVwiIGNsYXNzPVwiYmFkZ2UgYmFkZ2UtZmxleGlibGUgc2Fzcy1saW50XCJgO1xuICAgICAgY29uc3Qgd2FybmluZ01hcmt1cCA9IGA8YSAke2F0dHJpYnV0ZXN9Pm5vLWNvbG9yLWxpdGVyYWxzPC9hPmA7XG4gICAgICBjb25zdCB3YXJuSWQgPSAnIENvbG9yIGxpdGVyYWxzIHN1Y2ggYXMgXFwncmVkXFwnIHNob3VsZCBvbmx5IGJlIHVzZWQgaW4gdmFyaWFibGUgZGVjbGFyYXRpb25zJztcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS50eXBlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLnR5cGUpLnRvRXF1YWwoJ1dhcm5pbmcnKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5odG1sKS50b0JlRGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLmh0bWwpLnRvRXF1YWwoYCR7d2FybmluZ01hcmt1cH0ke3dhcm5JZH1gKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5maWxlUGF0aCkudG9CZURlZmluZWQoKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5maWxlUGF0aCkudG9NYXRjaCgvLitmYWlsdXJlXFwuc2NzcyQvKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5yYW5nZSkudG9CZURlZmluZWQoKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5yYW5nZS5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMV0ucmFuZ2UpLnRvRXF1YWwoW1sxLCA5XSwgWzEsIDEwXV0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnY2hlY2tzIHBhc3Muc2NzcyBhbmQnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvciA9IG51bGw7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1zYXNzLWxpbnQuY29uZmlnRmlsZScsIGNvbmZpZ0ZpbGUpO1xuICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihgJHtfX2Rpcm5hbWV9L2ZpeHR1cmVzL2ZpbGVzL3Bhc3Muc2Nzc2ApLnRoZW4ob3BlbkVkaXRvciA9PiB7XG4gICAgICAgICAgZWRpdG9yID0gb3BlbkVkaXRvcjtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kcyBub3RoaW5nIHdyb25nIHdpdGggdGhlIHZhbGlkIGZpbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGxpbnQoZWRpdG9yKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdvcGVucyBpZ25vcmVkLnNjc3MgYW5kJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItc2Fzcy1saW50LmNvbmZpZ0ZpbGUnLCBjb25maWdGaWxlKTtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oYCR7X19kaXJuYW1lfS9maXh0dXJlcy9maWxlcy9pZ25vcmVkLnNjc3NgKS50aGVuKG9wZW5FZGl0b3IgPT4ge1xuICAgICAgICAgIGVkaXRvciA9IG9wZW5FZGl0b3I7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaWdub3JlcyB0aGUgZmlsZSBhbmQgcmVwb3J0cyBubyB3YXJuaW5ncycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gbGludChlZGl0b3IpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ29wZW5zIGZhaWx1cmUuc2NzcyBhbmQgc2V0cyBwYWNha2FnZSB0byBub3QgbGludCBpZiBubyBjb25maWcgZmlsZSBwcmVzZW50JywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItc2Fzcy1saW50Lm5vQ29uZmlnRGlzYWJsZScsIHRydWUpO1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1zYXNzLWxpbnQuY29uZmlnRmlsZScsICcnKTtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oYCR7X19kaXJuYW1lfS9maXh0dXJlcy9maWxlcy9mYWlsdXJlLnNjc3NgKS50aGVuKG9wZW5FZGl0b3IgPT4ge1xuICAgICAgICAgIGVkaXRvciA9IG9wZW5FZGl0b3I7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZG9lc25cXCd0IGxpbnQgdGhlIGZpbGUgYXMgdGhlcmVcXCdzIG5vIGNvbmZpZyBmaWxlIHByZXNlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGxpbnQoZWRpdG9yKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/home/junior/.atom/packages/linter-sass-lint/spec/linter-sass-lint-scss-spec.js
