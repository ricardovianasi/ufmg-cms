(function() {
    'use strict';

    angular
        .module('useTermModule')
        .controller('UseTermController', UseTermController);

    /** ngInject */
    function UseTermController(UseTermService, PermissionService, toastr, authService, $window, $rootScope, $location, $timeout) {
        var vm = this;
        vm.idUser;

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
                    $timeout( function(){
                        $location.path('/');
                        $window.location.reload();
                    }, 2000);
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
                .then(function(data) {
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
                authService.account().then(function(res) { _setStatusSign(); });
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
            toastr.success('Os termos de uso estão aceito.');
        }

        function activate() {
            _getTerm();
        }
    }
})();