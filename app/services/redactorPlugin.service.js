;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('RedactorPluginService', RedactorPluginService);

  RedactorPluginService.$inject = [
    'ModalService',
  ];

  /**
   * @param ModalService
   *
   * @returns {{setPlugin: setPlugin, getOptions: getOptions}}
   *
   * @constructor
   */
  function RedactorPluginService(ModalService) {
    console.log('... RedactorPluginService');

    /**
     * @param redactor
     * @param {string} template
     * @param {object} obj
     *
     * @private
     */
    var _insertItemOnEditor = function (redactor, template, obj) {
      var html = _.template($(template).html());

      redactor.selection.restore();
      redactor.insert.raw(html(obj));
    };

    /**
     * @type {{imagencrop: _plugins.imagencrop, audioUpload: _plugins.audioUpload}}
     *
     * @private
     */
    var _plugins = {
      /**
       * @param {Object} options
       *
       * @returns {{init: init, show: show}}
       */
      imagencrop: function (options) {
        return {
          init: function () {
            var button = this.button.add('imagencrop', 'Inserir Imagem');

            this.button.addCallback(button, this.imagencrop.show);
            this.button.setIcon(button, '<i class="fa-picture-o"></i>');
          },
          show: function () {
            var _this = this;

            _this.selection.save();

            ModalService
              .uploadImage({
                formats: function () {
                  return options.formats || null;
                }
              })
              .result
              .then(function (data) {
                // Insert into textarea
                if (options.callback) {
                  options.callback.call(null, _this, data);
                }
              });
          }
        };
      },
      /**
       * @param options
       *
       * @returns {{init: init, show: show}}
       */
      audioUpload: function (options) {
        return {
          init: function () {
            var button = this.button.add('audioUpload', 'Inserir Áudio');

            this.button.addCallback(button, this.audioUpload.show);
            this.button.setIcon(button, '<i class="fa-file-audio-o"></i>');
          },
          show: function () {
            var _this = this;

            _this.selection.save();

            ModalService
              .uploadAudio()
              .result
              .then(function (data) {
                if (options.callback) {
                  options.callback.call(null, _this, data);
                }
              });
          }
        };
      }
    };

    /**
     * @type {{imagencrop: {callback: _options.imagencrop.callback}, audioUpload: {callback: _options.audioUpload.callback}}}
     *
     * @private
     */
    var _options = {
      imagencrop: {
        /**
         * @param redactor
         * @param data
         */
        callback: function (redactor, data) {
          var imgObj = {
            url: data.url,
            legend: data.legend ? data.legend : '',
            author: data.author ? data.author : ''
          };

          _insertItemOnEditor(redactor, '#redactor-template-figure-' + data.type, imgObj);
        }
      },
      audioUpload: {
        /**
         * @param redactor
         * @param data
         */
        callback: function (redactor, data) {
          _insertItemOnEditor(redactor, '#redactor-template-audio', data);
        }
      }
    };

    return {
      /**
       * @param {string} plugin
       * @param {Object} options
       *
       * @returns {*}|{null}
       */
      setPlugin: function (plugin, options) {
        return _plugins[plugin] ? _plugins[plugin](options) : null;
      },
      /**
       * @param {string} plugin
       *
       * @returns {*|{}}
       */
      getOptions: function (plugin) {
        return _options[plugin] || {};
      }
    };
  }
})();
