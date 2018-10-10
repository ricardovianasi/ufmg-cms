(function () {
    'use strict';

    angular
        .module('clippingsModule')
        .controller('ClippingsEditController', ClippingsEditController);

    /** ngInject */
    function ClippingsEditController(
        $scope,
        $location,
        $routeParams,
        $filter,
        ClippingsService,
        PermissionService,
        NotificationService,
        DateTimeHelper,
        validationService
    ) {

        var vm = $scope;

        vm.title = 'Editar Clipping: ';
        vm.breadcrumb = vm.title;
        vm.clipping = {};
        vm.canPermission = PermissionService.canPut('clipping', $routeParams.id);
        // Time and Date
        vm.time_days = DateTimeHelper.getDays();
        vm.time_months = DateTimeHelper.getMonths();
        vm.time_years = ['2015', '2016', '2017'];
        vm.time_hours = DateTimeHelper.getHours();
        vm.time_minutes = DateTimeHelper.getMinutes();

        ClippingsService.getClipping($routeParams.id).then(function (data) {
            var clipping = data.data;
            clipping.date = {
                year: $filter('date')(data.data.date, 'yyyy'),
                month: $filter('date')(data.data.date, 'MM'),
                day: $filter('date')(data.data.date, 'dd')
            };

            vm.clipping = clipping;
            vm.title += clipping.title;
        });

        vm.publish = function (data) {
            if (!validationService.isValid(vm.formData.$invalid)) {
                return false;
            }
            vm.isLoading = true;
            ClippingsService.update(data, $routeParams.id).then(function () {
                NotificationService.success('Clipping salvo com sucesso.');
                $location.path('/clipping');
                vm.isLoading = false;
            }).catch(console.error)
            .then(function () {
                vm.isLoading = false;
            });
        };
    }
})();
