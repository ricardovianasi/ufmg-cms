(function () {
    'use strict';

    angular
        .module('faqModule')
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
        $log.info('faqController');
        var vm = this; // jshint ignore: line
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

            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(faqs);
            vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);

            function faqs(params, fnCallback) {
                faqService
                    .faqs(dataTableConfigService.getParams(params))
                    .then(function (res) {
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
        }

        vm.removeFaq = function (id, title) {
            ModalService
                .confirm('Você deseja excluir o FAQ <b>' + title + '</b>?', ModalService.MODAL_MEDIUM, { isDanger: true })
                .result
                .then(function () {
                    faqService.remove(id).then(function () {
                        NotificationService.success('FAQ removido com sucesso.');
                        vm.dtInstance.DataTable.draw();
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
