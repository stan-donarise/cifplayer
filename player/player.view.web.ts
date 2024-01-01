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

		@ $mol_mem
		color_a(): string {
			return this.$.$mol_lights() ? this.colors_light().a : this.colors_dark().a
		}

		@ $mol_mem
		color_b(): string {
			return this.$.$mol_lights() ? this.colors_light().b : this.colors_dark().b
		}

		@ $mol_mem
		color_c(): string {
			return this.$.$mol_lights() ? this.colors_light().c : this.colors_dark().c
		}

		@ $mol_mem
		axcolor() {
			return [
				this.color_a(),
				this.color_b(),
				this.color_c(),
			]
		}

		@ $mol_mem
		camera_distance() {
			return this.camera().position.clone().sub( this.controls().target )
		}

		@ $mol_mem
		zoom_up() {
			this.camera().position.sub( this.camera_distance().multiplyScalar( this.zoom_scale_step() ) )
		}

		@ $mol_mem
		zoom_down() {
			this.camera().position.add( this.camera_distance().multiplyScalar( this.zoom_scale_step() ) )
		}

		@ $mol_mem
		structure_3d_data() {
			return new $mpds_cifplayer_matinfio( this.str() ).player()
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

			return sprite
		}

		@ $mol_mem
		axis_vectors() {

			return this.structure_3d_data().cell_matrix.map( vec => {

				return new THREE.Vector3(
					vec[ 0 ] * this.atom_pos_scale(),
					vec[ 1 ] * this.atom_pos_scale(),
					vec[ 2 ] * this.atom_pos_scale(),
				)
				
			} )
		}

		@ $mol_mem
		controls_target() {
			return this.centered() ? this.cell_center().clone() : new THREE.Vector3()
		}

		@ $mol_mem
		spacegroup() {
			const { sg_name, ng_name } = this.structure_3d_data()

			return $mpds_cifplayer_matinfio_spacegroup.by_name_and_num( sg_name, ng_name )
		}

		@ $mol_mem
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

		@ $mol_mem
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

		@ $mol_mem
		Toogle_all_title(): string {
			return this.all_symmetry_enabled() ? 'Disable all' : 'Enable all'
		}

		@ $mol_mem_key
		symmetric_atoms_raw( symmetry: string ){
			const structure = this.structure_3d_data()
			return structure.atoms.map(
				( data: any ) => this.spacegroup().symmetric_atom( symmetry, data, structure.cell_matrix ) 
			)
		}

		@ $mol_mem
		atoms(){
			const atoms: any[] = []

			const symmetries_enabled = this.spacegroup().symmetry_list().filter( name => this.symmetry_visible( name ) )

			symmetries_enabled.forEach( symmetry => {

				const next_symmetries = symmetries_enabled.slice( 0, symmetries_enabled.indexOf( symmetry ) )

				this.symmetric_atoms_raw( symmetry ).forEach( ( data: any ) => {

					for (const name of next_symmetries) {

						const atoms = this.symmetric_atoms_raw( name )
						if( is_overlap( data, atoms, 0.01 ) ) {
							return
						}
					}
	
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

		@ $mol_mem
		atom_box() {
			const atom_box = this.Three().object_blank( `atom_box`, ()=> new THREE.Object3D() )

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
		overlay_box() {
			const overlay_box = this.Three().object_blank( `overlay_box`, ()=> new THREE.Object3D() )

			if( !this.overlay() ) return

			this.atoms().forEach( ( data: any ) => {

				const label = this.create_sprite( data.overlays[ this.overlay() ] )
				label.position.set( data.x, data.y, data.z )

				overlay_box.add( label )
			} )

			return overlay_box
		}
		
		@ $mol_mem
		dir_light(): InstanceType< THREE["DirectionalLight"] >  {
			const intensity = this.$.$mol_lights() ? 1.5 : 0.5

			const dir_light = this.Three().object( 'dir_light', ()=> new THREE.DirectionalLight( 0xffffff, intensity ) )
			dir_light.intensity = intensity
			dir_light.position.set( 1, 1.5, 2 )

			return dir_light
		}

		@ $mol_mem
		ambient_light(): InstanceType< THREE["AmbientLight"] > {
			const intensity = this.$.$mol_lights() ? 5 : 1.5

			const ambient_light = this.Three().object( 'ambient_light', ()=> new THREE.AmbientLight( 0x999999, intensity ) )
			ambient_light.intensity = intensity

			return ambient_light
		}

		@ $mol_mem
		cell_center() {
			const [ a, b, c ] = this.axis_vectors()

			const origin = a.clone().add( b ).add( c ).multiplyScalar( 0.5 )

			return origin
		}

		@ $mol_mem
		axes_box() {
			const axes = this.Three().object_blank( 'axes_box', ()=> new THREE.Object3D() )

			const origin = new THREE.Vector3( 0, 0, 0 )

			const arrows = this.axis_vectors().map( ( [ x, y, z ], i ) => 
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

		@ $mol_mem
		cell_lines_color() {
			return 0xDDDDDD	
		}

		@ $mol_mem
		cell_box() {
			const cell_box = this.Three().object_blank( 'cell_box', ()=> new THREE.Object3D() )

			if( ! this.structure_3d_data().cell_matrix?.length ) return

			const [ a, b, c ] = this.axis_vectors()

			const color = this.cell_lines_color()

			const add_line = ( start: THREE.Vector3, end: THREE.Vector3 )=> {
				const geometry = new THREE.BufferGeometry().setFromPoints( [ start, end ] );
				const material = new THREE.LineBasicMaterial( { color } )
				cell_box.add( new THREE.Line( geometry, material ) )
			}

			const ab = a.clone().add( b )
			const ac = a.clone().add( c )
			const bc = b.clone().add( c )
			const abc = ab.clone().add( c )

			add_line( a, ab )
			add_line( a, ac )
			add_line( b, ab )
			add_line( b, bc )
			add_line( c, ac )
			add_line( c, bc )
			add_line( abc, ab )
			add_line( abc, ac )
			add_line( abc, bc )

			if( this.centered() ) {
				const axes_helper = new THREE.AxesHelper( 200 )
				axes_helper.position.fromArray( this.cell_center().toArray() )
				cell_box.add( axes_helper )
			}
			
			return cell_box
		}

	}

	function is_overlap( check: $mpds_cifplayer_matinfio_internal_obj_atom, atoms: $mpds_cifplayer_matinfio_internal_obj_atom[], delta: number ) {
		for (const atom of atoms) {
			if ( check.x < atom.x - delta || check.x > atom.x + delta ) continue
			if ( check.y < atom.y - delta || check.y > atom.y + delta ) continue
			if ( check.z < atom.z - delta || check.z > atom.z + delta ) continue
			return true
		}
		return false
	}

}
