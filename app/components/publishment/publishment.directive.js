(function () {
    'use strict';

    angular.module('componentsModule')
        .directive('publishmentOptions', PublishmentOptions);

    /** ngInject */
    function PublishmentOptions($location, $filter, StatusService, $log) {
        return {
            restrict: 'E',
            templateUrl: 'components/publishment/publishment.template.html',
            scope: {
                obj: '=routeModel',
                publishMethod: '=?publishMethod'
            },
            link: linkController
        };

        function linkController($scope, element, attrs) {
            $log.info('PublishmentDirective');

            $scope.obj = $scope.$parent.$eval(attrs.routeModel);
            $scope.publish = $scope.$parent.publish || $scope.publishMethod;
            $scope.remove = $scope.$parent.remove;
            $scope.statuses = [];
            $scope.saveDraft = _saveDraft;
            $scope.status = _status;
            $scope.back = _back;

            StatusService
                .getStatus()
                .then(function (data) {
                    $scope.statuses = data.data;
                });


            function _saveDraft($event) {
                $event.stopPropagation();
                $scope.obj.status = StatusService.STATUS_DRAFT;
                $scope.obj.saveDraftClicked = true;
                $scope.publish($scope.obj);
            }

            function _status(status) {
                $log.info('Status: ', status);
                if (status !== StatusService.STATUS_PUBLISHED) {
                    if (!$scope.isScheduled && status === StatusService.STATUS_SCHEDULED) {
                        $scope.obj.status = StatusService.STATUS_PUBLISHED;
                        $scope.obj.scheduled_date = '';
                        $scope.obj.scheduled_time = '';
                    } else if ($scope.isScheduled) {
                        $scope.obj.status = StatusService.STATUS_SCHEDULED;
                    } else {
                        $scope.obj.status = status;
                    }
                    $log.info('objeto status: ', $scope.obj.status);
                } else {
                    if ($scope.obj.scheduled_date === '' && $scope.obj.scheduled_time === '') {
                        $scope.obj.status = StatusService.STATUS_PUBLISHED;
                    } else {
                        $scope.obj.scheduled_date = '';
                        $scope.obj.scheduled_time = '';
                        $scope.obj.status = StatusService.STATUS_PUBLISHED;
                    }
                }
                $log.info('objeto status salvo: ', $scope.obj.status);
            }

            function _back() {
                var back = $filter('format')('/{0}', inflection.pluralize(attrs.routeModel)); // jshint ignore: line
                $log.info(angular.isDefined(attrs.back), attrs.back);
                if (angular.isDefined(attrs.back)) {
                    back = attrs.back;
                }
                $location.path(back);
            }
        }
    }
})();
