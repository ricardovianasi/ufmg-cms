;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('RedactorPluginService', RedactorPluginService);

  RedactorPluginService.$inject = [
    '$uibModal',
  ];

  function RedactorPluginService($uibModal) {
    console.log('... RedactorPluginService');

    var _plugins = {
      /**
       * @param {Object} options
       *
       * @returns {{init: init, show: show}}
       */
      imagencrop: function (options) {
        return {
          init: function () {
            var button = this.button.add('imagencrop', 'Image-N-Crop');

            this.button.addCallback(button, this.imagencrop.show);
            this.button.setIcon(button, '<i class="fa-picture-o"></i>');
          },
          show: function () {
            var _this = this;

            _this.selection.save();

            var moduleModal = $uibModal.open({
              templateUrl: 'components/modal/upload-component.template.html',
              controller: 'UploadComponentController as vm',
              backdrop: 'static',
              size: 'xl',
              resolve: {
                formats: function () {
                  return options.formats || null;
                }
              }
            });

            // Insert into textarea
            moduleModal.result.then(function (data) {
              if (options.callback) {
                options.callback.call(null, _this, data);
              }
            });
          }
        };
      },
      audioUpload: function(options){
        return {
          init: function () {
            var button = this.button.add('imagencrop', 'Image-N-Crop');

            this.button.addCallback(button, this.audioUpload.show);
            this.button.setIcon(button, '<i class="fa-file-audio-o"></i>');
          },
          show: function () {
            var _this = this;

            _this.selection.save();

            var moduleModal = $uibModal.open({
              templateUrl: 'components/modal/audio-upload-component.template.html',
              controller: 'AudioUploadComponentController as vm',
              backdrop: 'static',
              size: 'xl',
              resolve: {
                formats: function () {
                  return options.formats || null;
                }
              }
            });

            // Insert into textarea
            moduleModal.result.then(function (data) {
              if (options.callback) {
                options.callback.call(null, _this, data);
              }
            });
          }
        };
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
      }
    };
  }
})();
