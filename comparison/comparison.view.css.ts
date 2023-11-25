namespace $.$$ {

	$mol_style_define( $mpds_cifplayer_comparison, {

		Menu: {
			flex: {
				basis: '20rem',
			},
		},

		Player_page: {
			flex: {
				basis: '100%',
				// basis: '30rem',
				grow: 1,
			},
		},

		Row: {
			padding: {
				bottom: '2rem',
			},
		},
		
		Player_page_body: {
			flex: {
				basis: '20rem',
				grow: 1,
			},
		},

		Cif_page: {
			Head: {
				flex: {
					direction: 'column',
				},
			},
		},

		Menu_toggle: {
			'@': {
				mol_check_checked: {
					true: {
						transform: 'scaleX(-1)',
						color: $mol_theme.control,
					}
				}
			}
		}

	} )

}
