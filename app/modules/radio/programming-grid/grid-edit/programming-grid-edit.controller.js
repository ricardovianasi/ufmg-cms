(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('GridEditController', GridEditController);

    /** ngInject */
    function GridEditController(RadioService, $q, toastr, ModalService, PermissionService) {
        var vm = this;
        vm.changeDay = changeDay;
        vm.addProgram = addProgram;
        vm.removeGrid = removeGrid;
        vm.editGrid = editGrid;

        vm.listPrograms = [];
        vm.listProgramsGrid = [];
        vm.listTable = [];
        vm.loading = false;
        vm.requiredForm = false;
        vm.dataProgram = {};

        activate();

        ////////////////

        function changeDay(weekDay) {
            vm.weekdays.forEach(function(day) { day.active = false; });
            weekDay.active = true;
            vm.weekDayActive = weekDay;
        }

        function editGrid(program) {
            let listChildren = vm.listTable.filter(function(item) { 
                return item.weekDay === vm.weekDayActive.code && item.idGridParent === program.idGrid;
            });
            let gridEdit = { parent: program, children: listChildren };
            let instanceModal = _openModalGrid(undefined, gridEdit);
            instanceModal.result.then(function(data) {
                let promises = data.map(function(programmingGrid) {
                    return RadioService.updateProgramGrid(programmingGrid, programmingGrid.id);
                });
                Promise.all(promises).then(function() { 
                    _loadGrid();
                    toastr.success('Grade atualizada com sucesso!');
                });
            }).catch(function(error) { console.error(error); });

        }

        function removeGrid(program) {
            let msg = 'Você deseja excluir este bloco de programa ' + program.titleProgram + '?';
            ModalService.confirm(msg, ModalService.MODAL_MEDIUM, { isDanger: true })
                .result.then(function() {
                    _removeGrid(program);
                }).catch(function(error) {console.log(error);});
        }

        function addProgram(formDataProgram) {
            if(formDataProgram.$invalid) {
                toastr.warning('Atenção todos aos campos em vermelho.');
                return;
            }
            vm.loading =  true;
            var promises;
            if (vm.dataProgram.program.children && !vm.dataProgram.program.children.length) {
                promises = _saveGrid(vm.dataProgram);
            } else {
                promises = _saveChildrenTime(vm.dataProgram);
            }
            promises.then(function() { 
                _loadGrid();
                vm.dataProgram = {};
            }).catch(function(error) {console.error(error);})
            .finally(function() { vm.loading = false; });
        }

        function _saveChildrenTime(data) {
            let instanceModal = _openModalGrid(data);
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
                .filter(function(prog) {
                    if(!prog) { return false; }
                    return prog.idGridParent === program.idGrid || program.idGrid === prog.idGrid;
                });
            RadioService.deleteProgramGrid(program.idGrid)
                .then(function() {
                    toastr.success('Bloco apagado com sucesso.');
                    vm.listTable = vm.listTable
                        .filter(function(grid) { return this.indexOf(grid) < 0; }, gridsDel);
                })
                .catch(function(error) { console.error(error); });
        }

        function _openModalGrid(dataProgram, gridEdit) {
            let pathTemplate = 'modules/radio/programming-grid/modal-time-childrens/modal-time-childrens.template.html';
            let resolve = { dataProgram: function() { return dataProgram; },  gridEdit: function() { return gridEdit; }};
            return ModalService.openModal(pathTemplate, 'TimeChildrensController as vm', resolve);
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
                    _permissions();
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
        }

        function _generateChildrenGrid(grid) {
            return grid.program.children.map( function(child) {
                let gridChild = child.grid_program.find(function(gc) { return gc.week_day === grid.week_day; });
                if(gridChild) {
                    return _generateItemGrid(child, gridChild, grid.week_day, grid.program, grid.id);
                }
                return false;
            }).filter(function (children) {return !!children;});
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
            return obj;
        }

        function _permissions() {
            vm.canDelete = PermissionService.canDelete('radio_programming_grid');
            vm.canPut = PermissionService.canPut('radio_programming_grid');
            vm.canPost = PermissionService.canPost('radio_programming_grid');
        }

        function activate() {
            vm.weekdays = [
                { label: 'Domingo', active: true, code: 7 },
                { label: 'Segunda-Feira', active: false, code: 1 },
                { label: 'Terça-Feira', active: false, code: 2 },
                { label: 'Quarta-Feira', active: false, code: 3 },
                { label: 'Quinta-Feira', active: false, code: 4 },
                { label: 'Sexta-Feira', active: false, code: 5 },
                { label: 'Sábado', active: false, code: 6 },
            ];
            vm.weekDayActive = vm.weekdays[0];
            _loadGrid();
            _loadPrograms();
        }
    }
})();