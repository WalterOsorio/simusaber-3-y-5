package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A SalaMateria.
 */
@Entity
@Table(name = "sala_materia")
public class SalaMateria implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "id_sala")
    private Integer idSala;

    @Column(name = "id_materia")
    private Integer idMateria;

    @OneToMany(mappedBy = "salaMateria")
    @JsonIgnoreProperties(value = { "pruebas", "salaMateria", "docente", "estudianteSala", "estudiantes" }, allowSetters = true)
    private Set<Sala> salas = new HashSet<>();

    @OneToMany(mappedBy = "salaMateria")
    @JsonIgnoreProperties(value = { "docenteMateria", "salaMateria" }, allowSetters = true)
    private Set<Materia> materias = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SalaMateria id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIdSala() {
        return this.idSala;
    }

    public SalaMateria idSala(Integer idSala) {
        this.setIdSala(idSala);
        return this;
    }

    public void setIdSala(Integer idSala) {
        this.idSala = idSala;
    }

    public Integer getIdMateria() {
        return this.idMateria;
    }

    public SalaMateria idMateria(Integer idMateria) {
        this.setIdMateria(idMateria);
        return this;
    }

    public void setIdMateria(Integer idMateria) {
        this.idMateria = idMateria;
    }

    public Set<Sala> getSalas() {
        return this.salas;
    }

    public void setSalas(Set<Sala> salas) {
        if (this.salas != null) {
            this.salas.forEach(i -> i.setSalaMateria(null));
        }
        if (salas != null) {
            salas.forEach(i -> i.setSalaMateria(this));
        }
        this.salas = salas;
    }

    public SalaMateria salas(Set<Sala> salas) {
        this.setSalas(salas);
        return this;
    }

    public SalaMateria addSala(Sala sala) {
        this.salas.add(sala);
        sala.setSalaMateria(this);
        return this;
    }

    public SalaMateria removeSala(Sala sala) {
        this.salas.remove(sala);
        sala.setSalaMateria(null);
        return this;
    }

    public Set<Materia> getMaterias() {
        return this.materias;
    }

    public void setMaterias(Set<Materia> materias) {
        if (this.materias != null) {
            this.materias.forEach(i -> i.setSalaMateria(null));
        }
        if (materias != null) {
            materias.forEach(i -> i.setSalaMateria(this));
        }
        this.materias = materias;
    }

    public SalaMateria materias(Set<Materia> materias) {
        this.setMaterias(materias);
        return this;
    }

    public SalaMateria addMateria(Materia materia) {
        this.materias.add(materia);
        materia.setSalaMateria(this);
        return this;
    }

    public SalaMateria removeMateria(Materia materia) {
        this.materias.remove(materia);
        materia.setSalaMateria(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SalaMateria)) {
            return false;
        }
        return id != null && id.equals(((SalaMateria) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SalaMateria{" +
            "id=" + getId() +
            ", idSala=" + getIdSala() +
            ", idMateria=" + getIdMateria() +
            "}";
    }
}
