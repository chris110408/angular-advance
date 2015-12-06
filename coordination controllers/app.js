/**
 * Created by leichen on 12/4/15.
 */

    angular.module("myapp",['ngSanitize'])
        .controller('mainCtrl',mainCtrl)
        .factory('feed',feedFcty)
        .directive('contentHandler',contentHandler)
        .directive('content',content)
    function feedFcty($http){
        var loremUrl='http://www.randomtext.me/api/lorem/p-2/20-35'

        return{

            get:function(){

                return $http.get(loremUrl)
            }
        }



    }
    function mainCtrl($scope,$timeout,feed){
        $scope.feed=[];
        $scope.message=[];
        //$scope.hi='hello'


        console.warn($scope);

        $scope.addContent=function(){

            feed.get().success(function (data) {

                $scope.feed.push({'content':data.text_out});
            })
                .error(function(err){

                    console.warn(err);
                })
        }

        $scope.remove=function(el){
            $scope.feed= _.without($scope.feed,el)
        }

        $scope.onUpdate=function(item,action){
                //console.log(item);
            if(action=='registered'){
                item.element.animate({backgroundColor:'yellow'},500);

                setTimeout(function(){
                    item.element.animate({backgroundColor:'white'},500);
                },1000)
            }


            else{


                var mess='goodbye item ' +item.id+'!';
                $scope.message.push(mess);
                $timeout(function(){
                    console.warn($scope.message)
                    $scope.message= _.without($scope.message,mess);
                },1000)
            }
        }
    }

    function contentHandler(){
        return{

            scope:{
                feed:'=contentHandler',
                onChange:'&'
            },

            controller:function($scope){
                console.log($scope);
                var ctrl=this;
                var _elements=[];
                var onChange=angular.noop;

                ctrl.registerElement=function(id,element){
                    var el={
                        id:id,
                        element:element
                    };
                    _elements.push(el);
                    onChange(el,_elements,'registered');

                }

                ctrl.removeElement=function(id){

                    var el= _.find(_elements,function(el){
                        return el.id==id;
                    })
                    if(el){
                        _elements= _.without(_elements,el);
                        onChange(el,_elements,'remove');
                    }


                }

                ctrl.onChange=function(fn){

                    onChange=fn||angular.noop;
                }


            },
            require:'contentHandler',
            link:function($scope,$element,$attrs,contentCtrl){
                if($scope.onChange && angular.isFunction($scope.onChange)){
                    var handler=function(element,elements,action){
                        $scope.onChange({element:element,action:action})
                    }

                }

                contentCtrl.onChange(handler)
            }


        }

    }

    function content(){

        return{
            require:'^contentHandler',
            link:function($scope,$element,$attrs,contentCtrl){
                console.log($element)
                var id=$attrs.contentID||$scope.$id;
                contentCtrl.registerElement(id,$element);

                $scope.$on('$destroy',function(){
                    contentCtrl.removeElement(id);
                })

            }

        }

    }




