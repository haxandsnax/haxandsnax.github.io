var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var ChannelChats = function () {






  function ChannelChats(channels) {var _this = this;_classCallCheck(this, ChannelChats);this.chatRows = [];this.darkMode = true;this.wrapper = $('.chats-wrapper');this.query = '';this.editMode = false;
    rows = channels || location.search.
    slice(1).
    split('&').
    filter(function (g) {
      if (g == 'light=true') {
        _this.darkMode = false;
        _this.wrapper.addClass('light-mode');
        return false;
      }
      return g && g.length;
    }).
    map(function (g) {return g.split(',');});

    if (location.hash == '#edit') {
      this.editMode = true;
      this.wrapper.addClass('edit-mode');
    }
    rows.forEach(function (r) {
      var match = /^\[(\d+)\]/.exec(r[0]);
      var rowSize = 100;
      if (match != null) {
        r[0] = r[0].replace(match[0], '');
        rowSize = parseInt(match[1]) || 100;
      }
      _this.chatRows.push({ size: rowSize, chats: r.map(function (c) {
          var data = c.split('.');
          var chat = { name: data[0], element: _this.createChat(data[0]) };
          chat.size = parseInt(data[1]) || 100;
          chat.element[0].style.flex = chat.size;
          return chat;
        }) });
    });

    if (this.chatRows.length) {
      this.loadAllChats();
      this.calculateWindowCodes();
    }

    $(window).on('hashchange', function (e) {
      if (location.hash == '#edit') {
        _this.wrapper.addClass('edit-mode');
      } else if (_this.wrapper.hasClass('edit-mode')) {
        _this.closeEditMode();
      }
    });
  }_createClass(ChannelChats, [{ key: 'closeEditMode', value: function closeEditMode()

    {
      this.calculateWindowCodes();
      prompt('Copy this link to retain settings', location.protocol + '//' + location.host + location.pathname + '?' + this.query);
      this.editMode = false;
      this.wrapper.removeClass('edit-mode');
    } }, { key: 'createChat', value: function createChat(


    c) {
      var chat = $('<div class="chat"><div class="chat-name">' + c + '</div><iframe src="https://twitch.tv/embed/' + c + '/chat?parent=haxandsnax.github.io' + (this.darkMode ? '&darkpopout' : '') + '"></iframe></div>');
      return chat;
    } }, { key: 'createColumnSeparator', value: function createColumnSeparator(

    row, colLeft, colRight) {var _this2 = this;
      var sep = $('<div class="chat-col-separator" title="Double click to close edit mode" draggable="true" />');
      sep.on('dragend', function (e) {
        var flex = _.sumBy(row.chats, 'size');
        var winWidth = window.innerWidth;
        var flexDifference = e.offsetX / winWidth * flex;
        row.chats[colLeft].size += Math.round(flexDifference);
        row.chats[colRight].size -= Math.round(flexDifference);
        row.chats[colLeft].element[0].style.flex = row.chats[colLeft].size;
        row.chats[colRight].element[0].style.flex = row.chats[colRight].size;

        _this2.calculateWindowCodes();
      });

      sep.on('dblclick', function (e) {
        _this2.closeEditMode();
      });
      return sep;
    } }, { key: 'createRowSeparator', value: function createRowSeparator(

    rowAbove, rowBelow) {var _this3 = this;
      var sep = $('<div class="chat-row-separator" title="Double click to close edit mode" draggable="true" />');
      sep.on('dragend', function (e) {
        var flex = _.sumBy(_this3.chatRows, 'size');
        var winHeight = window.innerHeight;
        var flexDifference = e.offsetY / winHeight * flex;
        _this3.chatRows[rowAbove].size += Math.round(flexDifference);
        _this3.chatRows[rowBelow].size -= Math.round(flexDifference);
        _this3.chatRows[rowAbove].element[0].style.flex = _this3.chatRows[rowAbove].size;
        _this3.chatRows[rowBelow].element[0].style.flex = _this3.chatRows[rowBelow].size;

        _this3.calculateWindowCodes();
      });
      sep.on('dblclick', function (e) {
        _this3.closeEditMode();
      });
      return sep;
    } }, { key: 'calculateWindowCodes', value: function calculateWindowCodes()

    {
      var names = [];
      var query = this.chatRows.map(function (r) {
        return '[' + r.size + ']' + r.chats.map(function (c) {
          names.push(c.name);
          return c.name + '.' + c.size;
        }).join(',');
      }).join('&');

      var nameStr = names = names.slice(0, 4).join(', ');
      if (names.length > 4)
      nameStr += ' +' + (names.length - 4) + ' more';
      this.query = query;
      window.history.pushState({}, nameStr, '?' + query + (this.editMode ? '#edit' : ''));
    } }, { key: 'loadAllChats', value: function loadAllChats()

    {var _this4 = this;

      this.chatRows.forEach(function (row, rowIndex) {
        if (rowIndex > 0) {
          _this4.createRowSeparator(rowIndex - 1, rowIndex).appendTo(_this4.wrapper);
        }
        var rowEl = row.element = $('<div class="chat-row" />').appendTo(_this4.wrapper);
        rowEl[0].style.flex = row.size;

        row.chats.forEach(function (r, i) {
          if (i > 0) {
            _this4.createColumnSeparator(row, i - 1, i).appendTo(rowEl);
          }
          r.element.appendTo(rowEl);

        });
      });
    } }]);return ChannelChats;}();



$(document).ready(function () {
  var channelChats = new ChannelChats();

});
