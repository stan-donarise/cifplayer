namespace $ {

	const math = $mpds_cifplayer_lib_math

	export class $mpds_cifplayer_matinfio_spacegroup extends $mol_object2 {

		protected constructor( public readonly data: $mpds_cifplayer_lib_spacegroups_info ) {
			super()
		}

		@ $mol_mem_key
		static by_name_and_num( name: string, num: number ) {
			const spacegroup = $mpds_cifplayer_matinfio_spacegroup.by_num( num ) ??
				$mpds_cifplayer_matinfio_spacegroup.by_name( name )
			return spacegroup ? spacegroup : $mpds_cifplayer_matinfio_spacegroup.unknown()
		}

		@ $mol_mem_key
		static by_name( name: string ) {
			const name_fixed = name.charAt( 0 ).toUpperCase() + name.slice( 1 )
			const data = $mpds_cifplayer_lib_spacegroups.SpaceGroup.getByHMName( name_fixed )
			return data ? new $mpds_cifplayer_matinfio_spacegroup( data ) : null
		}

		@ $mol_mem_key
		static by_num( num: number ) {
			const data = $mpds_cifplayer_lib_spacegroups.SpaceGroup.getById( num )
			return data ? new $mpds_cifplayer_matinfio_spacegroup( data ) : null
		}

		@ $mol_mem
		static unknown() {
			return new $mpds_cifplayer_matinfio_spacegroup( $mpds_cifplayer_lib_spacegroups.SpaceGroup.getById( 1 ) )
		}

		@ $mol_mem
		symmetry_list(): string[] {
			return this.data.s
		}

		calc_part( str: string, fract: { x: number, y: number, z: number } ) {
			let res = 0

			let sign: -1 | 1 = 1
			let coef_sign = 1
			let coef = ''

			for( const char of str ) {
				switch( char ) {
					case 'x':
					case 'y':
					case 'z':
						res += sign * fract[ char ]
						break

					case '+':
						sign = 1
						break
					case '-':
						sign = -1
						break

					default:
						coef_sign = sign
						coef += char
						break
				}
			}

			const split = coef.split( '/' )

			if( coef ) res += coef_sign * parseInt( split[ 0 ] ) / ( split[ 1 ] ? parseInt( split[ 1 ] ) : 1 )

			res = res % 1
			if( res < 0 ) res = res + 1 //normalization

			// if( res > 1 ) res = res - 1 //normalization

			return res
		}

		symmetric_atom( symmetry: string, atom: { fract: { x: number, y: number, z: number } }, cell: number[][] ) {
			const parts = symmetry.split( ',' )

			const fract = [
				this.calc_part( parts[ 0 ], atom.fract ),
				this.calc_part( parts[ 1 ], atom.fract ),
				this.calc_part( parts[ 2 ], atom.fract ),
			]

			const cartesian = math.multiply( fract, cell )
			return {
				...atom,
				x: cartesian[ 0 ],
				y: cartesian[ 1 ],
				z: cartesian[ 2 ],
			}
		}

		@ $mol_mem_key
		symmetric_atoms( atom: { fract: { x: number, y: number, z: number } }, cell: number[][] ) {
			return this.symmetry_list().map( name => this.symmetric_atom( name, atom, cell ) )
		}

	}

}
