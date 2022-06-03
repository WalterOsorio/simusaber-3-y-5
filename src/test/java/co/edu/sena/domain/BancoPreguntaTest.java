package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BancoPreguntaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BancoPregunta.class);
        BancoPregunta bancoPregunta1 = new BancoPregunta();
        bancoPregunta1.setId(1L);
        BancoPregunta bancoPregunta2 = new BancoPregunta();
        bancoPregunta2.setId(bancoPregunta1.getId());
        assertThat(bancoPregunta1).isEqualTo(bancoPregunta2);
        bancoPregunta2.setId(2L);
        assertThat(bancoPregunta1).isNotEqualTo(bancoPregunta2);
        bancoPregunta1.setId(null);
        assertThat(bancoPregunta1).isNotEqualTo(bancoPregunta2);
    }
}
