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
        vm.removeGrid = removeGrid;

        vm.listPrograms = [];
        vm.listProgramsGrid = [];
        vm.listTable = [];
        vm.loading = false;
        vm.requiredForm = false;
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

        function removeGrid(program) {
            ModalService.confirm('Você deseja excluir este bloco de programa?', ModalService.MODAL_MEDIUM, { isDanger: true })
                .result.then(function() {
                    _removeGrid(program);
                }).catch(function(error) {console.log(error);});
        }

        function addProgram() {
            if(_hasRequired()) {
                toastr.warning('Atenção todos os campos são obrigatório para adicionar o programa.');
                return;
            }
            vm.loading =  true;
            var promises;
            if (vm.dataProgram.program.children && !vm.dataProgram.program.children.length) {
                promises = _saveGrid(vm.dataProgram);
            } else {
                promises = _saveChildrenTime(vm.dataProgram);
            }
            promises                    
                .then(function(resDatas) { 
                    _loadGrid();
                    vm.dataProgram = {};
                })
                .catch(function(error) {console.error(error);})
                .finally(function() { vm.loading = false; });
        }

        function _hasRequired() {
            vm.requiredForm = true;
            if(vm.dataProgram.program && vm.dataProgram.time_start && vm.dataProgram.time_end) {
                vm.requiredForm = false;
            }
            return vm.requiredForm;
        }

        function _saveChildrenTime(data) {
            let pathTemplate = 'modules/radio/programming-grid/modal-time-childrens/modal-time-childrens.template.html';
            let resolve = { dataProgram: function() { return data; } };
            let instanceModal = ModalService.openModal(pathTemplate, 'TimeChildrensController as vm', resolve);
            return instanceModal.result.then(function(res) {
                let listPromises = res.map(function(gridToSave) {
                    gridToSave.week_day = vm.weekDayActive.code;
                    return RadioService.registerProgramGrid(gridToSave);
                });
                return Promise.all(listPromises);
            });
        }

        function _saveGrid(data) {
            var program = data.program;
            var programGrid = {
                programming: program.id,
                week_day: vm.weekDayActive.code,
                time_start: moment(data.time_start).format('HH:mm'),
                time_end: moment(data.time_end).format('HH:mm'),
            };
            return RadioService.registerProgramGrid(programGrid);
        }

        function _removeGrid(program) {
            let gridsDel = vm.listTable
                .filter(function(prog) {return prog.idGridParent === program.idGrid || program.idGrid === prog.idGrid;});
            RadioService.deleteProgramGrid(program.idGrid)
                .then(function() {
                    toastr.success('Bloco apagado com sucesso.');
                    vm.listTable = vm.listTable
                        .filter(function(grid) { return this.indexOf(grid) < 0; }, gridsDel);
                })
                .catch(function(error) { console.error(error); });
        }

        function _loadPrograms() {
            RadioService.listPrograms()
                .then(function(res) {
                    vm.listPrograms = res.data.items
                        .filter(function(program) { return !program.parent; });
                });
        }

        function _loadGrid() {
            RadioService.radioProgramming()
                .then(function(res) {
                    vm.listProgramsGrid = res.data.items;
                    _generateListTable();
                });
        }

        function _generateListTable() {
            vm.listTable = [];
            let listParent = vm.listProgramsGrid
                .filter(function(grid) { return !grid.program.parent; });
            listParent.forEach(function(grid) {
                let children = _generateChildrenGrid(grid);
                vm.listTable.push(_generateItemGrid(grid.program, grid, grid.week_day));
                vm.listTable = vm.listTable.concat(children);
            });
            console.log('_generateListTable', vm.listTable);
        }

        function _generateChildrenGrid(grid) {
            return grid.program.children.map( function(child) {
                let gridChild = child.grid_program.find(function(gc) { return gc.week_day === grid.week_day; });
                return _generateItemGrid(child, gridChild, grid.week_day, grid.program, grid.id);
            });
        }

        function _generateItemGrid(program, grid, weekDay, parent, idGridParent) {
            let obj = {
                idProgram: program.id,
                idGrid: grid.id,
                idGridParent: idGridParent,
                idParent: parent ? parent.id : null,
                timeStart: grid.time_start,
                timeEnd: grid.time_end,
                weekDay: weekDay,
                titleProgram: program.title,
            };
            console.log('_generateItemGrid', obj);
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