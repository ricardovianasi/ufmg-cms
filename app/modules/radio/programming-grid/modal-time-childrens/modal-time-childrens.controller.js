(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('TimeChildrensController', TimeChildrensController);

    /** ngInject */
    function TimeChildrensController($uibModalInstance, dataProgram) {
        var vm = this;

        vm.dismiss = dismiss;
        vm.saveItem = saveItem;

        activate();

        ////////////////

        function dismiss() {
            $uibModalInstance.dismiss('Canceled');
        }

        function saveItem() {
            console.log('saveItem', vm.program);
            let listProgramsToSave = vm.program.children
                .map(function(child) {return _generateProgramGrid(child);});
            listProgramsToSave.push(_generateProgramGrid(vm.program));
            $uibModalInstance.close(listProgramsToSave);
        }

        function _generateProgramGrid(prog) {
            return{
                programming: prog.id,
                time_start: moment(prog.time_start).format('HH:mm'),
                time_end: moment(prog.time_end).format('HH:mm'),
            };
        }

        function _initProgramMain() {
            vm.program = dataProgram.program;
            vm.program.time_start = dataProgram.time_start;
            vm.program.time_end = dataProgram.time_end;
            vm.time = { timeStart: moment(dataProgram.time_start).format('HH:mm'),
                timeEnd: moment(dataProgram.time_end).format('HH:mm') };
        }

        function activate() {
            _initProgramMain();
            console.log(vm.program, vm.time);
        }
    }
})();