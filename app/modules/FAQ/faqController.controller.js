(function () {
    'use strict';

    angular.module('faqModule')
        .controller('faqController', faqController);

    /** ngInject */
    function faqController($rootScope,
        faqService,
        ModalService,
        $log,
        NotificationService,
        PermissionService) {
        $rootScope.shownavbar = true;

        $log.info('faqController');

        /* jshint ignore:start */
        var vm = this;
        /* jshint ignore:end */

        function _loadFaqs() {
            faqService.get().then(function (data) {
                vm.faqs = data.data.items;
                _permissions();
            });
        }

        _loadFaqs();

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
