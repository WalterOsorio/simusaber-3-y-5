package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EstudianteSalaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EstudianteSala.class);
        EstudianteSala estudianteSala1 = new EstudianteSala();
        estudianteSala1.setId(1L);
        EstudianteSala estudianteSala2 = new EstudianteSala();
        estudianteSala2.setId(estudianteSala1.getId());
        assertThat(estudianteSala1).isEqualTo(estudianteSala2);
        estudianteSala2.setId(2L);
        assertThat(estudianteSala1).isNotEqualTo(estudianteSala2);
        estudianteSala1.setId(null);
        assertThat(estudianteSala1).isNotEqualTo(estudianteSala2);
    }
}
