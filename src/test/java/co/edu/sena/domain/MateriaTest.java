package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MateriaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Materia.class);
        Materia materia1 = new Materia();
        materia1.setId(1L);
        Materia materia2 = new Materia();
        materia2.setId(materia1.getId());
        assertThat(materia1).isEqualTo(materia2);
        materia2.setId(2L);
        assertThat(materia1).isNotEqualTo(materia2);
        materia1.setId(null);
        assertThat(materia1).isNotEqualTo(materia2);
    }
}
