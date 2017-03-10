(function () {
    'use strict';

    angular.module('componentsModule')
        .directive('redactor', Redactor);

    /** ngInject */
    function Redactor($timeout, lodash, RedactorPluginService, $log) {
        $log.info('RedactorDirective');
        var _ = lodash;

        var _applyPlugins = function ($scope, plugins, attrs) {
            angular.forEach(plugins, function (plugin) {
                var pluginOptions = $scope[attrs[plugin.toLowerCase() + 'Options']] || {};
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
            link: function ($scope, elem, attrs, ngModel) {
                var _options = {
                    lang: 'pt_br',
                    plugins: ['video', 'soundcloud', 'uploadfiles', 'imagencrop', 'audioUpload'],
                    buttons: [
                        'html',
                        'format',
                        'bold',
                        'italic',
                        'link',
                        'file'
                    ],
                    tabKey: false,
                    pastePlainText: true,
                    pasteImages: false,
                    pasteLinks: false,
                    maxHeight: 500,
                    formatting: ['p', 'blockquote'],
                    formattingAdd: {
                        'red-p-add': {
                            title: '<i class="fa fa-text-height"></i> Subtítulo',
                            args: ['h3', 'class', 'news__subtitle', 'toggle']
                        }
                    },
                    linkTooltip: true,
                    callbacks: {
                        change: function updateModel(value) {
                            //$timeout to avoid $digest collision
                            $timeout(function () {
                                $scope.$apply(function () {
                                    ngModel.$setViewValue(value);
                                });
                            });
                        },
                        init: function () {
                            this.code.get();
                            setTimeout(function () {
                                $(".fig-delete").on('click', function (event) {
                                    event.preventDefault();
                                    $(this).parent('figure').remove();
                                });
                            }, 2000);
                        }
                    }
                };

                var additionalOptions = $scope.$eval(attrs.redactor) || {};

                angular.extend(_options, additionalOptions);

                if (additionalOptions.plugins !== false) {
                    var defaultPlugins = _options.plugins;

                    if (typeof additionalOptions.plugins !== 'undefined') {
                        _options.plugins = defaultPlugins.concat(additionalOptions.plugins);
                    }

                    _options.plugins = _.uniq(_options.plugins);

                    _applyPlugins($scope, _options.plugins, attrs);
                } else {
                    delete _options.plugins;
                }

                var editor;

                $timeout(function timeout() {
                    editor = elem.redactor(_options);

                    ngModel.$render();

                    elem.on('remove', function on() {
                        elem.off('remove');
                        elem.redactor('core.destroy');
                    });
                }, 500);

                ngModel.$render = function render() {
                    if (angular.isDefined(editor)) {
                        $timeout(function timeoutRender() {
                            elem.redactor('code.set', ngModel.$viewValue || '');

                            $scope.redactorLoaded = true;
                        }, 500);
                    }
                };
            }
        };
    }
})();
