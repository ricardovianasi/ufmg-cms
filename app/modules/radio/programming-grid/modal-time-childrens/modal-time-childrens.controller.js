(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('TimeChildrensController', TimeChildrensController);

    /** ngInject */
    function TimeChildrensController($uibModalInstance, dataProgram, gridEdit) {
        var vm = this;
        
        vm.requiredForm = false;
        vm.isEdit = false;

        vm.dismiss = dismiss;
        vm.saveItem = saveItem;

        activate();

        ////////////////

        function dismiss() {
            $uibModalInstance.dismiss('Canceled');
        }

        function saveItem() {
            if (_hasRequired()) {
                return;
            }
            vm.submitted = true;
            let listProgramsToSave = vm.program.children
                .map(function(child) {return _generateProgramGrid(child);});
            listProgramsToSave.push(_generateProgramGrid(vm.program));
            $uibModalInstance.close(listProgramsToSave);
        }


        function _hasRequired() {
            vm.requiredForm = vm.program.children.reduce(function(result, child) {
                let noTime = !child.time_start || !child.time_end;
                return noTime || result;
            }, false);
            let parentTimeRequired = vm.isEdit && (!vm.program.time_start || !vm.program.time_end);
            return vm.requiredForm || parentTimeRequired;
        }

        function _generateProgramGrid(prog) {
            let programGrid = {
                programming: prog.id,
                time_start: moment(prog.time_start).format('HH:mm'),
                time_end: moment(prog.time_end).format('HH:mm'),
            };
            if(vm.isEdit) {
                programGrid.id = prog.idGrid;
                programGrid.week_day = prog.weekDay;
            }
            return programGrid;
        }

        function _initProgramMain() {
            vm.program = dataProgram.program;
            vm.program.time_start = dataProgram.time_start;
            vm.program.time_end = dataProgram.time_end;
            vm.time = { timeStart: moment(dataProgram.time_start).format('HH:mm'),
                timeEnd: moment(dataProgram.time_end).format('HH:mm') };
        }

        function _setHourToDate(timeStr) {
            let timeMoment = timeStr.split(':')
                .reduce(function(result, time, idx) {
                    if (idx === 0) { result.hour = time; }
                    if (idx === 1) { result.minute = time; }
                    return result;
                }, {second: 0, millisecond: 0});
            return moment().set(timeMoment).toDate();
        }

        function _generateGridEdit(programGrid) {
            return {
                idGrid: programGrid.idGrid,
                id: programGrid.idProgram,
                title: programGrid.titleProgram, 
                time_start: _setHourToDate(programGrid.timeStart),
                time_end: _setHourToDate(programGrid.timeEnd),
                weekDay: programGrid.weekDay,
            };
        }

        function _initGridEdit() {
            let children = gridEdit.children
                .map(function(child) { return _generateGridEdit(child); });
            vm.program = _generateGridEdit(gridEdit.parent);
            vm.program.children = children;
        }

        function activate() {
            if(gridEdit) {
                vm.isEdit = true;
                _initGridEdit();
            } else {
                _initProgramMain();
            }
        }
    }
})();