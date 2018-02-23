(function() {
    'use strict';

    angular
        .module('tagsModule')
        .controller('TagsController', TagsController);

        /** ngInject */
    function TagsController(dataTableConfigService, TagsService, ModalService, NotificationService) {
        var vm = this;

        vm.removeTag = removeTag;
        vm.createTag = createTag;
        vm.openEditTag = openEditTag;

        activate();

        ////////////////

        function openEditTag(tag, idx) {
            let modal = ModalService.inputModal('Edição de Tag', 'Nome', tag.name);
            modal.result.then(function (name) {
                tag.name = name;
                _updateTag(tag, idx);
            })
            .catch(function () { console.log('catch modal tag'); });
        }

        function createTag() {
            console.log('createTag', vm.nameNewTag);
            if(vm.nameNewTag) {
                _postTag(vm.nameNewTag);
            } else {
                NotificationService.warning('É necessário informar um nome para a tag.');
            }
            vm.nameNewTag = '';
        }

        function removeTag(id, name, idx) {
            let msgConfirm = 'Voce tem certeza que deseja remover a tag <b>' + name + '</b>?';
            ModalService.confirm(msgConfirm, ModalService.MODAL_MEDIUM, {isDanger: true}).result
                .then(function() { _removeTag(id, name, idx); })
                .catch(function() { console.log('catch modal delete'); });
        }
        
        function _removeTag(id, name, idx) {
            TagsService.deleteTag(id)
                .then(function(data) {
                    vm.tags.splice(idx, 1);
                    NotificationService.success('Tag ' + name + ' removida com sucesso!');
                });
        }

        function _updateTag(tag, idx) {
            TagsService.updateTag(tag)
                .then(function (data) {
                    vm.tags[idx] = tag;
                    NotificationService.success('Tag alterada com sucesso!');
                });
        }

        function _postTag(name) {
            console.log('_postTag', name);
        }

        function _renderDataTable() {
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                filter: 'name',
                name: 'name'
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
                    vm.tags = res.data.items;
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
            vm.dtInstance = {};
            vm.nameNewTag = '';
        }
    }
})();