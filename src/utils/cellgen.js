import { CAWorld } from "../vendor/cellauto";

export default class CellGen {
  constructor ( props ) {
    this.props = props;
    this.rafId = null;
    this.tiles = [];
    this.world = new CAWorld( this.props );
    this.register( "living" );
    this.initialize();
  }

  initialize() {
    this.world.initialize([
      {
        name: "living",
        distribution: 100,
      },
    ]);
  }

  generate () {
    return new Promise(( resolve ) => {
      const cycle = () => {
        this.world.step();

        // Tile mapping for this step of the simulation
        const tiles = [];

        for ( let y = 0; y < this.world.height; y++ ) {
          for ( let x = 0; x < this.world.width; x++ ) {
            const cell = this.world.grid[ y ][ x ];
            const value = cell.getValue();
            tiles.push( value );
          }
        }

        // When the old bytes matches the new bytes the simulation is resolved
        if ( this.tiles.join( "" ) === tiles.join( "" ) ) {
          cancelAnimationFrame( this.rafId );
          resolve();

        } else {
          this.tiles = tiles;
          this.rafId = requestAnimationFrame( cycle );
        }
      };

      this.rafId = requestAnimationFrame( cycle );
    });
  }

  register ( type ) {
    this.world.registerCellType( type, {
      getValue() {
        return this.alive ? 0 : 1;
      },
      process( neighbors ) {
        const surrounding = this.countSurroundingCellsWithValue( neighbors, "wasAlive" );

        if ( this.simulated < 20 ) {
          this.alive = surrounding === 1 || surrounding === 2 && this.alive;
        }

        if ( this.simulated > 20 && surrounding === 2 ) {
          this.alive = true;
        }

        this.simulated += 1;
      },
      reset() {
        this.wasAlive = this.alive;
      }
    // Initialize...
    }, function () {
      this.alive = Math.random() > 0.5;
      this.simulated = 0;
    });
  }
}