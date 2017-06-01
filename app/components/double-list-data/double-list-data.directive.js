(function () {
    'use strict';

    angular
        .module('componentsModule')
        .directive('doubleListData', DoubleListDataDirective);

    /** ngInject */
    function DoubleListDataDirective() {
        return {
            restrict: 'AE',
            templateUrl: 'components/double-list-data/double-list-data.html',
            controller: DoubleListDataCtrl
        };
    }

    /** ngInject */
    function DoubleListDataCtrl($log,
        DTOptionsBuilder,
        $window,
        PagesService,
        CourseService,
        PeriodicalService,
        $timeout,
        $scope) {
        var vm = $scope;
        vm.heightScreen = $window.screen.availHeight * 0.78;
        vm.filterDataDeselected = [];
        vm.configTableDeselected = {};
        vm.configTableDeselected.page = 1;
        vm.configTableDeselected.size = 0;
        vm.limitTo = 10;
        vm.configTableSelected = {};
        vm.configTableSelected.page = 1;
        vm.configTableSelected.size = 0;
        vm.title = 'TESTE';
        vm.select = _select;
        vm.deselect = _deselect;

        vm.changeTable = function () {
            _changeTables();
        };

        function onInit() {
            $log.info('DoubleListDataCtrl');
            PagesService
                .getPages()
                .then(function (res) {
                    _mountListPermissionContextId(res.data.items);
                });
        }

        function _mountItem(item) {
            return {
                id: item.id,
                title: item.title || item.name
            };
        }

        function _changeTables() {
            vm.configTableDeselected.in = (vm.configTableDeselected.page * vm.limitTo) - vm.limitTo;
            vm.configTableDeselected.to = vm.configTableDeselected.page * vm.limitTo < vm.filterDataDeselected.length ?
                vm.configTableDeselected.page * vm.limitTo :
                vm.filterDataDeselected.length;

            vm.configTableSelected.in = (vm.configTableSelected.page * vm.limitTo) - vm.limitTo;
            vm.configTableSelected.to = vm.configTableSelected.page * vm.limitTo < vm.filterDataSelected.length ?
                vm.configTableSelected.page * vm.limitTo :
                vm.filterDataSelected.length;
        }

        var haveSelected = [];

        function _mountListPermissionContextId(listContext) {
            vm.selecteds = [];
            vm.deselects = [];
            var isString = angular.isString(haveSelected);
            var countIsVerify = 0;
            if (isString) {
                var arraycontextPermissions = haveSelected.split(',');
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
                }
            }
            for (var k = 0; k < listContext.length; k++) {
                if (listContext[k]) {
                    vm.deselects.push(_mountItem(listContext[k]));
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

        onInit();
    }
})();
