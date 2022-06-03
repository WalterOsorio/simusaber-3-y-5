package co.edu.sena.web.rest;

import co.edu.sena.domain.SalaMateria;
import co.edu.sena.repository.SalaMateriaRepository;
import co.edu.sena.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link co.edu.sena.domain.SalaMateria}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SalaMateriaResource {

    private final Logger log = LoggerFactory.getLogger(SalaMateriaResource.class);

    private static final String ENTITY_NAME = "salaMateria";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SalaMateriaRepository salaMateriaRepository;

    public SalaMateriaResource(SalaMateriaRepository salaMateriaRepository) {
        this.salaMateriaRepository = salaMateriaRepository;
    }

    /**
     * {@code POST  /sala-materias} : Create a new salaMateria.
     *
     * @param salaMateria the salaMateria to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new salaMateria, or with status {@code 400 (Bad Request)} if the salaMateria has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sala-materias")
    public ResponseEntity<SalaMateria> createSalaMateria(@RequestBody SalaMateria salaMateria) throws URISyntaxException {
        log.debug("REST request to save SalaMateria : {}", salaMateria);
        if (salaMateria.getId() != null) {
            throw new BadRequestAlertException("A new salaMateria cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SalaMateria result = salaMateriaRepository.save(salaMateria);
        return ResponseEntity
            .created(new URI("/api/sala-materias/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sala-materias/:id} : Updates an existing salaMateria.
     *
     * @param id the id of the salaMateria to save.
     * @param salaMateria the salaMateria to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated salaMateria,
     * or with status {@code 400 (Bad Request)} if the salaMateria is not valid,
     * or with status {@code 500 (Internal Server Error)} if the salaMateria couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sala-materias/{id}")
    public ResponseEntity<SalaMateria> updateSalaMateria(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SalaMateria salaMateria
    ) throws URISyntaxException {
        log.debug("REST request to update SalaMateria : {}, {}", id, salaMateria);
        if (salaMateria.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, salaMateria.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salaMateriaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SalaMateria result = salaMateriaRepository.save(salaMateria);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, salaMateria.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sala-materias/:id} : Partial updates given fields of an existing salaMateria, field will ignore if it is null
     *
     * @param id the id of the salaMateria to save.
     * @param salaMateria the salaMateria to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated salaMateria,
     * or with status {@code 400 (Bad Request)} if the salaMateria is not valid,
     * or with status {@code 404 (Not Found)} if the salaMateria is not found,
     * or with status {@code 500 (Internal Server Error)} if the salaMateria couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sala-materias/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SalaMateria> partialUpdateSalaMateria(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SalaMateria salaMateria
    ) throws URISyntaxException {
        log.debug("REST request to partial update SalaMateria partially : {}, {}", id, salaMateria);
        if (salaMateria.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, salaMateria.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salaMateriaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SalaMateria> result = salaMateriaRepository
            .findById(salaMateria.getId())
            .map(existingSalaMateria -> {
                if (salaMateria.getIdSala() != null) {
                    existingSalaMateria.setIdSala(salaMateria.getIdSala());
                }
                if (salaMateria.getIdMateria() != null) {
                    existingSalaMateria.setIdMateria(salaMateria.getIdMateria());
                }

                return existingSalaMateria;
            })
            .map(salaMateriaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, salaMateria.getId().toString())
        );
    }

    /**
     * {@code GET  /sala-materias} : get all the salaMaterias.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of salaMaterias in body.
     */
    @GetMapping("/sala-materias")
    public List<SalaMateria> getAllSalaMaterias() {
        log.debug("REST request to get all SalaMaterias");
        return salaMateriaRepository.findAll();
    }

    /**
     * {@code GET  /sala-materias/:id} : get the "id" salaMateria.
     *
     * @param id the id of the salaMateria to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the salaMateria, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sala-materias/{id}")
    public ResponseEntity<SalaMateria> getSalaMateria(@PathVariable Long id) {
        log.debug("REST request to get SalaMateria : {}", id);
        Optional<SalaMateria> salaMateria = salaMateriaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(salaMateria);
    }

    /**
     * {@code DELETE  /sala-materias/:id} : delete the "id" salaMateria.
     *
     * @param id the id of the salaMateria to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sala-materias/{id}")
    public ResponseEntity<Void> deleteSalaMateria(@PathVariable Long id) {
        log.debug("REST request to delete SalaMateria : {}", id);
        salaMateriaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
