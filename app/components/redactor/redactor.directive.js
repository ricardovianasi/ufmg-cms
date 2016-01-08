;(function () {
  'use strict';

  angular
    .module('componentsModule')
    .directive('redactor', redactor);

  redactor.$inject = [
    '$timeout',
    'RedactorPluginService',
  ];

  /**
   * @param $timeout
   * @param RedactorPluginService
   *
   * @returns {{restrict: string, require: string, link: link}}
   */
  function redactor($timeout, RedactorPluginService) {
    var _options = {
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
     * @param $scope
     * @param attrs
     *
     * @private
     */
    var _applyPlugins = function ($scope, attrs) {
      angular.forEach(_options.plugins, function (plugin) {
        var pluginOptions = $scope[attrs[plugin.toLowerCase() + 'Options']] || {};

        log('_plugin opotions >>>>>_',pluginOptions);

        var pluginSource = RedactorPluginService.setPlugin(plugin, pluginOptions);

        if (pluginSource) {
          jQuery.Redactor.prototype[plugin] = function () {
            return pluginSource;
          };
        }
      });
    };

    return {
      restrict: 'A',
      require: 'ngModel',
      /**
       * @param $scope
       * @param elem
       * @param attrs
       * @param ngModel
       */
      link: function ($scope, elem, attrs, ngModel) {
        //redactor callbacks
        _options.callbacks = {
          change: function updateModel(value) {
            //$timeout to avoid $digest collision
            $timeout(function () {
              $scope.$apply(function () {
                ngModel.$setViewValue(value);
              });
            });
          }
        };

        var additionalOptions = $scope.$eval(attrs.redactor) || {};
        //as of angular.extend does not know how to treat array attributes
        var defaultPlugins = _options.plugins;

        angular.extend(_options, additionalOptions);

        if (typeof additionalOptions.plugins !== 'undefined') {
          _options.plugins = defaultPlugins.concat(additionalOptions.plugins);
        }

        _applyPlugins($scope, attrs);

        var editor;

        //$timeout to avoid $digest collision
        //call $render() to set the initial value
        $timeout(function () {
          editor = elem.redactor(_options);

          ngModel.$render();

          elem.on('remove', function () {
            elem.off('remove');
            elem.redactor('core.destroy');
          });
        });

        ngModel.$render = function () {
          if (angular.isDefined(editor)) {
            $timeout(function () {
              elem.redactor('code.set', ngModel.$viewValue || '');
              $scope.redactorLoaded = true;
            });
          }
        };
      }
    };
  }
})();
