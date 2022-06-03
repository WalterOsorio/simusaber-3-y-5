package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Prueba.
 */
@Entity
@Table(name = "prueba")
public class Prueba implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "fecha_aplicacion")
    private LocalDate fechaAplicacion;

    @Column(name = "resultado")
    private Float resultado;

    @NotNull
    @Size(max = 256)
    @Column(name = "retroalimentacion", length = 256, nullable = false)
    private String retroalimentacion;

    @ManyToOne
    @JsonIgnoreProperties(value = { "userData", "pruebas", "pruebaApoyos", "salas", "estudianteSala" }, allowSetters = true)
    private Estudiante estudiante;

    @ManyToOne
    @JsonIgnoreProperties(value = { "pruebas", "pruebaApoyos", "admiBancoP" }, allowSetters = true)
    private BancoPregunta bancoPregunta;

    @ManyToOne
    @JsonIgnoreProperties(value = { "pruebas", "salaMateria", "docente", "estudianteSala", "estudiantes" }, allowSetters = true)
    private Sala sala;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Prueba id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFechaAplicacion() {
        return this.fechaAplicacion;
    }

    public Prueba fechaAplicacion(LocalDate fechaAplicacion) {
        this.setFechaAplicacion(fechaAplicacion);
        return this;
    }

    public void setFechaAplicacion(LocalDate fechaAplicacion) {
        this.fechaAplicacion = fechaAplicacion;
    }

    public Float getResultado() {
        return this.resultado;
    }

    public Prueba resultado(Float resultado) {
        this.setResultado(resultado);
        return this;
    }

    public void setResultado(Float resultado) {
        this.resultado = resultado;
    }

    public String getRetroalimentacion() {
        return this.retroalimentacion;
    }

    public Prueba retroalimentacion(String retroalimentacion) {
        this.setRetroalimentacion(retroalimentacion);
        return this;
    }

    public void setRetroalimentacion(String retroalimentacion) {
        this.retroalimentacion = retroalimentacion;
    }

    public Estudiante getEstudiante() {
        return this.estudiante;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
    }

    public Prueba estudiante(Estudiante estudiante) {
        this.setEstudiante(estudiante);
        return this;
    }

    public BancoPregunta getBancoPregunta() {
        return this.bancoPregunta;
    }

    public void setBancoPregunta(BancoPregunta bancoPregunta) {
        this.bancoPregunta = bancoPregunta;
    }

    public Prueba bancoPregunta(BancoPregunta bancoPregunta) {
        this.setBancoPregunta(bancoPregunta);
        return this;
    }

    public Sala getSala() {
        return this.sala;
    }

    public void setSala(Sala sala) {
        this.sala = sala;
    }

    public Prueba sala(Sala sala) {
        this.setSala(sala);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Prueba)) {
            return false;
        }
        return id != null && id.equals(((Prueba) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Prueba{" +
            "id=" + getId() +
            ", fechaAplicacion='" + getFechaAplicacion() + "'" +
            ", resultado=" + getResultado() +
            ", retroalimentacion='" + getRetroalimentacion() + "'" +
            "}";
    }
}
