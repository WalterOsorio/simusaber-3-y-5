package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DocenteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Docente.class);
        Docente docente1 = new Docente();
        docente1.setId(1L);
        Docente docente2 = new Docente();
        docente2.setId(docente1.getId());
        assertThat(docente1).isEqualTo(docente2);
        docente2.setId(2L);
        assertThat(docente1).isNotEqualTo(docente2);
        docente1.setId(null);
        assertThat(docente1).isNotEqualTo(docente2);
    }
}
