namespace $ {

	const math = $mpds_cifplayer_lib_math

	/** Prepare internal repr for visualization in three.js */
	export function $mpds_cifplayer_matinfio_player_from_obj( this: $, crystal: $mpds_cifplayer_matinfio_internal_obj ) {
		var cell
		let descr: any = false

		if( Object.keys( crystal.cell ).length == 6 ) { // for CIF
			cell = this.$mpds_cifplayer_matinfio_cell_to_vec( crystal.cell )
			descr = crystal.cell
			var symlabel = ( crystal.sg_name || crystal.ng_name ) ? ( ( crystal.sg_name ? crystal.sg_name : "" ) + ( crystal.ng_name ? ( " (" + crystal.ng_name + ")" ) : "" ) ) : false
			if( symlabel ) descr.symlabel = symlabel

		} else {
			cell = crystal.cell // for POSCAR and OPTIMADE
		}

		if( !crystal.atoms.length ) this.$mpds_cifplayer_matinfio_log.warning( "Note: no atomic coordinates supplied" )

		const render = {
			atoms: [] as any[],
			cell: cell,
			descr: descr,
			overlayed: {} as Record< string, string >,
			sg_name: crystal.sg_name,
			ng_name: parseInt( crystal.ng_name ),
			info: crystal.info,
			mpds_data: crystal.mpds_data,
			mpds_demo: crystal.mpds_demo
		}
		const pos2els: any = {}
		const hashes: any = {}

		for( let i = 0; i < crystal.atoms.length; i++ ) {
			const pos = [ crystal.atoms[ i ].x, crystal.atoms[ i ].y, crystal.atoms[ i ].z ]
			const hash = pos.map( function( item ) { return item.toFixed( 2 ) } ).join( ',' )
			// make atoms unique, i.e. remove collisions;
			// makes special sense for partial occupancies
			if( hashes.hasOwnProperty( hash ) ) {
				var update = ""
				for( let oprop in render.atoms[ hashes[ hash ] ].overlays ) {
					if( oprop == 'S' ) {
						if( pos2els[ hash ].indexOf( crystal.atoms[ i ].symbol ) == -1 ) {
							update = " " + crystal.atoms[ i ].symbol
							pos2els[ hash ].push( crystal.atoms[ i ].symbol )
						}
					}
					else if( oprop == 'N' )
						update = ", " + ( i + 1 )
					else if( oprop == '_atom_site_occupancy' )
						update = "+" + crystal.atoms[ i ].overlays[ oprop ]
					else
						update = " " + crystal.atoms[ i ].overlays[ oprop ]

					render.atoms[ hashes[ hash ] ].overlays[ oprop ] += update
				}
			} else {
				const color = ($mpds_cifplayer_matinfio_chemical_elements.JmolColors as any)[ crystal.atoms[ i ].symbol ] || '#FFFF00'
				const radius = ($mpds_cifplayer_matinfio_chemical_elements.AseRadii as any)[ crystal.atoms[ i ].symbol ] || 0.66
				
				const overlays: Record< string, string | number > = {
					"S": crystal.atoms[ i ].symbol,
					"N": i + 1,
				}
				for( let oprop in crystal.atoms[ i ].overlays ) {
					overlays[ oprop ] = crystal.atoms[ i ].overlays[ oprop ]
				}

				// CIF has fractional positions
				// OPTIMADE has cartesian positions
				// POSCAR may have either of two
				const cpos = crystal.cartesian ? pos : math.multiply( pos, cell )
				const fpos = crystal.cartesian ? math.divide( pos, cell ) : pos
				
				render.atoms.push( { 
					'fract': {
						'x': fpos[ 0 ],
						'y': fpos[ 1 ],
						'z': fpos[ 2 ],
					},
					'x': cpos[ 0 ],
					'y': cpos[ 1 ],
					'z': cpos[ 2 ],
					'c': color,
					'r': radius,
					'overlays': overlays
				} )
				hashes[ hash ] = render.atoms.length - 1
				pos2els[ hash ] = [ crystal.atoms[ i ].symbol ]
			}
		}

		for( let oprop in crystal.atoms.at(-1)!.overlays ) {
			render.overlayed[ oprop ] = $mpds_cifplayer_matinfio_custom_atom_loop_props[ oprop ]
		}
		
		return render
	}

}
