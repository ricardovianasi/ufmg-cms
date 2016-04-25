;(function () {
  'use strict';

  angular.module('faqModule')
    .controller('faqController', faqController);

  faqController.$inject = [
    '$rootScope',
    'faqService',
    'ModalService',
    'NotificationService'
  ];



  function faqController($rootScope, faqService, ModalService, NotificationService) {
    $rootScope.shownavbar = true;
    console.log('... faqController');

    /* jshint ignore:start */
    var vm = this;
    /* jshint ignore:end */

      /**
       *
       * @private
       */
    function _loadFaqs() {
      faqService.get().then(function (data) {
        vm.faqs = data.data.items;
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
  }
})();
