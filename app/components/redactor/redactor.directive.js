;(function () {
  'use strict';

  angular
    .module('componentsModule')
    .directive('redactor', redactor);

  redactor.$inject = [
    'RedactorPluginService',
    'lodash'
  ];

  function redactor(RedactorPluginService, _) {
    var _defaultOptions = {
      lang: 'pt_br',
      plugins: [],
      buttons: [
        'html',
        'format',
        'bold',
        'italic',
        'link',
        'file'
      ],
      tabKey: false
    };

    /**
     * Apply plugins on Redactor according to directive attribute
     *
     * @param list
     *
     * @private
     */
    var _applyPlugins = function (list) {
      angular.forEach(list, function (value, key) {
        if(value){
          jQuery.Redactor.prototype[key] = function () {
            return value;
          };
        }
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
        var options = angular.extend($scope[attrs.redactor] || {}, _defaultOptions);
        var plugins = attrs.plugins ? attrs.plugins.split(',') : [];
        var list = {};

        //look for plugins set on directive
        angular.forEach(plugins, function (plugin) {
          var pluginCallback = $scope[attrs[plugin+'Callback']] || null;

          list[plugin] = RedactorPluginService.getPlugin(plugin).getOptions(pluginCallback);
        });

        _applyPlugins(list);

        //
        controller.$render = function () {
          console.log('...render');

          angular.extend(options.plugins, plugins);
          //add buttons according to plugins
          options.buttons.concat(plugins);

          elem.redactor(options);
        };
      }
    };
  }
})();
