namespace $ {

	export class $mpds_cifplayer_lib_three extends $mol_object2 {

		@ $mol_mem
		static all() {
			// return require( '../mpds/cifplayer/lib/three/index.js' )
			return require( '../mpds/cifplayer/lib/three/three.js' ) as typeof import( '../three/build/index' )
		}

	}

}
