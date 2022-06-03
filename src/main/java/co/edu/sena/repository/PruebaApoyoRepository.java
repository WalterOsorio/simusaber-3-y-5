package co.edu.sena.repository;

import co.edu.sena.domain.PruebaApoyo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PruebaApoyo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PruebaApoyoRepository extends JpaRepository<PruebaApoyo, Long> {}
