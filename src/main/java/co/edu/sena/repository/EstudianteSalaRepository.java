package co.edu.sena.repository;

import co.edu.sena.domain.EstudianteSala;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EstudianteSala entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EstudianteSalaRepository extends JpaRepository<EstudianteSala, Long> {}
