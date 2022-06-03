package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AdmiBancoPTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AdmiBancoP.class);
        AdmiBancoP admiBancoP1 = new AdmiBancoP();
        admiBancoP1.setId(1L);
        AdmiBancoP admiBancoP2 = new AdmiBancoP();
        admiBancoP2.setId(admiBancoP1.getId());
        assertThat(admiBancoP1).isEqualTo(admiBancoP2);
        admiBancoP2.setId(2L);
        assertThat(admiBancoP1).isNotEqualTo(admiBancoP2);
        admiBancoP1.setId(null);
        assertThat(admiBancoP1).isNotEqualTo(admiBancoP2);
    }
}
