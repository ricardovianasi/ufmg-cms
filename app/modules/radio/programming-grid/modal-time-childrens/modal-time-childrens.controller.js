(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('TimeChildrensController', TimeChildrensController);

    /** ngInject */
    function TimeChildrensController($uibModalInstance, program, time) {
        var vm = this;

        vm.dismiss = dismiss;
        vm.saveItem = saveItem;
        vm.program = program;

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
            vm.program = program;
            vm.time = time;
        }

        function activate() {
            _initProgramMain();
            console.log(vm.program, vm.time);
        }
    }
})();