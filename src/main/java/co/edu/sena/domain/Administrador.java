package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Administrador.
 */
@Entity
@Table(name = "administrador")
public class Administrador implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nivel_acceso")
    private Long nivelAcceso;

    @JsonIgnoreProperties(value = { "tipoDocumento", "user", "docente", "estudiante", "administrador" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private UserData userData;

    @ManyToOne
    @JsonIgnoreProperties(value = { "administradors", "bancoPreguntas" }, allowSetters = true)
    private AdmiBancoP admiBancoP;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Administrador id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNivelAcceso() {
        return this.nivelAcceso;
    }

    public Administrador nivelAcceso(Long nivelAcceso) {
        this.setNivelAcceso(nivelAcceso);
        return this;
    }

    public void setNivelAcceso(Long nivelAcceso) {
        this.nivelAcceso = nivelAcceso;
    }

    public UserData getUserData() {
        return this.userData;
    }

    public void setUserData(UserData userData) {
        this.userData = userData;
    }

    public Administrador userData(UserData userData) {
        this.setUserData(userData);
        return this;
    }

    public AdmiBancoP getAdmiBancoP() {
        return this.admiBancoP;
    }

    public void setAdmiBancoP(AdmiBancoP admiBancoP) {
        this.admiBancoP = admiBancoP;
    }

    public Administrador admiBancoP(AdmiBancoP admiBancoP) {
        this.setAdmiBancoP(admiBancoP);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Administrador)) {
            return false;
        }
        return id != null && id.equals(((Administrador) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Administrador{" +
            "id=" + getId() +
            ", nivelAcceso=" + getNivelAcceso() +
            "}";
    }
}
