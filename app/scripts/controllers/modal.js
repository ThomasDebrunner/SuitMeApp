angular.module('suitMeApp').controller('DetailModalController', ['detailModal', function(detailModal){
	this.close = detailModal.deactivate;
}]);