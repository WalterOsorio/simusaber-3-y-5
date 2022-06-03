package co.edu.sena.repository;

import co.edu.sena.domain.Prueba;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Prueba entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PruebaRepository extends JpaRepository<Prueba, Long> {}
