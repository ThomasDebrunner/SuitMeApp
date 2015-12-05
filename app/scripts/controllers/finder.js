'use strict';

angular.module('suitMeApp').controller('FinderController', ['$scope', '$http', '$q', function($scope, $http, $q){


var gCategories = ['belt', 'jacket', 'shirt', 'coat', 'trousers', 'shoe', 'socks'];

var updateDeleteId = function(articleId){
    var localVar;
};


$scope.testFunction = function(){
    //Delete by id 
    var id = 'SE622A08M-O12';
    deleteArticleById(id);
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

var createOrRankByArticle = function(curArticle){
   var debug = 0;
   //Put in correct Category
   var curCategory = '';
   var concatCategories = '';
   curArticle['data']['categoryKeys'].forEach(function( className ){
       concatCategories = concatCategories.concat(className);
       });
   if (debug == 1) console.log(concatCategories);
   //Append Category
   var categoryFound = 0;
   gCategories.forEach(function( categoryName ){
       if (concatCategories.search(categoryName) >= 0)
       {
           if (debug == 1) console.log(categoryName);
           curCategory = categoryName;
       }
   });
   //Is already in globalArticles?
   if (categoryFound >= 0){
       var id = curArticle['data']['id'];
       var alreadyExists = 0;
       $scope.globalArticles.forEach(function(gArticle){
           if (id == gArticle['id'])
               {
                   alreadyExists = 1;
                   incrementRank(id);
                   if (debug == 1) console.log('already exists');
               }
       });
       if (alreadyExists == 0)
       {
           curArticle['data']['ourCategory'] = curCategory;
           curArticle['data']['rank'] = 1;
           $scope.globalArticles.push(curArticle['data']);
       }
       }
}


var incrementRank = function (id){
    $scope.globalArticles.forEach( function(article){
        if (article['id'] == id)
        {
            article['rank']++;
        }
    })
}

var deleteArticleById = function(id){

}
    



////////////////////////////////////////
///// INIT
////////////////////////////////////////

$scope.testCaption='HELLO WORLD'

$scope.globalArticles = [];

//==================== Init allClasses
var art1 = getArticle('K4452D00F-O11');
var art2 = getArticle('SE622D0I1-K11');
var art3 = getArticle('SE622A07M-C12');
var art4 = getArticle('PI912A06N-802');
var art5 = getArticle('PI922G01B-Q11');
var art6 = getArticle('BB182F003-C11');

$q.all([art1, art2, art3, art4, art5, art6]).then(function(arrayOfResult)
{
   arrayOfResult.forEach(function(initArticle){
        createOrRankByArticle(initArticle);
         })
        console.log($scope.globalArticles);
    });
}]);
