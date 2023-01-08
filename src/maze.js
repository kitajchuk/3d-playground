import {
  Mesh,
  Vector3,
  BoxGeometry,
  MeshBasicMaterial,
} from "three";
import { Capsule } from "three/examples/jsm/math/Capsule";
import CellGen from "./utils/cellgen";
import World from "./utils/world";
import Player from "./utils/player";
import Colors from "./utils/colors";

class Game {
  constructor() {
    this.info = document.getElementById( "info" );
    this.blit = this.blit.bind( this );
    this.world = new World({
      blit: this.blit,
      fog: true,
    });
    this.cellGen = new CellGen({
      width: this.world.width,
      height: this.world.height,
      cellSize: this.world.scale,
    });
    this.blockGeometry = new BoxGeometry(
      this.world.scale,
      this.world.scale,
      this.world.scale
    );
    this.blockMaterial = new MeshBasicMaterial({
      color: Colors.teal,
      wireframe: true,
    });
    this.spawn = null;

    // Initialize
    this._init();
    this._events();
  }

  _addBlock( x, y, z ) {
    const block = new Mesh( this.blockGeometry, this.blockMaterial );
    block.position.x = x;
    block.position.y = y;
    block.position.z = z;
    this.world.addToGroup( block );
  }

  // Cheese spawn logic (can make this a lot better)
  // Finds the first empty cell that has four empty cell neighbors
  _trySpawn( x, y, xx, zz ) {
    const cellUp = this.cellGen.world.grid[ y - 1 ][ x ];
    const cellLeft = this.cellGen.world.grid[ y ][ x - 1 ];
    const cellDown = this.cellGen.world.grid[ y + 1 ][ x ];
    const cellRight = this.cellGen.world.grid[ y ][ x + 1 ];
    const cellsEmptyCross = (
      (cellUp && cellUp.getValue() === 1) && 
      (cellLeft && cellLeft.getValue() === 1) && 
      (cellDown && cellDown.getValue() === 1) && 
      (cellRight && cellRight.getValue() === 1)
    );

    if ( cellsEmptyCross ) {
      this.spawn = new Capsule(
        new Vector3( xx, 1, zz ),
        new Vector3( xx, 0, zz ),
        0.5
      );
    }
  }

  _init() {
    this.cellGen.generate().then(() => {
      for ( let y = 0; y < this.world.height; y++ ) {
        for ( let x = 0; x < this.world.width; x++ ) {
          const cell = this.cellGen.world.grid[ y ][ x ];
          const value = cell.getValue();
          const xx = (x - (this.world.width / 2)) + (this.world.scale / 2);
          const zz = (y - (this.world.height / 2)) + (this.world.scale / 2);

          if ( value === 0 ) {
            this._addBlock( xx, (this.world.scale / 2), zz );

          } else if ( !this.spawn && y > 0 && x > 0 ) {
            this._trySpawn( x, y, xx, zz );
          }
        }
      }

      this.player = new Player({
        world: this.world,
        spawn: this.spawn,
      });

      this.world.genOctree();
    });
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