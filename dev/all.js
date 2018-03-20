(function () {

    'use strict';

    PaginationController.$inject = ["$scope"];
    angular
        .module('NrAngularPagination', [])
        .component('pagination', {
            bindings: {
                options: '=',
                onPageChange: '&',
                onCountChange: '&'
            },
            templateUrl: 'tpl/nr-angular-pagination.html',
            controller: PaginationController,
            controllerAs: 'vm'
        });

    function PaginationController($scope) {
        var vm = this;

        vm.currentPage = 1;
        vm.pages = [];
        vm.totalButtons = 0;

        vm.changeLimit = changeLimit;
        vm.firstPage = firstPage;
        vm.jumpToPage = jumpToPage;
        vm.lastPage = lastPage;
        vm.nextPage = nextPage;
        vm.prevPage = prevPage;
        vm.show = show;

        var count = 0,
            operation = '',
            query = {};

        /* LISTENER */
        $scope.$on('pagination-listener', function (event, args) {

        });

        /* $scope.$on('refresh', function (event, args) {
            vm.options.getCount(args.query).then(function (response) {
                getButtons(parseInt(response.data));
                firstPage();
            })
        });

        $scope.$on("onAdvancedSearchCount", function (event, args) {
            getButtons(args.count);
            query = args.query;
            operation = "advancedsearch";

            if (args.query && args.query.skip === 0) {
                vm.currentPage = 1;
                vm.options.query.skip = 0;
            }

            //init
            if (!args.query.skip)
                vm.options.updateFooter(args.count, null, vm.options.query.limit, true);
        });

        $scope.$on("onSearch", function (event, args) {
            //Scenario for first condition set: After advanced search, displayed query removed.
            if ((args.count && !args.query) || (args.query && args.query.skip === 0) || args.groupMode) {
                vm.currentPage = 1;
                vm.options.query.skip = 0;
            }

            if (args.loadPagination) {
                getButtons(args.count);
                operation = null;
            } else {
                getButtons(args.count);
                operation = "search";
            }
            query = args.query;

            //init
            if (args.loadPagination || (args.query && args.query.skip === 0) || args.groupMode)
                vm.options.updateFooter(args.count, null, vm.options.query.limit, true);
        }); */

        this.$onInit = function () {
            handleOptions();
            getCount();
        };

        /* FUNCTION DECLARATIONS */
        function getCount() {
            vm.options.getCount(vm.options.query).then(function (countArg) {
                count = typeof countArg === 'number' ? countArg : parseInt(countArg);
                getButtons(count);
            });
        }

        function changeLimit() {
            getButtons(count);

            if (vm.currentPage > vm.totalButtons)
                jumpToPage(vm.totalButtons);
            else
                jumpToPage(vm.currentPage);

            PropertiesStoreService.changeLimit(vm.options.query.limit)
                .then(function (response) { })
                .catch(function (err) {
                    console.error(err);
                })
        }

        function getButtons(count) {
            if (count === 0)
                vm.totalButtons = 1;
            else
                vm.totalButtons = ((count + (vm.options.query.limit - 1)) - (count + (vm.options.query.limit - 1)) % (vm.options.query.limit)) / vm.options.query.limit;

            vm.pages = [];

            _.times(vm.totalButtons, function (i) {
                vm.pages.push(i);
            });
        }

        function nextPage() {
            if (vm.currentPage < vm.pages.length)
                vm.currentPage++;

            if ((vm.options.query.skip + vm.options.query.limit) < count) {
                vm.options.query.skip += vm.options.query.limit;
            }
            emitList();
        }

        function prevPage() {
            if (vm.currentPage !== 1)
                vm.currentPage--;

            if ((vm.options.query.skip - vm.options.query.limit) >= 0) {
                vm.options.query.skip -= vm.options.query.limit;
            }
            emitList();
        }

        function firstPage() {
            jumpToPage(1);
        }

        function lastPage() {
            jumpToPage(vm.totalButtons);
        }

        function jumpToPage(pageNum) {

            if (vm.options.scrollToTop)
                vm.options.scrollToTop();

            vm.currentPage = pageNum;
            vm.options.query.skip = (pageNum - 1) * vm.options.query.limit;
            emitList();
        }

        function emitList() {
            if (query) {
                query.skip = vm.options.query.skip;
                query.limit = vm.options.query.limit;
            }

            if (vm.options.hasOwnProperty('updateFooter')) {
                if (vm.currentPage === vm.pages[vm.pages.length - 1])
                    vm.options.updateFooter(count % vm.options.query.limit, vm.options.query.skip);
                else
                    vm.options.updateFooter(null, vm.options.query.skip, vm.options.query.limit);
            }

            var options = {
                'limit': vm.options.query.limit,
                'skip': vm.options.query.skip,
                'operation': operation || vm.operation,
                'query': query
            };

            //extended behavior to avoid using listeners
            if (vm.options.apiCall) {
                vm.options.apiCall(options);
                return;
            }

            $scope.$emit('refreshList', options);
        }

        var jumper = 20,
            half_jumper = (jumper / 2),
            isBeginning,
            isMiddle,
            isEnd;

        function show(i) {
            isBeginning = vm.currentPage < half_jumper;
            isMiddle = vm.currentPage >= half_jumper && vm.currentPage < (vm.totalButtons - half_jumper);
            isEnd = vm.currentPage >= (vm.totalButtons - half_jumper);

            if (isBeginning)
                if (i < jumper)
                    return true;

            if (isMiddle)
                if (i >= vm.currentPage - half_jumper && i < vm.currentPage + half_jumper)
                    return true;

            if (isEnd)
                if (i >= vm.totalButtons - jumper)
                    return true;
        }

        /* HELPER FUNCTIONS */
        function handleOptions() {
            var requiredOptions = [
                'getCount',
                'query'
            ];

            checkDifference(vm.options, requiredOptions, 'options');

            var requiredQueryOptions = [
                'skip',
                'limit'
            ];

            checkDifference(vm.options.query, requiredQueryOptions, 'options.query');
        }

        function checkDifference(options, requiredOptions, path) {
            var keys = Object.keys(options),
                missingOptions = _.difference(requiredOptions, keys);

            if (missingOptions.length !== 0)
                throw new Error('Required options missing for NrAngularPagination component: ' + missingOptions
                    .map(function (str) { return path + '.' + str })
                    .join(', '));
        }

    }
})();
angular.module('NrAngularPagination').run(['$templateCache', function($templateCache) {$templateCache.put('tpl/nr-angular-pagination.html','<div id="nr-pagination" class="pagination attribution-pagination nr-pagination-wrapper">\r\n    <div layout="row" layout-align="center center">\r\n        <md-select ng-model="vm.data.query.limit" ng-change="vm.changeLimit()" aria-label="change limit">\r\n            <md-option ng-repeat="limit in [25, 50, 100, 500]" ng-value="limit">\r\n                {{limit}}\r\n            </md-option>\r\n        </md-select>\r\n        <ul class="nr-pagination list">\r\n            <li>\r\n                <a ng-class="{none: vm.currentPage === 1}" ng-click="vm.firstPage()" class="prev">&laquo;</a>\r\n            </li>\r\n            <md-tooltip md-direction="{{bottom}}" md-delay="750">Premi\xE8re page</md-tooltip>\r\n        </ul>\r\n        <br>\r\n        <ul class="nr-pagination list">\r\n            <li>\r\n                <a ng-class="{none: vm.currentPage === 1}" ng-click="vm.prevPage()" class="prev">&lt;</a>\r\n            </li>\r\n            <md-tooltip md-direction="{{bottom}}" md-delay="750">Page pr\xE9c\xE9dente</md-tooltip>\r\n        </ul>\r\n        <ul class="nr-pagination list" ng-repeat="i in vm.pages">\r\n            <li ng-if="vm.show($index)">\r\n                <a ng-class="{active: vm.currentPage === $index+1}" ng-click="vm.jumpToPage(i);">{{i}}</a>\r\n            </li>\r\n            <md-tooltip md-direction="{{bottom}}" md-delay="750">Page {{i}}</md-tooltip>\r\n        </ul>\r\n        <ul class="nr-pagination list">\r\n            <li>\r\n                <a ng-class="{none: vm.currentPage === vm.pages.length}" ng-click="vm.nextPage()" class="next">&gt;</a>\r\n            </li>\r\n            <md-tooltip md-direction="{{bottom}}" md-delay="750">Page suivante</md-tooltip>\r\n\r\n        </ul>\r\n        <ul class="nr-pagination list">\r\n            <li>\r\n                <a ng-class="{none: vm.currentPage === vm.pages.length}" ng-click="vm.lastPage()" class="next">&raquo;</a>\r\n            </li>\r\n            <md-tooltip md-direction="{{bottom}}" md-delay="750">Derni\xE8re page</md-tooltip>\r\n        </ul>\r\n        <br>\r\n\r\n    </div>\r\n</div>');}]);
"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,".nr-pagination-wrapper {\n" +
"    padding: 10px 0;\n" +
"}\n" +
"\n" +
".nr-pagination {\n" +
"    user-select: none;\n" +
"    list-style: none;\n" +
"    padding: 0;\n" +
"}\n" +
"\n" +
".nr-pagination li {\n" +
"    display: inline;\n" +
"    text-align: center;\n" +
"}\n" +
"\n" +
".nr-pagination a {\n" +
"    float: left;\n" +
"    display: block;\n" +
"    font-size: 14px;\n" +
"    text-decoration: none;\n" +
"    padding: 5px 12px;\n" +
"    color: #212E3B;\n" +
"    margin-left: -1px;\n" +
"    border: 1px solid transparent;\n" +
"    line-height: 1.5;\n" +
"}\n" +
"\n" +
".nr-pagination.list a {\n" +
"    margin-left: 3px;\n" +
"    padding: 0;\n" +
"    width: 30px;\n" +
"    height: 30px;\n" +
"    line-height: 30px;\n" +
"    -moz-border-radius: 100%;\n" +
"    -webkit-border-radius: 100%;\n" +
"    border-radius: 100%;\n" +
"}\n" +
"\n" +
".nr-pagination.list a:hover {\n" +
"    background-color: lightseagreen;\n" +
"    color: #fff;\n" +
"    cursor: pointer;\n" +
"}\n" +
"\n" +
".nr-pagination.list .active {\n" +
"    background-color: lightblue;\n" +
"    border: 2px solid lightseagreen;\n" +
"    pointer-events: none;\n" +
"}\n" +
"\n" +
".nr-pagination.list a.none {\n" +
"    pointer-events: none;\n" +
"    opacity: 0.5;\n" +
"}");
(function () {

    'use strict';

    DemoController.$inject = ["$scope", "$http", "$httpParamSerializer"];
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

        /* INIT */
        getComments({ limit: 50 });

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

    }

})();