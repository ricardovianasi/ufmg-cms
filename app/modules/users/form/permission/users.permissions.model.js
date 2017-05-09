(function () {
    'use strict';

    angular
        .module('usersModule')
        .controller('UsersPermissionModelController', UsersPermissionModelController);

    /** ngInject */
    function UsersPermissionModelController($log,
        DTOptionsBuilder,
        $window,
        PagesService,
        CourseService,
        contextPermissions,
        PeriodicalService,
        $timeout,
        $uibModalInstance) {
        var vm = this;
        vm.heightScreen = $window.screen.availHeight * 0.78;
        vm.configTableDeselected = {};
        vm.configTableDeselected.page = 1;
        vm.configTableDeselected.size = 0;
        vm.limitTo = 10;
        vm.configTableSelected = {};
        vm.configTableSelected.page = 1;
        vm.configTableSelected.size = 0;
        vm.title = contextPermissions.title;
        vm.select = _select;
        vm.deselect = _deselect;
        vm.cancel = _cancel;
        vm.save = _save;

        vm.changeTable = function () {
            _changeTables();
        };

        function onInit() {
            $log.info('UsersPermissionModelController');
            switch (contextPermissions.context) {
                case 'page':
                    PagesService
                        .getPages()
                        .then(function (res) {
                            _mountListPermissionContextId(res.data.items);
                        });
                    break;
                case 'editions':
                    PeriodicalService
                        .getPeriodicals()
                        .then(function (res) {
                            _mountListPermissionContextId(res.data.items);
                        });
                    break;
                case 'course_graduation':
                    CourseService.getCourses('graduation').then(function (res) {
                        _mountListPermissionContextId(res.data.items);
                    });
                    break;
                case 'course_specialization':
                    CourseService.getCourses('specialization').then(function (res) {
                        _mountListPermissionContextId(res.data.items);
                    });
                    break;
                case 'course_master':
                    CourseService.getCourses('master').then(function (res) {
                        _mountListPermissionContextId(res.data.items);
                    });
                    break;
                case 'course_doctorate':
                    CourseService.getCourses('doctorate').then(function (res) {
                        _mountListPermissionContextId(res.data.items);
                    });
                    break;
                default:
                    break;
            }
        }

        function _cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function _save() {
            $uibModalInstance.close(_updateCustomPermission());
        }

        function _mountItem(item) {
            if (contextPermissions.context === 'page') {
                return {
                    id: item.id,
                    title: item.title
                };
            } else if (contextPermissions.context === 'editions') {
                return {
                    id: item.id,
                    title: item.name
                };
            } else if (contextPermissions.context.substr(0, 6) === 'course') {
                return {
                    id: item.id,
                    title: item.name
                };
            }
            return false;
        }

        function _changeTables() {
            vm.configTableDeselected.in = (vm.configTableDeselected.page * vm.limitTo) - vm.limitTo;
            vm.configTableDeselected.to = vm.configTableDeselected.page * vm.limitTo < vm.filterDataDeselected.length ?
                vm.configTableDeselected.page * vm.limitTo : vm.filterDataDeselected.length;

            vm.configTableSelected.in = (vm.configTableSelected.page * vm.limitTo) - vm.limitTo;
            vm.configTableSelected.to = vm.configTableSelected.page * vm.limitTo < vm.filterDataSelected.length ?
                vm.configTableSelected.page * vm.limitTo : vm.filterDataSelected.length;
        }

        function _mountListPermissionContextId(listContext) {
            vm.selecteds = [];
            vm.deselects = [];
            var isString = angular.isString(contextPermissions.valuePermission);
            var countIsVerify = 0;
            if (isString) {
                var arraycontextPermissions = contextPermissions.valuePermission.split(',');
                for (var i = 0; i < listContext.length; i++) {
                    var item = listContext[i];
                    for (var j = 0; j < arraycontextPermissions.length; j++) {
                        var contextId = arraycontextPermissions[j];
                        if (item.id.toString() === contextId.toString()) {
                            vm.selecteds.push(_mountItem(item));
                            listContext[i] = null;
                            countIsVerify++;
                            break;
                        }
                    }
                    if (arraycontextPermissions.length === countIsVerify) {
                        vm.configTableSelected.size = vm.selecteds.length;
                        break;
                    }
                    item = null;
                }
            }
            for (var k = 0; k < listContext.length; k++) {
                var el = listContext[k];
                if (el) {
                    vm.deselects.push(_mountItem(el));
                }
            }
            vm.configTableDeselected.size = vm.deselects.length;
            $timeout(function () {
                _changeTables();
            }, 100);
        }

        function _arrayRemoveItem(arr, item) {
            for (var i = arr.length; i--;) {
                if (arr[i] === item) {
                    arr.splice(i, 1);
                }
            }
        }

        function _deselect(item) {
            _arrayRemoveItem(vm.selecteds, item);
            vm.deselects.push(item);
            vm.configTableSelected.size = vm.selecteds.length;
            vm.configTableDeselected.size = vm.deselects.length;
            _changeTables();
        }

        function _select(item) {
            _arrayRemoveItem(vm.deselects, item);
            vm.selecteds.push(item);
            vm.configTableSelected.size = vm.selecteds.length;
            vm.configTableDeselected.size = vm.deselects.length;
            _changeTables();
        }


        function _updateCustomPermission() {
            var array = [];
            if (!vm.selecteds) {
                return [];
            }
            for (var i = 0; i < vm.selecteds.length; i++) {
                var select = vm.selecteds[i];
                array.push(select.id);
            }
            var contextIds = array.toString();
            if (!contextIds) {
                return [];
            }
            return contextIds;
        }

        onInit();
    }
})();
