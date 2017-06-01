(function () {
    'use strict';

    angular
        .module('componentsModule')
        .directive('listData', ListDataDirective);

    /** ngInject */
    function ListDataDirective() {
        return {
            restrict: 'AE',
            templateUrl: 'components/list-data/list-data.html',
            controller: ListDataCtrl,
            controllerAs: 'vm'
        };
    }

    /** ngInject */
    function ListDataCtrl($log, $scope, ListDataService, dataTableConfigService) {
        var vm = this;
        $log.info('ListDataCtrl');

        vm.title = ListDataService.get().title;

        $scope.$watch('vm.search', function () {
            getResource();
        });

        function getResource() {
            var params = dataTableConfigService.getParams({
                page: 1,
                page_size: ListDataService.get().size,
                search: vm.search,
                order_by: {
                    field: ListDataService.get().orderElement,
                    direction: 'DESC',
                }
            }, ListDataService.get().searchElement);
            ListDataService
                .get()
                .fnService(params)
                .success(function (res) {
                    vm.data = res.items;
                });
        }

    }
})();
