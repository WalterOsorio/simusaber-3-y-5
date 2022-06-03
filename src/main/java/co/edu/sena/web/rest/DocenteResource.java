package co.edu.sena.web.rest;

import co.edu.sena.domain.Docente;
import co.edu.sena.repository.DocenteRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.Docente}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DocenteResource {

    private final Logger log = LoggerFactory.getLogger(DocenteResource.class);

    private static final String ENTITY_NAME = "docente";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DocenteRepository docenteRepository;

    public DocenteResource(DocenteRepository docenteRepository) {
        this.docenteRepository = docenteRepository;
    }

    /**
     * {@code POST  /docentes} : Create a new docente.
     *
     * @param docente the docente to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new docente, or with status {@code 400 (Bad Request)} if the docente has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/docentes")
    public ResponseEntity<Docente> createDocente(@Valid @RequestBody Docente docente) throws URISyntaxException {
        log.debug("REST request to save Docente : {}", docente);
        if (docente.getId() != null) {
            throw new BadRequestAlertException("A new docente cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Docente result = docenteRepository.save(docente);
        return ResponseEntity
            .created(new URI("/api/docentes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /docentes/:id} : Updates an existing docente.
     *
     * @param id the id of the docente to save.
     * @param docente the docente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated docente,
     * or with status {@code 400 (Bad Request)} if the docente is not valid,
     * or with status {@code 500 (Internal Server Error)} if the docente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/docentes/{id}")
    public ResponseEntity<Docente> updateDocente(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Docente docente
    ) throws URISyntaxException {
        log.debug("REST request to update Docente : {}, {}", id, docente);
        if (docente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, docente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!docenteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Docente result = docenteRepository.save(docente);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, docente.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /docentes/:id} : Partial updates given fields of an existing docente, field will ignore if it is null
     *
     * @param id the id of the docente to save.
     * @param docente the docente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated docente,
     * or with status {@code 400 (Bad Request)} if the docente is not valid,
     * or with status {@code 404 (Not Found)} if the docente is not found,
     * or with status {@code 500 (Internal Server Error)} if the docente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/docentes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Docente> partialUpdateDocente(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Docente docente
    ) throws URISyntaxException {
        log.debug("REST request to partial update Docente partially : {}, {}", id, docente);
        if (docente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, docente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!docenteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Docente> result = docenteRepository
            .findById(docente.getId())
            .map(existingDocente -> {
                if (docente.getColegio() != null) {
                    existingDocente.setColegio(docente.getColegio());
                }
                if (docente.getMateria() != null) {
                    existingDocente.setMateria(docente.getMateria());
                }
                if (docente.getCiudad() != null) {
                    existingDocente.setCiudad(docente.getCiudad());
                }

                return existingDocente;
            })
            .map(docenteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, docente.getId().toString())
        );
    }

    /**
     * {@code GET  /docentes} : get all the docentes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of docentes in body.
     */
    @GetMapping("/docentes")
    public List<Docente> getAllDocentes() {
        log.debug("REST request to get all Docentes");
        return docenteRepository.findAll();
    }

    /**
     * {@code GET  /docentes/:id} : get the "id" docente.
     *
     * @param id the id of the docente to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the docente, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/docentes/{id}")
    public ResponseEntity<Docente> getDocente(@PathVariable Long id) {
        log.debug("REST request to get Docente : {}", id);
        Optional<Docente> docente = docenteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(docente);
    }

    /**
     * {@code DELETE  /docentes/:id} : delete the "id" docente.
     *
     * @param id the id of the docente to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/docentes/{id}")
    public ResponseEntity<Void> deleteDocente(@PathVariable Long id) {
        log.debug("REST request to delete Docente : {}", id);
        docenteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
