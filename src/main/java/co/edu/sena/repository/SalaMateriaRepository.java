package co.edu.sena.repository;

import co.edu.sena.domain.SalaMateria;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SalaMateria entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SalaMateriaRepository extends JpaRepository<SalaMateria, Long> {}
