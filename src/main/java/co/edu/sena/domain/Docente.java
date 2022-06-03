package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Docente.
 */
@Entity
@Table(name = "docente")
public class Docente implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 256)
    @Column(name = "colegio", length = 256, nullable = false)
    private String colegio;

    @NotNull
    @Size(max = 256)
    @Column(name = "materia", length = 256, nullable = false)
    private String materia;

    @NotNull
    @Size(max = 256)
    @Column(name = "ciudad", length = 256, nullable = false)
    private String ciudad;

    @JsonIgnoreProperties(value = { "tipoDocumento", "user", "docente", "estudiante", "administrador" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private UserData userData;

    @OneToMany(mappedBy = "docente")
    @JsonIgnoreProperties(value = { "pruebas", "salaMateria", "docente", "estudianteSala", "estudiantes" }, allowSetters = true)
    private Set<Sala> salas = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "docentes", "materias" }, allowSetters = true)
    private DocenteMateria docenteMateria;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Docente id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getColegio() {
        return this.colegio;
    }

    public Docente colegio(String colegio) {
        this.setColegio(colegio);
        return this;
    }

    public void setColegio(String colegio) {
        this.colegio = colegio;
    }

    public String getMateria() {
        return this.materia;
    }

    public Docente materia(String materia) {
        this.setMateria(materia);
        return this;
    }

    public void setMateria(String materia) {
        this.materia = materia;
    }

    public String getCiudad() {
        return this.ciudad;
    }

    public Docente ciudad(String ciudad) {
        this.setCiudad(ciudad);
        return this;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public UserData getUserData() {
        return this.userData;
    }

    public void setUserData(UserData userData) {
        this.userData = userData;
    }

    public Docente userData(UserData userData) {
        this.setUserData(userData);
        return this;
    }

    public Set<Sala> getSalas() {
        return this.salas;
    }

    public void setSalas(Set<Sala> salas) {
        if (this.salas != null) {
            this.salas.forEach(i -> i.setDocente(null));
        }
        if (salas != null) {
            salas.forEach(i -> i.setDocente(this));
        }
        this.salas = salas;
    }

    public Docente salas(Set<Sala> salas) {
        this.setSalas(salas);
        return this;
    }

    public Docente addSala(Sala sala) {
        this.salas.add(sala);
        sala.setDocente(this);
        return this;
    }

    public Docente removeSala(Sala sala) {
        this.salas.remove(sala);
        sala.setDocente(null);
        return this;
    }

    public DocenteMateria getDocenteMateria() {
        return this.docenteMateria;
    }

    public void setDocenteMateria(DocenteMateria docenteMateria) {
        this.docenteMateria = docenteMateria;
    }

    public Docente docenteMateria(DocenteMateria docenteMateria) {
        this.setDocenteMateria(docenteMateria);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Docente)) {
            return false;
        }
        return id != null && id.equals(((Docente) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Docente{" +
            "id=" + getId() +
            ", colegio='" + getColegio() + "'" +
            ", materia='" + getMateria() + "'" +
            ", ciudad='" + getCiudad() + "'" +
            "}";
    }
}
