'use strict';

angular.module('suitMeApp').controller('FinderController', ['$scope', '$http', '$q', 'detailModal', function($scope, $http, $q, detailModal){


var gCategories = {
    'belt' : [ 'belt','guertel'], 
    'jacket': ['sakko', 'coat', 'mantel','jacket'], 
    'shirt': ['shirt','hemd'], 
    'trousers': ['trousers', 'pants', 'hosen'], 
    'shoe': ['shoes', 'schuhe'], 
    'socks': ['socks','socken']
    };

$scope.updateDeleteId = function(articleId){
    console.log(articleId);
    var debug = 0;
    //Delete by id 
    deleteArticleById(articleId);
    //////Calculate Rank
    var catigorieList = Object.keys(gCategories);
    console.log(catigorieList);
    catigorieList.forEach(function(curCategory){
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
                //console.log(recommondationIds);
                //Add all recommondations
                recommondationIds.forEach(function(recomID){
                    //console.log(recomID);
                    getArticle(recomID).then(function(article){
                        //console.log(article['data']);
                        createOrRankByArticle(article);
                        //console.log($scope.globalArticles);
                    });
                });
            } catch (e)
            {}
            
       })
    });

};


$scope.testFunction = function(){
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

   for (var property in gCategories) {
        if (gCategories.hasOwnProperty(property)) {
            if (new RegExp(gCategories[property].join("|")).test(concatCategories))
            {
                if (debug == 1) console.log(categoryName);
                curCategory = property;
            }
        }
    }  
/*
   gCategories.forEach(function( categoryName ){
       
   });*/
   //Is already in globalArticles?
   if (categoryFound >= 0){
       var id = curArticle['data']['id'];
       var alreadyExists = false;
       $scope.globalArticles.forEach(function(gArticle){
           if (id == gArticle['id'])
               {
                   alreadyExists = true;
                   incrementRank(id);
                   if (debug == 1) console.log('already exists');
               }
       });
       if (alreadyExists == false)
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
    console.log("delete: " + id);
    var i = $scope.globalArticles.length;
    //only if more than one article in this category
    while(i--){
        var category = $scope.globalArticles[i]['ourCategory'];
        if ($scope.globalArticles[i] && $scope.globalArticles[i]['id'] == id &&
            nrOfArticlesInCategory(category) > 1 )
        {
            console.log(category);
            $scope.globalArticles.splice(i,1);
            setHighestScoreToSelection(category);
        }
    }
}

var nrOfArticlesInCategory = function(categoryName)
{
    var numberOfCategory = 0;
    $scope.globalArticles.forEach(function(article){
        if (article['ourCategory'] == categoryName)
            numberOfCategory++;
    });
    return numberOfCategory;
}

var setHighestScoreToSelection = function(categoryName)
{
    var maxRank = 0;
    var bestArticle;
    $scope.globalArticles.forEach(function(article){
        if (article['rank'] > maxRank && article['ourCategory'] == categoryName)
        {
            maxRank = article['rank'];
            bestArticle = article;
        }
    });
    console.log(bestArticle['ourCategory']);
    console.log(bestArticle['id']);
    console.log(bestArticle['rank']);
    bestArticle['rank'] = 999;
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

$scope.showRank = function()
{
    $scope.globalArticles.forEach(function(article){
        console.log(article['id'] + " " + article['ourCategory'] + " " + article['rank']);
    });
}

$scope.showDetail = function(){
    detailModal.activate();
}

////////////////////////////////////////
///// INIT
////////////////////////////////////////

$scope.testCaption='HELLO WORLD'

$scope.globalArticles = [];

//==================== Init allClasses
var art1 = getArticle('K4452D00F-O11');
var art2 = getArticle('SE622D0I1-K11');
var art3 = getArticle('SE622A07L-Q11');
var art4 = getArticle('PI912A06N-802');
var art5 = getArticle('PI922BA02-K11');
var art6 = getArticle('BB182F003-C11');

$q.all([art1, art2, art3, art4, art5, art6]).then(function(arrayOfResult)
{
   arrayOfResult.forEach(function(initArticle){
        createOrRankByArticle(initArticle);
         })
        console.log($scope.globalArticles);
        //set all visible articles to high rank
        $scope.globalArticles.forEach(function(article){
        article['rank'] = 999;
        });
    });


}]);

