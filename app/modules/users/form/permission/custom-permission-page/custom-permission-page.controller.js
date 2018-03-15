(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('CustomPermissionPageController', CustomPermissionPageController);

    /** ngInject */
    function CustomPermissionPageController() {
        let vm = this;

        vm.deletePage = deletePage;
        vm.deleteModule = deleteModule;
        vm.startDialogDelete = startDialogDelete;
        vm.addPage = addPage;

        activate();

        ////////////////

        function addPage(page) {

        }

        function deleteModule(result) {

        }

        function deletePage(result, type, idx) {
            if(!result) {
                endDialodDelete(type, idx);
                return;
            }
        }

        function endDialodDelete(type, idx) {
            vm.toggleDelete[type+idx] = false;
        }

        function startDialogDelete(type, idx) {
            vm.toggleDelete[type+idx] = true;
            console.log('startDialogDelete', vm.toggleDelete);
        }


        function activate() {
            vm.toggleDelete = {}; 
        }
    }
})();