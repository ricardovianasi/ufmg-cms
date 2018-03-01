(function() {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('componentsModule')
        .component('selectPagesComponent', {
            templateUrl: 'components/select-pages-component/select-pages-component.html',
            controller: SelectPagesController,
            controllerAs: 'ctrlSelectPage',
            bindings: {
                pageSelected: '=',
                placeholder: '@',
                title: '@'
            },
        });

    /** ngInject */
    function SelectPagesController(PagesService, Util) {
        let ctrl = this;

        ctrl.loadMorePage = loadMorePage;

        ////////////////

        function loadMorePage(search) {
            if(search !== ctrl.currentSearch) {
                _initParamsSelectPage();
                ctrl.currentSearch = search;
            }
            if(ctrl.isAllLoaded) {
                return;
            }
            ctrl.countPage += 1;
            let paramsHandled = _getParamsPages(ctrl.currentSearch, ctrl.countPage);
            _getPages(paramsHandled); 
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

        function _getPages(params) {
            PagesService.getPages(params)
                .then(function(data) {
                    ctrl.pages = ctrl.pages.concat(data.data.items);
                    ctrl.isAllLoaded = ctrl.pages.length >= data.data.total;
                });
        }

        function _initParamsSelectPage() {
            ctrl.countPage = 0;
            ctrl.pages = [];
            ctrl.currentSearch = '';
            ctrl.isAllLoaded = false;
        }

        function _initParams() {
            ctrl.titleDefault = ctrl.title || 'Selecione uma página...';
            ctrl.placeHolderDefault = ctrl.placeholder || 'Procure uma página...';
        }

        ctrl.$onInit = function() {
            _initParamsSelectPage();
            _initParams();
        };
        ctrl.$onChanges = function(changesObj) { };
        ctrl.$onDestroy = function() { };
    }
})();