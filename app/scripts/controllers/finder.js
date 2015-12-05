'use strict';

angular.module('suitMeApp').controller('FinderController', ['$scope', '$http', '$q', function($scope, $http, $q){


var updateDeleteId = function(articleId){
    var localVar;

};


$scope.testFunction = function(){
    console.log($scope.allClasses);
    var allRecommendations;
    var promis1 = getRecommendations('SE622A08M-O12');
    var promis2 = getRecommendations('OS322O02I-A11');

    $q.all([promis1, promis2]).then(function(arrayOfResult)
    {
        //==================== increment rank for each item
        console.log(arrayOfResult);
    })
}

var getRecommendations = function(id){
    var myUrl = "https://api.zalando.com/recommendations/";
    myUrl = myUrl.concat(id);
    console.log(myUrl);
    return $http({
        methode: 'GET',
        url:     myUrl,
        });
}

var getArticle = function(id){
    var myUrl = "https://api.zalando.com/articles/";
    myUrl = myUrl.concat(id);
    console.log(myUrl);
    return $http({
        methode: 'GET',
        url:     myUrl,
        });
}

$scope.testCaption='HELLO WORLD'

//==================== Init allClasses
var art1 = getArticle('K4452D00F-O11');
var art2 = getArticle('SE622D0I1-K11');
var art3 = getArticle('SE622A07M-C12');
var art4 = getArticle('PI912A06N-802');
var art5 = getArticle('PI922G01B-Q11');
var art6 = getArticle('BB182F003-C11');

$q.all([art1, art2, art3, art4, art5, art6]).then(function(arrayOfResult)
{
   arrayOfResult.forEach(function(res){
        //==================== Put in correct Category
        var concatCategories = '';
        res['data']['categoryKeys'].forEach(function( className ){
            concatCategories = concatCategories.concat(className);
            });
        console.log(concatCategories);
        var found = concatCategories.search('shirt')
        console.log(found);





        });
});


}]);
