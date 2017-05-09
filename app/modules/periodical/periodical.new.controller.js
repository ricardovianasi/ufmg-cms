(function () {
    'use strict';

    angular.module('periodicalModule')
        .controller('PeriodicalNewController', PeriodicalNewController);

    /** ngInject */
    function PeriodicalNewController($scope,
        $location,
        $filter,
        PeriodicalService,
        StatusService,
        NotificationService,
        MediaService,
        PermissionService,
        $rootScope,
        validationService,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('PeriodicalNewController');
        $scope.canPermission = PermissionService.canPost('periodical');
        $scope.status = [];
        $scope.periodical = {};
        $scope.highlight_ufmg_visible = false;

        StatusService.getStatus().then(function (res) {
            $scope.status = res.data;
        });

        $scope.$watch('add_photos', function () {
            if ($scope.add_photos) {
                MediaService.newFile($scope.add_photos).then(function (res) {
                    $scope.periodical.url = res.url;
                    $scope.periodical.logo = res.id;
                });
            }
        });

        var date = new Date();

        $scope.date_formats = [{
            label: $filter('format')('ano ({0})', date.getFullYear()),
            format: 'Y'
        }, {
            label: $filter('format')('mês/ano ({0}/{1})', date.getMonth() + 1, date.getFullYear()),
            format: 'm/Y'
        }, {
            label: $filter('format')(
                'dia/mês/ano ({0}/{1}/{2})',
                date.getDate(),
                date.getMonth() + 1,
                date.getFullYear()
            ),
            format: 'd/m/Y'
        }];

        $scope.removeImage = function () {
            $scope.periodical.logo = '';
            $scope.periodical.url = '';
        };

        $scope.publish = function (data) {
            if (!validationService.isValid($scope.formPeriodicals.$invalid)) {
                return false;
            }

            var _data = angular.copy(data);

            delete _data.url;

            PeriodicalService
                .newPeriodical(_data)
                .then(function () {
                    NotificationService.success('Publicação criada com sucesso.');
                    $location.path('/periodicals');
                });
        };
    }
})();
