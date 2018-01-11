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

        activate();

        ////////////////

        function _baseConfigSortable() {
            return {
                connectWith: '.list',
                dropOnEmpty: true,
                cursor: 'move'
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

        
        function activate() {
            initMock();
            _setOptions();
            _setOptionsPrimary();
            _setOptionsSecondary();
            _setOptionsTertiary();
        }
    }
})();