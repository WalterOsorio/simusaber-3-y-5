package co.edu.sena.repository;

import co.edu.sena.domain.DocenteMateria;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the DocenteMateria entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DocenteMateriaRepository extends JpaRepository<DocenteMateria, Long> {}
