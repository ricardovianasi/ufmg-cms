(function() {
    'use strict';

    angular
        .module('tagsModule')
        .controller('TagsController', TagsController);

        /** ngInject */
    function TagsController(dataTableConfigService, TagsService, TagsMock) {
        var vm = this;

        vm.removeTag = removeTag;
        vm.editTag = editTag;

        activate();

        ////////////////

        function editTag(tag) {
            console.log('removeTag', tag);
        }

        function removeTag(id, name) {
            console.log('removeTag', id, name);
        }

        function _renderDataTable() {
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                filter: 'name',
                name: 'name'
            }, {
                index: 1,
                name: 'postDate'
            }]);
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(_getTags);
        }

        function _getTags(params, fnCallback) {
            let numberOfColumns = 2;
            let columnsHasNotOrder = [];
            TagsService
                .getTags(dataTableConfigService.getParams(params))
                .then(function (res) {
                    vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                    // _permissions();
                    // vm.tags = res.data;
                    vm.tags = TagsMock.mock();
                    let records = {
                        'draw': params.draw,
                        'recordsTotal': res.data.total,
                        'data': [],
                        'recordsFiltered': res.data.total
                    };
                    fnCallback(records);
                });
        }

        function activate() {
            _renderDataTable();
            vm.tags = TagsMock.mock();
            vm.dtInstance = {};
        }
    }
})();