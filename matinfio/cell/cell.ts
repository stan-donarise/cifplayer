namespace $ {

	const Mimpl = $mpds_cifplayer_lib_math.all()

	function unit( vec: number[] ) {
		return Mimpl.divide( vec, Mimpl.norm( vec ) )
	}

	/** Crystalline cell parameters to 3x3 matrix */
	export function $mpds_cifplayer_matinfio_cell_to_vec( this : $, a: number, b: number, c: number, alpha: number, beta: number, gamma: number ) {
		if( !a || !b || !c || !alpha || !beta || !gamma ) {
			this.$mpds_cifplayer_matinfio_log.error( "Error: invalid cell definition" )
			return false
		}
		alpha = alpha * Math.PI / 180, beta = beta * Math.PI / 180, gamma = gamma * Math.PI / 180
		const ab_norm = [ 0, 0, 1 ] // TODO
		const a_dir = [ 1, 0, 0 ] // TODO
		const Z = unit( ab_norm )
		const X = unit( Mimpl.subtract( a_dir, Mimpl.multiply( Mimpl.dot( a_dir, Z ), Z ) ) )
		const Y = Mimpl.cross( Z, X )
		const va = Mimpl.multiply( a, [ 1, 0, 0 ] )
		const vb = Mimpl.multiply( b, [ Mimpl.cos( gamma ), Mimpl.sin( gamma ), 0 ] )
		const cx = Mimpl.cos( beta )
		const cy = Mimpl.divide( Mimpl.subtract( Mimpl.cos( alpha ), Mimpl.multiply( Mimpl.cos( beta ), Mimpl.cos( gamma ) ) ), Mimpl.sin( gamma ) )
		const cz = Mimpl.sqrt( Mimpl.subtract( Mimpl.subtract( 1, Mimpl.multiply( cx, cx ) ), Mimpl.multiply( cy, cy ) ) )
		const vc = Mimpl.multiply( c, [ cx, cy, cz ] )
		const abc = [ va, vb, vc ]
		const t = [ X, Y, Z ]
		return Mimpl.multiply( abc, t )
	}
	/** 3x3 matrix to crystalline cell parameters */
	export function $mpds_cifplayer_matinfio_cell_from_vec( matrix: number[] ) {
		const norms: number[] = []
		const angles = []
		matrix.forEach( function( vec ) {
			norms.push( Mimpl.norm( vec ) )
		} )
		let j = -1
		let k = -2
		for( let i = 0; i < 3; i++ ) {
			j = i - 1
			k = i - 2
			const lenmult = norms[ j ] * norms[ k ]
			const tau = lenmult > 1e-16 
				? 180 / Math.PI * Math.acos( Mimpl.dot( matrix[ j ], matrix[ k ] ) / lenmult )
				: 90.0
			angles.push( tau )
		}
		return norms.concat( angles )
	}
}
