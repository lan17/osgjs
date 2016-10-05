( function () {
    'use strict';

    var OSG = window.OSG;
    var osg = OSG.osg;
    var ExampleOSGJS = window.ExampleOSGJS;

    var leftSound = 'https://soundcloud.com/youngma/young-ma-ooouuu-1';
    var rightSound = '';

    var SoundCloudAudioSource = function ( player ) {

        player.crossOrigin = 'anonymous';
        var self = this;

        var audioCtx = new( window.AudioContext || window.webkitAudioContext ); // this is because it's not been standardised accross browsers yet.

        var panner = audioCtx.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;
        panner.orientationX.value = 1;
        panner.orientationY.value = 0;
        panner.orientationZ.value = 0;

        var source = audioCtx.createMediaElementSource( player ); // this is where we hook up the <audio> element
        source.connect( panner );
        panner.connect( audioCtx.destination );


        var listener = audioCtx.listener;
        listener.positionX.value = 0;
        listener.positionY.value = 0;
        listener.positionZ.value = 3;

        this.playStream = function ( streamUrl ) {
            // get the input stream from the audio element
            player.setAttribute( 'src', streamUrl );
            player.play();
        };
    };

    var Example = function () {
        ExampleOSGJS.call( this );
    };


    Example.prototype = osg.objectInherit( ExampleOSGJS.prototype, {

        // helpers
        createLeftSound: function ( ) {
            var player = document.getElementById( 'left-sound' );
            var loader = new window.SoundcloudLoader( player );
            var audioSource = new SoundCloudAudioSource( player );

            var loadAndUpdate = function ( trackUrl ) {
                loader.loadStream( trackUrl,
                    function () {
                        osg.log( 'streaming ' + trackUrl );
                        audioSource.playStream( loader.streamUrl() );
                    },
                    function () {
                        osg.error( loader.errorMessage );
                    } );
            };
            loadAndUpdate( leftSound );
        },


        createScene: function () {
            // the root node
            var scene = new osg.Node();
            scene.getOrCreateStateSet().setAttributeAndModes( new osg.CullFace( 0 ) );

            this.createLeftSound();

            this.getRootNode().addChild( scene );

            this._viewer.getManipulator().setNode( scene );
            this._viewer.getManipulator().computeHomePosition();
        }

    } );

    window.addEventListener( 'load', function () {

        var example = new Example();
        example.run();
        window.example = example;

    }, true );

} )();
