(function() {
    'use strict';

    angular
        .module('useTermModule')
        .controller('UseTermController', UseTermController);

    /** ngInject */
    function UseTermController(UseTermService, PermissionService, toastr, authService) {
        var vm = this;
        vm.isAdmin = false;
        vm.idUser;

        vm.updateTerm = updateTerm;
        vm.signTerm = signTerm;

        activate();

        ////////////////

        function signTerm() {
            authService.account()
                .then(function(res) { return res.data.id; })
                .then(function(idUser) { return UseTermService.signTerm(idUser); })
                .then(function() { toastr.success('Termo assinado com sucesso.'); });
        }

        function updateTerm() {
            var data = {
                term_of_use: vm.term.term,
                updated: vm.forceAccept
            };
            UseTermService.updateTerm(data, vm.term.id)
                .then(function(data) {
                    toastr.success('Termo atualizado com sucesso.');
                });
        }

        function _getTerm() {
            UseTermService.getTerms()
                .then(function(res) {
                    console.log(res);
                    vm.isAdmin = PermissionService.isAdministrator();
                    vm.term = res.data.items[0];
                });
        }

        function activate() {
            _getTerm();
        }
    }
})();