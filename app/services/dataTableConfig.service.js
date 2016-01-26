;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('dataTableConfigService', dataTableConfigService);

  dataTableConfigService.$inject = [
    'DTOptionsBuilder'
  ];

  /**
   * @param DTOptionsBuilder
   *
   * @returns {{init: init}}
   */
  function dataTableConfigService(DTOptionsBuilder) {
    console.log('... dataTableConfigService');

    return {
      init: init
    };

    function init() {
      /**
       * config DTOptionsBuilder
       */
      return DTOptionsBuilder
        .newOptions()
        .withPaginationType('full_numbers')
        .withDisplayLength(30)
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
          'sSearch': 'Pesquisar: ',
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
