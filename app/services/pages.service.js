(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('PagesService', PagesService);

    /** ngInject */
    function PagesService($timeout, $log, $http, $filter, $uibModal, $q, $rootScope, apiUrl, ReleasesService,
        Util, WidgetModuleService) {

        var _parseData = function (page) {
            $log.info('parseData', page);
            var cleanPage = {};

            cleanPage.image = page.image ? page.image.id : null;
            cleanPage.status = page.status;

            cleanPage.post_date = postDateToSave(page.scheduled_date, page.scheduled_time);

            cleanPage.tags = _.map(page.tags, 'text');
            cleanPage.title = page.title;

            //@todo: change this to editable slug
            // cleanPage.slug = page.title;
            cleanPage.widgets = {
                main: [],
                side: []
            };

            // Insert each widget into main and side columns
            angular.forEach(page.widgets.main, function (widget) {
                let widgetMake = _module.makeWidget(widget);
                cleanPage.widgets.main.push(widgetMake);
            });

            angular.forEach(page.widgets.side, function (widget) {
                cleanPage.widgets.side.push(_module.makeWidget(widget));
            });

            // If we are updating the Page
            if (page.id) {
                cleanPage.id = page.id;

                delete cleanPage.created_at;
                delete cleanPage.udpated_at;
                delete cleanPage.scheduled_at;
            }

            if (page.columns === 1) {
                cleanPage.widgets.side = [];
            }
            if (page.parent) {
                cleanPage.parent = page.parent.id ? page.parent.id : page.parent;
            } else {
                cleanPage.parent = null;
            }
            cleanPage.page_type = page.page_type;
            cleanPage.slug = angular.isDefined(page.slug) ? page.slug.slug : '';

            return cleanPage;
        };

        function postDateToSave(scheduled_date, scheduled_time) {
            if (!scheduled_date) {
                return undefined;
            }
            var datePost = new Date(scheduled_date);
            var dd = datePost.getDate();
            var mm = datePost.getMonth() + 1;

            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }

            var yyyy = datePost.getFullYear();

            if (!scheduled_time) {
                var date = new Date();
                var hh = date.getHours();
                var MM = date.getMinutes();
                if (hh < 10) {
                    hh = '0' + hh;
                }
                if (MM < 10) {
                    MM = '0' + MM;
                }
                scheduled_time = hh + ':' + MM;
            }

            return dd + '/' + mm + '/' + yyyy + ' ' + scheduled_time;
        }

        var _getPages = function (params, ignoreLoadingBar) {
            if (angular.isUndefined(params)) {
                params = '';
            }
            return $http.get(apiUrl + '/page' + params, {
                ignoreLoadingBar: ignoreLoadingBar
            });
        };

        var _module = (function (_getPages, $uibModal) { // jshint ignore: line

            return {

                handle: function ($scope, column, idx) {
                    var moduleModal = $uibModal.open({
                        templateUrl: 'components/modal/module.modal.template.html',
                        controller: 'ModuleModalController',
                        controllerAs: 'ctrlModal',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            module: function () {
                                if (typeof idx !== 'undefined') {
                                    if ($scope.page) {
                                        return $scope.page.widgets[column][idx];
                                    } else {
                                        return $scope.course.widgets[column][idx];
                                    }
                                }
                                return false;
                            },
                            widgets: function () {
                                return $scope.widgets;
                            },
                        }
                    });

                    moduleModal.result.then(function (data) {
                        $log.warn('Widget pos modal', data);
                        if (typeof idx !== 'undefined') {
                            if ($scope.page) {
                                $scope.page.widgets[column][idx] = data;
                            } else {
                                $scope.course.widgets[column][idx] = data;
                            }
                        } else {
                            if ($scope.page) {
                                $scope.page.widgets[column].push(data);
                            } else {
                                $scope.course.widgets[column].push(data);
                            }
                        }
                    });
                },
                makeWidget: function (widget) {
                    var obj = {};

                    if (widget) {
                        if (widget.id) {
                            obj.id = widget.id;
                        }

                        obj.type = widget.type;
                        obj.title = widget.title;
                        angular.extend(obj, WidgetModuleService.getWidget(widget.type).parseToSave(widget));
                    }
                    return obj;
                }
            };
        })(_getPages, $uibModal);

        return {
            // Columns defaults
            COLUMNS: [{
                value: 1,
                label: '1 coluna'
            }, {
                value: 2,
                label: '2 colunas'
            }],
            getPages: _getPages,
            addPage: function (page) {
                page = _parseData(page);
                return $http.post(apiUrl + '/page', page, { ignoreLoadingBar: true });
            },
            getPage: function (id) {
                return $http.get(apiUrl + '/page/' + id);
            },
            updatePage: function (id, page) {
                page = _parseData(page);
                return $http.put(apiUrl + '/page/' + id, page, { ignoreLoadingBar: true });
            },
            removePage: function (id) {
                return $http.delete(apiUrl + '/page/' + id);
            },
            getType: function () {
                return $http.get(apiUrl + '/page/type');
            },
            module: function () {
                return _module;
            }
        };
    }
})();
