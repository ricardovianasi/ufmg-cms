(function () {
    'use strict';

    angular.module('clippingsModule')
        .controller('ClippingsNewController', ClippingsNewController);

    /** ngInject */
    function ClippingsNewController($scope,
        $location,
        ClippingsService,
        NotificationService,
        StatusService,
        DateTimeHelper,
        $rootScope,
        PermissionService,
        validationService,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('ClippingsNewController');

        $scope.canPermission = PermissionService.canPost('clipping');

        $scope.title = 'Nova Matéria';
        $scope.breadcrumb = $scope.title;
        $scope.clipping = {
            title: '',
            date: {
                year: (new Date()).getFullYear(),
                month: null,
                day: null
            },
            status: StatusService.STATUS_PUBLISHED,
            origin: '',
            url: ''
        };

        // Time and Date
        $scope.time_days = DateTimeHelper.getDays();
        $scope.time_months = DateTimeHelper.getMonths();
        $scope.time_years = DateTimeHelper.yearRange(5); // 5 year back and forth
        $scope.time_hours = DateTimeHelper.getHours();
        $scope.time_minutes = DateTimeHelper.getMinutes();

        $scope.publish = function (data) {
            if (!validationService.isValid($scope.formClippings.$invalid)) {
                return false;
            }

            ClippingsService.store(data).then(function () {
                NotificationService.success('Clipping criado com sucesso.');
                $location.path('/clippings');
            });
        };
    }
})();
