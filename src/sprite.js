import {
  Mesh,
  Vector3,
  DoubleSide,
  PlaneGeometry,
  TextureLoader,
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
    this.aspect = 1066 / 766;
    this.width = 1 / this.world.scale;
    this.height = (1 * this.aspect / this.world.scale);
    this.asset = "/roller_mingo.png";
    this.loader = new TextureLoader();
    this.spriteTexture = this.loader.load( this.asset );
    this.spriteGeometry = new PlaneGeometry( this.width, this.height );
    this.spriteMaterial = new MeshBasicMaterial({
      color: Colors.white,
      map: this.spriteTexture,
      side: DoubleSide,
      transparent: true,
    });
    this.spriteMesh = new Mesh( this.spriteGeometry, this.spriteMaterial );
    this.spriteMesh.position.y = this.height / 2;

    this.player = new Player({
      world: this.world,
      spawn: this.spawn,
    });

    this.world.addToGroup( this.spriteMesh );
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