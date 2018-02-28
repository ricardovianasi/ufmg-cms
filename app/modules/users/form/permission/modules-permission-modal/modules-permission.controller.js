(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('ModulesPermissionController', ModulesPermissionController);

    /** ngInject */    
    function ModulesPermissionController(WidgetsService, PagesService, Util) {
        let vm = this;

        vm.loadMorePage = loadMorePage;
        
        activate();
        
        ////////////////

        function loadMorePage(search) {
            console.log('loadMorePage', search, vm.currentSearch, vm.countPage);
            if(search !== vm.currentSearch) {
                _initParamsSelectPage();
                vm.currentSearch = search;
            }
            vm.countPage += 1;
            let paramsHandled = _getParamsPages(vm.currentSearch, vm.countPage);
            _getPages(paramsHandled); 

        }

        function _getPages(params) {
            PagesService.getPages(params)
                .then(function(data) {
                    vm.pages = vm.pages.concat(data.data.items);
                    console.log('_getPages then', data.data.items, vm.pages);
                });
        }

        function _getParamsPages(search, countPage) {
            let params = {
                page: countPage,
                page_size: 10,
                search: search,
                order_by: {
                    field: 'title',
                    direction: 'ASC'
                }
            }
            return Util.getParams(params, 'title');
        }

        function _initParamsSelectPage() {
            vm.countPage = 0;
            vm.pages = [];
            vm.currentSearch = '';
        }

        function _initVariables() {
            vm.pageSelected;
            _initParamsSelectPage();
        }

        function activate() {
            _initVariables();
        }
    }
})();