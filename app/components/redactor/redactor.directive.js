;(function () {
  'use strict';

  angular
    .module('componentsModule')
    .directive('redactor', redactor);

  redactor.$inject = [
    '$timeout',
    'RedactorPluginService',
  ];

  function redactor($timeout, RedactorPluginService) {
    var _defaultOptions = {
      lang: 'pt_br',
      plugins: ['video', 'soundcloud'],
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
        if (value) {
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
          var pluginOptions = $scope[attrs[plugin + 'Options']] || {};

          list[plugin] = RedactorPluginService.setPlugin(plugin, pluginOptions);
        });

        _applyPlugins(list);

        //redactor callbacks
        options.callbacks = {
          change: function updateModel(value) {
            //$timeout to avoid $digest collision
            $timeout(function () {
              $scope.$apply(function () {
                controller.$setViewValue(value);
              });
            });
          }
        };

        var editor;

        //$timeout to avoid $digest collision
        //call $render() to set the initial value
        $timeout(function () {
          options.plugins = options.plugins.concat(plugins);

          editor = elem.redactor(options);

          controller.$render();

          elem.on('remove', function () {
            elem.off('remove');
            elem.redactor('core.destroy');
          });
        });

        controller.$render = function () {
          if (angular.isDefined(editor)) {
            $timeout(function () {
              elem.redactor('code.set', controller.$viewValue || '');
              elem.redactor('placeholder.toggle');
              $scope.redactorLoaded = true;
            });
          }
        };
      }
    };
  }
})();
