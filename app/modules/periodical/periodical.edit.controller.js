;
(function () {
    'use strict';

    angular.module('periodicalModule')
        .controller('PeriodicalEditController', PeriodicalEditController);

    /** ngInject */
    function PeriodicalEditController($scope,
        $routeParams,
        $location,
        $filter,
        PermissionService,
        PeriodicalService,
        StatusService,
        NotificationService,
        MediaService,
        DateTimeHelper,
        $rootScope,
        validationService,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('PeriodicalEditController');
        $scope.canPermission = PermissionService.canPut('periodical', $routeParams.id);
        $scope.status = [];
        $scope.highlight_ufmg_visible = false;

        StatusService.getStatus().then(function (data) {
            $scope.status = data.data;
        });

        $scope.periodical = {};

        PeriodicalService.getPeriodicals($routeParams.id).then(function (data) {
            $scope.periodical.id = data.data.id;
            $scope.periodical.name = data.data.name;
            $scope.periodical.logo = data.data.logo ? data.data.logo.id : '';
            $scope.periodical.url = data.data.logo ? data.data.logo.url : '';
            $scope.periodical.identifier = data.data.identifier;
            $scope.periodical.date = DateTimeHelper.dateToStr(data.data.date);
            $scope.periodical.date_format = data.data.date_format;
            $scope.periodical.status = data.data.status;

            var scheduled_at = DateTimeHelper.toBrStandard(data.data.scheduled_at, true, true);

            if (scheduled_at) {
                $scope.periodical.scheduled_date = scheduled_at.date;
                $scope.periodical.scheduled_time = scheduled_at.time;
            }

            $scope.$watch('add_photos', function () {
                if ($scope.add_photos) {
                    MediaService.newFile($scope.add_photos).then(function (data) {
                        $scope.periodical.url = data.url;
                        $scope.periodical.logo = data.id;
                    });
                }
            });
        });



        var date = new Date();

        $scope.date_formats = [{
                label: $filter('format')('ano ({0})', date.getFullYear()),
                format: 'Y'
            },
            {
                label: $filter('format')('mês/ano ({0}/{1})', date.getMonth() + 1, date.getFullYear()),
                format: 'm/Y'
            },
            {
                label: $filter('format')(
                    'dia/mês/ano ({0}/{1}/{2})',
                    date.getDate(),
                    date.getMonth() + 1,
                    date.getFullYear()
                ),
                format: 'd/m/Y'
            }
        ];

        $scope.removeImage = function () {
            $scope.periodical.logo = '';
            $scope.periodical.url = '';
        };

        $scope.publish = function (data) {
            if (!validationService.isValid($scope.formPeriodicals.$invalid))
                return false;

            var _data = angular.copy(data);

            _data.scheduled_at = data.scheduled_date + ' ' + data.scheduled_time;

            delete _data.url;
            delete _data.scheduled_date;
            delete _data.scheduled_time;

            PeriodicalService.updatePeriodical($routeParams.id, _data).then(function (data) {
                NotificationService.success('Publicação atualizada com sucesso.');
                $location.path('/periodicals');
            });
        };

    }
})();
