(function () {
    'use strict';

    angular
        .module('usersModule')
        .controller('UsersPermissionModelController', UsersPermissionModelController);

    /** ngInject */
    function UsersPermissionModelController($log, DTOptionsBuilder, $window, PagesService, CourseService,
        contextPermissions, PeriodicalService, $timeout, $uibModalInstance) {

        let vm = this;
        let lengthOfDataContext = 0;
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

        vm.changeTable = _changeTables;

        function onInit() {
            $log.info('UsersPermissionModelController');
            switch (contextPermissions.context) {
                case 'page':
                    _getItems(PagesService.getPages());
                    break;
                case 'editions':
                    _getItems(PeriodicalService.getPeriodicals());
                    break;
                case 'course_graduation':
                    _getItems(CourseService.getCourses('graduation'));
                    break;
                case 'course_specialization':
                    _getItems(CourseService.getCourses('specialization'));
                    break;
                case 'course_master':
                    _getItems(CourseService.getCourses('master'));
                    break;
                case 'course_doctorate':
                    _getItems(CourseService.getCourses('doctorate'));
                    break;
                default:
                    break;
            }
        }

        function _getItems(promise) {
            promise.then(function(res) {
                _mountListPermissionContextId(res.data.items);
            });
        }

        function _cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function _save() {
            $uibModalInstance.close(_updateCustomPermission());
        }

        function _mountItem(item) {
            if(item) {
                return { id: item.id, title: item.title || item.name };
            }
            return null;
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
            lengthOfDataContext = listContext.length;
            let permissions = angular.isString(contextPermissions.valuePermission) ? contextPermissions.valuePermission : '';
            vm.deselects = [];
            vm.selecteds = listContext.filter(function(item) {
                let isSelected = permissions.includes(item.id.toString());
                if(!isSelected) {
                    vm.deselects.push(_mountItem(item));
                }
                return isSelected;
            }).map(function(item) { return _mountItem(item); });
            vm.configTableSelected.size = vm.selecteds.length;
            vm.configTableDeselected.size = vm.deselects.length;
            $timeout(function () {
                _changeTables();
            }, 100);
        }

        function _arrayRemoveItem(arr, item) {
            let idx = arr.indexOf(item);
            if(idx !== -1) {
                arr.splice(idx, 1);
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
            let array = { ids: [], data: [] };
            let contextIds = false;
            if (!vm.selecteds) {
                return [];
            }
            vm.selecteds.forEach(function (selected) {
                array.ids.push(selected.id);
                array.data.push({
                    title: selected.name || selected.title
                });
            });
            if (array.ids.length !== 0) {
                if (array.data.length === lengthOfDataContext) {
                    contextIds = true;
                } else if (array.data.length === 0) {
                    contextIds = false;
                } else {
                    contextIds = array.ids.toString();
                }
            }
            return {
                ids: contextIds,
                data: array.data
            };
        }

        onInit();
    }
})();
