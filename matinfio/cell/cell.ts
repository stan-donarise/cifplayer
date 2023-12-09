namespace $ {

	const math = $mpds_cifplayer_lib_math

	function unit( vec: number[] ) {
		return math.divide( vec, math.norm( vec ) )
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
		const X = unit( math.subtract( a_dir, math.multiply( math.dot( a_dir, Z ), Z ) ) )
		const Y = math.cross( Z, X )
		const va = math.multiply( a, [ 1, 0, 0 ] )
		const vb = math.multiply( b, [ math.cos( gamma ), math.sin( gamma ), 0 ] )
		const cx = math.cos( beta )
		const cy = math.divide( math.subtract( math.cos( alpha ), math.multiply( math.cos( beta ), math.cos( gamma ) ) ), math.sin( gamma ) )
		const cz = math.sqrt( math.subtract( math.subtract( 1, math.multiply( cx, cx ) ), math.multiply( cy, cy ) ) )
		const vc = math.multiply( c, [ cx, cy, cz ] )
		const abc = [ va, vb, vc ]
		const t = [ X, Y, Z ]
		return math.multiply( abc, t )
	}
	/** 3x3 matrix to crystalline cell parameters */
	export function $mpds_cifplayer_matinfio_cell_from_vec( matrix: number[] ) {
		const norms: number[] = []
		const angles = []
		matrix.forEach( function( vec ) {
			norms.push( math.norm( vec ) )
		} )
		let j = -1
		let k = -2
		for( let i = 0; i < 3; i++ ) {
			j = i - 1
			k = i - 2
			const lenmult = norms[ j ] * norms[ k ]
			const tau = lenmult > 1e-16 
				? 180 / Math.PI * Math.acos( math.dot( matrix[ j ], matrix[ k ] ) / lenmult )
				: 90.0
			angles.push( tau )
		}
		return norms.concat( angles )
	}
}
