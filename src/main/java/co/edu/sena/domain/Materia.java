package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Materia.
 */
@Entity
@Table(name = "materia")
public class Materia implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 256)
    @Column(name = "nombre_materia", length = 256, nullable = false)
    private String nombreMateria;

    @Column(name = "numero_preguntas")
    private Integer numeroPreguntas;

    @NotNull
    @Size(max = 256)
    @Column(name = "pregunta", length = 256, nullable = false)
    private String pregunta;

    @ManyToOne
    @JsonIgnoreProperties(value = { "docentes", "materias" }, allowSetters = true)
    private DocenteMateria docenteMateria;

    @ManyToOne
    @JsonIgnoreProperties(value = { "salas", "materias" }, allowSetters = true)
    private SalaMateria salaMateria;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Materia id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreMateria() {
        return this.nombreMateria;
    }

    public Materia nombreMateria(String nombreMateria) {
        this.setNombreMateria(nombreMateria);
        return this;
    }

    public void setNombreMateria(String nombreMateria) {
        this.nombreMateria = nombreMateria;
    }

    public Integer getNumeroPreguntas() {
        return this.numeroPreguntas;
    }

    public Materia numeroPreguntas(Integer numeroPreguntas) {
        this.setNumeroPreguntas(numeroPreguntas);
        return this;
    }

    public void setNumeroPreguntas(Integer numeroPreguntas) {
        this.numeroPreguntas = numeroPreguntas;
    }

    public String getPregunta() {
        return this.pregunta;
    }

    public Materia pregunta(String pregunta) {
        this.setPregunta(pregunta);
        return this;
    }

    public void setPregunta(String pregunta) {
        this.pregunta = pregunta;
    }

    public DocenteMateria getDocenteMateria() {
        return this.docenteMateria;
    }

    public void setDocenteMateria(DocenteMateria docenteMateria) {
        this.docenteMateria = docenteMateria;
    }

    public Materia docenteMateria(DocenteMateria docenteMateria) {
        this.setDocenteMateria(docenteMateria);
        return this;
    }

    public SalaMateria getSalaMateria() {
        return this.salaMateria;
    }

    public void setSalaMateria(SalaMateria salaMateria) {
        this.salaMateria = salaMateria;
    }

    public Materia salaMateria(SalaMateria salaMateria) {
        this.setSalaMateria(salaMateria);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Materia)) {
            return false;
        }
        return id != null && id.equals(((Materia) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Materia{" +
            "id=" + getId() +
            ", nombreMateria='" + getNombreMateria() + "'" +
            ", numeroPreguntas=" + getNumeroPreguntas() +
            ", pregunta='" + getPregunta() + "'" +
            "}";
    }
}
