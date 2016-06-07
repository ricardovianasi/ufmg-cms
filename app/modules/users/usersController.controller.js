;(function () {
  'use strict';

  angular.module('usersModule')
    .controller('usersController', usersController);

  usersController.$inject = [
    '$rootScope',
    'UsersService',
    'ModalService',
    'NotificationService'
  ];



  function usersController($rootScope, UsersService, ModalService, NotificationService) {
    $rootScope.shownavbar = true;
    console.log('... usersController');

    /* jshint ignore:start */
    var vm = this;
    /* jshint ignore:end */

    /**
     *
     * @private
     */
    function _loadUsers() {
      UsersService.getUsers().then(function (data) {
        vm.users = data.data.items;
      });
    }

    _loadUsers();

    //
    // vm.removeFaq = function (id, title) {
    //   ModalService
    //     .confirm('Você deseja excluir o FAQ <b>' + title + '</b>?', ModalService.MODAL_MEDIUM)
    //     .result
    //     .then(function () {
    //       faqService.remove(id).then(function () {
    //         NotificationService.success('FAQ removido com sucesso.');
    //         _loadFaqs();
    //       });
    //     });
    // };
  }
})();
