;(function () {
  'use strict';

  angular
    .module('loginModule')
    .controller('loginController', loginController);

  loginController.$inject = [
    '$rootScope',
    'authService',
    'NotificationService',
    'sessionService',
    '$location'
  ];

  function loginController($rootScope, authService, NotificationService, sessionService, $location) {
    $rootScope.shownavbar = false;
    console.log('... loginController');

    /* jshint ignore:start */
    var vm = this;
    /* jshint ignore:end */

    vm.login = _login;
    vm.credentials = {};
    vm.credentials.username = 'portal@portal';
    vm.credentials.password = 'teste';

      /**
       *
       * @private
       */
    function _login() {
      authService.autenticate(vm.credentials).then(function(data){
        sessionService.saveData(data.data);
        sessionService.setIsLogged();
        console.log($location.path());
        $location.path('/');
      }, function(error) {
          NotificationService.error('Usuário ou senha inválidos, tente novamente.');
          vm.credentials.password = '';
      });
    }




  }
})();
