(function () {
    'use strict';

    angular
        .module('usersModule')
        .controller('UsersInformationController', UsersInformationController);

    /** ngInject */
    function UsersInformationController($routeParams,
        $log,
        $scope) {
        var vm = $scope;
        vm.test = vm.$parent.test;
        vm.user = {
            name: '',
            status: 1,
            isValid: false
        };
        function onInit() {
            $log.info('UsersInformationController');
        }

        onInit();
    }
})();
