import {
  Fog,
  Mesh,
  Group,
  Clock,
  Scene,
  Color,
  SpotLight,
  PlaneGeometry,
  TextureLoader,
  WebGLRenderer,
  PerspectiveCamera,
  MeshBasicMaterial,
} from "three";
import { Octree } from "three/examples/jsm/math/Octree";
import Colors from "./colors";

// plane geometry
const MAP_WIDTH = 2560;
const MAP_HEIGHT = 2048;
const MAP_SCALE = 128;
const MAP_FOV = 64;
const NEAR = 2;
const FAR = 4;

export default class World {
  constructor( props ) {
    this.props = props;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.loader = new TextureLoader();
    this.group = new Group();
    this.clock = new Clock();
    this.octree = new Octree();
    this.scale = 1;
    this.width = MAP_WIDTH / MAP_SCALE;
    this.height = MAP_HEIGHT / MAP_SCALE;
    this.bounds = {
      left: - this.width / 2,
      right: this.width / 2,
      top: - this.height / 2,
      bottom: this.height / 2,
    };

    // Bind context
    this._animation = this._animation.bind( this );

    // Initialize
    this._init();
    this._events();
    this._animate();
  }
  
  _animate() {
    requestAnimationFrame( this._animation );
  }

  _animation( time ) {
    const deltaTime = Math.min( 0.1, this.clock.getDelta() );
    this.renderer.render( this.scene, this.camera );
    this._animate();

    // call child "animate"
    if ( typeof this.props.blit === "function" ) {
      this.props.blit( time, deltaTime );
    }
  }

  _init() {
    // scene
    this.scene = new Scene();
    this.scene.background = new Color( Colors.black );
		
    // fog?
    if ( this.props.fog ) {
      this.scene.fog = new Fog( Colors.black, NEAR, FAR );
    }

    // group (all physical objects)
    this.scene.add( this.group );

    // camera
    this.camera = new PerspectiveCamera(
      MAP_FOV,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.rotation.order = 'YXZ';

    // light
    this.light = new SpotLight( Colors.white, 1 );
    this.scene.add( this.light );

    // geometry
    this.geometry = new PlaneGeometry( this.width, this.height, this.width, this.height )
      .rotateX( (Math.PI / 180) * -90 );
    this.material = new MeshBasicMaterial({
      color: Colors.white,
      wireframe: true,
    });
    this.plane = new Mesh( this.geometry, this.material );
    
    // push the plane to the group
    this.addToGroup( this.plane );

    // renderer
    this.renderer = new WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
  }

  _events() {
    window.addEventListener( "resize", () => {
      this.renderer.setSize( window.innerWidth, window.innerHeight );
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  addToGroup( obj ) {
    this.group.add( obj );
  }

  genOctree() {
    this.octree.fromGraphNode( this.group );
  }
}
