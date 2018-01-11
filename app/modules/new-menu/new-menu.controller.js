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

        function initConfigSortable() {
            vm.sortableOptions = {
                connectWith: '.list'
            }
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
            initConfigSortable();
        }
    }
})();