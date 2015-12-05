'use strict';

angular.module('suitMeApp').controller('FinderController', ['$scope', '$http', '$q', function($scope, $http, $q){


var gCategories = ['belt', 'jacket', 'shirt', 'coat', 'trousers', 'shoe', 'socks'];

var updateDeleteId = function(articleId){
   console.log(articleId); 
};


$scope.testFunction = function(){
    var debug = 1;
    //Delete by id 
    var id = 'K4452D00F-O11';
    deleteArticleById(id);
    //////Calculate Rank
    gCategories.forEach(function(curCategory){
       //Get top article
       var topArticleId = getTopArticle(curCategory);
       if (debug == 1) console.log(topArticleId);
       
       //Get recommendations for it
       var promis = getRecommendations(topArticleId);
       var recommondationIds = [];
       $q.all([promis]).then(function(arrayOfResult)
       {
           //==================== increment rank for each item
           try{
                arrayOfResult[0]['data'].forEach(function(recomend){
                   recommondationIds.push(recomend['id']);
                });
                console.log(recommondationIds);
                //Add all recommondations
                recommondationIds.forEach(function(recomID){
                    console.log(recomID);
                    getArticle(recomID).then(function(article){
                        console.log(article['data']);
                        createOrRankByArticle(article);
                        console.log($scope.globalArticles);
                    });
                });
            } catch (e)
            {}
            
       })
    });

}


var getRecommendations = function(id){
    if (id == 0) return 0;
    var myUrl = "https://api.zalando.com/recommendations/";
    myUrl = myUrl.concat(id);
    return $http({
        methode: 'GET',
        url:     myUrl,
        });
}

var getRecommendationIds = function(id){
    var recommendations = getRecommendations(id);
    var ids = [];
    recommendations.forEach(function(recomend){
        ids.push(recomend['id']);
    })
    return ids;
}


var getArticle = function(id){
    var myUrl = "https://api.zalando.com/articles/";
    myUrl = myUrl.concat(id);
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
    var i = $scope.globalArticles.length;
    while(i--){
        if ($scope.globalArticles[i] && $scope.globalArticles[i]['id'] == id)
        {
            $scope.globalArticles.splice(i,1);
            console.log("====" + i + "----" + id + "   " + $scope.globalArticles[i]['id']);
        }
    }
}
    
var getTopArticle = function(categoryName){
    var retArticle;
    $scope.globalArticles.forEach(function(curArticle){
       if (curArticle['ourCategory'] == categoryName)
       {
            if (curArticle['ourChoice'] == 1) return curArticle['id'];
            retArticle = curArticle;
       }
    })
    if (retArticle) return retArticle['id'];
    else return 0;
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
