(function () {

    'use strict';

    angular
        .module('Demo', [
            'ngMaterial',
            'NrAngularPagination'
        ])
        .controller('DemoController', DemoController);

    /* @ngInject */
    function DemoController($scope, $http, $httpParamSerializer) {

        var BASEURL = 'http://localhost:4000/api/comments';

        $scope.paginationOptions = {
            'getCount': getCommentsCount,
            'query': { skip: 0, limit: 10 }
        };
        $scope.comments = [];

        $scope.getComments = getComments;
        $scope.searchComments = searchComments;

        /* INIT */
        getComments({ limit: $scope.paginationOptions.query.limit });

        /* FUNCTION DECLARATIONS */
        function getComments(query) {
            var qs = qs = $httpParamSerializer(query),
                url = BASEURL + '?' + qs;

            $http.get(url).then(function (response) {
                $scope.comments = response.data;
            });

            /* fetch(url)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                //does not work
                $scope.comments = data;
                })
                .catch(function (err) {
                    console.error(err);
                }); */
        }

        function getCommentsCount() {
            return $http.get(BASEURL + '/count').then(function (response) {
                return response.data.count;
            });
        }

        function searchComments(searchText) {
            getComments(Object.assign({}, $scope.paginationOptions.query, { text: searchText }));
        }

    }

})();