(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramFormController', ProgramFormController);
    
    /** ngInject */
    function ProgramFormController(RadioService, $routeParams, toastr) {
        var vm = this;
        vm.id = '';
        vm.listCategory = [];
        vm.listGenre = [];

        vm.setImageCover = setImageCover;
        vm.save = save;

        activate();

        ////////////////

        function activate() {
            vm.program = {title: ''};
            vm.id = $routeParams.id;
            _loadItemsFilters();
            if(vm.id) {
                _getProgram(vm.id);
            }
        }

        function setImageCover(imageSelected) {
            vm.program.image = { url: imageSelected.url };
            vm.program.id_image = imageSelected.id;
        }

        function save() {
            if(vm.id) {
                _update();
            } else {
                _register();
            }
        }
        
        function _register() {
            RadioService.registerProgram(_getProgramToSave())
                .then(function() {
                    toastr.success('Programa de rádio cadastrado com sucesso!');
                    vm.program = {title: ''};
                });
        }

        function _update() {
            RadioService.updateProgram(_getProgramToSave(), vm.id)
                .then(function() {
                    toastr.success('Programa de rádio atualizado com sucesso!');
                });
        }

        function _getProgramToSave() {
            let objProgram = angular.copy(vm.program);
            objProgram.categories = [objProgram.category_id];
            objProgram.genres = [objProgram.genre_id];
            delete objProgram.image, objProgram.genre_id, objProgram.category_id;
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
            RadioService.listItemFilter(undefined, RadioService.baseUrlCategory)
                .then(function(res) { vm.listCategory = res.data.items; });
            RadioService.listItemFilter(undefined, RadioService.baseUrlGenre)
                .then(function(res) { vm.listGenre = res.data.items; });
        }


        function initObjProgram(data) {
            vm.program = {
                title: data.title,
                description: data.description,
                genre_id: data.genres[0] ? data.genres[0].id : null,
                category_id: data.categories[0] ? data.categories[0].id : null,
            };
            setImageCover(data.image);
        }

    }
})();