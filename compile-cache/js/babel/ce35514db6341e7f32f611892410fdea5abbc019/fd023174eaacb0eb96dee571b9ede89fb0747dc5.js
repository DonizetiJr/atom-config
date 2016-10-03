'use babel';
var lint = require('../lib/main.coffee').provideLinter().lint;

describe('The sass-lint provider for Linter - resolve paths relative to config file', function () {
  var configFile = __dirname + '/fixtures/config/.relative-config.yml';

  beforeEach(function () {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(function () {
      atom.packages.activatePackage('linter-sass-lint');
      return atom.packages.activatePackage('language-sass');
    });
  });
  describe('checks ignored.scss and', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        atom.config.set('linter-sass-lint.configFile', configFile);
        atom.config.set('linter-sass-lint.resolvePathsRelativeToConfig', true);
        return atom.workspace.open(__dirname + '/fixtures/files/ignored.scss').then(function (openEditor) {
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
      expect(messages[0].filePath).toMatch(/.+ignored\.scss$/);
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
      expect(messages[1].filePath).toMatch(/.+ignored\.scss$/);
      expect(messages[1].range).toBeDefined();
      expect(messages[1].range.length).toEqual(2);
      expect(messages[1].range).toEqual([[1, 9], [1, 10]]);
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

    it('finds nothing wrong with the valid file', function () {
      var messages = lint(editor);
      expect(messages.length).toEqual(0);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2p1bmlvci8uYXRvbS9wYWNrYWdlcy9saW50ZXItc2Fzcy1saW50L3NwZWMvbGludGVyLXNhc3MtbGludC1yZXNvbHZlLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDO0FBQ1osSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDOztBQUVoRSxRQUFRLENBQUMsMkVBQTJFLEVBQUUsWUFBTTtBQUMxRixNQUFNLFVBQVUsR0FBTSxTQUFTLDBDQUF1QyxDQUFDOztBQUV2RSxZQUFVLENBQUMsWUFBTTtBQUNmLFFBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUN2QyxtQkFBZSxDQUFDLFlBQU07QUFDcEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNsRCxhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3ZELENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztBQUNILFVBQVEsQ0FBQyx5QkFBeUIsRUFBRSxZQUFNO0FBQ3hDLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQztBQUNsQixjQUFVLENBQUMsWUFBTTtBQUNmLHFCQUFlLENBQUMsWUFBTTtBQUNwQixZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMzRCxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN2RSxlQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFJLFNBQVMsa0NBQStCLENBQUMsSUFBSSxDQUFDLFVBQUEsVUFBVSxFQUFJO0FBQ3hGLGdCQUFNLEdBQUcsVUFBVSxDQUFDO1NBQ3JCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKLENBQUMs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SixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvanVuaW9yLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zYXNzLWxpbnQvc3BlYy9saW50ZXItc2Fzcy1saW50LXJlc29sdmUtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuY29uc3QgbGludCA9IHJlcXVpcmUoJy4uL2xpYi9tYWluLmNvZmZlZScpLnByb3ZpZGVMaW50ZXIoKS5saW50O1xuXG5kZXNjcmliZSgnVGhlIHNhc3MtbGludCBwcm92aWRlciBmb3IgTGludGVyIC0gcmVzb2x2ZSBwYXRocyByZWxhdGl2ZSB0byBjb25maWcgZmlsZScsICgpID0+IHtcbiAgY29uc3QgY29uZmlnRmlsZSA9IGAke19fZGlybmFtZX0vZml4dHVyZXMvY29uZmlnLy5yZWxhdGl2ZS1jb25maWcueW1sYDtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZUl0ZW0oKTtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xpbnRlci1zYXNzLWxpbnQnKTtcbiAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGFuZ3VhZ2Utc2FzcycpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ2NoZWNrcyBpZ25vcmVkLnNjc3MgYW5kJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItc2Fzcy1saW50LmNvbmZpZ0ZpbGUnLCBjb25maWdGaWxlKTtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItc2Fzcy1saW50LnJlc29sdmVQYXRoc1JlbGF0aXZlVG9Db25maWcnLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oYCR7X19kaXJuYW1lfS9maXh0dXJlcy9maWxlcy9pZ25vcmVkLnNjc3NgKS50aGVuKG9wZW5FZGl0b3IgPT4ge1xuICAgICAgICAgIGVkaXRvciA9IG9wZW5FZGl0b3I7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZHMgYXQgbGVhc3Qgb25lIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGxpbnQoZWRpdG9yKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKTtcbiAgICB9KTtcblxuICAgIGl0KCd2ZXJpZmllcyB0aGUgZmlyc3QgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gbGludChlZGl0b3IpO1xuICAgICAgY29uc3Qgc2xEb2NVcmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL3Nhc3N0b29scy9zYXNzLWxpbnQvdHJlZS9tYXN0ZXIvZG9jcy9ydWxlcy9uby1pZHMubWQnO1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IGBocmVmPVwiJHtzbERvY1VybH1cIiBjbGFzcz1cImJhZGdlIGJhZGdlLWZsZXhpYmxlIHNhc3MtbGludFwiYDtcbiAgICAgIGNvbnN0IHdhcm5pbmdNYXJrdXAgPSBgPGEgJHthdHRyaWJ1dGVzfT5uby1pZHM8L2E+YDtcbiAgICAgIGNvbnN0IHdhcm5JZCA9ICcgSUQgc2VsZWN0b3JzIG5vdCBhbGxvd2VkJztcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50eXBlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnR5cGUpLnRvRXF1YWwoJ0Vycm9yJyk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uaHRtbCkudG9CZURlZmluZWQoKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5odG1sKS50b0VxdWFsKGAke3dhcm5pbmdNYXJrdXB9JHt3YXJuSWR9YCk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZmlsZVBhdGgpLnRvQmVEZWZpbmVkKCk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZmlsZVBhdGgpLnRvTWF0Y2goLy4raWdub3JlZFxcLnNjc3MkLyk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0ucmFuZ2UpLnRvQmVEZWZpbmVkKCk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0ucmFuZ2UubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnJhbmdlKS50b0VxdWFsKFtbMCwgMF0sIFswLCAxXV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3ZlcmlmaWVzIHRoZSBzZWNvbmQgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gbGludChlZGl0b3IpO1xuICAgICAgY29uc3Qgc2xEb2NVcmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL3Nhc3N0b29scy9zYXNzLWxpbnQvdHJlZS9tYXN0ZXIvZG9jcy9ydWxlcy9uby1jb2xvci1saXRlcmFscy5tZCc7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gYGhyZWY9XCIke3NsRG9jVXJsfVwiIGNsYXNzPVwiYmFkZ2UgYmFkZ2UtZmxleGlibGUgc2Fzcy1saW50XCJgO1xuICAgICAgY29uc3Qgd2FybmluZ01hcmt1cCA9IGA8YSAke2F0dHJpYnV0ZXN9Pm5vLWNvbG9yLWxpdGVyYWxzPC9hPmA7XG4gICAgICBjb25zdCB3YXJuSWQgPSAnIENvbG9yIGxpdGVyYWxzIHN1Y2ggYXMgXFwncmVkXFwnIHNob3VsZCBvbmx5IGJlIHVzZWQgaW4gdmFyaWFibGUgZGVjbGFyYXRpb25zJztcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS50eXBlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLnR5cGUpLnRvRXF1YWwoJ1dhcm5pbmcnKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5odG1sKS50b0JlRGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLmh0bWwpLnRvRXF1YWwoYCR7d2FybmluZ01hcmt1cH0ke3dhcm5JZH1gKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5maWxlUGF0aCkudG9CZURlZmluZWQoKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5maWxlUGF0aCkudG9NYXRjaCgvLitpZ25vcmVkXFwuc2NzcyQvKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5yYW5nZSkudG9CZURlZmluZWQoKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5yYW5nZS5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMV0ucmFuZ2UpLnRvRXF1YWwoW1sxLCA5XSwgWzEsIDEwXV0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnY2hlY2tzIGZhaWx1cmUuc2NzcyBhbmQnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvciA9IG51bGw7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1zYXNzLWxpbnQuY29uZmlnRmlsZScsIGNvbmZpZ0ZpbGUpO1xuICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihgJHtfX2Rpcm5hbWV9L2ZpeHR1cmVzL2ZpbGVzL2ZhaWx1cmUuc2Nzc2ApLnRoZW4ob3BlbkVkaXRvciA9PiB7XG4gICAgICAgICAgZWRpdG9yID0gb3BlbkVkaXRvcjtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kcyBub3RoaW5nIHdyb25nIHdpdGggdGhlIHZhbGlkIGZpbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGxpbnQoZWRpdG9yKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/home/junior/.atom/packages/linter-sass-lint/spec/linter-sass-lint-resolve-spec.js
