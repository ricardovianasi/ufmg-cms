;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('validationService', validationService);

    validationService.$inject = ['NotificationService'];

    function validationService(NotificationService) {
      return {
        isValid: isValid
      };

      function isValid(formValid) {
        if(formValid) {
          NotificationService.error('Existem campos obrigatórios vazios ou inválidos.');
          return false;
        }

        return true;
      }
    }
})();
