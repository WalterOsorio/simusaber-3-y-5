package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DocenteMateriaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocenteMateria.class);
        DocenteMateria docenteMateria1 = new DocenteMateria();
        docenteMateria1.setId(1L);
        DocenteMateria docenteMateria2 = new DocenteMateria();
        docenteMateria2.setId(docenteMateria1.getId());
        assertThat(docenteMateria1).isEqualTo(docenteMateria2);
        docenteMateria2.setId(2L);
        assertThat(docenteMateria1).isNotEqualTo(docenteMateria2);
        docenteMateria1.setId(null);
        assertThat(docenteMateria1).isNotEqualTo(docenteMateria2);
    }
}
