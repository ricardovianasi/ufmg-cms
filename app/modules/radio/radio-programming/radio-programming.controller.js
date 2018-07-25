(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('RadioProgrammingController', RadioProgrammingController);

    /** ngInject */
    function RadioProgrammingController(RadioService) {
        var vm = this;
        vm._ = _;
        

        activate();

        ////////////////

        function loadRadioProgramming() {
            RadioService.radioProgramming()
                .then(function(data) {
                    console.log('loadRadioProgramming', data);
                });
        }


        function _initWeekCalendar() {
            vm.hours24 = 
                ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00'];
            vm.days = [
                {label: 'Seg', content: []},
                {label: 'Ter', content: []},
                {label: 'Qua', content: []},
                {label: 'Qui', content: []},
                {label: 'Sex', content: []},
                {label: 'Sáb', content: []},
                {label: 'Dom', content: []},
            ];
        }

        function activate() {
            _initWeekCalendar();
            console.log(vm._.range);
            // loadRadioProgramming();
        }
    }
})();