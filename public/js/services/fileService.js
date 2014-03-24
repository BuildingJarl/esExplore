angular.module('esExploreApp')
   .service( 'fileService', function( $q, $document ) {
      
      var esprimaOptions = {
         loc: true, //Nodes have line and column-based location info
         range: false, //Nodes have an index-based location range (array)
         raw: true, //Literals have extra property which stores the verbatim source
         tokens: false, //An extra array containing all found tokens
         comment: false, //An extra array containing all line and block comments
         tolerant: true //An extra array containing all errors found, attempts to continue parsing when an error is encountered
      };

      //"Static" vars
      ES_EX.File.fid = 0;
      ES_EX.Scope.sid = 0;

      function isFileValid( type ) {

         if( type.indexOf('javascript') != -1 ) {
            return true;
         }
         return false;
      };

      function readFileContents( file ) {

         var defer = $q.defer();
         var fileReader = new FileReader();

         fileReader.onload = function( e ) {
            defer.resolve(e.target.result);
         };

         fileReader.onerror = function( msg ) {
            defer.reject(msg);
         };

         fileReader.readAsText( file );

         return defer.promise;
      };

      this.createFile = function( input ) {

         var file = new ES_EX.File();
         var defer = $q.defer();

         file.name = input.name;

         if( isFileValid ) {
            file.isValid = true;
            readFileContents( input ).then( onSuccess, onError );
         } else {
            defer.resolve();
         }

         return defer.promise;


         function onSuccess( data ) {

            var ast;

            try {
               
               ast = esprima.parse( data, esprimaOptions );

            } catch(e) {

               file.isValid = false;
               file.errors = true;
               file.errorsList.push(e);
            }

            if(file.isValid && ast) {
               file.addAst(ast); 
               file.addScope( escope.analyze( ast ).scopes[0] );
               file.addSource( data );
            }

            defer.resolve(file);
         };

         function onError( msg ) { 
            file.errors = true;
            file.errorsList.push(msg);
         };
      };

      this.createExampleFiles = function() {


         var content = document.getElementById( 'exampleScript' ).textContent;
         var name = 'ExampleScript.js';

         var file = new ES_EX.File();
         file.name = name;
         file.isValid = true;
         var ast = esprima.parse( content, esprimaOptions );
         file.addAst(ast); 
         file.addScope( escope.analyze( ast ).scopes[0] );
         file.addSource( content );

         return file;

      }
});