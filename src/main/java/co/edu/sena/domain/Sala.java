package co.edu.sena.domain;

import co.edu.sena.domain.enumeration.State;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Sala.
 */
@Entity
@Table(name = "sala")
public class Sala implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private State estado;

    @NotNull
    @Size(max = 256)
    @Column(name = "materia", length = 256, nullable = false)
    private String materia;

    @Column(name = "numero_estudiantes")
    private Integer numeroEstudiantes;

    @Column(name = "resultados")
    private Float resultados;

    @NotNull
    @Size(max = 256)
    @Column(name = "retroalimentacion", length = 256, nullable = false)
    private String retroalimentacion;

    @OneToMany(mappedBy = "sala")
    @JsonIgnoreProperties(value = { "estudiante", "bancoPregunta", "sala" }, allowSetters = true)
    private Set<Prueba> pruebas = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "salas", "materias" }, allowSetters = true)
    private SalaMateria salaMateria;

    @ManyToOne
    @JsonIgnoreProperties(value = { "userData", "salas", "docenteMateria" }, allowSetters = true)
    private Docente docente;

    @ManyToOne
    @JsonIgnoreProperties(value = { "estudiantes", "salas" }, allowSetters = true)
    private EstudianteSala estudianteSala;

    @ManyToMany(mappedBy = "salas")
    @JsonIgnoreProperties(value = { "userData", "pruebas", "pruebaApoyos", "salas", "estudianteSala" }, allowSetters = true)
    private Set<Estudiante> estudiantes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Sala id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public State getEstado() {
        return this.estado;
    }

    public Sala estado(State estado) {
        this.setEstado(estado);
        return this;
    }

    public void setEstado(State estado) {
        this.estado = estado;
    }

    public String getMateria() {
        return this.materia;
    }

    public Sala materia(String materia) {
        this.setMateria(materia);
        return this;
    }

    public void setMateria(String materia) {
        this.materia = materia;
    }

    public Integer getNumeroEstudiantes() {
        return this.numeroEstudiantes;
    }

    public Sala numeroEstudiantes(Integer numeroEstudiantes) {
        this.setNumeroEstudiantes(numeroEstudiantes);
        return this;
    }

    public void setNumeroEstudiantes(Integer numeroEstudiantes) {
        this.numeroEstudiantes = numeroEstudiantes;
    }

    public Float getResultados() {
        return this.resultados;
    }

    public Sala resultados(Float resultados) {
        this.setResultados(resultados);
        return this;
    }

    public void setResultados(Float resultados) {
        this.resultados = resultados;
    }

    public String getRetroalimentacion() {
        return this.retroalimentacion;
    }

    public Sala retroalimentacion(String retroalimentacion) {
        this.setRetroalimentacion(retroalimentacion);
        return this;
    }

    public void setRetroalimentacion(String retroalimentacion) {
        this.retroalimentacion = retroalimentacion;
    }

    public Set<Prueba> getPruebas() {
        return this.pruebas;
    }

    public void setPruebas(Set<Prueba> pruebas) {
        if (this.pruebas != null) {
            this.pruebas.forEach(i -> i.setSala(null));
        }
        if (pruebas != null) {
            pruebas.forEach(i -> i.setSala(this));
        }
        this.pruebas = pruebas;
    }

    public Sala pruebas(Set<Prueba> pruebas) {
        this.setPruebas(pruebas);
        return this;
    }

    public Sala addPrueba(Prueba prueba) {
        this.pruebas.add(prueba);
        prueba.setSala(this);
        return this;
    }

    public Sala removePrueba(Prueba prueba) {
        this.pruebas.remove(prueba);
        prueba.setSala(null);
        return this;
    }

    public SalaMateria getSalaMateria() {
        return this.salaMateria;
    }

    public void setSalaMateria(SalaMateria salaMateria) {
        this.salaMateria = salaMateria;
    }

    public Sala salaMateria(SalaMateria salaMateria) {
        this.setSalaMateria(salaMateria);
        return this;
    }

    public Docente getDocente() {
        return this.docente;
    }

    public void setDocente(Docente docente) {
        this.docente = docente;
    }

    public Sala docente(Docente docente) {
        this.setDocente(docente);
        return this;
    }

    public EstudianteSala getEstudianteSala() {
        return this.estudianteSala;
    }

    public void setEstudianteSala(EstudianteSala estudianteSala) {
        this.estudianteSala = estudianteSala;
    }

    public Sala estudianteSala(EstudianteSala estudianteSala) {
        this.setEstudianteSala(estudianteSala);
        return this;
    }

    public Set<Estudiante> getEstudiantes() {
        return this.estudiantes;
    }

    public void setEstudiantes(Set<Estudiante> estudiantes) {
        if (this.estudiantes != null) {
            this.estudiantes.forEach(i -> i.removeSala(this));
        }
        if (estudiantes != null) {
            estudiantes.forEach(i -> i.addSala(this));
        }
        this.estudiantes = estudiantes;
    }

    public Sala estudiantes(Set<Estudiante> estudiantes) {
        this.setEstudiantes(estudiantes);
        return this;
    }

    public Sala addEstudiante(Estudiante estudiante) {
        this.estudiantes.add(estudiante);
        estudiante.getSalas().add(this);
        return this;
    }

    public Sala removeEstudiante(Estudiante estudiante) {
        this.estudiantes.remove(estudiante);
        estudiante.getSalas().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sala)) {
            return false;
        }
        return id != null && id.equals(((Sala) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sala{" +
            "id=" + getId() +
            ", estado='" + getEstado() + "'" +
            ", materia='" + getMateria() + "'" +
            ", numeroEstudiantes=" + getNumeroEstudiantes() +
            ", resultados=" + getResultados() +
            ", retroalimentacion='" + getRetroalimentacion() + "'" +
            "}";
    }
}
