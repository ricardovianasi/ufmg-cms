(function() {
    'use strict';

    angular
        .module('tagsManagerModule')
        .controller('TagsController', TagsController);

        /** ngInject */
    function TagsController(dataTableConfigService, TagsService, ModalService, NotificationService, PermissionService) {
        let vm = this;

        vm.removeTag = removeTag;
        vm.createTag = createTag;
        vm.openEditTag = openEditTag;
        vm.hasColumnAction = hasColumnAction;

        activate();

        ////////////////

        function openEditTag(tag, idx) {
            let modal = ModalService.inputModal('Edição de Tag', 'Nome', tag.name,
                ModalService.MODAL_MEDIUM, {required: true});
            modal.result.then(function (name) {
                tag.name = name;
                _updateTag(tag, idx);
            })
            .catch(function () { console.log('catch modal tag'); });
        }

        function createTag() {
            if(vm.nameNewTag) {
                _postTag({ name: vm.nameNewTag });
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
                .then(function() {
                    vm.tags.splice(idx, 1);
                    if(vm.tags.length <= 1) {
                        vm.dtInstance.DataTable.draw();
                    }
                    NotificationService.success('Tag ' + name + ' removida com sucesso!');
                });
        }

        function _updateTag(tag, idx) {
            TagsService.updateTag(tag)
                .then(function () {
                    vm.tags[idx] = tag;
                    NotificationService.success('Tag alterada com sucesso!');
                });
        }

        function _postTag(newTag) {
            TagsService.postTag(newTag)
                .then(function(data) {
                    vm.tags.unshift(data.data);
                    NotificationService.success('Tag '+ newTag.name + ' inserida com sucesso!');
                });
        }

        function _renderDataTable() {
            let numberOfColumns = 2;
            let columnsHasNotOrder = [];
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                filter: 'name',
                name: 'name'
            }]);
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(_getTags);
            vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
        }

        function _getTags(params, fnCallback) {
            TagsService
                .getTags(dataTableConfigService.getParams(params))
                .then(function (res) {
                    _permissions();
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

        function hasColumnAction() {
            return vm.canDelete || vm.canPut;
        }

        function _permissions() {
            vm.canPut = PermissionService.canPut('tags');
            vm.canDelete = PermissionService.canDelete('tags');
            vm.canPost = PermissionService.canPost('tags');
        }

        function activate() {
            _renderDataTable();
            vm.dtInstance = {};
            vm.nameNewTag = '';
        }
    }
})();
