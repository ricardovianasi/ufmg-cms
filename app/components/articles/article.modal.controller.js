(function () {
    'use strict';

    angular.module('componentsModule')
        .controller('ArticleModalController', ArticleModalController);

    /** ngInject */
    function ArticleModalController($scope,
        $uibModalInstance,
        $uibModal,
        $timeout,
        article,
        MediaService,
        RedactorPluginService,
        TagsService,
        ManagerFileService,
        $log,
        validationService) {
        $log.info('ArticleModalController');


        var allTags = [];

        TagsService.getTags().then(function (data) {
            allTags = data.data.items[0];
        });

        $scope.findTags = function ($query) {
            return TagsService.findTags($query, allTags);
        };

        $scope.article = {};
        $scope.article.tags = [];

        if (article) {
            $scope.article.id = article.id;
            $scope.article.title = article.title;
            $scope.article.subtitle = article.subtitle;
            $scope.article.author_name = article.author_name;
            $scope.article.page_number = article.page_number;
            $scope.article.cover = article.cover;
            $scope.article.thumb = article.thumb;
            $scope.article.content = article.content;
            $scope.article.cover_url = article.cover_url;
            $scope.article.thumb_url = article.thumb_url;
            $scope.article.slug = article.slug;

            angular.forEach(article.tags, function (tag) {
                if (typeof tag.text !== 'undefined') {
                    $scope.article.tags.push(tag.text);
                } else {
                    $scope.article.tags.push(tag);
                }
            });
        }

        $scope.imagencropOptions = RedactorPluginService.getOptions('imagencrop');

        $scope.audioUploadOptions = RedactorPluginService.getOptions('audioUpload');

        $scope.uploadfilesOptions = RedactorPluginService.getOptions('uploadfiles');

        $scope.article_thumb = null;

        // Upload
        // Cover Image - Upload
        $scope.$watch('article_thumb', function () {
            if ($scope.article_thumb) {
                $scope.upload($scope.article_thumb);
            }
        });

        $scope.upload = function (file) {
            MediaService.newFile(file).then(function (data) {
                $scope.article.thumb = data.id;
                $scope.article.thumb_url = data.url;
            });
        };

        $scope.uploadImage = function () {
            ManagerFileService.imageFiles();
            ManagerFileService
                .open('bigPageCover')
                .then(function (image) {
                    $scope.article.cover = image.id;
                    $scope.article.cover_url = image.url;
                });
        };

        $scope.removeImage = function (type) {
            $timeout(function () {
                $scope.article[type] = '';
                $scope.article[type + '_url'] = '';

                $scope.$apply();
            });
        };

        $scope.ok = function () {
            if (!validationService.isValid($scope.formArticle.$invalid)) {
                return false;
            }

            $uibModalInstance.close($scope.article);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
