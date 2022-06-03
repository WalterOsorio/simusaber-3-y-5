package co.edu.sena.repository;

import co.edu.sena.domain.Estudiante;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class EstudianteRepositoryWithBagRelationshipsImpl implements EstudianteRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Estudiante> fetchBagRelationships(Optional<Estudiante> estudiante) {
        return estudiante.map(this::fetchSalas);
    }

    @Override
    public Page<Estudiante> fetchBagRelationships(Page<Estudiante> estudiantes) {
        return new PageImpl<>(fetchBagRelationships(estudiantes.getContent()), estudiantes.getPageable(), estudiantes.getTotalElements());
    }

    @Override
    public List<Estudiante> fetchBagRelationships(List<Estudiante> estudiantes) {
        return Optional.of(estudiantes).map(this::fetchSalas).orElse(Collections.emptyList());
    }

    Estudiante fetchSalas(Estudiante result) {
        return entityManager
            .createQuery(
                "select estudiante from Estudiante estudiante left join fetch estudiante.salas where estudiante is :estudiante",
                Estudiante.class
            )
            .setParameter("estudiante", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Estudiante> fetchSalas(List<Estudiante> estudiantes) {
        return entityManager
            .createQuery(
                "select distinct estudiante from Estudiante estudiante left join fetch estudiante.salas where estudiante in :estudiantes",
                Estudiante.class
            )
            .setParameter("estudiantes", estudiantes)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
