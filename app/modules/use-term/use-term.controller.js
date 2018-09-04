(function() {
    'use strict';

    angular
        .module('useTermModule')
        .controller('UseTermController', UseTermController);

    /** ngInject */
    function UseTermController(UseTermService, PermissionService, toastr, authService, $rootScope, $location) {
        var vm = this;

        vm.termAssigned = false;
        vm.updateTerm = updateTerm;
        vm.signTerm = signTerm;

        activate();

        ////////////////

        function signTerm() {
            vm.signing = true;
            authService.account()
                .then(function(res) { return res.data.id; })
                .then(function(idUser) { return UseTermService.signTerm(idUser); })
                .then(function() {
                    $rootScope.User.term_signed = true;
                    _showMsgTermAssing();
                    $location.path('/');
                })
                .catch(function(error) { console.error(error); })
                .finally(function() { vm.signing = false; });
        }

        function updateTerm() {
            var data = {
                term_of_use: vm.term.term,
                updated: vm.forceAccept
            };
            UseTermService.updateTerm(data, vm.term.id)
                .then(function() {
                    toastr.success('Termos de uso atualizado com sucesso.');
                    vm.forceAccept = false;
                });
        }

        function _getTerm() {
            UseTermService.getTerms()
                .then(function(res) {
                    _permissions();
                    _getUserTermSign();
                    vm.term = res.data.items[0];
                });
            }
            
        function _permissions() {
            vm.canPut = PermissionService.canPut('term_of_use');
        }

        function _getUserTermSign() {
            if(!$rootScope.User) {
                authService.account().then(function() { _setStatusSign(); });
                return;
            }
            _setStatusSign();
        }

        function _setStatusSign() {
            if($rootScope.User && 
                $rootScope.User.term_signed && 
                !$rootScope.User.is_administrator) {
                _showMsgTermAssing();
                vm.termAssigned = true;
            }
        }

        function _showMsgTermAssing() {
            toastr.success('As regras de uso estão aceitas.');
        }

        function activate() {
            _getTerm();
        }
    }
})();