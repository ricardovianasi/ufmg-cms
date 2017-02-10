(function () {
    'use strict';

    angular
        .module('usersModule')
        .controller('UsersActionsController', UsersActionsController);

    /** ngInject */
    function UsersActionsController($routeParams,
        $log,
        UsersService,
        ResourcesService,
        PagesService,
        $uibModal,
        $scope,
        DTOptionsBuilder) {
        var vm = this;
        var userId = $routeParams.userId ? $routeParams.userId : null;

        vm.tab = 2;
        vm.user = {};
        vm.user = {};
        vm.moderators = [];
        vm.resources = [];
        vm.pages = [];
        vm.save = _save;
        vm.setTab = _setTab;
        vm.isActive = _isActive;
        vm.initPermissions = _initPermissions;
        vm.modalGetContext = _modalGetContext;

        function onInit() {
            $log.info('UsersActionsController');
        }

        function _initPermissions() {
            _getModerators();
            _getResources();
        }

        function _save(isValid) {
            if (isValid) {
                $log.info(angular.toJson(vm.user));
            }
        }

        function _setTab(tabId) {
            vm.tab = tabId;
        }

        function _isActive(tabId) {
            return vm.tab === tabId;
        }

        function _getModerators() {
            UsersService
                .getUsers()
                .then(function (res) {
                    vm.moderators = res.data.items;
                });
        }

        var count = 0;

        function _modalGetContext(context, permission) {
            switch (context) {
                case 'page':
                    openModal().result.then(function (contextPermissions) {
                        vm.user.resources_perms[context][permission] = contextPermissions;
                    });
                    break;

                default:
                    break;
            }

            if (angular.isUndefined(vm.user.resources_perms[context][permission])) {
                vm.user.resources_perms[context][permission] = '';
            }

            function openModal() {
                return $uibModal.open({
                    templateUrl: 'modules/users/users.permissions.model.html',
                    controller: 'UsersPermissionModelController',
                    controllerAs: 'vm',
                    resolve: {
                        contextPermissions: function () {
                            return vm.user.resources_perms[context][permission];
                        }
                    },
                    size: 'xl',
                });
            }
        }

        function _getResources() {
            ResourcesService
                .get()
                .then(function (res) {
                    vm.resources = res.data.items;
                });
        }

        function _getPages() {
            PagesService
                .getPages()
                .then(function (res) {
                    $log.info('Get Pages');
                    vm.pages = res.data.items;
                });
        }

        onInit();
    }
})();
