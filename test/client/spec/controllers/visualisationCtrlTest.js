'use strict';

describe('Controller: visualisationCtrl', function () {

  // load the controller's module
  beforeEach(module('esExploreApp'));

  var visualisationCtrl;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach( inject( function ( $controller, $rootScope ) {
    
    scope = $rootScope.$new();
    visualisationCtrl = $controller('visualisationCtrl', {
      $scope: scope
    });
  }));

  it('page slide triggers should be false on init', function () {
    
    expect(scope.showCreate).toBe(false);
    expect(scope.showSettings).toBe(false);
    expect(scope.showHelp).toBe(false);
  });
});
