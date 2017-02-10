(function () {
    'use strict';

    angular
        .module('usersModule')
        .controller('UsersPermissionModelController', UsersPermissionModelController);

    /** ngInject */
    function UsersPermissionModelController($log, DTOptionsBuilder, contextPermissions, $uibModalInstance) {
        var vm = this;
        vm.select = _select;
        vm.deselect = _deselect;
        vm.save = _save;

        function onInit() {
            $log.info('UsersPermissionModelController');
            console.log(contextPermissions);
        }

        function _save() {
            $uibModalInstance.close(_updateCustomPermission());
        }

        var pages = [{
            id: 1,
            title: 'Title 1',
            autor: 'Autor 1'
        }, {
            id: 2,
            title: 'Title 2',
            autor: 'Autor 2'
        }, {
            id: 3,
            title: 'Title 3',
            autor: 'Autor 3'
        }];

        var contextList = mountListPermissionContextId(pages);
        vm.deselects = contextList.deselects;
        vm.selecteds = contextList.selecteds;
        vm.dtOptions = _getConfigDataTableDTOptionsBuilder();

        function _select(item) {
            _arrayRemoveItem(vm.deselects, item);
            vm.selecteds.push(item);
        }

        function mountListPermissionContextId(listContext) {
            var arraycontextPermissions = contextPermissions;
            var selecteds = [];
            if (angular.isString(arraycontextPermissions) && arraycontextPermissions[0] !== "PUT") {
                // arraycontextPermissions = vm.user.resources_perms[context][permission].replace(/\s/g, '').split(',');
                for (var i = 0; i < listContext.length; i++) {
                    var deselect = listContext[i];
                    for (var j = 0; j < arraycontextPermissions.length; j++) {
                        var contextId = arraycontextPermissions[j];
                        if (deselect.id.toString() === contextId.toString()) {
                            _arrayRemoveItem(listContext, deselect);
                            selecteds.push(deselect);
                        }
                    }
                }
            }
            return {
                selecteds: selecteds,
                deselects: listContext
            };
        }

        function _arrayRemoveItem(arr, item) {
            for (var i = arr.length; i--;) {
                if (arr[i] === item) {
                    arr.splice(i, 1);
                }
            }
        }

        function _deselect(item) {
            _arrayRemoveItem(vm.selecteds, item);
            vm.deselects.push(item);
        }

        function _updateCustomPermission() {
            var array = [];
            for (var i = 0; i < vm.selecteds.length; i++) {
                var select = vm.selecteds[i];
                array.push(select.id);
            }
            var contextIds = array.toString();
            if (!contextIds) {
                return ["PUT"];
            }
            return contextIds;
        }


        function _getConfigDataTableDTOptionsBuilder() {
            return DTOptionsBuilder
                .newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(10)
                .withLanguage({
                    'sEmptyTable': 'Nenhum dado foi encontrado.',
                    'sInfo': 'Exibindo de _START_ a _END_ de _TOTAL_ resultados',
                    'sInfoEmpty': 'Exibindo de 0 a 0 de 0 resultados',
                    'sInfoFiltered': '(Filtrado de _MAX_ resultados)',
                    'sInfoPostFix': '',
                    'sInfoThousands': ',',
                    'sLengthMenu': 'Exibir _MENU_ resultados',
                    'sLoadingRecords': 'Carregando...',
                    'sProcessing': 'Processando...',
                    'sSearch': '<i class="fa fa-search"></i>',
                    'sZeroRecords': 'Não foram encontrados resultados',
                    'oPaginate': {
                        'sFirst': '<i class="fa fa-angle-double-left"></i>',
                        'sPrevious': '<i class="fa fa-angle-left"></i>',
                        'sNext': '<i class="fa fa-angle-right"></i>',
                        'sLast': '<i class="fa fa-angle-double-right"></i>',
                    },
                    'oAria': {
                        'sSortAscending': ': filtro ascendente ativo',
                        'sSortDescending': ': filtro descendente ativo'
                    }
                })
                .withOption('bLengthChange', false)
                .withOption('aaSorting', [])
                .withBootstrap();
        }

        onInit();
    }
})();
