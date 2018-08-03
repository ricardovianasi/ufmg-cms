(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('GridEditController', GridEditController);

    /** ngInject */
    function GridEditController(RadioService, $q, toastr) {
        var vm = this;

        vm.changeDay = changeDay;
        vm.addProgram = addProgram;

        vm.listPrograms = [];
        vm.loading = false;
        vm.weekDayActive;

        activate();

        ////////////////

        function changeDay(weekDay) {
            vm.weekdays.forEach(function(day) {
                day.active = false;
            });
            weekDay.active = true;
            vm.weekDayActive = weekDay;
        }

        function addProgram(program, parent, time) {
            console.log('addProgram', vm.weekDayActive, program, parent, vm.time);
            vm.loading =  true;
            var progressPromise = parent ? _updateProgramParent(program, parent) : $q.resolve();
            progressPromise
                .then(function() {
                    return _saveGrid(program, time);
                })
                .then(function(res) {
                    vm.listPrograms.unshift(res.data);
                    toastr.success('Programa inserido com sucesso.');
                })
                .catch(function(error) {console.error(error);})
                .finally(function() { vm.loading = false; });
        }

        function _updateProgramParent(child, parent) {
            child.id_parent = parent.id;
            delete child.author;
            delete child.grid_program;
            return RadioService.updateProgram(child, child.id);
        }

        function _saveGrid(program, time) {
            var programGrid = {
                programming: program.id,
                week_day: vm.weekDayActive.code,
                time_start: moment(time.time_start).format('HH:mm'),
                time_end: moment(time.time_end).format('HH:mm'),
            };
            return RadioService.registerProgramGrid(programGrid);
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
            vm.weekDayActive = vm.weekdays[0];
            _loadGrid();
        }
    }
})();