(function () {
    'use strict';

    angular.module('clippingsModule')
        .controller('ClippingsNewController', ClippingsNewController);

    /** ngInject */
    function ClippingsNewController(
        $scope,
        $location,
        ClippingsService,
        NotificationService,
        StatusService,
        DateTimeHelper,
        $rootScope,
        PermissionService,
        validationService,
        HandleChangeService,
        $log
    ) {
        $log.info('ClippingsNewController');
        var vm = $scope;

        vm.canPermission = PermissionService.canPost('clipping');

        HandleChangeService.registerHandleChange('/clipping', ['POST'], $scope, ['clipping']);

        vm.title = 'Nova Matéria';
        vm.breadcrumb = vm.title;
        vm.clipping = {
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
        vm.time_days = DateTimeHelper.getDays();
        vm.time_months = DateTimeHelper.getMonths();
        vm.time_years = DateTimeHelper.yearRange(5); // 5 year back and forth
        vm.time_hours = DateTimeHelper.getHours();
        vm.time_minutes = DateTimeHelper.getMinutes();

        vm.publish = function (data) {
            if (!validationService.isValid(vm.formData.$invalid)) {
                return false;
            }

            vm.isLoading = true;
            ClippingsService.store(data).then(function () {
                NotificationService.success('Clipping criado com sucesso.');
                $location.path('/clipping');
            }).catch(console.error)
            .then(function() { vm.isLoading = false; });
        };
    }
})();
