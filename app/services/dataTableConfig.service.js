(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('dataTableConfigService', dataTableConfigService);

    /** ngInject */
    function dataTableConfigService(DTOptionsBuilder, $log) {
        $log.info('dataTableConfigService');

        return {
            init: _init
        };

        function _init() {
            return DTOptionsBuilder
                .newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(25)
                .withLanguage({
                    'sEmptyTable': 'Nenhum dado foi encontrado. :(',
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
                .withOption('aaSorting', [])
                .withBootstrap();
        }
    }
})();
