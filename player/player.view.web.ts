namespace $.$$ {

	const THREE = $mpds_cifplayer_lib_three
	type THREE = typeof THREE

	export class $mpds_cifplayer_player extends $.$mpds_cifplayer_player {

		@ $mol_mem
		sub(): readonly any[] {
			this.auto()
			return super.sub()
		}

		@ $mol_mem
		available_overlays() {
			return {
				...super.available_overlays(),
				...this.structure_3d_data().overlayed
			}
		}

		@ $mol_mem
		symlabel(): string {
			return this.structure_3d_data().mpds_data
				? ''
				: (this.structure_3d_data().descr.symlabel)
					? 'SG ' + this.structure_3d_data().descr.symlabel
					: ''
		}

		@ $mol_mem
		descr_a(): string {
			return `a=${ parseFloat( this.structure_3d_data().descr.a ).toFixed( 3 ) }Å`
		}

		@ $mol_mem
		descr_b(): string {
			return `b=${ parseFloat( this.structure_3d_data().descr.b ).toFixed( 3 ) }Å`
		}

		@ $mol_mem
		descr_c(): string {
			return `c=${ parseFloat( this.structure_3d_data().descr.c ).toFixed( 3 ) }Å`
		}

		@ $mol_mem
		descr_alpha(): string {
			return `α=${ parseFloat( this.structure_3d_data().descr.alpha ).toFixed( 3 ) }°`
		}

		@ $mol_mem
		descr_beta(): string {
			return `β=${ parseFloat( this.structure_3d_data().descr.beta ).toFixed( 3 ) }°`
		}

		@ $mol_mem
		descr_gamma(): string {
			return `γ=${ parseFloat( this.structure_3d_data().descr.gamma ).toFixed( 3 ) }°`
		}

		@$mol_mem
		camera_distance() {
			return this.camera().position.clone().sub( this.controls().target )
		}

		@$mol_mem
		zoom_up() {
			this.camera().position.sub( this.camera_distance().multiplyScalar( this.zoom_scale_step() ) )
		}

		@$mol_mem
		zoom_down() {
			this.camera().position.add( this.camera_distance().multiplyScalar( this.zoom_scale_step() ) )
		}

		@$mol_mem
		structure_3d_data() {
			return new $mpds_cifplayer_matinfio( this.str() ).player() as any
		}

		@ $mol_mem_key
		text_canvas( text: string ) {
			const canvas = document.createElement( 'canvas' )
			
			const context = canvas.getContext( '2d' )!

			const metrics = context.measureText( text )
			canvas.width = metrics.width * 3.5
			canvas.height = 30

			context.font = "italic 28px sans-serif"
			context.textAlign = "center"
			context.textBaseline = "middle"
			context.fillStyle = this.$.$mol_lights() ? "#000" : "#fff"
			context.fillText( text, canvas.width / 2, canvas.height / 2 )
			
			return canvas
		}

		create_sprite( text: string ) {
			const canvas = this.text_canvas( text )
			const texture = new THREE.Texture( canvas )
			texture.needsUpdate = true

			const material = new THREE.SpriteMaterial( { map: texture, depthTest: false } )
			const sprite = new THREE.Sprite( material )
			sprite.renderOrder = 1
			sprite.scale.set( canvas.width, 30, 1 )

			const txt = new THREE.Object3D()
			txt.add( sprite )
			txt.name = "label"

			return txt
		}

		@$mol_mem
		color_a(): string {
			return this.$.$mol_lights() ? this.colors_light().a : this.colors_dark().a
		}

		@$mol_mem
		color_b(): string {
			return this.$.$mol_lights() ? this.colors_light().b : this.colors_dark().b
		}

		@$mol_mem
		color_c(): string {
			return this.$.$mol_lights() ? this.colors_light().c : this.colors_dark().c
		}

		@$mol_mem
		axcolor() {
			return [
				this.color_a(),
				this.color_b(),
				this.color_c(),
			]
		}

		@$mol_mem
		ortes() {
			const ortes: number[][] = []

			for( let i = 0; i < 3; i++ ) {
				const x = parseFloat( this.structure_3d_data().cell[ i ][ 0 ] ) * this.atom_pos_scale()
				const y = parseFloat( this.structure_3d_data().cell[ i ][ 1 ] ) * this.atom_pos_scale()
				const z = parseFloat( this.structure_3d_data().cell[ i ][ 2 ] ) * this.atom_pos_scale()
				
				ortes.push( [ x, y, z ] )
			}

			return ortes
		}

		@$mol_mem
		controls_target() {
			return this.centered() ? this.cell_center().clone() : new THREE.Vector3()
		}

		new_three_object( name: string ) {
			const old = this.scene()?.getObjectByName( name )
			if( old ) {
				$mpds_cifplayer_lib_three_view_dispose_deep( old )
				this.scene()?.remove( old )
			}

			const obj = new THREE.Object3D()
			obj.name = name
			this.scene().add( obj )

			return obj
		}

		@$mol_mem
		spacegroup() {
			const { sg_name, ng_name } = this.structure_3d_data()

			return $mpds_cifplayer_matinfio_spacegroup.by_name_and_num( sg_name, ng_name )
		}

		@$mol_mem
		sym_checks() {
			return this.spacegroup().symmetry_list().map( name => this.Sym_check( name ) )
		}

		sym_name( id: any ): string {
			return id
		}

		@$mol_action
		toogle_all_symmetry() {
			const state = this.all_symmetry_enabled() ? false : true

			this.sym_checks().forEach( Check => Check.checked( state ) )
		}

		@$mol_mem
		all_symmetry_enabled() {

			for( const Check of this.sym_checks() ) {

				if( Check.checked() == false ) return false
			}

			return true
		}

		@ $mol_mem_key
		symmetry_visible(id: any, next?: any) {
			if ( next !== undefined ) return next as never
			return id == 'x,y,z' ? true : false
		}

		@$mol_mem
		Toogle_all_title(): string {
			return this.all_symmetry_enabled() ? 'Disable all' : 'Enable all'
		}

		@$mol_mem_key
		symmetric_atoms_raw( symmetry: string ){
			const structure = this.structure_3d_data()
			return structure.atoms.map(
				( data: any ) => this.spacegroup().symmetric_atom( symmetry, data, structure.cell ) 
			)
		}

		@$mol_mem
		atoms(){
			const atoms: any[] = []

			const symmetries_enabled = this.spacegroup().symmetry_list().filter( name => this.symmetry_visible( name ) )

			symmetries_enabled.forEach( symmetry => {

				const next_symmetries = symmetries_enabled.slice( 0, symmetries_enabled.indexOf( symmetry ) )

				this.symmetric_atoms_raw( symmetry ).forEach( ( data: any ) => {
					let overlap = false
					for (const name of next_symmetries) {
						const atoms = this.symmetric_atoms_raw( name )
						for (const d of atoms) {
							if ( data.x < d.x - 0.01 || data.x > d.x + 0.01 ) continue
							if ( data.y < d.y - 0.01 || data.y > d.y + 0.01 ) continue
							if ( data.z < d.z - 0.01 || data.z > d.z + 0.01 ) continue
							overlap = true
							break
						}
						if (overlap) break
					}
					if (overlap) return
	
					atoms.push( {
						...data,
						x: data.x * this.atom_pos_scale(), 
						y: data.y * this.atom_pos_scale(), 
						z: data.z * this.atom_pos_scale() 
					} )
				} )

			} )

			return atoms
		}

		@$mol_mem
		overlay_box() {
			const overlay_box = this.new_three_object( `overlay_box` )

			if( !this.overlay() ) return

			this.atoms().forEach( ( data: any ) => {

				const label = this.create_sprite( data.overlays[ this.overlay() ] )
				label.position.set( data.x, data.y, data.z )

				overlay_box.add( label )
			} )

			return overlay_box
		}

		@$mol_mem
		atom_box() {
			const atom_box = this.new_three_object( `atom_box` )

			this.atoms().forEach( ( data: any ) => {

				const atom = new THREE.Mesh(
					new THREE.SphereGeometry( data.r * this.atom_radius_scale(), 10, 8 ),
					new THREE.MeshLambertMaterial( { color: data.c } )
				)
				atom.position.set( data.x, data.y, data.z )
				atom.name = 'atom'

				atom_box.add( atom )
			} )

			return atom_box
		}
		
		@ $mol_mem
		dir_light(): InstanceType< THREE["DirectionalLight"] >  {
			const intensity = this.$.$mol_lights() ? 1.5 : 0.5

			const dir_light_old = this.scene()?.getObjectByName( 'dir_light' ) as InstanceType< THREE["DirectionalLight"] >
			if( dir_light_old ) {
				dir_light_old.intensity = intensity
				return dir_light_old
			}

			const dir_light = new THREE.DirectionalLight( 0xffffff, intensity )
			dir_light.name = 'dir_light'
			dir_light.position.set( 1, 1.5, 2 )
			this.scene().add( dir_light )
			return dir_light
		}
		
		@ $mol_mem
		ambient_light(): InstanceType< THREE["AmbientLight"] > {
			const intensity = this.$.$mol_lights() ? 5 : 1.5

			const ambient_light_old = this.scene()?.getObjectByName( 'ambient_light' ) as InstanceType< THREE["AmbientLight"] >
			if( ambient_light_old ) {
				ambient_light_old.intensity = intensity
				return ambient_light_old
			}

			const ambient_light = new THREE.AmbientLight( 0x999999, intensity )
			ambient_light.name = 'ambient_light'
			this.scene().add( ambient_light )
			return ambient_light
		}

		draw_3d_line( box: any, start_arr: number[], finish_arr: number[], color = 0xDDDDDD ) {
			const vector = new THREE.BufferGeometry()

			const vertices = new Float32Array( [
				start_arr[ 0 ], start_arr[ 1 ], start_arr[ 2 ],
				finish_arr[ 0 ], finish_arr[ 1 ], finish_arr[ 2 ]
			] )
			
			vector.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )

			const material = new THREE.LineBasicMaterial( { color: color } )
			box.add( new THREE.Line( vector, material ) )
		}

		@$mol_mem
		cell_center() {
			const ortes = this.ortes()
			const vecs = ortes.map( v => new THREE.Vector3( v[ 0 ], v[ 1 ], v[ 2 ] ) )

			const origin = vecs[ 0 ].add( vecs[ 1 ] ).add( vecs[ 2 ] ).multiplyScalar( 0.5 )
			return origin
		}

		@$mol_mem
		axes() {
			const axes = this.new_three_object( 'axes' )

			const origin = new THREE.Vector3( 0, 0, 0 )

			const arrows = this.ortes().map( ( [ x, y, z ], i ) => 
				new THREE.ArrowHelper(
					new THREE.Vector3( x, y, z ).normalize(),
					origin,
					Math.sqrt( x * x + y * y + z * z ),
					this.axcolor()[ i ],
					75,
					10
				)
			)

			arrows.forEach( arrow => axes.add( arrow ) )

			return axes
		}

		@$mol_mem
		cell() {
			const cell_box = this.new_three_object( 'cell_box' )

			if( this.structure_3d_data().cell.length ) {

				const ortes = this.ortes()

				const plane_point1 = [ ortes[ 0 ][ 0 ] + ortes[ 1 ][ 0 ], ortes[ 0 ][ 1 ] + ortes[ 1 ][ 1 ], ortes[ 0 ][ 2 ] + ortes[ 1 ][ 2 ] ]
				const plane_point2 = [ ortes[ 0 ][ 0 ] + ortes[ 2 ][ 0 ], ortes[ 0 ][ 1 ] + ortes[ 2 ][ 1 ], ortes[ 0 ][ 2 ] + ortes[ 2 ][ 2 ] ]
				const plane_point3 = [ plane_point1[ 0 ] + ortes[ 2 ][ 0 ], plane_point1[ 1 ] + ortes[ 2 ][ 1 ], plane_point1[ 2 ] + ortes[ 2 ][ 2 ] ]
				const dpoint = [ ortes[ 1 ][ 0 ] + ortes[ 2 ][ 0 ], ortes[ 1 ][ 1 ] + ortes[ 2 ][ 1 ], ortes[ 1 ][ 2 ] + ortes[ 2 ][ 2 ] ]
				const drawing_cell = []

				drawing_cell.push( [ ortes[ 0 ], plane_point1 ] )
				drawing_cell.push( [ ortes[ 0 ], plane_point2 ] )
				drawing_cell.push( [ ortes[ 1 ], dpoint ] )
				drawing_cell.push( [ ortes[ 1 ], plane_point1 ] )
				drawing_cell.push( [ ortes[ 2 ], dpoint ] )
				drawing_cell.push( [ ortes[ 2 ], plane_point2 ] )
				drawing_cell.push( [ plane_point1, plane_point3 ] )
				drawing_cell.push( [ plane_point2, plane_point3 ] )
				drawing_cell.push( [ plane_point3, dpoint ] )

				for( let i = 0; i < drawing_cell.length; i++ ) {
					this.draw_3d_line( cell_box, drawing_cell[ i ][ 0 ], drawing_cell[ i ][ 1 ] )
				}
			}

			if( this.centered() ) {
				const axes_helper = new THREE.AxesHelper( 200 )
				axes_helper.position.fromArray( this.cell_center().toArray() )
				cell_box.add( axes_helper )
			}
			
			return cell_box
		}

	}

}
