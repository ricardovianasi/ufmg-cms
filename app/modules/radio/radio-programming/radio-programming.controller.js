(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('RadioProgrammingController', RadioProgrammingController);

    /** ngInject */
    function RadioProgrammingController(RadioService) {
        var vm = this;
        vm._ = _;

        vm.programToDataDrop = programToDataDrop;

        activate();

        ////////////////

        function programToDataDrop(program) {
            return angular.copy(program);
        }

        function _loadGrid() {
            RadioService.radioProgramming()
                .then(function(data) {
                    console.log('loadGrid', data);
                });
        }

        function _loadPrograms() {
            RadioService.listPrograms()
                .then(function(res) {
                    vm.listProgramming = res.data.items;
                    console.log('loadPrograms', res);
                });
        }

        function _getProgramGrid(event) {
            let dayOfWeek = event.start.days();
            let obj = {
                week_day: dayOfWeek || 7,
                programming: event.id,
                time_start: event.start.format('hh:mm'),
                time_end: !event.end ? event.start.add(2, 'hours').format('hh:mm') : event.end
            };
            return obj;
        }

        function whenReceive(event) {
            let programGrid = _getProgramGrid(event);
            console.log('whenReceive', programGrid);
        }

        function activate() {
            vm.eventSources = [{
                events: [{
                    title: 'testea',
                    start: new Date()
                }]
            }];
            vm.uiConfig = {
                calendar:{
                    height: 450,
                    editable: true,
                    defaultView: 'agendaWeek',
                    droppable: true,
                    header: { left: '', center: '', right: '' },
                    eventReceive: whenReceive,
                    eventDrop: function(event, delta, revertFunc) {
                        console.log('eventDrop', event);
                    },
                    eventResize: function(data) {
                        console.log('eventResize', data);
                    },
                    eventClick: function(event, jsEvent, view) {
                        console.log('eventClick', event);
                    }
                //   eventClick: $scope.alertEventOnClick,
                //   eventDrop: $scope.alertOnDrop,
                //   eventResize: $scope.alertOnResize
                }
              };
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