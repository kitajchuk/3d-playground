import World from "./utils/world";
import Player from "./utils/player";

class Game {
  constructor() {
    this.info = document.getElementById( "info" );
    this.blit = this.blit.bind( this );
    this.world = new World({
      blit: this.blit,
    });
    this.player = new Player({
      world: this.world,
      third: true,
    });

    // Initialize
    this._init();
    this._events();
  }

  _init() {
    this.world.genOctree();
  }

  _events() {
    document.body.addEventListener( "click", () => {
      if ( !this.info.classList.contains( "out" ) ) {
        this.info.classList.add( "out" );
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