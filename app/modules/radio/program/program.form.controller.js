(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramFormController', ProgramFormController);
    
    /** ngInject */
    function ProgramFormController(RadioService, $routeParams, toastr, $location, PermissionService, $q, ProgramFormUtils, ModalService) {
        var vm = this;
        vm.id = '';
        vm.listProgramBlock = [];
        vm.listGenre = [];
        vm.loading = false;
        vm.isExtraordinaryProgram = false;

        vm.removeProgram = removeProgram;
        vm.save = save;
        vm.addHour = addHour;
        vm.changeTime = changeTime;
        vm.changeCheckDay = changeCheckDay;
        vm.removeHour = removeHour;
        vm.setExtraordinary = setExtraordinary;
        vm.addNewParent = addNewParent;
        vm.canAddHour = canAddHour;

        activate();

        ////////////////

        function removeProgram() {
            ModalService.confirm('Deseja excluir este programa?', ModalService.MODAL_MEDIUM).result
                .then(function() { return RadioService.deleteProgram(vm.id); })
                .then(function() { 
                    toastr.success('Programa removido com sucesso.');
                    $location.path('/radio_programming/programs');
                })
                .catch(function(){console.log('closeModal');});
        }

        function addNewParent(nameParent) {
            RadioService.registerItemFilter({name: nameParent}, RadioService.baseUrlParent)
                .then(function(res) {
                    let parent = res.data;
                    vm.listParents.unshift(parent);
                    vm.program.id_schedule = parent.id;
                    toastr.success('Bloco ' + parent.name + ' adicionado com sucesso.');
                });
        }

        function changeTime(moment, time, day, type) {
            day.moment[type] = moment;
            day['time_'+type] = time;
            ProgramFormUtils.checkValidateDate(day, vm.id);
        }

        function setExtraordinary() {
            if (vm.program.highlight) {

            }
        }

        function changeCheckDay(day) {
            day.delete = !day.checked;
            if(!day.checked) {
                day.time_start = '';
                day.time_end = '';
                day.times.forEach(function(time) { time.delete = true; });
                day.moment = {};
            }
        }

        function removeHour(day, timeExtra) {
            let idxTime = day.times.indexOf(timeExtra);
            if(!timeExtra.idGrid) {
                day.times.splice(idxTime, 1);
                return;
            }
            timeExtra.delete = true;
        }

        function addHour(day, start, end, idGrid) {
            day.times.push(ProgramFormUtils.createGrid(day.week_day, start, end, idGrid));
        }

        function canAddHour(day) {
            if (day.isExtraordinary) { return false; }
            let canAdd = true;
            let times = day.times.filter(function(time) {return !time.delete;});
            if(times && times.length) {
                let timeExtra = times[times.length - 1];
                canAdd = timeExtra.time_start && timeExtra.time_end;
            } else {
                canAdd = day.time_start && day.time_end;
            }
            return canAdd && !vm.program.highlight;
        }

        function save() {
            let promiseSave;
            vm.loading = true;
            if(vm.id) { promiseSave = _update(); } 
            else { promiseSave = _register(); }
            promiseSave
                .catch(function(error) {console.error(error);})
                .finally(function() {vm.loading = false;});
        }
        
        function _register() {
            return RadioService.registerProgram(ProgramFormUtils.createProgramServer(vm.program))
                .then(function(res) {
                    vm.program.id = res.data.id;
                    return _saveGrid();
                })
                .then(function(res) {
                    toastr.success('Programa de rádio cadastrado com sucesso!');
                    if(vm.canPut) {
                        $location.path('/radio_programming/edit/' + res.data.id);
                    }
                    vm.program = {title: ''};
                });
        }

        function _update() {
            return $q.all([ RadioService.updateProgram(ProgramFormUtils.createProgramServer(vm.program), vm.id), _saveGrid() ])
                .then(function(res) {
                    _getProgram(vm.id);
                    toastr.success('Programa de rádio atualizado com sucesso!');
                });
        }

        function _prepareGridToSave() {
            let listGridsToSave = vm.listDays
                .reduce(function(result, column) { return result.concat(column); }, [])
                .filter(function(grid) { return grid.idGrid || grid.checked; })
                .reduce(function(resultDays, day) { return resultDays.concat(day.times).concat(day); }, [])
                .map(function(grid) { return ProgramFormUtils.createGridServer(grid, vm.program.id); });
            return listGridsToSave;
        }

        function _saveGrid() {
            let listPromise = [];
            _prepareGridToSave().forEach(function(grid) {
                if (grid.idGrid && grid.delete) {
                    listPromise.push(RadioService.deleteProgramGrid(grid.idGrid));
                } else if (grid.idGrid) {
                    listPromise.push(RadioService.updateProgramGrid(grid, grid.idGrid));
                } else { 
                    listPromise.push(RadioService.registerProgramGrid(grid));
                }
            });
            return $q.all(listPromise);
        }

        function _getProgram(id) {
            vm.loading = true;
            RadioService.program(id)
                .then(function(data) { initObjProgram(data); })
                .catch(function(error) { console.error(error); })
                .finally(function() { vm.loading = false; });
        }

        function _loadGenre() {
            RadioService.listItemFilter(undefined, RadioService.baseUrlGenre)
                .then(function(res) { vm.listGenre = res.data.items; });
        }

        function _loadParents() {
            RadioService.listItemFilter(undefined, RadioService.baseUrlParent)
                .then(function(res) { 
                    _permissions();
                    vm.listParents = res.data.items; 
                });
        }

        function _permissions() {
            vm.canPut = PermissionService.canPut('radio_programming');
            vm.canPost = PermissionService.canPost('radio_programming');
        }

        function initObjProgram(data) {
            vm.program = ProgramFormUtils.initObjProgram(data);
            vm.listDays = ProgramFormUtils.createListDays();
            data.grid_program.forEach(function(grid) {
                let day = ProgramFormUtils.getByWeekDay(vm.listDays, grid.week_day);
                day.checked = true;
                if(day.time_start) {
                    addHour(day, grid.time_start, grid.time_end, grid.id);
                } else {
                    day.idGrid = grid.id;
                    day.time_start = grid.time_start;
                    day.time_end = grid.time_end;
                }
            });
        }

        function activate() {
            vm.readctorOpts = { plugins: false, buttons: ['bold', 'italic'] };
            vm.program = {title: ''};
            vm.id = $routeParams.id;
            _loadGenre();
            _loadParents();
            if(vm.id) {
                _getProgram(vm.id);
            } else {
                vm.program = ProgramFormUtils.initObjProgram();
                vm.listDays = ProgramFormUtils.createListDays();
            }
        }

    }
})();