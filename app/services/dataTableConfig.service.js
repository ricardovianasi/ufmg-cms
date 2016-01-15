;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('dataTableConfigService', dataTableConfigService);

    dataTableConfigService.$inject = [
      'DTOptionsBuilder'
    ];

    function dataTableConfigService(DTOptionsBuilder) {
      console.log('... dataTableConfigService');

      return {
        init: init
      };

      function init(){
       /**
        * config DTOptionsBuilder
        */
        return DTOptionsBuilder
                .newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(30)
                .withLanguage({
                    "sEmptyTable":     "Nenhum dado foi encontrado. :(",
                    "sInfo":           "Mostrando de _START_ á _END_ de _TOTAL_ resultados",
                    "sInfoEmpty":      "Mostrando de 0 á 0 de 0 resultados",
                    "sInfoFiltered":   "(Filtrado de _MAX_ resultados)",
                    "sInfoPostFix":    "",
                    "sInfoThousands":  ",",
                    "sLengthMenu":     "Mostrar _MENU_ resultados",
                    "sLoadingRecords": "Carregando...",
                    "sProcessing":     "Processando...",
                    "sSearch":         "Pesquisar: ",
                    "sZeroRecords":    "Não foram encontrados resultados",
                    "oPaginate": {
                        "sFirst":    "<<",
                        "sLast":     ">>",
                        "sNext":     ">",
                        "sPrevious": "<"
                    },
                    "oAria": {
                        "sSortAscending":  ": filtro ascendente ativo",
                        "sSortDescending": ": filtro descendente ativo"
                    }
                })
                .withBootstrap();
      }
    }
})();
