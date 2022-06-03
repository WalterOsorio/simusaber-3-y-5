package co.edu.sena.web.rest;

import co.edu.sena.domain.Materia;
import co.edu.sena.repository.MateriaRepository;
import co.edu.sena.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link co.edu.sena.domain.Materia}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MateriaResource {

    private final Logger log = LoggerFactory.getLogger(MateriaResource.class);

    private static final String ENTITY_NAME = "materia";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MateriaRepository materiaRepository;

    public MateriaResource(MateriaRepository materiaRepository) {
        this.materiaRepository = materiaRepository;
    }

    /**
     * {@code POST  /materias} : Create a new materia.
     *
     * @param materia the materia to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new materia, or with status {@code 400 (Bad Request)} if the materia has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/materias")
    public ResponseEntity<Materia> createMateria(@Valid @RequestBody Materia materia) throws URISyntaxException {
        log.debug("REST request to save Materia : {}", materia);
        if (materia.getId() != null) {
            throw new BadRequestAlertException("A new materia cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Materia result = materiaRepository.save(materia);
        return ResponseEntity
            .created(new URI("/api/materias/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /materias/:id} : Updates an existing materia.
     *
     * @param id the id of the materia to save.
     * @param materia the materia to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated materia,
     * or with status {@code 400 (Bad Request)} if the materia is not valid,
     * or with status {@code 500 (Internal Server Error)} if the materia couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/materias/{id}")
    public ResponseEntity<Materia> updateMateria(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Materia materia
    ) throws URISyntaxException {
        log.debug("REST request to update Materia : {}, {}", id, materia);
        if (materia.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, materia.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!materiaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Materia result = materiaRepository.save(materia);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, materia.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /materias/:id} : Partial updates given fields of an existing materia, field will ignore if it is null
     *
     * @param id the id of the materia to save.
     * @param materia the materia to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated materia,
     * or with status {@code 400 (Bad Request)} if the materia is not valid,
     * or with status {@code 404 (Not Found)} if the materia is not found,
     * or with status {@code 500 (Internal Server Error)} if the materia couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/materias/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Materia> partialUpdateMateria(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Materia materia
    ) throws URISyntaxException {
        log.debug("REST request to partial update Materia partially : {}, {}", id, materia);
        if (materia.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, materia.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!materiaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Materia> result = materiaRepository
            .findById(materia.getId())
            .map(existingMateria -> {
                if (materia.getNombreMateria() != null) {
                    existingMateria.setNombreMateria(materia.getNombreMateria());
                }
                if (materia.getNumeroPreguntas() != null) {
                    existingMateria.setNumeroPreguntas(materia.getNumeroPreguntas());
                }
                if (materia.getPregunta() != null) {
                    existingMateria.setPregunta(materia.getPregunta());
                }

                return existingMateria;
            })
            .map(materiaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, materia.getId().toString())
        );
    }

    /**
     * {@code GET  /materias} : get all the materias.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of materias in body.
     */
    @GetMapping("/materias")
    public List<Materia> getAllMaterias() {
        log.debug("REST request to get all Materias");
        return materiaRepository.findAll();
    }

    /**
     * {@code GET  /materias/:id} : get the "id" materia.
     *
     * @param id the id of the materia to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the materia, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/materias/{id}")
    public ResponseEntity<Materia> getMateria(@PathVariable Long id) {
        log.debug("REST request to get Materia : {}", id);
        Optional<Materia> materia = materiaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(materia);
    }

    /**
     * {@code DELETE  /materias/:id} : delete the "id" materia.
     *
     * @param id the id of the materia to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/materias/{id}")
    public ResponseEntity<Void> deleteMateria(@PathVariable Long id) {
        log.debug("REST request to delete Materia : {}", id);
        materiaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
