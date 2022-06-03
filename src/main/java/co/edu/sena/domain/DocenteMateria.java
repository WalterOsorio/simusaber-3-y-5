package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A DocenteMateria.
 */
@Entity
@Table(name = "docente_materia")
public class DocenteMateria implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "id_docente")
    private Integer idDocente;

    @Column(name = "id_materia")
    private Integer idMateria;

    @OneToMany(mappedBy = "docenteMateria")
    @JsonIgnoreProperties(value = { "userData", "salas", "docenteMateria" }, allowSetters = true)
    private Set<Docente> docentes = new HashSet<>();

    @OneToMany(mappedBy = "docenteMateria")
    @JsonIgnoreProperties(value = { "docenteMateria", "salaMateria" }, allowSetters = true)
    private Set<Materia> materias = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DocenteMateria id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIdDocente() {
        return this.idDocente;
    }

    public DocenteMateria idDocente(Integer idDocente) {
        this.setIdDocente(idDocente);
        return this;
    }

    public void setIdDocente(Integer idDocente) {
        this.idDocente = idDocente;
    }

    public Integer getIdMateria() {
        return this.idMateria;
    }

    public DocenteMateria idMateria(Integer idMateria) {
        this.setIdMateria(idMateria);
        return this;
    }

    public void setIdMateria(Integer idMateria) {
        this.idMateria = idMateria;
    }

    public Set<Docente> getDocentes() {
        return this.docentes;
    }

    public void setDocentes(Set<Docente> docentes) {
        if (this.docentes != null) {
            this.docentes.forEach(i -> i.setDocenteMateria(null));
        }
        if (docentes != null) {
            docentes.forEach(i -> i.setDocenteMateria(this));
        }
        this.docentes = docentes;
    }

    public DocenteMateria docentes(Set<Docente> docentes) {
        this.setDocentes(docentes);
        return this;
    }

    public DocenteMateria addDocente(Docente docente) {
        this.docentes.add(docente);
        docente.setDocenteMateria(this);
        return this;
    }

    public DocenteMateria removeDocente(Docente docente) {
        this.docentes.remove(docente);
        docente.setDocenteMateria(null);
        return this;
    }

    public Set<Materia> getMaterias() {
        return this.materias;
    }

    public void setMaterias(Set<Materia> materias) {
        if (this.materias != null) {
            this.materias.forEach(i -> i.setDocenteMateria(null));
        }
        if (materias != null) {
            materias.forEach(i -> i.setDocenteMateria(this));
        }
        this.materias = materias;
    }

    public DocenteMateria materias(Set<Materia> materias) {
        this.setMaterias(materias);
        return this;
    }

    public DocenteMateria addMateria(Materia materia) {
        this.materias.add(materia);
        materia.setDocenteMateria(this);
        return this;
    }

    public DocenteMateria removeMateria(Materia materia) {
        this.materias.remove(materia);
        materia.setDocenteMateria(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DocenteMateria)) {
            return false;
        }
        return id != null && id.equals(((DocenteMateria) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DocenteMateria{" +
            "id=" + getId() +
            ", idDocente=" + getIdDocente() +
            ", idMateria=" + getIdMateria() +
            "}";
    }
}
