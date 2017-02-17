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
        $uibModalInstance) {
        var vm = this;
        vm.heightScreen = $window.screen.availHeight * 0.78;
        vm.configTable = {};
        vm.configTable.page = 1;
        vm.configTable.limitTo = 10;
        vm.title = contextPermissions.title;
        vm.select = _select;
        vm.deselect = _deselect;
        vm.cancel = _cancel;
        vm.save = _save;

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

        function _select(item) {
            _arrayRemoveItem(vm.deselects, item);
            vm.selecteds.push(item);
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
                        break;
                    }
                }
            }
            for (var i = 0; i < listContext.length; i++) {
                var item = listContext[i];
                if (item) {
                    vm.deselects.push(_mountItem(item));
                }
            }
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
                return ["PUT"];
            }
            return contextIds;
        }

        onInit();
    }
})();
