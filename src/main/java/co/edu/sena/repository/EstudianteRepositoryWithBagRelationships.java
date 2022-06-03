package co.edu.sena.repository;

import co.edu.sena.domain.Estudiante;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface EstudianteRepositoryWithBagRelationships {
    Optional<Estudiante> fetchBagRelationships(Optional<Estudiante> estudiante);

    List<Estudiante> fetchBagRelationships(List<Estudiante> estudiantes);

    Page<Estudiante> fetchBagRelationships(Page<Estudiante> estudiantes);
}
