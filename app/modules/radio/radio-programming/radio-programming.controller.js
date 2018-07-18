(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('RadioProgrammingController', RadioProgrammingController);

    /** ngInject */
    function RadioProgrammingController(RadioService) {
        var vm = this;
        

        activate();

        ////////////////

        function loadRadioProgramming() {
            RadioService.radioProgramming()
                .then(function(data) {
                    console.log('loadRadioProgramming', data);
                });
        }

        function activate() {
            loadRadioProgramming();
        }
    }
})();