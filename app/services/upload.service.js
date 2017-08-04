(function () {
    'use strict';

    angular.module('serviceModule')
        /** ngInject */
        .factory('UploadService', function ($q, $http, Upload, $log, apiUrl) {
            $log.info('UploadService');

            return {
                uploadPhoto: function (files) {
                    var deferred = $q.defer();

                    var success = function (data) {
                        deferred.resolve(data);
                    };
                    if (files && files.length) {
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];

                            Upload
                                .upload({
                                    url: apiUrl + '/file',
                                    fields: {
                                        title: files[i].title,
                                        file: files[i].file,
                                        legend: files[i].legend,
                                        description: files[i].description,
                                        alt_text: files[i].alt_text
                                    },
                                    file: file[i]
                                })
                                .success(success);
                        }
                    }
                    return deferred.promise;
                }
            };
        });
})();
