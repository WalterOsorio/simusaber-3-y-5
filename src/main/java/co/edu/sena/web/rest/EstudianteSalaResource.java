package co.edu.sena.web.rest;

import co.edu.sena.domain.EstudianteSala;
import co.edu.sena.repository.EstudianteSalaRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.EstudianteSala}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EstudianteSalaResource {

    private final Logger log = LoggerFactory.getLogger(EstudianteSalaResource.class);

    private static final String ENTITY_NAME = "estudianteSala";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EstudianteSalaRepository estudianteSalaRepository;

    public EstudianteSalaResource(EstudianteSalaRepository estudianteSalaRepository) {
        this.estudianteSalaRepository = estudianteSalaRepository;
    }

    /**
     * {@code POST  /estudiante-salas} : Create a new estudianteSala.
     *
     * @param estudianteSala the estudianteSala to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new estudianteSala, or with status {@code 400 (Bad Request)} if the estudianteSala has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/estudiante-salas")
    public ResponseEntity<EstudianteSala> createEstudianteSala(@RequestBody EstudianteSala estudianteSala) throws URISyntaxException {
        log.debug("REST request to save EstudianteSala : {}", estudianteSala);
        if (estudianteSala.getId() != null) {
            throw new BadRequestAlertException("A new estudianteSala cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EstudianteSala result = estudianteSalaRepository.save(estudianteSala);
        return ResponseEntity
            .created(new URI("/api/estudiante-salas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /estudiante-salas/:id} : Updates an existing estudianteSala.
     *
     * @param id the id of the estudianteSala to save.
     * @param estudianteSala the estudianteSala to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estudianteSala,
     * or with status {@code 400 (Bad Request)} if the estudianteSala is not valid,
     * or with status {@code 500 (Internal Server Error)} if the estudianteSala couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/estudiante-salas/{id}")
    public ResponseEntity<EstudianteSala> updateEstudianteSala(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EstudianteSala estudianteSala
    ) throws URISyntaxException {
        log.debug("REST request to update EstudianteSala : {}, {}", id, estudianteSala);
        if (estudianteSala.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estudianteSala.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estudianteSalaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EstudianteSala result = estudianteSalaRepository.save(estudianteSala);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, estudianteSala.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /estudiante-salas/:id} : Partial updates given fields of an existing estudianteSala, field will ignore if it is null
     *
     * @param id the id of the estudianteSala to save.
     * @param estudianteSala the estudianteSala to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estudianteSala,
     * or with status {@code 400 (Bad Request)} if the estudianteSala is not valid,
     * or with status {@code 404 (Not Found)} if the estudianteSala is not found,
     * or with status {@code 500 (Internal Server Error)} if the estudianteSala couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/estudiante-salas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EstudianteSala> partialUpdateEstudianteSala(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EstudianteSala estudianteSala
    ) throws URISyntaxException {
        log.debug("REST request to partial update EstudianteSala partially : {}, {}", id, estudianteSala);
        if (estudianteSala.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estudianteSala.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estudianteSalaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EstudianteSala> result = estudianteSalaRepository
            .findById(estudianteSala.getId())
            .map(existingEstudianteSala -> {
                if (estudianteSala.getIdEstudiante() != null) {
                    existingEstudianteSala.setIdEstudiante(estudianteSala.getIdEstudiante());
                }
                if (estudianteSala.getIdSala() != null) {
                    existingEstudianteSala.setIdSala(estudianteSala.getIdSala());
                }

                return existingEstudianteSala;
            })
            .map(estudianteSalaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, estudianteSala.getId().toString())
        );
    }

    /**
     * {@code GET  /estudiante-salas} : get all the estudianteSalas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of estudianteSalas in body.
     */
    @GetMapping("/estudiante-salas")
    public List<EstudianteSala> getAllEstudianteSalas() {
        log.debug("REST request to get all EstudianteSalas");
        return estudianteSalaRepository.findAll();
    }

    /**
     * {@code GET  /estudiante-salas/:id} : get the "id" estudianteSala.
     *
     * @param id the id of the estudianteSala to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the estudianteSala, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/estudiante-salas/{id}")
    public ResponseEntity<EstudianteSala> getEstudianteSala(@PathVariable Long id) {
        log.debug("REST request to get EstudianteSala : {}", id);
        Optional<EstudianteSala> estudianteSala = estudianteSalaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(estudianteSala);
    }

    /**
     * {@code DELETE  /estudiante-salas/:id} : delete the "id" estudianteSala.
     *
     * @param id the id of the estudianteSala to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/estudiante-salas/{id}")
    public ResponseEntity<Void> deleteEstudianteSala(@PathVariable Long id) {
        log.debug("REST request to delete EstudianteSala : {}", id);
        estudianteSalaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
