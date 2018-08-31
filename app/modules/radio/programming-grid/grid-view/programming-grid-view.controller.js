(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('GridViewController', GridViewController);

    /** ngInject */
    function GridViewController(RadioService, toastr, uiCalendarConfig, PermissionService) {
        var vm = this;

        activate();

        ////////////////

        function _loadGrid() {
            RadioService.radioProgramming()
                .then(function(res) {
                    _permissions();
                    _insertProgramOnGrid(res.data.items);
                    console.log('loadGrid', res);
                });
        }

        function _insertProgramOnGrid(listDataGrid) {
            let events = listDataGrid.map(function(programGrid) {
                return {
                    title: programGrid.program.title,
                    start: _convertTimeToMoment(programGrid.time_start, programGrid.week_day),
                    end: _convertTimeToMoment(programGrid.time_end, programGrid.week_day),
                    id: programGrid.id,
                    programming: programGrid.program.id
                };
                // vm.events.push(event);
            });
            _getCalendar().fullCalendar('addEventSource', {events: events});
        }

        function _convertTimeToMoment(time, week_day) {
            let day = week_day === 7 ? 0 : week_day;
            let timeSplitted = time.split(':');
            return moment().set({day: day, hour: timeSplitted[0], minute: timeSplitted[1] });
        }

        function _createProgramGrid(event, idProgramming) {
            let eventCopy = angular.copy(event);
            let dayOfWeek = eventCopy.start.days();
            let obj = {
                week_day: dayOfWeek || 7,
                programming: idProgramming,
                time_start: eventCopy.start.format('HH:mm'),
                time_end: !eventCopy.end ? eventCopy.start.add(2, 'hours').format('HH:mm') : eventCopy.end.format('HH:mm')
            };
            return obj;
        }

        function _getCalendar() {
            return uiCalendarConfig.calendars.fCalendar;
        }

        function whenReceive(event) {
            let programGrid = _createProgramGrid(event, event.id);
            _postEventGrid(programGrid, event);
        }

        function whenChange(event) {
            let programGrid = _createProgramGrid(event, event.programming);
            _updateEventGrid(programGrid, event.id);
        }

        function _removeEventGrid(event) {
            RadioService.deleteProgramGrid(event.id)
                .then(function() {
                    toastr.success('Programação removida com sucesso!');
                    _getCalendar().fullCalendar('removeEvents', event.id);
                });
        }

        function _updateEventGrid(programGrid, id) {
            RadioService.updateProgramGrid(programGrid, id)
                .then(function(res) {
                    toastr.success('Grade atualizada com sucesso!');
                    console.log('updateEventGrid', res);
                });
        }

        function _postEventGrid(programGrid, event) {
            RadioService.registerProgramGrid(programGrid)
                .then(function(res) {
                    toastr.success('Grade salva com sucesso!');
                    event.id = res.data.id;
                    event.programming = res.data.program.id;
                    _getCalendar().fullCalendar('updateEvent', event);
                });
        }

        function _configCalendar() {
            vm.events = [];
            vm.eventSources = [vm.events];
            vm.uiConfig = {
                calendar: { height: 450, editable: false, defaultView: 'agendaWeek', droppable: true, allDaySlot: false,
                    header: { left: '', center: '', right: '' }, dragOpacity: 0.7, timeFormat: 'H:mm',
                    eventReceive: whenReceive,
                    eventDrop: whenChange,
                    eventResize: whenChange,
                    eventClick: _removeEventGrid
                }
            };
        }

        function _permissions() {
            vm.canPut = PermissionService.canPut('radio_programming_grid');
            vm.canPost = PermissionService.canPost('radio_programming_grid');
        }

        function activate() {
            _configCalendar();
            _loadGrid();
        }
    }
})();
