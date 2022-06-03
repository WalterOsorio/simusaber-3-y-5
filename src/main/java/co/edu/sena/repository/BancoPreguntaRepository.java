package co.edu.sena.repository;

import co.edu.sena.domain.BancoPregunta;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BancoPregunta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BancoPreguntaRepository extends JpaRepository<BancoPregunta, Long> {}
