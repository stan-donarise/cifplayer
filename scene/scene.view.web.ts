//@ts-nocheck
namespace $.$$ {

	const THREE = $mpds_cifplayer_lib_three.all()

	export class $mpds_cifplayer_scene extends $.$mpds_cifplayer_scene {

		@ $mol_mem
		webgl_support() {
			try {
				var canvas = document.createElement( 'canvas' )
				return !!( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) )
			} catch( e ) {
				return false
			}
		}

		auto() {
			const container = this.dom_node_actual()
			if ( !container ) return
			const renderer = this.renderer()
			renderer.domElement.style.position = 'absolute' //otherwise renderer.domElement prevents dom_node from resizing
			container.replaceChildren( renderer.domElement )
			this.lights()
			this.resize()
			this.render_loop()
		}

		@ $mol_mem
		scene() {
			const scene = new THREE.Scene()
			return scene
		}

		@ $mol_mem
		lights() {
			const dir_light = new THREE.DirectionalLight( 0xffffff, 1.5 )
			dir_light.position.set( 1, 1.5, 2 )
			this.scene().add( dir_light )
			const ambient_light = new THREE.AmbientLight( 0x999999, 2.5 )
			this.scene().add( ambient_light )
			return { dir_light, ambient_light }
		}

		@ $mol_mem
		camera() {
			const camera = new THREE.PerspectiveCamera( 45, 0, 0.1, 20000 )
			camera.position.set( 900, 900, 1800 )
			return camera
		}

		@ $mol_mem
		controls() {
			const controls = new THREE.TrackballControls( this.camera()!, this.dom_node_actual() as HTMLElement )
			controls.rotateSpeed = 7.5
			controls.staticMoving = true
			return controls
		}

		@ $mol_mem
		renderer() {
			$mol_wire_solid()
			const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } )
			return renderer
		}

		renderer_render() {
			this.renderer()!.render( this.scene(), this.camera()! )
		}

		render_loop() {
			this.renderer_render()
			this.controls().update()
			requestAnimationFrame( () => this.render_loop() )
		}

		@ $mol_mem
		size() {
			if( !this.view_rect() ) return
			const { width, height } = this.view_rect()!
			return { width, height }
		}

		@ $mol_mem
		resize() {
			if( !this.size() ) return
			const { width, height } = this.size()!

			this.camera()!.aspect = width / height
			this.camera()!.updateProjectionMatrix()

			this.renderer()!.setSize( width, height )
			this.renderer_render()

			this.controls().handleResize()
		}

	}


	/**
	 * Dispose of all Object3D`s nested Geometries, Materials and Textures
	 *
	 * @param object  Object3D, BufferGeometry, Material or Texture
	 * @param disposeMedia If set to true will dispose of the texture image or video element, default false
	 */
	export function $mpds_cifplayer_scene_dispose_deep(
		object: any
	) {
		const dispose = ( object: any ) => {
			object.dispose()
		}
		const disposeObject = ( object: any ) => {
			if( object.geometry ) dispose( object.geometry )
			if( object.material ) traverseMaterialsTextures( object.material, dispose, dispose )
		}

		if( object instanceof THREE.BufferGeometry || object instanceof THREE.Texture ) {
			return dispose( object )
		}

		if( object instanceof THREE.Material ) {
			return traverseMaterialsTextures( object, dispose, dispose )
		}

		disposeObject( object )

		if( object.traverse ) object.traverse( ( obj ) => disposeObject( obj ) )
	}

	/**
	 * Traverse material or array of materials and all nested textures
	 * executing there respective callback
	 *
	 * @param material          Three js Material or array of material
	 * @param materialCallback  Material callback
	 * @param textureCallback   THREE.Texture callback
	 */
	function traverseMaterialsTextures(
		material: any,
		materialCallback?: ( material: any ) => void,
		textureCallback?: ( texture: any ) => void
	) {
		const traverseMaterial = ( mat: any ) => {
			if( materialCallback ) materialCallback( mat )

			if( !textureCallback ) return

			Object.values( mat )
				.filter( ( value: any ) => value instanceof THREE.Texture )
				.forEach( ( texture: any ) => textureCallback( texture ) )

			if( ( mat ).uniforms )
				Object.values( ( mat ).uniforms )
					.filter( ( { value }: any ) => value instanceof THREE.Texture )
					.forEach( ( { value }: any ) => textureCallback( value ) )
		}

		if( Array.isArray( material ) ) {
			material.forEach( ( mat ) => traverseMaterial( mat ) )
		} else traverseMaterial( material )
	}

}

