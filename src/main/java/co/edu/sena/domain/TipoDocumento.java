package co.edu.sena.domain;

import co.edu.sena.domain.enumeration.State;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A TipoDocumento.
 */
@Entity
@Table(name = "tipo_documento")
public class TipoDocumento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 12)
    @Column(name = "iniciales", length = 12, nullable = false)
    private String iniciales;

    @NotNull
    @Size(max = 50)
    @Column(name = "nombre_documento", length = 50, nullable = false)
    private String nombreDocumento;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_tipo_documento", nullable = false)
    private State estadoTipoDocumento;

    @JsonIgnoreProperties(value = { "tipoDocumento", "user", "docente", "estudiante", "administrador" }, allowSetters = true)
    @OneToOne(mappedBy = "tipoDocumento")
    private UserData userData;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TipoDocumento id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIniciales() {
        return this.iniciales;
    }

    public TipoDocumento iniciales(String iniciales) {
        this.setIniciales(iniciales);
        return this;
    }

    public void setIniciales(String iniciales) {
        this.iniciales = iniciales;
    }

    public String getNombreDocumento() {
        return this.nombreDocumento;
    }

    public TipoDocumento nombreDocumento(String nombreDocumento) {
        this.setNombreDocumento(nombreDocumento);
        return this;
    }

    public void setNombreDocumento(String nombreDocumento) {
        this.nombreDocumento = nombreDocumento;
    }

    public State getEstadoTipoDocumento() {
        return this.estadoTipoDocumento;
    }

    public TipoDocumento estadoTipoDocumento(State estadoTipoDocumento) {
        this.setEstadoTipoDocumento(estadoTipoDocumento);
        return this;
    }

    public void setEstadoTipoDocumento(State estadoTipoDocumento) {
        this.estadoTipoDocumento = estadoTipoDocumento;
    }

    public UserData getUserData() {
        return this.userData;
    }

    public void setUserData(UserData userData) {
        if (this.userData != null) {
            this.userData.setTipoDocumento(null);
        }
        if (userData != null) {
            userData.setTipoDocumento(this);
        }
        this.userData = userData;
    }

    public TipoDocumento userData(UserData userData) {
        this.setUserData(userData);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TipoDocumento)) {
            return false;
        }
        return id != null && id.equals(((TipoDocumento) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TipoDocumento{" +
            "id=" + getId() +
            ", iniciales='" + getIniciales() + "'" +
            ", nombreDocumento='" + getNombreDocumento() + "'" +
            ", estadoTipoDocumento='" + getEstadoTipoDocumento() + "'" +
            "}";
    }
}
