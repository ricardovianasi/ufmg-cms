;(function () {
  'use strict';

  angular
    .module('componentsModule')
    .directive('redactor', redactor);

  redactor.$inject = [
    'RedactorPluginService',
  ];

  function redactor(RedactorPluginService) {
    /**
     * @param list
     *
     * @private
     */
    var _applyPlugins = function (list) {
      angular.forEach(list, function (value, key) {
        jQuery.Redactor.prototype[key] = function () {
          return value;
        };
      });
    };

    return {
      require: '?ngModel',
      /**
       * @param $scope
       * @param elem
       * @param attrs
       * @param controller
       */
      link: function ($scope, elem, attrs, controller) {
        var options = $scope[attrs.redactor];
        var plugins = attrs.plugins.split(',');
        var list = {};

        //
        angular.forEach(plugins, function (plugin) {
          var pluginCallback = $scope[attrs[plugin+'Callback']] || null;

          this[plugin] = RedactorPluginService.getPlugin(plugin).getOptions(pluginCallback);
        }, list);

        //
        _applyPlugins(list);

        //
        controller.$render = function () {
          console.log('...render');

          elem.redactor(options);
        };
      }
    };
  }
})();
