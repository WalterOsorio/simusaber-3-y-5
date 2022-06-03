package co.edu.sena.repository;

import co.edu.sena.domain.AdmiBancoP;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AdmiBancoP entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdmiBancoPRepository extends JpaRepository<AdmiBancoP, Long> {}
