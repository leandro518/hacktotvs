(function () {
    'use strict';
    angular
    .module(global.config.APP_NAME)
    .service('TaskService', Service);

    Service.$inject = ['$q', '$uibModal', '$http'];

    function Service($q, $uibModal, $http) {
        var service = this;

        service.tasks = [];
        service.vendId = "01"
        service.url = "http://SPON4899:8089/rest/sales/vend/" + service.vendId ;
        service.msg = [];

        service.getTasksList = function() {
          var config = {
                         headers : {
                             'authorization' : 'felipemartinez'
                         }
                     }

         var deferred = $q.defer();

        $http.get(service.url, config).then(function(result)
        {

          service.tasks = result.data;

          deferred.resolve(service.tasks);

          }, function(error)
          {
             deferred.reject(error);
          });

            return deferred.promise;
        }

        //Efetua requisição Rest para listar as Metas
        service.getMeta = function() {
          var config = {
                         headers : {
                             'authorization' : 'felipemartinez'
                         }
                     }

         var deferred = $q.defer();

         var c_url = "http://SPON4899:8089/rest/sales/meta/1";

        $http.get(c_url, config).then(function(result)
        {

          service.meta = result.data;

          deferred.resolve(service.meta);

          }, function(error)
          {
             deferred.reject(error);
          });

          return deferred.promise;
        }

        //Efetua requisição Rest para listar Ranking de vendedores
        service.getRanking = function(idVendedor, callback)
        {

            var url = "http://SPON4899:8089/rest/sales/rank/1";

            $http.get(url).then(function(result)
            {
              service.ranking = result.data.dados;

              callback(result.data.dados);

            }, function(error)
            {
              console.log("Erro getRanking:");
              console.log(error);
            });

          }

        //Efetua requisição Rest para lista vendas com as respectivas comissões
        service.getSales = function(idVendedor, callback){

          var url = "http://SPON4899:8089/rest/sales/" + idVendedor;

          $http.get(url).then(function(result)
          {
            service.sales = result.data.dados;

            callback(result.data.dados);

          }, function(error)
          {
            console.log("Erro getSales:");
            console.log(error);
          });

        }

        //Efetua requisição Rest para listar as mensagens para o vendedor
        service.getMsg = function(IdVend, callback){

          var url = "http://SPON4899:8089/rest/sales/msg/" + IdVend;

          $http.get(url).then(function(result)
          {

            service.msg = result.data.dados;

            callback(result.data.dados);

          }, function(error)
          {
            console.log("Erro getMsg:");
            console.log(error);
          });

        }


        //
        service.addTask = function(task) {

          var options = {
            headers : {
              'authorization' : 'felipemartinez'
            }
          }

          var deferred = $q.defer();

          $http.post(service.url, task, options)
          .then(function(result){

            console.log(result);
            deferred.resolve(service.tasks);

          },function(error){
            console.log(error);
            deferred.reject(error);
          });

          return deferred.promise;

        }

        //Ajusta formato da data
        service.beautify = function(data) {
            var data = new Date(data);
            var dia = data.getDate();

            if (dia.toString().length == 1)
              dia = "0"+dia;

            var mes = data.getMonth()+1;
            if (mes.toString().length == 1)
              mes = "0"+mes;

            var ano = data.getFullYear();

            return dia+"/"+mes+"/"+ano;
        }

        service.completeTask = function(taskIndex) {
            service.tasks.splice(taskIndex, 1);
        }

        service.getTask = function(taskId) {
            for(var i = 0; i < service.tasks.length; i++ ) {
                if( service.tasks[i]._id == taskId ) {
                    return service.tasks[i];
                }
            }
            return null;
        }



    }

}());
