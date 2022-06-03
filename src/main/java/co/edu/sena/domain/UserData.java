package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A UserData.
 */
@Entity
@Table(name = "user_data")
public class UserData implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 256)
    @Column(name = "numero_documento", length = 256, nullable = false)
    private String numeroDocumento;

    @JsonIgnoreProperties(value = { "userData" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private TipoDocumento tipoDocumento;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @JsonIgnoreProperties(value = { "userData", "salas", "docenteMateria" }, allowSetters = true)
    @OneToOne(mappedBy = "userData")
    private Docente docente;

    @JsonIgnoreProperties(value = { "userData", "pruebas", "pruebaApoyos", "salas", "estudianteSala" }, allowSetters = true)
    @OneToOne(mappedBy = "userData")
    private Estudiante estudiante;

    @JsonIgnoreProperties(value = { "userData", "admiBancoP" }, allowSetters = true)
    @OneToOne(mappedBy = "userData")
    private Administrador administrador;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserData id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroDocumento() {
        return this.numeroDocumento;
    }

    public UserData numeroDocumento(String numeroDocumento) {
        this.setNumeroDocumento(numeroDocumento);
        return this;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public TipoDocumento getTipoDocumento() {
        return this.tipoDocumento;
    }

    public void setTipoDocumento(TipoDocumento tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public UserData tipoDocumento(TipoDocumento tipoDocumento) {
        this.setTipoDocumento(tipoDocumento);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserData user(User user) {
        this.setUser(user);
        return this;
    }

    public Docente getDocente() {
        return this.docente;
    }

    public void setDocente(Docente docente) {
        if (this.docente != null) {
            this.docente.setUserData(null);
        }
        if (docente != null) {
            docente.setUserData(this);
        }
        this.docente = docente;
    }

    public UserData docente(Docente docente) {
        this.setDocente(docente);
        return this;
    }

    public Estudiante getEstudiante() {
        return this.estudiante;
    }

    public void setEstudiante(Estudiante estudiante) {
        if (this.estudiante != null) {
            this.estudiante.setUserData(null);
        }
        if (estudiante != null) {
            estudiante.setUserData(this);
        }
        this.estudiante = estudiante;
    }

    public UserData estudiante(Estudiante estudiante) {
        this.setEstudiante(estudiante);
        return this;
    }

    public Administrador getAdministrador() {
        return this.administrador;
    }

    public void setAdministrador(Administrador administrador) {
        if (this.administrador != null) {
            this.administrador.setUserData(null);
        }
        if (administrador != null) {
            administrador.setUserData(this);
        }
        this.administrador = administrador;
    }

    public UserData administrador(Administrador administrador) {
        this.setAdministrador(administrador);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserData)) {
            return false;
        }
        return id != null && id.equals(((UserData) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserData{" +
            "id=" + getId() +
            ", numeroDocumento='" + getNumeroDocumento() + "'" +
            "}";
    }
}
