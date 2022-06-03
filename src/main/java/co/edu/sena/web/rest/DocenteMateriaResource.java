package co.edu.sena.web.rest;

import co.edu.sena.domain.DocenteMateria;
import co.edu.sena.repository.DocenteMateriaRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.DocenteMateria}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DocenteMateriaResource {

    private final Logger log = LoggerFactory.getLogger(DocenteMateriaResource.class);

    private static final String ENTITY_NAME = "docenteMateria";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DocenteMateriaRepository docenteMateriaRepository;

    public DocenteMateriaResource(DocenteMateriaRepository docenteMateriaRepository) {
        this.docenteMateriaRepository = docenteMateriaRepository;
    }

    /**
     * {@code POST  /docente-materias} : Create a new docenteMateria.
     *
     * @param docenteMateria the docenteMateria to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new docenteMateria, or with status {@code 400 (Bad Request)} if the docenteMateria has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/docente-materias")
    public ResponseEntity<DocenteMateria> createDocenteMateria(@RequestBody DocenteMateria docenteMateria) throws URISyntaxException {
        log.debug("REST request to save DocenteMateria : {}", docenteMateria);
        if (docenteMateria.getId() != null) {
            throw new BadRequestAlertException("A new docenteMateria cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DocenteMateria result = docenteMateriaRepository.save(docenteMateria);
        return ResponseEntity
            .created(new URI("/api/docente-materias/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /docente-materias/:id} : Updates an existing docenteMateria.
     *
     * @param id the id of the docenteMateria to save.
     * @param docenteMateria the docenteMateria to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated docenteMateria,
     * or with status {@code 400 (Bad Request)} if the docenteMateria is not valid,
     * or with status {@code 500 (Internal Server Error)} if the docenteMateria couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/docente-materias/{id}")
    public ResponseEntity<DocenteMateria> updateDocenteMateria(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DocenteMateria docenteMateria
    ) throws URISyntaxException {
        log.debug("REST request to update DocenteMateria : {}, {}", id, docenteMateria);
        if (docenteMateria.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, docenteMateria.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!docenteMateriaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DocenteMateria result = docenteMateriaRepository.save(docenteMateria);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, docenteMateria.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /docente-materias/:id} : Partial updates given fields of an existing docenteMateria, field will ignore if it is null
     *
     * @param id the id of the docenteMateria to save.
     * @param docenteMateria the docenteMateria to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated docenteMateria,
     * or with status {@code 400 (Bad Request)} if the docenteMateria is not valid,
     * or with status {@code 404 (Not Found)} if the docenteMateria is not found,
     * or with status {@code 500 (Internal Server Error)} if the docenteMateria couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/docente-materias/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DocenteMateria> partialUpdateDocenteMateria(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DocenteMateria docenteMateria
    ) throws URISyntaxException {
        log.debug("REST request to partial update DocenteMateria partially : {}, {}", id, docenteMateria);
        if (docenteMateria.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, docenteMateria.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!docenteMateriaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DocenteMateria> result = docenteMateriaRepository
            .findById(docenteMateria.getId())
            .map(existingDocenteMateria -> {
                if (docenteMateria.getIdDocente() != null) {
                    existingDocenteMateria.setIdDocente(docenteMateria.getIdDocente());
                }
                if (docenteMateria.getIdMateria() != null) {
                    existingDocenteMateria.setIdMateria(docenteMateria.getIdMateria());
                }

                return existingDocenteMateria;
            })
            .map(docenteMateriaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, docenteMateria.getId().toString())
        );
    }

    /**
     * {@code GET  /docente-materias} : get all the docenteMaterias.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of docenteMaterias in body.
     */
    @GetMapping("/docente-materias")
    public List<DocenteMateria> getAllDocenteMaterias() {
        log.debug("REST request to get all DocenteMaterias");
        return docenteMateriaRepository.findAll();
    }

    /**
     * {@code GET  /docente-materias/:id} : get the "id" docenteMateria.
     *
     * @param id the id of the docenteMateria to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the docenteMateria, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/docente-materias/{id}")
    public ResponseEntity<DocenteMateria> getDocenteMateria(@PathVariable Long id) {
        log.debug("REST request to get DocenteMateria : {}", id);
        Optional<DocenteMateria> docenteMateria = docenteMateriaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(docenteMateria);
    }

    /**
     * {@code DELETE  /docente-materias/:id} : delete the "id" docenteMateria.
     *
     * @param id the id of the docenteMateria to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/docente-materias/{id}")
    public ResponseEntity<Void> deleteDocenteMateria(@PathVariable Long id) {
        log.debug("REST request to delete DocenteMateria : {}", id);
        docenteMateriaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
