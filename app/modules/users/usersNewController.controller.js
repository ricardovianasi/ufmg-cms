(function () {
    'use strict';

    angular
        .module('usersModule')
        .controller('UsersNewController', UsersNewController);

    /** ngInject */
    function UsersNewController($rootScope,
        UsersService,
        ResourcesService,
        $routeParams,
        $location,
        $timeout,
        $scope,
        NotificationService,
        PagesService,
        PeriodicalService,
        CourseService,
        validationService,
        $log) {

        var vm = this;
        var id = $routeParams.userId;

        vm.save = _save;
        vm.getPeriodicals = _getPeriodicals;
        vm.getPages = _getPages;
        vm.getGraduation = _getGraduation;
        vm.getMaster = _getMaster;
        vm.getDoctorate = _getDoctorate;
        vm.getSpecialization = _getSpecialization;
        vm.setTab = _setTab;
        vm.isSet = _isSet;

        function onInit() {
            $log.info('UsersNewController');
            $rootScope.shownavbar = true;
            vm.tab = 1;
            vm.user = {
                name: '',
                email: '',
                site: '',
                commercial_phone: '',
                home_phone: '',
                mobile_phone: '',
                unit: '',
                sector: '',
                occupation: '',
                function: '',
                status: '1'
            };
            _getUser();
            _getPerms();
            ////////////Users service to populate Moderator Select
            UsersService.getUsers().then(function (data) {
                vm.users = data.data.items;
            });
            vm.getPages();
            // vm.getPeriodicals();
            // vm.getGraduation();
            // vm.getMaster();
            // vm.getDoctorate();
            // vm.getSpecialization();
        }

        function _setTab(tabId) {
            vm.tab = tabId;
        }

        function _isSet(tabId) {
            return vm.tab === tabId;
        }

        function _getUser() {
            if (id) {
                UsersService.getUser(id).then(function (data) {
                    vm.user = data.data;
                    _convertPrivilegesToLoad();
                });
            }
        }

        function _getPerms() {
            ResourcesService.get().then(function (data) {
                vm.resources = data.data.items;
            });
        }

        //Periodical Editions
        function _getPeriodicals() {
            PeriodicalService.getPeriodicals().then(function (data) {
                vm.periodicals = data.data.items;
            });
        }

        //Pages
        function _getPages() {
            PagesService
                .getPages()
                .then(function (data) {
                    vm.pagesParent = data.data.items;
                });
        }

        //Courses - Graduation, Master, Doctorate, Specialization
        function _getGraduation() {
            CourseService.getCourses('graduation').then(function (data) {
                vm.courses_g = data.data.items;
            });
        }

        function _getMaster() {
            CourseService.getCourses('master').then(function (data) {
                vm.courses_m = data.data.items;
            });
        }

        function _getDoctorate() {
            CourseService.getCourses('doctorate').then(function (data) {
                vm.courses_d = data.data.items;
            });
        }

        function _getSpecialization() {
            CourseService.getCourses('specialization').then(function (data) {
                vm.courses_s = data.data.items;
            });
        }
        ////////////Function to convert perms to Load

        function _convertPrivilegesToLoad() {
            var convertedPerms = {};
            var permsToConvert = vm.user.resources_perms;
            Object.keys(permsToConvert).forEach(function (key) {
                permsToConvert[key].split(";").forEach(function (value) {

                    var item = value.split(":");
                    var permsToConvert = convertedPerms[key] || {};

                    if (item.length > 1) {
                        //permsToConvert[item[0]] = isNaN(Number(item[1])) ? item[1] : Number(item[1]);
                        permsToConvert[item[0]] = item[1];
                        convertedPerms[key] = permsToConvert;
                    } else {
                        permsToConvert[item[0]] = [item[0]];
                        convertedPerms[key] = permsToConvert;
                    }
                });
            });
            vm.user.resources_perms = convertedPerms;
        }
        ////////////Function to clone perms Object and parse to save
        function _convertPrivilegesToSave() {
            console.log(angular.toJson(vm.user));
            // recursive function to clone an object. If a non object parameter
            // is passed in, that parameter is returned and no recursion occurs.
            function cloneObject(obj) {
                if (obj === null || typeof obj !== 'object') {
                    return obj;
                }
                var temp = obj.constructor(); // give temp the original obj's constructor
                for (var key in obj) {
                    temp[key] = cloneObject(obj[key]);
                }
                return temp;
            }
            var clonedPerms = (cloneObject(vm.user.resources_perms));
            Object.keys(clonedPerms).forEach(function (k) {
                var innerKeys = Object.keys(clonedPerms[k]),
                    items = [];
                innerKeys.forEach(function (key) {
                    items.push((Array.isArray(clonedPerms[k][key])) ? key : key + ":" + clonedPerms[k][key]);
                });
                clonedPerms[k] = items.join(";");
            });

            vm.user.permissions = clonedPerms;
            console.log(angular.toJson(vm.user));
        }

        function _save() {
            if (!validationService.isValid($scope.formUsers.$invalid)) {
                return false;
            }

            _convertPrivilegesToSave();

            if (id) {
                UsersService.updateUser(vm.user).then(function () {
                    $location.path('/users');
                    NotificationService.success('Usuário alterado com sucesso!');
                });
            } else {
                UsersService.saveUser(vm.user).then(function () {
                    $location.path('/users');
                    NotificationService.success('Usuário salvo com sucesso!');
                });
            }
        }
        onInit();
    }

})();
