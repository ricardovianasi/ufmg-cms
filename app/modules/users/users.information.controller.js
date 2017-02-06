(function () {
    'use strict';

    angular
        .module('usersModule')
        .controller('UsersInformationController', UsersInformationController);

    /** ngInject */
    function UsersInformationController($routeParams,
        $log,
        $scope,
        $rootScope) {
        var vm = $scope;
        var userId = $routeParams.userId ? $routeParams.userId : null;
        vm.test = vm.$parent.test;
        vm.user = {
            name: '',
            status: 1,
            isValid: false

        };

        vm.$watch('vm.user', _emitUserFromFather, true);

        function onInit() {
            $log.info('UsersInformationController');
        }

        function _emitUserFromFather(newUser, oldUser) {
            console.log(vm.formUsers.$valid);
            vm.user.isValid = vm.formUsers.$valid;
            $rootScope.$broadcast('UserChange', newUser);
        }

        onInit();
    }
})();
