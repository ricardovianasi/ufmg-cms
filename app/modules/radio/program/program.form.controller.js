(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramFormController', ProgramFormController);
    
    /** ngInject */
    function ProgramFormController(RadioService, $routeParams, toastr, $location, PermissionService) {
        var vm = this;
        vm.id = '';
        vm.listProgramBlock = [];
        vm.listGenre = [];
        vm.loading = false;

        vm.setImageCover = setImageCover;
        vm.save = save;
        vm.hasChildren = hasChildren;
        vm.addHour = addHour;

        activate();

        ////////////////

        function addHour(weekDay) {

        }

        function hasChildren() {
            return vm.program.children && vm.program.children.length;
        }

        function setImageCover(imageSelected) {
            if(!imageSelected) {
                return;
            }
            vm.program.image = { url: imageSelected.url };
            vm.program.id_image = imageSelected.id;
        }

        function save() {
            let promiseSave;
            vm.loading = true;
            if(vm.id) {
                promiseSave = _update();
            } else {
                promiseSave = _register();
            }
            promiseSave
                .catch(function(error) {console.error(error);})
                .finally(function() {vm.loading = false;});

        }
        
        function _register() {
            return RadioService.registerProgram(_getProgramToSave())
                .then(function(res) {
                    toastr.success('Programa de rádio cadastrado com sucesso!');
                    if(vm.canPut) {
                        $location.path('/radio_programming/edit/' + res.data.id);
                    }
                    vm.program = {title: ''};
                });
        }

        function _update() {
            return RadioService.updateProgram(_getProgramToSave(), vm.id)
                .then(function() {
                    toastr.success('Programa de rádio atualizado com sucesso!');
                });
        }

        function _getProgramToSave() {
            let objProgram = angular.copy(vm.program);
            objProgram.genres = objProgram.genre_id ? [objProgram.genre_id] : [];
            objProgram.id_parent = objProgram.id_parent;
            delete objProgram.image;
            delete objProgram.genre_id;
            delete objProgram.parent;
            return objProgram;
            
        }

        function _getProgram(id) {
            vm.loading = true;
            RadioService.program(id)
                .then(function(data) { initObjProgram(data); })
                .catch(function(error) { console.error(error); })
                .finally(function() { vm.loading = false; });
        }

        function _loadItemsFilters() {
            RadioService.listItemFilter(undefined, RadioService.baseUrlGenre)
                .then(function(res) { vm.listGenre = res.data.items; });
        }

        function _loadBlockPrograms() {
            RadioService.listPrograms()
                .then(function(res) { 
                    _permissions();
                    vm.listProgramBlock = res.data.items.filter(function(program) {
                        return !program.parent && program.id != vm.id;
                    }); 
                });
        }

        function _permissions() {
            vm.canPut = PermissionService.canPut('radio_programming');
            vm.canPost = PermissionService.canPost('radio_programming');
        }

        function initObjProgram(data) {
            vm.program = {
                title: data.title,
                id_parent: data.parent ? data.parent.id : null,
                description: data.description,
                genre_id: data.genres[0] ? data.genres[0].id : null,
                children: data.children
            };
            setImageCover(data.image);
        }

        function _initWeek() {
            vm.listDays = [
                { label: 'Seg', week_day: 1, checked: false, times: [ { time_start: '', time_end: '' } ] },
                { label: 'Sex', week_day: 5, checked: false, times: [ { time_start: '', time_end: '' } ] },
                { label: 'Ter', week_day: 2, checked: false, times: [ { time_start: '', time_end: '' } ] },
                { label: 'Sab', week_day: 6, checked: false, times: [ { time_start: '', time_end: '' } ] },
                { label: 'Qua', week_day: 3, checked: false, times: [ { time_start: '', time_end: '' } ] },
                { label: 'Dom', week_day: 7, checked: false, times: [ { time_start: '', time_end: '' } ] },
                { label: 'Qui', week_day: 4, checked: false, times: [ { time_start: '', time_end: '' } ] },
            ];
        }

        function activate() {
            vm.program = {title: ''};
            vm.id = $routeParams.id;
            _loadItemsFilters();
            _loadBlockPrograms();
            _initWeek();
            if(vm.id) {
                _getProgram(vm.id);
            } 
        }

    }
})();