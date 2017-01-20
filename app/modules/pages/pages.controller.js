(function () {
    'use strict';

    angular.module('pagesModule')
        .controller('PagesController', PagesController);

    /** ngInject */
    function PagesController($scope,
        dataTableConfigService,
        PagesService,
        NotificationService,
        StatusService,
        ModalService,
        DateTimeHelper,
        $rootScope,
        $log) {
        var vm = $scope;
        $log.info('PagesController');

        $rootScope.shownavbar = true;
        vm.status = [];
        vm.pages = [];
        vm.currentPage = 1;
        vm.remove = _remove;
        vm.changePage = _changePage;

        function onInit() {
            StatusService
                .getStatus()
                .then(function (data) {
                    vm.status = data.data;
                    $log.info(vm.status);
                });
            vm.convertDate = DateTimeHelper.convertDate;
            _loadPages();
        }

        function _loadPages(page) {
            PagesService
                .getPages(page)
                .then(function (data) {
                    vm.pages = data.data;
                    $log.info(vm.pages);
                    vm.dtOptions = dataTableConfigService.init();
                });
        }

        function _changePage() {
            _loadPages(vm.currentPage);
        }

        function _remove(id, title) {
            ModalService
                .confirm('Você deseja excluir a página <b>' + title + '</b>?', ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    PagesService
                        .removePage(id)
                        .then(function () {
                            NotificationService.success('Página removida com sucesso.');
                            _loadPages();
                        });
                });
        }
        onInit();
    }
})();
