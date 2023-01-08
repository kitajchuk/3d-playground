import {
  Mesh,
  Sprite,
  BoxGeometry,
  TextureLoader,
  SpriteMaterial,
  MeshBasicMaterial,
} from "three";

export class CubeWithGravity {
  constructor( x = 0, y = 0, z = 0, w = 1, h = 1, d = 1, asset = '' ) {
    this.loader = new TextureLoader();
    this.texture = this.loader.load( asset );
    this.texture.anisotropy = 8;
    this.texture.wrapS = this.texture.wrapT = RepeatWrapping;
		this.texture.repeat.set( w, h );
    this.geometry = new BoxGeometry( w, h, d );
    this.material = new MeshBasicMaterial({
      map: this.texture,
    });
    this.cube = new Mesh( this.geometry, this.material );
    this.cube.position.x = x;
    this.cube.position.y = y;
    this.cube.position.z = z;
  }

  applyForces( deltaTime ) {
    if ( this.cube.position.y > (this.geometry.parameters.height / 2) ) {
      this.cube.position.y -= deltaTime;

    } else {
      this.cube.position.y = this.geometry.parameters.height / 2;
    }
  }
}

export class SpriteWithGravity {
  constructor( x = 0, y = 0, z = 0, w = 0, h = 0, scale = 0, asset = '' ) {
    this.loader = new TextureLoader();
    this.texture = this.loader.load( asset );
    this.material = new SpriteMaterial({
      map: this.texture,
    });
    this.sprite = new Sprite( this.material );
		this.sprite.position.set( x, y, z );
		this.sprite.scale.set( w / scale, h / scale, 0 );
  }

  applyForces( deltaTime ) {
    if ( this.sprite.position.y > (this.sprite.scale.y / 2) ) {
      this.sprite.position.y -= deltaTime;

    } else {
      this.sprite.position.y = this.sprite.scale.y / 2;
    }
  }
}