(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('RadioProgrammingController', RadioProgrammingController);

    /** ngInject */
    function RadioProgrammingController(RadioService) {
        var vm = this;
        vm._ = _;
        vm.pipeHour = pipeHour;
        

        activate();

        ////////////////

        function loadRadioProgramming() {
            RadioService.radioProgramming()
                .then(function(data) {
                    console.log('loadRadioProgramming', data);
                });
        }

        function pipeHour(n, width, z) {
            z = z || '0';
            n = n + '';
            let padZero = n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            return padZero + ':00';
        }


        function _initWeekCalendar() {
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