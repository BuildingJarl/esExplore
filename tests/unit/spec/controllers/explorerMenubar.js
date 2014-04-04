/*
   Ivan Bacher
   C10736831
   ivan.bacher@mydit.ie

   Unit test for angularJS controller
*/

'use strict';

describe('Controller: explorerCtrl', function () {

  // load the controller's module
  beforeEach(module('esExploreApp'));

  var explorerMenubarCtrl;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach( inject( function ( $controller, $rootScope ) {
    scope = $rootScope.$new();
    explorerMenubarCtrl = $controller('explorerMenubarCtrl', {
      $scope: scope
    });
  }));


  it('should be decalred', function () {
    expect(scope).toNotBe(undefined);
  });
  
  it('attributes should have initial values', function () {
      
    expect(scope.showCreate).toBe(false);
    expect(scope.showHelp).toBe(false);
    expect(scope.showAbout).toBe(false);
    expect(scope.showDemo).toBe(false);
    expect(scope.showFeedback).toBe(false);
  });

  describe('toggel slider function', function(){
    
    it('toggle slider - showCreate simple', function () {
        
      scope.showCreate = false;
      scope.toggleSlider('create');
      expect(scope.showCreate).toBe(true);
    });

    it('toggle slider - showCreate advanced', function () {
      
      scope.showHelp = true;
      scope.showAbout = true;
      scope.showDemo = true;
      scope.showFeedback = true;
      scope.showCreate = false;

      scope.toggleSlider('create');

      expect(scope.showCreate).toBe(true);
      expect(scope.showAbout).toBe(false);
      expect(scope.showHelp).toBe(false);
      expect(scope.showDemo).toBe(false);
      expect(scope.showFeedback).toBe(false);
    });

    it('toggle slider - showHelp simple', function () {
        
      scope.showHelp = false;
      scope.toggleSlider('help');
      expect(scope.showHelp).toBe(true);
    });

    it('toggle slider - showHelp advanced', function () {
      
      scope.showHelp = false;
      scope.showAbout = true;
      scope.showDemo = true;
      scope.showFeedback = true;
      scope.showCreate = true;

      scope.toggleSlider('help');

      expect(scope.showCreate).toBe(false);
      expect(scope.showAbout).toBe(false);
      expect(scope.showHelp).toBe(true);
      expect(scope.showDemo).toBe(false);
      expect(scope.showFeedback).toBe(false);
    });

    it('toggle slider - showAbout simple', function () {
        
      scope.showAbout = false;
      scope.toggleSlider('about');
      expect(scope.showAbout).toBe(true);
    });

    it('toggle slider - showAbout advanced', function () {
      
      scope.showHelp = true;
      scope.showAbout = false;
      scope.showDemo = true;
      scope.showFeedback = true;
      scope.showCreate = true;

      scope.toggleSlider('about');

      expect(scope.showCreate).toBe(false);
      expect(scope.showAbout).toBe(true);
      expect(scope.showHelp).toBe(false);
      expect(scope.showDemo).toBe(false);
      expect(scope.showFeedback).toBe(false);
    });

    it('toggle slider - showDemo simple', function () {
        
      scope.showDemo = false;
      scope.toggleSlider('demo');
      expect(scope.showDemo).toBe(true);
    });

    it('toggle slider - showDemo advanced', function () {
      
      scope.showHelp = true;
      scope.showAbout = true;
      scope.showDemo = false;
      scope.showFeedback = true;
      scope.showCreate = true;

      scope.toggleSlider('demo');

      expect(scope.showCreate).toBe(false);
      expect(scope.showAbout).toBe(false);
      expect(scope.showHelp).toBe(false);
      expect(scope.showDemo).toBe(true);
      expect(scope.showFeedback).toBe(false);
    });

    it('toggle slider - showFeedback simple', function () {
        
      scope.showFeedback = false;
      scope.toggleSlider('feedback');
      expect(scope.showFeedback).toBe(true);
    });

    it('toggle slider - showFeedback advanced', function () {
      
      scope.showHelp = true;
      scope.showAbout = true;
      scope.showDemo = true;
      scope.showFeedback = false;
      scope.showCreate = true;

      scope.toggleSlider('feedback');

      expect(scope.showCreate).toBe(false);
      expect(scope.showAbout).toBe(false);
      expect(scope.showHelp).toBe(false);
      expect(scope.showDemo).toBe(false);
      expect(scope.showFeedback).toBe(true);
    });
    
  });



});
