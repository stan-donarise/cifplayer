namespace $.$$ {

	const gh_pages_fix_url = ( url: string ) => {
		return $mol_state_arg.href().split('/')[3] == 'cifplayer' ? '/cifplayer' + url : url
	}

	export class $mpds_cifplayer_comparison extends $.$mpds_cifplayer_comparison {
		
		cif_spreads(): Record<string, any> {
			return Object.fromEntries( this.cif_paths().map( path => [ path, this.Cif_spread( path ) ] ) ) 
		}

		@ $mol_mem_key
		cif_title( id: any ): string {
			return id.split( '/' ).slice( -2 ).join( '/' )
		}

		@ $mol_mem
		nasty_cif_csv(): readonly any[] {
			const text = $mol_fetch.text( gh_pages_fix_url( '/mpds/cifplayer/comparison/cifs/nasty_cifs.csv' ) )
			return $mol_csv_parse( text )
		}

		@ $mol_mem_key
		nasty_cif_reference( id: any ): string {
			const num = parseInt( id.split( '/' ).at(-1) )
			return this.nasty_cif_csv()[ num ][ ' reference' ]
		}

		@ $mol_mem_key
		nasty_cif_problem( id: any ): string {
			const num = parseInt( id.split( '/' ).at(-1) )
			return this.nasty_cif_csv()[ num ][ ' problem' ]
		}

		@ $mol_mem_key
		nasty_cif_section( id: any ): readonly any[] {
			const cif_type = id.split( '/' ).at(-2)
			if ( cif_type != 'bad' ) return []
			return super.nasty_cif_section( id )
		}

		@ $mol_mem_key
		cif_value( id: any, next?: string ): string {
			if ( next !== undefined ) return next as never
			const path = id
			const str = $mol_fetch.text( gh_pages_fix_url( path ) )
			return str
		}

		@ $mol_mem_key
		matinfio_obj( id: any ): Record<string, any> {
			return $mpds_cifplayer_matinfio.to_player( this.cif_value( id ) ) as any
		}

		@ $mol_mem_key
		crystcif_obj( id: any ): Record<string, any> {
			return $mpds_cifplayer_lib_cif.all().crystcif.parseCifStructures( this.cif_value( id ) ) as any
		}

		@ $mol_mem_key
		cif_loader3_obj( id: any ): Record<string, any> {
			const loader = $mpds_cifplayer_lib_cif.loader()
			return loader.parse( this.cif_value( id ) )
		}
		
	}
}
