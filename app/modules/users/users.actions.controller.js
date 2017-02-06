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
        PagesService) {
        var vm = this;
        var userId = $routeParams.userId ? $routeParams.userId : null;

        vm.tab = 2;
        vm.user = {};
        vm.save = _save;
        vm.setTab = _setTab;
        vm.isActive = _isActive;
        vm.initPermissions = _initPermissions;
        vm.user = {};
        vm.moderators = [];
        vm.resources = [];
        vm.pages = [];
        vm.log = $log.info;

        function onInit() {
            $log.info('UsersActionsController');
        }

        function _initPermissions() {
            _getModerators();
            _getResources();
            _getPages();
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
                    console.log('"Users: "', angular.toJson(res.data));
                    vm.moderators = res.data.items;
                });
        }

        function _getResources() {
            ResourcesService
                .get()
                .then(function (res) {
                    console.log('"Resource: "', angular.toJson(res.data));
                    vm.resources = res.data.items;
                });
        }

        function _getPages() {
            PagesService
                .getPages()
                .then(function (res) {
                    console.log('"Context": ', angular.toJson(res.data));
                    vm.pages = res.data.items;
                });
        }

        onInit();
    }
})();
