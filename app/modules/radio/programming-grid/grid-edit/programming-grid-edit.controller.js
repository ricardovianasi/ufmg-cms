(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('GridEditController', GridEditController);

    /** ngInject */
    function GridEditController(RadioService, $q, toastr, ModalService) {
        var vm = this;

        vm.changeDay = changeDay;
        vm.addProgram = addProgram;

        vm.listPrograms = [];
        vm.listProgramsGrid = [];
        vm.listTable = [];
        vm.loading = false;
        vm.weekDayActive;
        vm.dataProgram = {};

        activate();

        ////////////////

        function changeDay(weekDay) {
            vm.weekdays.forEach(function(day) {
                day.active = false;
            });
            weekDay.active = true;
            vm.weekDayActive = weekDay;
        }

        function addProgram() {
            console.log('addProgram', vm.dataProgram);
            vm.loading =  true;
            vm.dataProgram.program.time_start = vm.dataProgram.time_start;
            vm.dataProgram.program.time_end = vm.dataProgram.time_end;
            let time = { timeStart: moment(vm.dataProgram.time_start).format('HH:mm'),
                timeEnd: moment(vm.dataProgram.time_end).format('HH:mm') };
            let modal = _openEditTime(vm.dataProgram.program, time);
            
            modal.result.then(function(res) {
                console.log('close modal', res);
                let listPromises = res.map(function(gridToSave) {
                    gridToSave.week_day = vm.weekDayActive.code;
                    return RadioService.registerProgramGrid(gridToSave);
                });
                return Promise.all(listPromises);
            })
            .then(function(resDatas) {
                _loadGrid();
            })
            .catch(function(error) {console.error(error);});
            // _saveGrid(vm.dataProgram.program, vm.dataProgram.time_start, vm.dataProgram.time_end)
            //     // .then(function() {
            //     //     return _saveGrid(vm.dataProgram.program, vm.dataProgram.time_start, vm.dataProgram.time_end);
            //     // })
            //     .then(function(res) {
            //         vm.listProgramsGrid.unshift(res.data);
            //         toastr.success('Programa inserido com sucesso.');
            //     })
            //     .catch(function(error) {console.error(error);})
            //     .finally(function() { vm.loading = false; });
        }

        function _openEditTime(program, time) {
            let resolve = {
                program: function() { return program; },
                time: function() { return time; }
            };
            return ModalService.openModal('modules/radio/programming-grid/modal-time-childrens/modal-time-childrens.template.html',
            'TimeChildrensController as vm',
            resolve);
        }

        // function _updateProgramParent(child, parent) {
        //     if(!parent) {
        //         return $q.resolve();
        //     } 
        //     delete child.parent;
        //     child.id_parent = parent.id;
        //     delete child.author;
        //     delete child.grid_program;
        //     return RadioService.updateProgram(child, child.id);
        // }

        function _saveGrid(program, time_start, time_end) {
            var programGrid = {
                programming: program.id,
                week_day: vm.weekDayActive.code,
                time_start: moment(time_start).format('HH:mm'),
                time_end: moment(time_end).format('HH:mm'),
            };
            return RadioService.registerProgramGrid(programGrid);
        }

        function _loadGrid() {
            RadioService.radioProgramming()
                .then(function(res) {
                    vm.listProgramsGrid = res.data.items;
                    generateListTable();
                });
        }


        function _loadPrograms() {
            RadioService.listPrograms()
                .then(function(res) {
                    vm.listPrograms = res.data.items
                        .filter(function(program) { return !program.parent; });
                });
        }

        function generateListTable() {
            let listParent = vm.listProgramsGrid
                .filter(function(grid) { return !grid.program.parent; });
            listParent.forEach(function(grid) {
                let children = grid.program.children
                    .map(function(child) {return _generateItemGrid(child, child.grid_program[0], grid.week_day); });
                vm.listTable.push(_generateItemGrid(grid.program, grid, grid.week_day));
                vm.listTable = vm.listTable.concat(children);
            });
            // vm.listTable = vm.listProgramsGrid.map(function(dataGrid) {
            //     return {
            //         idProgram: dataGrid.program.id,
            //         idParent: dataGrid.program.parent ? dataGrid.program.parent.id : null,
            //         timeStart: dataGrid.time_start,
            //         timeEnd: dataGrid.time_end,
            //         weekDay: dataGrid.week_day,
            //         titleProgram: dataGrid.program.title
            //     };
            // });
            console.log('generateListTable', vm.listTable);
        }

        function _generateItemGrid(program, grid, weekDay) {
            let obj = {
                idProgram: program.id,
                idGrid: grid.id,
                idParent: program.parent ? program.parent.id : null,
                timeStart: grid.time_start,
                timeEnd: grid.time_end,
                weekDay: weekDay,
                titleProgram: program.title,
            };
            console.log('_generateItemGrid', program, grid, weekDay, obj);
            return obj;
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
            _loadPrograms();
        }
    }
})();