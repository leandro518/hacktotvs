(function () {
    'use strict';
    angular
        .module(global.config.APP_NAME)
        .service('DatabaseService', Service);

    Service.$inject = ['$q'];

    function Service($q) {
        var service = this;

        service.init = function(type) {
            service.type = type;

            if( service.type == "WEBSQL" ) {
                service.db = openDatabase("maindb", "1.0", "App Database", 200000);
            } else if( service.type == "TOTVS_SQLITE") {
                service.db = channel;
            }

            var query = "CREATE TABLE IF NOT EXISTS TASKS (" +
                            "ID integer PRIMARY KEY, " +
                            "NAME text, " +
                            "DATE text)";


            return service.execute(query);
        }

        service.execute = function(query) {
            var deferred = $q.defer();

            if( service.type == "WEBSQL" ) {
                service.db.transaction(function(transaction){
                    transaction.executeSql(query, null,
                        function(transaction, result) {
                            var retorno = [];

                            for( var rc = 0; rc < result.rows.length; rc++ ) {
                                retorno.push(result.rows[rc]);
                            }

                            deferred.resolve(retorno);
                        },
                        function(transaction, e) {
                            deferred.reject(e);
                        });
                });
            } else if( service.type == "TOTVS_SQLITE") {
                var callback = function(result) {
                    if(result.result == 0) {
                        deferred.resolve(result.data);
                    } else {
                        deferred.reject(result.erro);
                    }
                }

                if( query.toUpperCase().indexOf("SELECT") != -1 ) {
                    service.db.dbGet(query, callback);
                } else {
                    service.db.dbExec(query, callback);
                }
            }

            return deferred.promise;
        }
    }
}());
