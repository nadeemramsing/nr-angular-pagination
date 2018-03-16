(function () {

    'use strict';

    angular
        .module('NrAngularPagination', [])
        .component('pagination', {
            bindings: {
                data: '=',
                view: '='
            },

            templateUrl: 'tpl/nr-angular-pagination.html',

            controller: PaginationController
        });

    function PaginationController() {
        debugger;
    }
})();