(function ($) {
  $.witness = function (options, element) {
    this.element = $(element);
    this._init(options);
  };

  $.witness.settings = { socketUrl: "http://localhost", //change this to server ip and port 8080
  						 emitSocket: "sendWitness",
  						 listenSocket: "responseWitness",
  						 listenElement: null};

  $.witness.prototype = {
    _init : function (options) {
      this.settings = $.extend( true, {}, $.witness.settings, options);
	  var thisWitness = this;
	  var socket = io.connect(this.settings.socketUrl);	  
	  $(this.element).bind('input', function(){
    		var content = $(this).val();
    		socket.emit($.witness.settings.emitSocket, { d: content });
	  });
  	  socket.on($.witness.settings.listenSocket, function (data) {
      	thisWitness.sync(data.d);
      });
    },
    sync : function(data){
    //support noninput elements
    	if($.witness.settings.listenElement !== null){
    		$($.witness.settings.listenElement).val(data);
    	} else {
			$(this.element).val(data);    		
    	}
    }
  };

  $.fn.witness = function ( options ) {
    if ( typeof options === 'string' ) {
      var args = Array.prototype.slice.call( arguments, 1 );

      this.each(function(){
        var instance = $.data( this, 'witness' );
        if ( !instance ) {
          return $.error( "cannot call methods on witness prior to initialization; " +
            "attempted to call method '" + options + "'" );
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
          return $.error( "no such method '" + options + "' for witness instance" );
        }
        instance[ options ].apply( instance, args );
      });
    } else {
      this.each(function() {
        var instance = $.data( this, 'witness' );
        if ( instance ) {
          instance.option( options );
          instance._init();
        } else {
          $.data( this, 'witness', new $.witness( options, this ) );
        }
      });
    }
    return this;
  };
})(jQuery);
