import {
  Mesh,
  Vector3,
  FrontSide,
  BoxGeometry,
  VideoTexture,
  MeshBasicMaterial,
} from "three";
import { Capsule } from "three/examples/jsm/math/Capsule";
import World from "./utils/world";
import Player from "./utils/player";
import Colors from "./utils/colors";

class Game {
  constructor() {
    this.info = document.getElementById( "info" );
    this.blit = this.blit.bind( this );
    this.world = new World({
      blit: this.blit,
    });
    this.spawn = new Capsule(
      new Vector3( 0, 1, (this.world.height / 2) - (this.world.scale / 2) ),
      new Vector3( 0, 0, (this.world.height / 2) - (this.world.scale / 2) ),
      0.5
    );

    // Initialize
    this._init();
    this._events();
  }

  _init() {
    this.video = document.createElement( "video" );
    this.video.loop = true;
    this.video.playsinline = true;
    this.video.src = "/kitajchuk_kickflip.mp4";
    this.videoHeight = (9 / 16 * this.world.width);
    this.videoGeometry = new BoxGeometry( this.world.width, this.videoHeight, this.world.scale );
    this.videoTexture = new VideoTexture( this.video );
    this.videoMaterial = new MeshBasicMaterial({
      color: Colors.white,
      map: this.videoTexture,
      side: FrontSide,
    });
    this.videoMesh = new Mesh( this.videoGeometry, this.videoMaterial );
    this.videoMesh.position.y = this.videoHeight / 2;
    this.videoMesh.position.z = -(this.world.height / 2) + (this.world.scale / 2);

    this.player = new Player({
      world: this.world,
      spawn: this.spawn,
    });

    this.world.addToGroup( this.videoMesh );
    this.world.genOctree();
  }

  _events() {
    document.body.addEventListener( "click", () => {
      if ( !this.info.classList.contains( "out" ) ) {
        this.info.classList.add( "out" );

        if ( this.video ) {
          this.video.play();
        }
      }
    });
  }

  blit( time, deltaTime ) {
    if ( this.player ) {
      this.player.controls( deltaTime );
		  this.player.updatePlayer( deltaTime );
    }
  }
}

const game = new Game();

// Expose for console debugging
window.game = game;