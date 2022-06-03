package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SalaMateriaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SalaMateria.class);
        SalaMateria salaMateria1 = new SalaMateria();
        salaMateria1.setId(1L);
        SalaMateria salaMateria2 = new SalaMateria();
        salaMateria2.setId(salaMateria1.getId());
        assertThat(salaMateria1).isEqualTo(salaMateria2);
        salaMateria2.setId(2L);
        assertThat(salaMateria1).isNotEqualTo(salaMateria2);
        salaMateria1.setId(null);
        assertThat(salaMateria1).isNotEqualTo(salaMateria2);
    }
}
