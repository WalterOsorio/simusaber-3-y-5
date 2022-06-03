package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A PruebaApoyo.
 */
@Entity
@Table(name = "prueba_apoyo")
public class PruebaApoyo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 256)
    @Column(name = "materia", length = 256, nullable = false)
    private String materia;

    @NotNull
    @Size(max = 256)
    @Column(name = "pregunta", length = 256, nullable = false)
    private String pregunta;

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

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PruebaApoyo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMateria() {
        return this.materia;
    }

    public PruebaApoyo materia(String materia) {
        this.setMateria(materia);
        return this;
    }

    public void setMateria(String materia) {
        this.materia = materia;
    }

    public String getPregunta() {
        return this.pregunta;
    }

    public PruebaApoyo pregunta(String pregunta) {
        this.setPregunta(pregunta);
        return this;
    }

    public void setPregunta(String pregunta) {
        this.pregunta = pregunta;
    }

    public Float getResultado() {
        return this.resultado;
    }

    public PruebaApoyo resultado(Float resultado) {
        this.setResultado(resultado);
        return this;
    }

    public void setResultado(Float resultado) {
        this.resultado = resultado;
    }

    public String getRetroalimentacion() {
        return this.retroalimentacion;
    }

    public PruebaApoyo retroalimentacion(String retroalimentacion) {
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

    public PruebaApoyo estudiante(Estudiante estudiante) {
        this.setEstudiante(estudiante);
        return this;
    }

    public BancoPregunta getBancoPregunta() {
        return this.bancoPregunta;
    }

    public void setBancoPregunta(BancoPregunta bancoPregunta) {
        this.bancoPregunta = bancoPregunta;
    }

    public PruebaApoyo bancoPregunta(BancoPregunta bancoPregunta) {
        this.setBancoPregunta(bancoPregunta);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PruebaApoyo)) {
            return false;
        }
        return id != null && id.equals(((PruebaApoyo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PruebaApoyo{" +
            "id=" + getId() +
            ", materia='" + getMateria() + "'" +
            ", pregunta='" + getPregunta() + "'" +
            ", resultado=" + getResultado() +
            ", retroalimentacion='" + getRetroalimentacion() + "'" +
            "}";
    }
}
