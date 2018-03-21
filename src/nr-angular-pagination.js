(function () {

    'use strict';

    angular
        .module('NrAngularPagination', [])
        .component('pagination', {
            bindings: {
                options: '=',
                onPageChange: '&',
                onLimitChange: '&'
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

        /* LOCAL VARIABLES */
        var count = 0,
            operation = 'default',
            additionalQuery = {};

        /* LISTENER */
        $scope.$on('paginationListener', function (event, args) {
            operation = args.operation || operation;
            additionalQuery = args.additionalQuery || additionalQuery;

            if (args.operation === 'reset-search')
                removeAdditionalQuery();

            if (args.reload)
                jumpToPage(1, {
                    reload: true
                });

            if (args.count)
                getButtons(args.count);
        });

        this.$onInit = function () {
            handleOptions();
            getCount();
        };

        /* FUNCTION DECLARATIONS */
        function getCount() {
            return vm.options.getCount().then(function (countArg) {
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

            return vm.onLimitChange({ limit: vm.options.query.limit });
        }

        function getButtons(count) {
            if (count === 0)
                vm.totalButtons = 1;
            else
                vm.totalButtons = ((count + (vm.options.query.limit - 1)) - (count + (vm.options.query.limit - 1)) % (vm.options.query.limit)) / vm.options.query.limit;

            //emptying original array
            vm.pages.length = 0;

            _.times(vm.totalButtons, function (i) {
                vm.pages.push(i + 1);
            });
        }

        function nextPage() {
            if (vm.currentPage < vm.pages.length)
                vm.currentPage++;

            if ((vm.options.query.skip + vm.options.query.limit) < count) {
                vm.options.query.skip += vm.options.query.limit;
            }
            return changePage();
        }

        function prevPage() {
            if (vm.currentPage !== 1)
                vm.currentPage--;

            if ((vm.options.query.skip - vm.options.query.limit) >= 0) {
                vm.options.query.skip -= vm.options.query.limit;
            }
            return changePage();
        }

        function firstPage() {
            return jumpToPage(1);
        }

        function lastPage() {
            return jumpToPage(vm.totalButtons);
        }

        function jumpToPage(pageNum, options) {
            vm.currentPage = pageNum;
            vm.options.query.skip = (pageNum - 1) * vm.options.query.limit;
            return changePage(options);
        }

        function changePage(options) {
            options = options || {};

            return vm.onPageChange({
                options: {
                    operation: operation,
                    query: Object.assign({}, additionalQuery, vm.options.query),
                    reload: options.reload
                }
            });
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
        function removeAdditionalQuery() {
            additionalQuery = {};
        }

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