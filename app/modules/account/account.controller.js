(function () {
    'use strict';

    angular
        .module('accountModule')
        .controller('AccountController', AccountController);

    /** ngInject */
    function AccountController($routeParams,
        $log,
        $filter,
        $scope,
        accountService,
        authService,
        NotificationService,
        $location,
        $rootScope) {
        var vm = $scope;
        var userId = $routeParams.userId ? $routeParams.userId : null;

        vm.account = {};
        vm.save = save;
        vm.back = back;

        function onInit() {
            $log.info('AccountController');
            if (angular.isDefined($rootScope.User)) {
                vm.account = angular.copy($rootScope.User);
            } else {
                authService
                    .account()
                    .then(function (res) {
                        vm.account = res.data;
                    });
            }
        }

        function back() {
            var back = $filter('format')('/{0}', inflection.pluralize(attrs.routeModel));
            $log.info(angular.isDefined(attrs.back), attrs.back);
            if (angular.isDefined(attrs.back)) {
                back = attrs.back;
            }
            $location.path(back);
        }

        function save(isValid) {
            if (!isValid) {
                NotificationService.error('Existem campos obrigatórios vazios ou inválidos.');
                return;
            }

            var data = {
                name: vm.account.name,
                password: vm.account.password,
                commercial_phone: vm.account.commercial_phone,
                home_phone: vm.account.home_phone,
                mobile_phone: vm.account.mobile_phone
            };

            accountService
                .edit(data, vm.account.id)
                .then(function (res) {
                    $location.path('/');
                    NotificationService.success('Perfil atualizado com sucesso!');
                }).catch(function (err) {
                    $log.error(err);
                });
        }
        onInit();
    }
})();
