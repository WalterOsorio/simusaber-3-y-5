package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Estudiante.
 */
@Entity
@Table(name = "estudiante")
public class Estudiante implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 256)
    @Column(name = "grado", length = 256, nullable = false)
    private String grado;

    @NotNull
    @Size(max = 256)
    @Column(name = "colegio", length = 256, nullable = false)
    private String colegio;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @NotNull
    @Size(max = 256)
    @Column(name = "ciudad", length = 256, nullable = false)
    private String ciudad;

    @JsonIgnoreProperties(value = { "tipoDocumento", "user", "docente", "estudiante", "administrador" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private UserData userData;

    @OneToMany(mappedBy = "estudiante")
    @JsonIgnoreProperties(value = { "estudiante", "bancoPregunta", "sala" }, allowSetters = true)
    private Set<Prueba> pruebas = new HashSet<>();

    @OneToMany(mappedBy = "estudiante")
    @JsonIgnoreProperties(value = { "estudiante", "bancoPregunta" }, allowSetters = true)
    private Set<PruebaApoyo> pruebaApoyos = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_estudiante__sala",
        joinColumns = @JoinColumn(name = "estudiante_id"),
        inverseJoinColumns = @JoinColumn(name = "sala_id")
    )
    @JsonIgnoreProperties(value = { "pruebas", "salaMateria", "docente", "estudianteSala", "estudiantes" }, allowSetters = true)
    private Set<Sala> salas = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "estudiantes", "salas" }, allowSetters = true)
    private EstudianteSala estudianteSala;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Estudiante id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGrado() {
        return this.grado;
    }

    public Estudiante grado(String grado) {
        this.setGrado(grado);
        return this;
    }

    public void setGrado(String grado) {
        this.grado = grado;
    }

    public String getColegio() {
        return this.colegio;
    }

    public Estudiante colegio(String colegio) {
        this.setColegio(colegio);
        return this;
    }

    public void setColegio(String colegio) {
        this.colegio = colegio;
    }

    public LocalDate getFechaNacimiento() {
        return this.fechaNacimiento;
    }

    public Estudiante fechaNacimiento(LocalDate fechaNacimiento) {
        this.setFechaNacimiento(fechaNacimiento);
        return this;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getCiudad() {
        return this.ciudad;
    }

    public Estudiante ciudad(String ciudad) {
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

    public Estudiante userData(UserData userData) {
        this.setUserData(userData);
        return this;
    }

    public Set<Prueba> getPruebas() {
        return this.pruebas;
    }

    public void setPruebas(Set<Prueba> pruebas) {
        if (this.pruebas != null) {
            this.pruebas.forEach(i -> i.setEstudiante(null));
        }
        if (pruebas != null) {
            pruebas.forEach(i -> i.setEstudiante(this));
        }
        this.pruebas = pruebas;
    }

    public Estudiante pruebas(Set<Prueba> pruebas) {
        this.setPruebas(pruebas);
        return this;
    }

    public Estudiante addPrueba(Prueba prueba) {
        this.pruebas.add(prueba);
        prueba.setEstudiante(this);
        return this;
    }

    public Estudiante removePrueba(Prueba prueba) {
        this.pruebas.remove(prueba);
        prueba.setEstudiante(null);
        return this;
    }

    public Set<PruebaApoyo> getPruebaApoyos() {
        return this.pruebaApoyos;
    }

    public void setPruebaApoyos(Set<PruebaApoyo> pruebaApoyos) {
        if (this.pruebaApoyos != null) {
            this.pruebaApoyos.forEach(i -> i.setEstudiante(null));
        }
        if (pruebaApoyos != null) {
            pruebaApoyos.forEach(i -> i.setEstudiante(this));
        }
        this.pruebaApoyos = pruebaApoyos;
    }

    public Estudiante pruebaApoyos(Set<PruebaApoyo> pruebaApoyos) {
        this.setPruebaApoyos(pruebaApoyos);
        return this;
    }

    public Estudiante addPruebaApoyo(PruebaApoyo pruebaApoyo) {
        this.pruebaApoyos.add(pruebaApoyo);
        pruebaApoyo.setEstudiante(this);
        return this;
    }

    public Estudiante removePruebaApoyo(PruebaApoyo pruebaApoyo) {
        this.pruebaApoyos.remove(pruebaApoyo);
        pruebaApoyo.setEstudiante(null);
        return this;
    }

    public Set<Sala> getSalas() {
        return this.salas;
    }

    public void setSalas(Set<Sala> salas) {
        this.salas = salas;
    }

    public Estudiante salas(Set<Sala> salas) {
        this.setSalas(salas);
        return this;
    }

    public Estudiante addSala(Sala sala) {
        this.salas.add(sala);
        sala.getEstudiantes().add(this);
        return this;
    }

    public Estudiante removeSala(Sala sala) {
        this.salas.remove(sala);
        sala.getEstudiantes().remove(this);
        return this;
    }

    public EstudianteSala getEstudianteSala() {
        return this.estudianteSala;
    }

    public void setEstudianteSala(EstudianteSala estudianteSala) {
        this.estudianteSala = estudianteSala;
    }

    public Estudiante estudianteSala(EstudianteSala estudianteSala) {
        this.setEstudianteSala(estudianteSala);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Estudiante)) {
            return false;
        }
        return id != null && id.equals(((Estudiante) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Estudiante{" +
            "id=" + getId() +
            ", grado='" + getGrado() + "'" +
            ", colegio='" + getColegio() + "'" +
            ", fechaNacimiento='" + getFechaNacimiento() + "'" +
            ", ciudad='" + getCiudad() + "'" +
            "}";
    }
}
