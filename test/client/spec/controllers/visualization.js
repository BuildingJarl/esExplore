'use strict';

describe('Controller: VisualizationCtrl', function () {

  // load the controller's module
  beforeEach(module('esExploreApp'));

  var VisualizationCtrl;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach( inject( function ( $controller, $rootScope ) {
    
    scope = $rootScope.$new();
    VisualizationCtrl = $controller('VisualizationCtrl', {
      $scope: scope
    });
  }));

  it('should return true just to test if its working', function () {
    expect(true).toBe(true);
  });
});
