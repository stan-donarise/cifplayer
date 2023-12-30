namespace $.$$ {

	$mol_style_define( $mpds_cifplayer_player, {

		background: {
			color: $mol_theme.back,
		},

		'@': {
			fullscreen: {
				'true': {
					position: 'fixed',
					zIndex: 9999,
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
				},
			},
		},

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
			padding: $mol_gap.block,
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
			zIndex: 1,
			flex: {
				direction: 'column',
			},
			align: {
				items: 'flex-end',
			},
		},

		Zoom_up_icon: {
			width: '2rem',
			height: '2rem',
		},

		Zoom_down_icon: {
			width: '2rem',
			height: '2rem',
		},

	} )

}
