package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A EstudianteSala.
 */
@Entity
@Table(name = "estudiante_sala")
public class EstudianteSala implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "id_estudiante")
    private Integer idEstudiante;

    @Column(name = "id_sala")
    private Integer idSala;

    @OneToMany(mappedBy = "estudianteSala")
    @JsonIgnoreProperties(value = { "userData", "pruebas", "pruebaApoyos", "salas", "estudianteSala" }, allowSetters = true)
    private Set<Estudiante> estudiantes = new HashSet<>();

    @OneToMany(mappedBy = "estudianteSala")
    @JsonIgnoreProperties(value = { "pruebas", "salaMateria", "docente", "estudianteSala", "estudiantes" }, allowSetters = true)
    private Set<Sala> salas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EstudianteSala id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIdEstudiante() {
        return this.idEstudiante;
    }

    public EstudianteSala idEstudiante(Integer idEstudiante) {
        this.setIdEstudiante(idEstudiante);
        return this;
    }

    public void setIdEstudiante(Integer idEstudiante) {
        this.idEstudiante = idEstudiante;
    }

    public Integer getIdSala() {
        return this.idSala;
    }

    public EstudianteSala idSala(Integer idSala) {
        this.setIdSala(idSala);
        return this;
    }

    public void setIdSala(Integer idSala) {
        this.idSala = idSala;
    }

    public Set<Estudiante> getEstudiantes() {
        return this.estudiantes;
    }

    public void setEstudiantes(Set<Estudiante> estudiantes) {
        if (this.estudiantes != null) {
            this.estudiantes.forEach(i -> i.setEstudianteSala(null));
        }
        if (estudiantes != null) {
            estudiantes.forEach(i -> i.setEstudianteSala(this));
        }
        this.estudiantes = estudiantes;
    }

    public EstudianteSala estudiantes(Set<Estudiante> estudiantes) {
        this.setEstudiantes(estudiantes);
        return this;
    }

    public EstudianteSala addEstudiante(Estudiante estudiante) {
        this.estudiantes.add(estudiante);
        estudiante.setEstudianteSala(this);
        return this;
    }

    public EstudianteSala removeEstudiante(Estudiante estudiante) {
        this.estudiantes.remove(estudiante);
        estudiante.setEstudianteSala(null);
        return this;
    }

    public Set<Sala> getSalas() {
        return this.salas;
    }

    public void setSalas(Set<Sala> salas) {
        if (this.salas != null) {
            this.salas.forEach(i -> i.setEstudianteSala(null));
        }
        if (salas != null) {
            salas.forEach(i -> i.setEstudianteSala(this));
        }
        this.salas = salas;
    }

    public EstudianteSala salas(Set<Sala> salas) {
        this.setSalas(salas);
        return this;
    }

    public EstudianteSala addSala(Sala sala) {
        this.salas.add(sala);
        sala.setEstudianteSala(this);
        return this;
    }

    public EstudianteSala removeSala(Sala sala) {
        this.salas.remove(sala);
        sala.setEstudianteSala(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EstudianteSala)) {
            return false;
        }
        return id != null && id.equals(((EstudianteSala) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EstudianteSala{" +
            "id=" + getId() +
            ", idEstudiante=" + getIdEstudiante() +
            ", idSala=" + getIdSala() +
            "}";
    }
}
