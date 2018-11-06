(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('PeriodicalService', PeriodicalService);

    /** ngInject */
    function PeriodicalService($http, $filter, $uibModal, apiUrl, $log) {
        $log.info('PeriodicalService');
        var periodicalName = '';

        var APIUrl = apiUrl;
        var PERIODICAL_ENDPOINT = $filter('format')('{0}/{1}', APIUrl, 'periodical');

        var _parseEditionData = function (data) {
            var obj = {
                articles: []
            };


            angular.forEach(data.articles, function (article) {

                obj.articles.push({
                    title: article.title,
                    subtitle: article.subtitle,
                    author_name: article.author_name,
                    page_number: article.page_number,
                    cover: article.cover,
                    thumb: article.thumb,
                    tags: article.tags,
                    content: article.content,
                    slug: typeof article.slug !== 'undefined' ? (article.slug.slug || article.slug) : ''
                });
            });

            obj.background = data.background;
            obj.cover = data.cover;
            obj.number = data.number;
            obj.file = data.file;
            obj.theme = data.theme;
            obj.status = data.status;
            obj.resume = data.resume;
            obj.year = data.year;
            obj.slug = typeof data.slug !== 'undefined' ? data.slug.slug : '';

            obj.post_date = convertPostDateToSend(data);
            obj.publish_date = convertPublishDateToSend(data);

            return obj;
        };

        function convertPublishDateToSend(data) {
            var datePublish = new Date(data.publish_date);
            var dd = datePublish.getDate();
            var mm = datePublish.getMonth() + 1;
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var yyyy = datePublish.getFullYear();
            return dd + '/' + mm + '/' + yyyy;
        }

        function convertPostDateToSend(data) {
            var datePost = new Date(data.scheduled_date);
            var dd = datePost.getDate();
            var mm = datePost.getMonth() + 1;
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var yyyy = datePost.getFullYear();
            return dd + '/' + mm + '/' + yyyy + ' ' + data.scheduled_time;
        }

        return {
            getPeriodicalEditions: function (id, params) {
                if (angular.isUndefined(params)) {
                    params = '';
                }
                return $http.get(APIUrl + '/periodical/' + id + '/editions' + params);
            },
            setPeriodicalName: function (periodical) {
                periodicalName = periodical;
            },
            getPeriodicalName: function () {
                return periodicalName;
            },
            getEdition: function (id, edition) {
                return $http.get(APIUrl + '/periodical/' + id + '/edition/' + edition);
            },
            newEdition: function (id, data) {
                return $http.post(APIUrl + '/periodical/' + id + '/edition', _parseEditionData(data));
            },
            updateEdition: function (id, edition, data) {
                var updated = _parseEditionData(data);
                return $http.put(APIUrl + '/periodical/' + id + '/edition/' + edition, updated);
            },
            removeEdition: function (id, edition) {
                return $http.delete(APIUrl + '/periodical/' + id + '/edition/' + edition);
            },
            getPeriodicals: function (id, params) {
                if (angular.isUndefined(params)) {
                    params = '';
                }
                var url = $filter('format')('{0}{1}', PERIODICAL_ENDPOINT, params);
                if (id) {
                    url = $filter('format')('{0}/{1}', PERIODICAL_ENDPOINT, id);
                }
                return $http.get(url);
            },
            newPeriodical: function (data) {
                return $http.post(APIUrl + '/periodical', data);
            },
            updatePeriodical: function (id, data) {
                return $http.put(APIUrl + '/periodical/' + id, data);
            },
            removePeriodical: function (id) {
                return $http.delete(APIUrl + '/periodical/' + id);
            },
            handleArticle: function ($scope, idx, article) {
                var articleModal = $uibModal.open({
                    templateUrl: 'components/modal/article.modal.template.html',
                    controller: 'ArticleModalController',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        article: function () {
                            if (typeof article !== 'undefined') {
                                return article;
                            }

                            return false;
                        }
                    }
                });

                articleModal.result.then(function (data) {
                    if (typeof idx !== 'undefined') {
                        $scope.edition.articles[idx] = data;
                    } else {
                        $scope.edition.articles.push(data);
                    }
                });
            },
            getEditionArticle: function (editionSlug, articleSlug) {
                return $http.get(APIUrl + '/periodical/boletim/edition/' + editionSlug + '/articles/' + articleSlug);
            },
            getEditionArticles: function (editionId) {
                return $http.get(APIUrl + '/periodical/boletim/edition/' + editionId + '/articles/');
            },
        };
    }
})();
