namespace $.$$ {

	$mol_style_define( $mpds_cifplayer_player, {

		position: 'relative',

		// Root: {
		// 	position: 'absolute',
		// },

		Descr_a: {
			color: $mol_style_func.vary('--color_a')
		},

		Descr_b: {
			color: $mol_style_func.vary('--color_b')
		},

		Descr_c: {
			color: $mol_style_func.vary('--color_c')
		},

		Info: {
			position: 'absolute',
			// left: $mol_gap.block,
			// top: $mol_gap.block,
			padding: $mol_gap.block,
			// align: {
			// 	items: 'center',
			// },
			gap: $mol_gap.space,
			zIndex: 1,
			flex: {
				direction: 'column',
			},
		},

		Overlays_panel: {
			position: 'absolute',
			bottom: 0,
			width: '100%',
			align: {
				items: 'center',
			},
			zIndex: 1,
		},

		Switch_overlay: {
			justify: {
				content: 'center'
			},
		},

		Tools: {
			position: 'absolute',
			right: 0,
			top: '2rem',
			zIndex: 1,
			flex: {
				direction: 'column',
			},
		},

		Zoom_up: {
			width: '3rem',
			height: '3rem',
			alignItems: 'center',
			justifyContent: 'center',
		},
		Zoom_up_icon: {
			width: '125%',
			height: '125%',
		},

		Zoom_down: {
			width: '3rem',
			height: '3rem',
			alignItems: 'center',
			justifyContent: 'center',
		},
		Zoom_down_icon: {
			width: '125%',
			height: '125%',
		},

		Center: {
			width: '3rem',
			height: '3rem',
			alignItems: 'center',
			justifyContent: 'center',
		},
		Center_icon: {
			width: '80%',
			height: '80%',
		},

	} )

}
