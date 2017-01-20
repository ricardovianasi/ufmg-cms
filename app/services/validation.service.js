(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('validationService', validationService);
    /** ngInject */
    function validationService(NotificationService) {
        return {
            isValid: _isValid
        };

        function _isValid(formValid) {
            if (formValid) {
                NotificationService.error('Existem campos obrigatórios vazios ou inválidos.');
                return false;
            }
            return true;
        }
    }
})();
