(function() {
    'use strict';

    angular
        .module('newMenuModule')
        .controller('NewMenuController', MenuController);
    
        /** ngInject */
    function MenuController($scope
        , $log
        , $q
        , $rootScope
        , $filter
        , NotificationService
        , ModalService
        , PermissionService
        , MenuService
        ) {
        var vm = this;

        vm.isEmpty = _isEmpty;
        vm.listCanShow = _listCanShow;
        vm.toggle = _toggle;
        vm.isOpen = _isOpen;

        activate();

        ////////////////

        function _baseConfigSortable() {
            return {
                connectWith: '.list',
                dropOnEmpty: true,
                cursor: 'move',
                update: _updateSortable
            };
        }

        function _setOptionsSortable(placeholder) {
            var options = _baseConfigSortable();
            if(placeholder) {
                options.placeholder = placeholder;
            }
            console.log(options);
            return options;
        }

        function _setOptions() {
            vm.optionsSortable = _setOptionsSortable();
        }

        function _setOptionsPrimary() {
            vm.optionsSortablePrimary = _setOptionsSortable('placeholder-primary');
        }

        function _setOptionsSecondary() {
            vm.optionsSortableSecondary = _setOptionsSortable('placeholder-secondary');
        }

        function _setOptionsTertiary() {
            vm.optionsSortableTertiary = _setOptionsSortable('placeholder-tertiary');
        }

        function _updateSortable(event, ui) {
            console.log('_update', event, ui);
            console.log('model', vm.items, vm.pages);
        }

        function initMock() {
            vm.items = [
                {
                    id: 10,
                    label: 'A Universidade',
                    children: [
                        {
                            id: 11,
                            label: 'Apresentação',
                            children: [
                                {
                                    id: 111,
                                    label: 'UFMG e a Cidade',
                                    children: []
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 20,
                    label: 'Cursos',
                    children: [
                        {
                            id: 21,
                            label: 'Graduação',
                            children: [ ]
                        },
                        {
                            id: 22,
                            label: 'Pós Graduação',
                            children: [
                                {
                                    id: 221,
                                    label: 'Especialização',
                                    children: []
                                },
                                {
                                    id: 222,
                                    label: 'Mestrado',
                                    children: []
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 30,
                    label: 'Pesquisa e Inovação',
                    children: [
                        {
                            id: 31,
                            label: 'Extensão',
                            children: [
                                {
                                    id: 311,
                                    label: 'Especialização e Produção Científica',
                                    children: []
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 40,
                    label: 'Formas de Ingresso',
                    children: [
                        {
                            id: 41,
                            label: 'Ingresso em Graduação',
                            children: []
                        },
                        {
                            id: 42,
                            label: 'Ingresso em Pós Graduação',
                            children: []
                        },
                        {
                            id: 43,
                            label: 'Ingresso no Ensino Médio e Técnico',
                            children: []
                        },
                        {
                            id: 44,
                            label: 'Ingresso no Ensino Fundamental',
                            children: []
                        },
                        {
                            id: 45,
                            label: 'Ingresso na Educação de Jovens e Adultos',
                            children: []
                        }
                    ]
                }
            ];
            console.log(vm.items);
        }

        function initMockPages() {
            vm.pages = [
                { label: 'Belo Horizonte', id: 1, children: [] },
                { label: 'Contato', id: 2, children: [] },
                { label: 'Restaurantes', id: 3, children: [] },
                { label: 'Segurança nos Campi', id: 4, children: [] },
                { label: 'Auditórios', id: 5, children: [] }
            ]
        }

        function _isEmpty(list) {
            return list ? !list.length : true;
        }

        function _listCanShow(parentId, list) {
            return vm.stateToggles[parentId] || _isEmpty(list);
        }

        function _toggle(id) {
            vm.stateToggles[id] = !vm.stateToggles[id];
            console.log(vm.stateToggles);
        }

        function _isOpen(id) {
            return vm.stateToggles[id];
        }

        function activate() {
            vm.stateToggles = {};
            initMock();
            initMockPages();
            _setOptions();
            _setOptionsPrimary();
            _setOptionsSecondary();
            _setOptionsTertiary();
        }
    }
})();