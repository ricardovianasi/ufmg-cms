(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('GridEditController', GridEditController);

    /** ngInject */
    function GridEditController(RadioService) {
        var vm = this;

        vm.changeDay = changeDay;
        vm.listPrograms = [];
        vm.weekDayActive;

        activate();

        ////////////////

        function changeDay(weekDay) {
            vm.weekdays.forEach(function(day) {
                day.active = false;
            });
            weekDay.active = true;
            vm.weekDayActive = weekDay.code;
        }

        function _loadGrid() {
            RadioService.radioProgramming()
                .then(function(res) {
                    vm.listPrograms = res.data.items;
                    console.log('loadGrid', res);
                });
        }

        function activate() {
            vm.weekdays = [
                {label: 'Domingo', active: true, code: 7},
                {label: 'Segunda-Feira', active: false, code: 1},
                {label: 'Terça-Feira', active: false, code: 2},
                {label: 'Quarta-Feira', active: false, code: 3},
                {label: 'Quinta-Feira', active: false, code: 4},
                {label: 'Sexta-Feira', active: false, code: 5},
                {label: 'Sábado', active: false, code: 6},
            ];
            vm.weekDayActive = 7;
            _loadGrid();
        }
    }
})();