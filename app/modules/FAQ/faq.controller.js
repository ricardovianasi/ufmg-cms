(function () {
    'use strict';

    angular.module('faqModule')
        .controller('faqController', faqController);

    /** ngInject */
    function faqController($rootScope,
        faqService,
        ModalService,
        $log,
        dataTableConfigService,
        Util,
        NotificationService,
        PermissionService) {
        $rootScope.shownavbar = true;
        $log.info('faqController');

        var vm = this;
        vm.dtInstance = {};


        onInit();

        function onInit() {
            _renderDataTable();
        }

        function _renderDataTable() {
            var numberOfColumns = 2;
            var columnsHasNotOrder = [1];
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                name: 'title'
            }]);

            function faqs(params, fnCallback) {
                faqService
                    .faqs(dataTableConfigService.getParams(params))
                    .then(function (res) {
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                        _permissions();
                        vm.faqs = res.data.items;
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        fnCallback(records);
                         
                    });
            }
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(faqs);
        }

        vm.removeFaq = function (id, title) {
            ModalService
                .confirm('Você deseja excluir o FAQ <b>' + title + '</b>?', ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    faqService.remove(id).then(function () {
                        NotificationService.success('FAQ removido com sucesso.');
                        _loadFaqs();
                    });
                });
        };

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('faq');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('faq');
        }
    }
})();
