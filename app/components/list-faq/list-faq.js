(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('componentsModule')
        .component('listFaq', {
            templateUrl:'components/list-faq/list-faq.html',
            controller: ListFaqController,
            controllerAs: '$ctrl',
            bindings: {
                textLabel: '@',
                faqSelected: '=',
            },
        });

    /** ngInject */
    function ListFaqController(faqService) {
        var $ctrl = this;

        $ctrl.dataFaq = [];
        $ctrl.clearFaq = clearFaq;


        ////////////////

        function clearFaq() {
            $ctrl.faqSelected = undefined;
        }

        function loadFaq() {
            faqService.faqs()
                .then(res => $ctrl.dataFaq = res.data.items);
        }


        $ctrl.$onInit = function() {
            loadFaq();
        };
        $ctrl.$onChanges = function(changesObj) { };
        $ctrl.$onDestroy = function() { };
    }
})();
