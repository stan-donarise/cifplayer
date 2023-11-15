namespace $.$$ {

	const THREE = $mpds_cifplayer_lib_three.all()

	export class $mpds_cifplayer_player extends $.$mpds_cifplayer_player {

		@ $mol_mem
		webgl_support() {
			try {
				var canvas = document.createElement( 'canvas' )
				return !!( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) )
			} catch( e ) {
				return false
			}
		}

		// available_overlays = [ "empty", "S" ]
		default_overlay = "S" /// TODO radio checked=checked
		colorset = 'W'
		sample = "data_example\n_cell_length_a 24\n_cell_length_b 5.91\n_cell_length_c 5.85\n_cell_angle_alpha 90\n_cell_angle_beta 90\n_cell_angle_gamma 90\n_symmetry_space_group_name_H-M 'P1'\nloop_\n_symmetry_equiv_pos_as_xyz\nx,y,z\nloop_\n_atom_site_label\n_atom_site_type_symbol\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\n_atom_site_charge\nO1 O 0.425 0.262 0.009 -2.0\nO2 O -0.425 0.262 0.009 -2.0\nH3 H 0.444 0.258 0.154 1.0\nH4 H -0.444 0.258 0.154 1.0\nH5 H 0.396 0.124 0.012 1.0\nH6 H -0.396 0.124 0.012 1.0\nO7 O 0.425 0.236 0.510 -2.0\nO8 O -0.425 0.236 0.510 -2.0\nH9 H 0.444 0.239 0.656 1.0\nH10 H -0.444 0.239 0.656 1.0\nH11 H 0.396 0.374 0.512 1.0\nH12 H -0.396 0.374 0.512 1.0\nSr13 Sr 0.342 0.964 0.467 2.0\nSr14 Sr -0.342 0.964 0.467 2.0\nSr15 Sr 0.342 0.535 0.967 2.0\nSr16 Sr -0.342 0.535 0.967 2.0\nO17 O 0.348 0.971 0.019 -2.0\nO18 O -0.348 0.971 0.019 -2.0\nO19 O 0.348 0.528 0.519 -2.0\nO20 O -0.348 0.528 0.519 -2.0\nO21 O 0.263 0.803 0.701 -2.0\nO22 O -0.263 0.803 0.701 -2.0\nO23 O 0.264 0.695 0.200 -2.0\nO24 O -0.264 0.695 0.200 -2.0\nZr25 Zr 0.261 0.000 0.998 4.0\nZr26 Zr -0.261 0.000 0.998 4.0\nZr27 Zr 0.261 0.499 0.498 4.0\nZr28 Zr -0.261 0.499 0.498 4.0\nO29 O 0.257 0.304 0.806 -2.0\nO30 O -0.257 0.304 0.806 -2.0\nO31 O 0.257 0.195 0.306 -2.0\nO32 O -0.257 0.195 0.306 -2.0\nSr33 Sr 0.173 0.993 0.524 2.0\nSr34 Sr -0.173 0.993 0.524 2.0\nSr35 Sr 0.173 0.506 0.024 2.0\nSr36 Sr -0.173 0.506 0.024 2.0\nO37 O 0.173 0.947 0.986 -2.0\nO38 O -0.173 0.947 0.986 -2.0\nO39 O 0.173 0.551 0.486 -2.0\nO40 O -0.173 0.551 0.486 -2.0\nO41 O 0.098 0.204 0.295 -2.0\nO42 O -0.098 0.204 0.295 -2.0\nO43 O 0.098 0.295 0.795 -2.0\nO44 O -0.098 0.295 0.795 -2.0\nZr45 Zr 0.086 0.004 0.998 4.0\nZr46 Zr -0.086 0.004 0.998 4.0\nZr47 Zr 0.086 0.495 0.498 4.0\nZr48 Zr -0.086 0.495 0.498 4.0\nO49 O 0.074 0.709 0.211 -2.0\nO50 O -0.074 0.709 0.211 -2.0\nO51 O 0.074 0.790 0.711 -2.0\nO52 O -0.074 0.790 0.711 -2.0\nSr53 Sr 0 0.991 0.467 2.0\nSr54 Sr 0 0.508 0.967 2.0\nO55 O 0 0.076 0.020 -2.0\nO56 O 0 0.423 0.520 -2.0"

		@ $mol_mem
		str() {
			return this.sample
		}

		@ $mol_mem
		obj3d() {
			return $mpds_cifplayer_matinfio.to_player( this.str() ) as any
		}

		auto() {
			this.render_start()
			this.resize()
		}

		draw_3d_line( box: THREE.Object3D, start_arr: number[], finish_arr: number[], color = 0xDDDDDD ) {
			const vector = new THREE.BufferGeometry()

			const vertices = new Float32Array( [
				start_arr[ 0 ], start_arr[ 1 ], start_arr[ 2 ],
				finish_arr[ 0 ], finish_arr[ 1 ], finish_arr[ 2 ]
			] )
			vector.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )

			const material = new THREE.LineBasicMaterial( { color: color } )
			box.add( new THREE.Line( vector, material ) )
		}

		create_sprite( text: string ) {
			const canvas = document.createElement( 'canvas' )
			const context = canvas.getContext( '2d' )!
			const metrics = context.measureText( text ), w = metrics.width * 3.5

			canvas.width = w
			canvas.height = 30
			context.font = "italic 28px sans-serif"
			context.textAlign = "center"
			context.textBaseline = "middle"
			context.fillStyle = ( this.colorset == "W" ) ? "#000" : "#fff"
			context.fillText( text, canvas.width / 2, canvas.height / 2 )

			const texture = new THREE.Texture( canvas )
			texture.needsUpdate = true
			const material = new THREE.SpriteMaterial( { map: texture, depthTest: false } )
			const sprite = new THREE.Sprite( material )
			sprite.renderOrder = 1
			const txt = new THREE.Object3D()
			sprite.scale.set( w, 30, 1 )
			txt.add( sprite )
			txt.name = "label"
			return txt
		}

		@ $mol_mem
		atombox() {
			const old = this.scene()?.getObjectByName( "atombox" )
			if( old ) {
				deepDispose( old )
				this.scene()?.remove( old )
			}

			const atombox = new THREE.Object3D()

			const current_overlay = this.default_overlay
			const resolution = this.webgl_support() ? { w: 10, h: 8 } : { w: 8, h: 6 }
			for( let i = 0; i < this.obj3d().atoms.length; i++ ) {
				var x = Math.floor( this.obj3d().atoms[ i ].x * 100 ),
					y = Math.floor( this.obj3d().atoms[ i ].y * 100 ),
					z = Math.floor( this.obj3d().atoms[ i ].z * 100 ),
					r = this.obj3d().atoms[ i ].r * 65,
					atom = new THREE.Mesh(
						new THREE.SphereGeometry( r, resolution.w, resolution.h ),
						new THREE.MeshLambertMaterial( { color: this.obj3d().atoms[ i ].c } )
					)
				atom.position.set( x, y, z )
				atom.name = "atom"
				const overlays = this.obj3d().atoms[ i ].overlays
				atombox.add( atom )

				if( current_overlay !== 'empty' ) {
					const label = this.create_sprite( overlays[ current_overlay ] )
					label.position.set( x, y, z )
					atombox.add( label )
				}
			}

			if( this.obj3d().cell.length ) {
				var axcolor,
					ortes = []
				for( var i = 0; i < 3; i++ ) {
					var a = Math.round( parseFloat( this.obj3d().cell[ i ][ 0 ] ) * 1000 ) / 10,
						b = Math.round( parseFloat( this.obj3d().cell[ i ][ 1 ] ) * 1000 ) / 10,
						c = Math.round( parseFloat( this.obj3d().cell[ i ][ 2 ] ) * 1000 ) / 10
					ortes.push( [ a, b, c ] )
					if( i == 0 ) axcolor = 0x990000
					else if( i == 1 ) axcolor = 0x009900
					else if( i == 2 ) axcolor = 0x0099FF
					atombox.add( new THREE.ArrowHelper(
						new THREE.Vector3( a, b, c ).normalize(),
						new THREE.Vector3( 0, 0, 0 ), Math.sqrt( a * a + b * b + c * c ), axcolor, 75, 10 )
					)
				}

				var plane_point1 = [ ortes[ 0 ][ 0 ] + ortes[ 1 ][ 0 ], ortes[ 0 ][ 1 ] + ortes[ 1 ][ 1 ], ortes[ 0 ][ 2 ] + ortes[ 1 ][ 2 ] ],
					plane_point2 = [ ortes[ 0 ][ 0 ] + ortes[ 2 ][ 0 ], ortes[ 0 ][ 1 ] + ortes[ 2 ][ 1 ], ortes[ 0 ][ 2 ] + ortes[ 2 ][ 2 ] ],
					plane_point3 = [ plane_point1[ 0 ] + ortes[ 2 ][ 0 ], plane_point1[ 1 ] + ortes[ 2 ][ 1 ], plane_point1[ 2 ] + ortes[ 2 ][ 2 ] ],
					dpoint = [ ortes[ 1 ][ 0 ] + ortes[ 2 ][ 0 ], ortes[ 1 ][ 1 ] + ortes[ 2 ][ 1 ], ortes[ 1 ][ 2 ] + ortes[ 2 ][ 2 ] ],
					drawing_cell = []

				drawing_cell.push( [ ortes[ 0 ], plane_point1 ] )
				drawing_cell.push( [ ortes[ 0 ], plane_point2 ] )
				drawing_cell.push( [ ortes[ 1 ], dpoint ] )
				drawing_cell.push( [ ortes[ 1 ], plane_point1 ] )
				drawing_cell.push( [ ortes[ 2 ], dpoint ] )
				drawing_cell.push( [ ortes[ 2 ], plane_point2 ] )
				drawing_cell.push( [ plane_point1, plane_point3 ] )
				drawing_cell.push( [ plane_point2, plane_point3 ] )
				drawing_cell.push( [ plane_point3, dpoint ] )

				var i = 0,
					len = drawing_cell.length
				for( i; i < len; i++ ) {
					this.draw_3d_line( atombox, drawing_cell[ i ][ 0 ], drawing_cell[ i ][ 1 ] )
				}
			}
			atombox.name = "atombox"
			return atombox
		}

		@ $mol_mem
		scene() {
			const scene = new THREE.Scene()

			const dir_light = new THREE.DirectionalLight( 0xffffff, 1 )
			dir_light.position.set( 1, 1.5, 2 )
			scene.add( dir_light )

			const ambient_light = new THREE.AmbientLight( 0x999999 )
			scene.add( ambient_light )

			return scene
		}

		@ $mol_mem
		camera() {
			if( !this.size() ) return
			const { width, height } = this.size()!
			const camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 20000 )
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
			const camera = this.camera()
			if( !camera ) return
			const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } )
			// if ( this.colorset == "W" ) renderer.setClearColor( 0xffffff, 1 )
			// else renderer.setClearColor( 0x000000, 1 )
			// renderer.setPixelRatio( window.devicePixelRatio )
			renderer.render( this.scene(), camera )
			return renderer
		}

		render_start() {
			const renderer = this.renderer()
			if( !renderer ) return
			const container = this.dom_node_actual()
			container.replaceChildren( renderer.domElement )
			this.scene().add( this.atombox() )
			this.render_loop()
		}

		render_loop() {
			this.renderer()!.render( this.scene(), this.camera()! )
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
			this.renderer()!.render( this.scene(), this.camera()! )

			this.controls().handleResize()
		}

	}


	/**
	 * Dispose of all Object3D`s nested Geometries, Materials and Textures
	 *
	 * @param object  Object3D, BufferGeometry, Material or Texture
	 * @param disposeMedia If set to true will dispose of the texture image or video element, default false
	 */
	function deepDispose(
		object: THREE.Object3D | THREE.BufferGeometry | THREE.Material | THREE.Texture
	) {
		const dispose = ( object: THREE.BufferGeometry | THREE.Material | THREE.Texture ) => {
			console.log( object )
			object.dispose()
		}
		const disposeObject = ( object: any ) => {
			if( object.geometry ) dispose( object.geometry )
			if( object.material )
				traverseMaterialsTextures( object.material, dispose, dispose )
		}

		if( object instanceof THREE.BufferGeometry || object instanceof THREE.Texture )
			return dispose( object )

		if( object instanceof THREE.Material )
			return traverseMaterialsTextures( object, dispose, dispose )

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
		material: THREE.Material | THREE.Material[],
		materialCallback?: ( material: any ) => void,
		textureCallback?: ( texture: any ) => void
	) {
		const traverseMaterial = ( mat: THREE.Material ) => {
			if( materialCallback ) materialCallback( mat )

			if( !textureCallback ) return

			Object.values( mat )
				.filter( ( value ) => value instanceof THREE.Texture )
				.forEach( ( texture ) => textureCallback( texture )
				)

			if( ( mat as THREE.ShaderMaterial ).uniforms )
				Object.values( ( mat as THREE.ShaderMaterial ).uniforms )
					.filter( ( { value } ) => value instanceof THREE.Texture )
					.forEach( ( { value }: any ) => textureCallback( value ) )
		}

		if( Array.isArray( material ) ) {
			material.forEach( ( mat ) => traverseMaterial( mat ) )
		} else traverseMaterial( material )
	}

}

