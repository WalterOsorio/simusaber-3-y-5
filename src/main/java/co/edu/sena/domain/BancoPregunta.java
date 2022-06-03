package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A BancoPregunta.
 */
@Entity
@Table(name = "banco_pregunta")
public class BancoPregunta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 256)
    @Column(name = "descripcion", length = 256, nullable = false)
    private String descripcion;

    @Column(name = "fecha_actualizacion")
    private LocalDate fechaActualizacion;

    @NotNull
    @Size(max = 256)
    @Column(name = "materia", length = 256, nullable = false)
    private String materia;

    @Column(name = "numero_preguntas")
    private Integer numeroPreguntas;

    @NotNull
    @Size(max = 256)
    @Column(name = "pregunta", length = 256, nullable = false)
    private String pregunta;

    @OneToMany(mappedBy = "bancoPregunta")
    @JsonIgnoreProperties(value = { "estudiante", "bancoPregunta", "sala" }, allowSetters = true)
    private Set<Prueba> pruebas = new HashSet<>();

    @OneToMany(mappedBy = "bancoPregunta")
    @JsonIgnoreProperties(value = { "estudiante", "bancoPregunta" }, allowSetters = true)
    private Set<PruebaApoyo> pruebaApoyos = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "administradors", "bancoPreguntas" }, allowSetters = true)
    private AdmiBancoP admiBancoP;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BancoPregunta id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public BancoPregunta descripcion(String descripcion) {
        this.setDescripcion(descripcion);
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDate getFechaActualizacion() {
        return this.fechaActualizacion;
    }

    public BancoPregunta fechaActualizacion(LocalDate fechaActualizacion) {
        this.setFechaActualizacion(fechaActualizacion);
        return this;
    }

    public void setFechaActualizacion(LocalDate fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public String getMateria() {
        return this.materia;
    }

    public BancoPregunta materia(String materia) {
        this.setMateria(materia);
        return this;
    }

    public void setMateria(String materia) {
        this.materia = materia;
    }

    public Integer getNumeroPreguntas() {
        return this.numeroPreguntas;
    }

    public BancoPregunta numeroPreguntas(Integer numeroPreguntas) {
        this.setNumeroPreguntas(numeroPreguntas);
        return this;
    }

    public void setNumeroPreguntas(Integer numeroPreguntas) {
        this.numeroPreguntas = numeroPreguntas;
    }

    public String getPregunta() {
        return this.pregunta;
    }

    public BancoPregunta pregunta(String pregunta) {
        this.setPregunta(pregunta);
        return this;
    }

    public void setPregunta(String pregunta) {
        this.pregunta = pregunta;
    }

    public Set<Prueba> getPruebas() {
        return this.pruebas;
    }

    public void setPruebas(Set<Prueba> pruebas) {
        if (this.pruebas != null) {
            this.pruebas.forEach(i -> i.setBancoPregunta(null));
        }
        if (pruebas != null) {
            pruebas.forEach(i -> i.setBancoPregunta(this));
        }
        this.pruebas = pruebas;
    }

    public BancoPregunta pruebas(Set<Prueba> pruebas) {
        this.setPruebas(pruebas);
        return this;
    }

    public BancoPregunta addPrueba(Prueba prueba) {
        this.pruebas.add(prueba);
        prueba.setBancoPregunta(this);
        return this;
    }

    public BancoPregunta removePrueba(Prueba prueba) {
        this.pruebas.remove(prueba);
        prueba.setBancoPregunta(null);
        return this;
    }

    public Set<PruebaApoyo> getPruebaApoyos() {
        return this.pruebaApoyos;
    }

    public void setPruebaApoyos(Set<PruebaApoyo> pruebaApoyos) {
        if (this.pruebaApoyos != null) {
            this.pruebaApoyos.forEach(i -> i.setBancoPregunta(null));
        }
        if (pruebaApoyos != null) {
            pruebaApoyos.forEach(i -> i.setBancoPregunta(this));
        }
        this.pruebaApoyos = pruebaApoyos;
    }

    public BancoPregunta pruebaApoyos(Set<PruebaApoyo> pruebaApoyos) {
        this.setPruebaApoyos(pruebaApoyos);
        return this;
    }

    public BancoPregunta addPruebaApoyo(PruebaApoyo pruebaApoyo) {
        this.pruebaApoyos.add(pruebaApoyo);
        pruebaApoyo.setBancoPregunta(this);
        return this;
    }

    public BancoPregunta removePruebaApoyo(PruebaApoyo pruebaApoyo) {
        this.pruebaApoyos.remove(pruebaApoyo);
        pruebaApoyo.setBancoPregunta(null);
        return this;
    }

    public AdmiBancoP getAdmiBancoP() {
        return this.admiBancoP;
    }

    public void setAdmiBancoP(AdmiBancoP admiBancoP) {
        this.admiBancoP = admiBancoP;
    }

    public BancoPregunta admiBancoP(AdmiBancoP admiBancoP) {
        this.setAdmiBancoP(admiBancoP);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BancoPregunta)) {
            return false;
        }
        return id != null && id.equals(((BancoPregunta) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BancoPregunta{" +
            "id=" + getId() +
            ", descripcion='" + getDescripcion() + "'" +
            ", fechaActualizacion='" + getFechaActualizacion() + "'" +
            ", materia='" + getMateria() + "'" +
            ", numeroPreguntas=" + getNumeroPreguntas() +
            ", pregunta='" + getPregunta() + "'" +
            "}";
    }
}
