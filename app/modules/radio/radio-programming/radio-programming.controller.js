(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('RadioProgrammingController', RadioProgrammingController);

    /** ngInject */
    function RadioProgrammingController(RadioService, toastr) {
        var vm = this;

        vm.programToDataDrop = programToDataDrop;

        activate();

        ////////////////

        function programToDataDrop(program) {
            return angular.copy(program);
        }

        function _loadGrid() {
            RadioService.radioProgramming()
                .then(function(res) {
                    _insertProgramOnGrid(res.data.items);
                    console.log('loadGrid', res);
                });
        }

        function _loadPrograms() {
            RadioService.listPrograms()
                .then(function(res) {
                    vm.listProgramming = res.data.items;
                    console.log('loadPrograms', res);
                });
        }

        function removeProgramOfGrid(idGrid) {
            let idx = vm.events.findIndex(function(programGrid) {
                return programGrid.id === idGrid;
            });
            vm.events.splice(idx, 1);
        }

        function _insertProgramOnGrid(listDataGrid) {
            listDataGrid.forEach(function(programGrid) {
                let event = {
                    title: programGrid.program.title,
                    start: _convertTimeToMoment(programGrid.time_start, programGrid.week_day),
                    end: _convertTimeToMoment(programGrid.time_end, programGrid.week_day),
                    id: programGrid.id,
                    program_id: programGrid.program.id
                };
                vm.events.push(event);
            });
            console.log('insertProgramingInGrid', vm.eventSources);
        }

        function _convertTimeToMoment(time, week_day) {
            let day = week_day === 7 ? 0 : week_day;
            let timeSplitted = time.split(':');
            return moment().set({day: day, hour: timeSplitted[0], minute: timeSplitted[1] });
        }

        function _createProgramGrid(event) {
            let dayOfWeek = event.start.days();
            let obj = {
                week_day: dayOfWeek || 7,
                programming: event.id,
                time_start: event.start.format('hh:mm'),
                time_end: !event.end ? event.start.add(2, 'hours').format('HH:mm') : event.end.format('HH:mm')
            };
            return obj;
        }

        function whenReceive(event) {
            let programGrid = _createProgramGrid(event);
            postEventGrid(programGrid, event);
            console.log('whenReceive', programGrid);
        }

        function whenResize(event) {
            let programGrid = _createProgramGrid(event);
            programGrid.id = event.id;
            updateEventGrid(programGrid, event.id);
            console.log('whenResize', programGrid, event);
        }

        function whenDrop(event) {
            let programGrid = _createProgramGrid(event);
            console.log('whenDrop', programGrid);
        }

        function removeEventGrid(event) {
            RadioService.deleteProgramGrid(event.id)
                .then(function(res) {
                    toastr.success('Programação removida com sucesso!');
                    removeProgramOfGrid(event.id);
                    console.log('removeEventGrid', res);
                });
        }

        function updateEventGrid(programGrid, id) {
            RadioService.updateProgramGrid(programGrid, id)
                .then(function(res) {
                    toastr.success('Grade atualizada com sucesso!');
                    console.log('updateEventGrid', res);
                });
        }

        function postEventGrid(programGrid, event) {
            RadioService.registerProgramGrid(programGrid)
                .then(function(res) {
                    toastr.success('Grade salva com sucesso!');
                    event.id = res.data.id;
                    console.log('registerProgram', res, vm.eventSources);
                });
        }

        function _configCalendar() {
            vm.events = [];
            vm.eventSources = [vm.events];
            vm.uiConfig = {
                calendar: { height: 450, editable: true, defaultView: 'agendaWeek', droppable: true,
                    header: { left: '', center: '', right: '' },
                    eventReceive: whenReceive,
                    eventDrop: whenDrop,
                    eventResize: whenResize,
                    eventClick: removeEventGrid
                }
            };
        }

        function activate() {
            _configCalendar();
            _loadGrid();
            _loadPrograms();
        }
    }
})();

// Buscar por ID
// Method: GET
// URL: /radio-programming-grid/{id}

// Retornar todos
// Method: GET
// URL: /radio-programming-grid

// Nova
// Method: POST
// URL: /radio-programming-grid

// Editar
// Method: PUT
// URL: /radio-programming-grid

// JSON:
// {
// 	"programming": 13,
// 	"week_day": 1,
// 	"time_start": "09:07",
// 	"time_end": "10:12"
// }