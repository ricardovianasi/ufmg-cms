;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('RedactorPluginService', RedactorPluginService);

  RedactorPluginService.$inject = [
    '$uibModal',
  ];

  function RedactorPluginService($uibModal) {
    console.log('... RedactorPluginService');

    var _plugin = '';

    var _options = {
      /**
       * @param callback
       *
       * @returns {{init: init, showEdit: showEdit, show: show}}
       */
      imagencrop: function (callback) {
        return {
          init: function () {
            var button = this.button.add('imagencrop', 'Image-N-Crop');

            this.button.addCallback(button, this.imagencrop.show);
            this.button.setIcon(button, '<i class="fa-picture-o"></i>');
          },
          showEdit: function ($image) {
            console.log('show edit', $image);
          },
          show: function () {
            var _this = this;

            _this.selection.save();

            var moduleModal = $uibModal.open({
              templateUrl: 'components/modal/upload-component.template.html',
              controller: 'UploadComponentController as vm',
              backdrop: 'static',
              size: 'xl'
            });

            // Insert into textarea
            moduleModal.result.then(function (data) {
              if (callback) {
                callback(_this, data);
              }
            });
          }
        };
      }
    };

    return {
      /**
       * @param plugin
       *
       * @returns {getPlugin}
       */
      getPlugin: function (plugin) {
        _plugin = plugin;

        return this;
      },
      /**
       * @param callback
       *
       * @returns {*}
       */
      getOptions: function (callback) {
        return _options[_plugin] ? _options[_plugin](callback) : null;
      }
    };
  }
})();
