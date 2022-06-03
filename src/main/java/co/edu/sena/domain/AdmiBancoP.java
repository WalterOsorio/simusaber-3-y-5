package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A AdmiBancoP.
 */
@Entity
@Table(name = "admi_banco_p")
public class AdmiBancoP implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "id_administrador")
    private Integer idAdministrador;

    @Column(name = "id_banco_pregunta")
    private Integer idBancoPregunta;

    @OneToMany(mappedBy = "admiBancoP")
    @JsonIgnoreProperties(value = { "userData", "admiBancoP" }, allowSetters = true)
    private Set<Administrador> administradors = new HashSet<>();

    @OneToMany(mappedBy = "admiBancoP")
    @JsonIgnoreProperties(value = { "pruebas", "pruebaApoyos", "admiBancoP" }, allowSetters = true)
    private Set<BancoPregunta> bancoPreguntas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AdmiBancoP id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIdAdministrador() {
        return this.idAdministrador;
    }

    public AdmiBancoP idAdministrador(Integer idAdministrador) {
        this.setIdAdministrador(idAdministrador);
        return this;
    }

    public void setIdAdministrador(Integer idAdministrador) {
        this.idAdministrador = idAdministrador;
    }

    public Integer getIdBancoPregunta() {
        return this.idBancoPregunta;
    }

    public AdmiBancoP idBancoPregunta(Integer idBancoPregunta) {
        this.setIdBancoPregunta(idBancoPregunta);
        return this;
    }

    public void setIdBancoPregunta(Integer idBancoPregunta) {
        this.idBancoPregunta = idBancoPregunta;
    }

    public Set<Administrador> getAdministradors() {
        return this.administradors;
    }

    public void setAdministradors(Set<Administrador> administradors) {
        if (this.administradors != null) {
            this.administradors.forEach(i -> i.setAdmiBancoP(null));
        }
        if (administradors != null) {
            administradors.forEach(i -> i.setAdmiBancoP(this));
        }
        this.administradors = administradors;
    }

    public AdmiBancoP administradors(Set<Administrador> administradors) {
        this.setAdministradors(administradors);
        return this;
    }

    public AdmiBancoP addAdministrador(Administrador administrador) {
        this.administradors.add(administrador);
        administrador.setAdmiBancoP(this);
        return this;
    }

    public AdmiBancoP removeAdministrador(Administrador administrador) {
        this.administradors.remove(administrador);
        administrador.setAdmiBancoP(null);
        return this;
    }

    public Set<BancoPregunta> getBancoPreguntas() {
        return this.bancoPreguntas;
    }

    public void setBancoPreguntas(Set<BancoPregunta> bancoPreguntas) {
        if (this.bancoPreguntas != null) {
            this.bancoPreguntas.forEach(i -> i.setAdmiBancoP(null));
        }
        if (bancoPreguntas != null) {
            bancoPreguntas.forEach(i -> i.setAdmiBancoP(this));
        }
        this.bancoPreguntas = bancoPreguntas;
    }

    public AdmiBancoP bancoPreguntas(Set<BancoPregunta> bancoPreguntas) {
        this.setBancoPreguntas(bancoPreguntas);
        return this;
    }

    public AdmiBancoP addBancoPregunta(BancoPregunta bancoPregunta) {
        this.bancoPreguntas.add(bancoPregunta);
        bancoPregunta.setAdmiBancoP(this);
        return this;
    }

    public AdmiBancoP removeBancoPregunta(BancoPregunta bancoPregunta) {
        this.bancoPreguntas.remove(bancoPregunta);
        bancoPregunta.setAdmiBancoP(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdmiBancoP)) {
            return false;
        }
        return id != null && id.equals(((AdmiBancoP) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdmiBancoP{" +
            "id=" + getId() +
            ", idAdministrador=" + getIdAdministrador() +
            ", idBancoPregunta=" + getIdBancoPregunta() +
            "}";
    }
}
