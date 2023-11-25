namespace $.$$ {

	const THREE = $mpds_cifplayer_lib_three.all()
	type THREE = typeof THREE

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
			this.resize()
			this.render_loop()
		}

		@ $mol_mem
		scene() {
			const scene = new THREE.Scene()
			return scene
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

		destructor(): void {
			this.renderer().dispose()
		}

	}


	/**
	 * Dispose of all Object3D`s nested Geometries, Materials and Textures
	 *
	 * @param object  Object3D, BufferGeometry, Material or Texture
	 * @param disposeMedia If set to true will dispose of the texture image or video element, default false
	 */
	export function $mpds_cifplayer_scene_dispose_deep(
		object: InstanceType< THREE["Object3D"] > | InstanceType< THREE["BufferGeometry"] > | InstanceType< THREE["Material"] > | InstanceType< THREE["Texture"] >
	) {
		const dispose = ( object: InstanceType< THREE["BufferGeometry"] > | InstanceType< THREE["Material"] > | InstanceType< THREE["Texture"] > ) => {
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

		if( object.traverse ) object.traverse( ( obj: any ) => disposeObject( obj ) )
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
		material: InstanceType< THREE["Material"] > | InstanceType< THREE["Material"] >[],
		materialCallback?: ( material: any ) => void,
		textureCallback?: ( texture: any ) => void
	) {
		const traverseMaterial = ( mat: InstanceType< THREE["Material"] > ) => {
			if( materialCallback ) materialCallback( mat )

			if( !textureCallback ) return

			Object.values( mat )
				.filter( ( value: any ) => value instanceof THREE.Texture )
				.forEach( ( texture: any ) => textureCallback( texture ) )

			if( ( mat as any ).uniforms ) //InstanceType< THREE["ShaderMaterial"] >
				Object.values( ( mat as any ).uniforms )
					.filter( ( { value }: any ) => value instanceof THREE.Texture )
					.forEach( ( { value }: any ) => textureCallback( value ) )
		}

		if( Array.isArray( material ) ) {
			material.forEach( ( mat: any ) => traverseMaterial( mat ) )
		} else traverseMaterial( material )
	}

}
