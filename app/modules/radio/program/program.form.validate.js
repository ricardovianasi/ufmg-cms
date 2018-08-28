(function() {
    'use strict';

    angular
        .module('radioModule')
        .factory('ProgramFormValidate', ProgramFormValidate);
    
    /** ngInject */
    function ProgramFormValidate() {
        var service = {
            isValidControlForm: isValidControlForm
        };
        
        return service;

        ////////////////
        function isValidControlForm(form, field, submit) {
            let control = form[field];
            let isValid = control.$valid || !control.$touched;
            if (submit) {
                isValid = isValid || !form.$submitted;
            }
            return isValid;
        }
    }
})();