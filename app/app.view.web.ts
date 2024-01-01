namespace $.$$ {
	export class $mpds_cifplayer_app extends $.$mpds_cifplayer_app {

		@ $mol_mem
		pages(): readonly any[] {
			return this.str()
				? super.pages()
				: [ this.Menu(), this.Start() ]
		}

		@ $mol_action
		files_read(next: readonly File[]) {
			const data = $mol_wire_sync( $mol_blob_text )( next[0] )
			this.str( data )
		}

		@ $mol_action
		drop_file(transfer: any) {
			this.files_read( transfer.files )
		}

		@ $mol_action
		paste_example() {
			this.str( this.data_example() )
		}

		data_example() {
			return `# CIF file\n# This file was generated by FINDSYM\n# Harold T. Stokes, Branton J. Campbell, Dorian M. Hatch\n# Brigham Young University, Provo, Utah, USA\n \ndata_findsym-output\n \n_symmetry_space_group_name_H-M "I 4/m 2/c 2/m"\n_symmetry_Int_Tables_number 140\n \n_cell_length_a       5.51665\n_cell_length_b       5.51665\n_cell_length_c       7.80171\n_cell_angle_alpha   90.00000\n_cell_angle_beta    90.00000\n_cell_angle_gamma   90.00000\n \nloop_\n_space_group_symop_operation_xyz\nx,y,z\nx,-y,-z+1/2\n-x,y,-z+1/2\n-x,-y,z\n-y,-x,-z+1/2\n-y,x,z\ny,-x,z\ny,x,-z+1/2\n-x,-y,-z\n-x,y,z+1/2\nx,-y,z+1/2\nx,y,-z\ny,x,z+1/2\ny,-x,-z\n-y,x,-z\n-y,-x,z+1/2\nx+1/2,y+1/2,z+1/2\nx+1/2,-y+1/2,-z\n-x+1/2,y+1/2,-z\n-x+1/2,-y+1/2,z+1/2\n-y+1/2,-x+1/2,-z\n-y+1/2,x+1/2,z+1/2\ny+1/2,-x+1/2,z+1/2\ny+1/2,x+1/2,-z\n-x+1/2,-y+1/2,-z+1/2\n-x+1/2,y+1/2,z\nx+1/2,-y+1/2,z\nx+1/2,y+1/2,-z+1/2\ny+1/2,x+1/2,z\ny+1/2,-x+1/2,-z+1/2\n-y+1/2,x+1/2,-z+1/2\n-y+1/2,-x+1/2,z\n \nloop_\n_atom_site_label\n_atom_site_type_symbol\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\n_atom_site_occupancy\nTi1 Ti   0.00000   0.00000   0.00000   1.00000\nO1 O   0.23602   0.73602   0.00000   1.00000\nO2 O   0.00000   0.00000   0.25000   1.00000\nSr1 Sr   0.00000   0.50000   0.25000   1.00000\n `
		}

	}

}
