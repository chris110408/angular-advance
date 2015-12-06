/**
 * Created by leichen on 12/4/15.
 */



(function(obj){


    obj.app.controller('mainCtrl', mainCtrl);

    obj.app.directive('debug', debug)
    obj.app.filter('type',typeFilter)
    //
    //obj.app.directive('eqScope', eqScope)
    //
    //obj.app.directive('functionTemp',functionTemp)


    function typeFilter(){
        return function(val){
            var type=typeof(val);
            if(type==='object'){
                return Object.prototype.toString.call(val);

            }else{
                return type;
            }

        }
    }

    function functionTemp(){
        return {
            template:function(el,attrs){
                console.log(attrs.awesomeThing);
                return attrs.awesomeThing+' is supper awesome'

            }
            //scope:{}

        }


    }


    function eqScope(){
        return{

            template:'<input ng-model="vm.theValue"/>',
            scope:{
                theValue:'=eqScopeValue'
            },
            controllerAs:'vm',
            bindToController:true,
            controller:function(){}

        }

    }


    function debug(){
        var defType="json";
        var dyTemp=function(el,attrs){

            var type=attrs['type']||defType;
            var innertype=attrs['innerType']||defType;


            console.log(attrs)

            var tpl=type==='json'&& '<pre ng-bind="value|json"></pre>'
                ||type==='type' && '<pre> Type:{{value | type}}</pre>'
                ||type==='array'&& '<div ng-repeat="el in value" debug="el" type="'+innertype+'">{{el}}</div>'
            return tpl;
        }
        return{


            scope:{
                value:'=debug'
            },

            template:dyTemp



        }

    }

    function mainCtrl($scope) {
        const vm=this;
        $scope.user={
            username:'chris',
            email:'chris.chen@duettoresearch.com',
            id:123,

        }
        $scope.log=[
            "my first message",
            "another message"
        ]
    }


})( {app:angular.module("myapp",[])});
