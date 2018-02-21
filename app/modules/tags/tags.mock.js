(function() {
    'use strict';

    angular
        .module('tagsModule')
        .service('TagsMock', TagsMock);

    function TagsMock() {
        this.mock = mock;
        
        ////////////////

        function mock() {
            return {
                items: [
                    [
                        {
                            id: 1,
                            name: "Centro-UFMG",
                            post_type: "tag",
                            rating: null
                        },
                        {
                            id: 2,
                            name: "Verão",
                            post_type: "tag",
                            rating: null
                        },
                        {
                            id: 3,
                            name: "Festa",
                            post_type: "tag",
                            rating: null
                        }
                    ],
                    {
                        string: 'Centro-UFMG, Verão, Festa'
                    }
                ]
            }
        }
    }
})();