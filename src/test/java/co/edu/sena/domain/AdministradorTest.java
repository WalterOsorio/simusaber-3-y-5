package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AdministradorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Administrador.class);
        Administrador administrador1 = new Administrador();
        administrador1.setId(1L);
        Administrador administrador2 = new Administrador();
        administrador2.setId(administrador1.getId());
        assertThat(administrador1).isEqualTo(administrador2);
        administrador2.setId(2L);
        assertThat(administrador1).isNotEqualTo(administrador2);
        administrador1.setId(null);
        assertThat(administrador1).isNotEqualTo(administrador2);
    }
}
