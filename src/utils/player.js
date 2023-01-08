import {
  Mesh,
  Vector3,
  CylinderGeometry,
  MeshBasicMaterial,
} from "three";
import { Capsule } from "three/examples/jsm/math/Capsule";
import Colors from "./colors";

// FPS boilerplate extracted from this example
// https://threejs.org/examples/?q=fps#games_fps
// https://github.com/mrdoob/three.js/blob/master/examples/games_fps.html

const GRAVITY = 30;
const SPEED = 8;
const JUMP = 8;
const MOVE = 500;

export default class Player {
  constructor( props ) {
    this.props = props;
    this.updatePlayer = this.updatePlayer.bind( this );
    this.playerCollisions = this.playerCollisions.bind( this );
    this.getForwardVector = this.getForwardVector.bind( this );
    this.getSideVector = this.getSideVector.bind( this );
    this.controls = this.controls.bind( this );
    this.playerOnFloor = false;
		this.playerCollider = this.props.spawn || new Capsule(
      new Vector3( 0, 1, 0 ),
      new Vector3( 0, 0, 0 ),
      0.5
    );
		this.playerVelocity = new Vector3();
		this.playerDirection = new Vector3();
    this.keyStates = {};

    this._init();
    this._events();
  }

  _init() {
    if ( this.props.third ) {
      this.playerGeometry = new CylinderGeometry(
        this.playerCollider.radius,
        this.playerCollider.radius,
        this.playerCollider.start.y,
        32
      );
      this.playerMaterial = new MeshBasicMaterial({
        color: Colors.blue,
        wireframe: true,
      });
      this.playerCylinder = new Mesh( this.playerGeometry, this.playerMaterial );
      this.props.world.scene.add( this.playerCylinder );
    }
  }

  _events() {
    document.addEventListener( 'keydown', ( event ) => {
      this.keyStates[ event.code ] = true;
    });

    document.addEventListener( 'keyup', ( event ) => {
      this.keyStates[ event.code ] = false;
    });

    if ( !this.props.third ) {
      document.addEventListener( 'mousedown', () => {
        document.body.requestPointerLock();
      });
  
      document.body.addEventListener( 'mousemove', ( event ) => {
        if ( document.pointerLockElement === document.body ) {
          this.props.world.camera.rotation.y -= event.movementX / MOVE;
          this.props.world.camera.rotation.x -= event.movementY / MOVE;
        }
      });
    }
  }

  controls( deltaTime ) {
    if ( this.playerOnFloor ) {
      if ( this.keyStates[ 'KeyW' ] ) {
        this.playerVelocity.add( this.getForwardVector().multiplyScalar( SPEED * deltaTime ) );
      }

      if ( this.keyStates[ 'KeyS' ] ) {
        this.playerVelocity.add( this.getForwardVector().multiplyScalar( - SPEED * deltaTime ) );
      }

      if ( this.keyStates[ 'KeyA' ] ) {
        this.playerVelocity.add( this.getSideVector().multiplyScalar( - SPEED * deltaTime ) );
      }

      if ( this.keyStates[ 'KeyD' ] ) {
        this.playerVelocity.add( this.getSideVector().multiplyScalar( SPEED * deltaTime ) );
      }

      if ( this.keyStates[ 'Space' ] ) {
        this.playerVelocity.y = JUMP;
      }
    }
  }

  getForwardVector() {
    this.props.world.camera.getWorldDirection( this.playerDirection );
		this.playerDirection.y = 0;
		this.playerDirection.normalize();

		return this.playerDirection;
  }

  getSideVector() {
    this.props.world.camera.getWorldDirection( this.playerDirection );
		this.playerDirection.y = 0;
		this.playerDirection.normalize();
		this.playerDirection.cross( this.props.world.camera.up );

		return this.playerDirection;
  }

  updatePlayer( deltaTime ) {
    if ( this.playerOnFloor ) {
      const damping = Math.exp( - 3 * deltaTime ) - 1;
      this.playerVelocity.addScaledVector( this.playerVelocity, damping );

    } else {
      this.playerVelocity.y -= GRAVITY * deltaTime;
    }

    const deltaPosition = this.playerVelocity.clone().multiplyScalar( deltaTime );
    this.playerCollider.translate( deltaPosition );

    this.playerCollisions();

    this.props.world.camera.position.copy( this.playerCollider.end );

    if ( this.props.third ) {
      this.playerCylinder.position.x = this.playerCollider.end.x;
      this.playerCylinder.position.y = this.playerCollider.end.y;
      this.playerCylinder.position.z = this.playerCollider.end.z;

      this.props.world.camera.position.y += 3;
      this.props.world.camera.position.z += 6;
      this.props.world.camera.rotation.x = -0.25;
    }
  }

  playerCollisions() {
    const result = this.props.world.octree.capsuleIntersect( this.playerCollider );

    this.playerOnFloor = false;

    if ( result ) {
      this.playerOnFloor = result.normal.y > 0;

      if ( !this.playerOnFloor ) {
        this.playerVelocity.addScaledVector( result.normal, - result.normal.dot( this.playerVelocity ) );
      }

      this.playerCollider.translate( result.normal.multiplyScalar( result.depth ) );
    }
  }
}