package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PruebaApoyoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PruebaApoyo.class);
        PruebaApoyo pruebaApoyo1 = new PruebaApoyo();
        pruebaApoyo1.setId(1L);
        PruebaApoyo pruebaApoyo2 = new PruebaApoyo();
        pruebaApoyo2.setId(pruebaApoyo1.getId());
        assertThat(pruebaApoyo1).isEqualTo(pruebaApoyo2);
        pruebaApoyo2.setId(2L);
        assertThat(pruebaApoyo1).isNotEqualTo(pruebaApoyo2);
        pruebaApoyo1.setId(null);
        assertThat(pruebaApoyo1).isNotEqualTo(pruebaApoyo2);
    }
}
