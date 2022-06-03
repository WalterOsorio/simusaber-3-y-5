package co.edu.sena.web.rest;

import co.edu.sena.domain.Prueba;
import co.edu.sena.repository.PruebaRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.Prueba}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PruebaResource {

    private final Logger log = LoggerFactory.getLogger(PruebaResource.class);

    private static final String ENTITY_NAME = "prueba";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PruebaRepository pruebaRepository;

    public PruebaResource(PruebaRepository pruebaRepository) {
        this.pruebaRepository = pruebaRepository;
    }

    /**
     * {@code POST  /pruebas} : Create a new prueba.
     *
     * @param prueba the prueba to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new prueba, or with status {@code 400 (Bad Request)} if the prueba has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pruebas")
    public ResponseEntity<Prueba> createPrueba(@Valid @RequestBody Prueba prueba) throws URISyntaxException {
        log.debug("REST request to save Prueba : {}", prueba);
        if (prueba.getId() != null) {
            throw new BadRequestAlertException("A new prueba cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Prueba result = pruebaRepository.save(prueba);
        return ResponseEntity
            .created(new URI("/api/pruebas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pruebas/:id} : Updates an existing prueba.
     *
     * @param id the id of the prueba to save.
     * @param prueba the prueba to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prueba,
     * or with status {@code 400 (Bad Request)} if the prueba is not valid,
     * or with status {@code 500 (Internal Server Error)} if the prueba couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pruebas/{id}")
    public ResponseEntity<Prueba> updatePrueba(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Prueba prueba
    ) throws URISyntaxException {
        log.debug("REST request to update Prueba : {}, {}", id, prueba);
        if (prueba.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prueba.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pruebaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Prueba result = pruebaRepository.save(prueba);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prueba.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /pruebas/:id} : Partial updates given fields of an existing prueba, field will ignore if it is null
     *
     * @param id the id of the prueba to save.
     * @param prueba the prueba to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prueba,
     * or with status {@code 400 (Bad Request)} if the prueba is not valid,
     * or with status {@code 404 (Not Found)} if the prueba is not found,
     * or with status {@code 500 (Internal Server Error)} if the prueba couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/pruebas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Prueba> partialUpdatePrueba(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Prueba prueba
    ) throws URISyntaxException {
        log.debug("REST request to partial update Prueba partially : {}, {}", id, prueba);
        if (prueba.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prueba.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pruebaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Prueba> result = pruebaRepository
            .findById(prueba.getId())
            .map(existingPrueba -> {
                if (prueba.getFechaAplicacion() != null) {
                    existingPrueba.setFechaAplicacion(prueba.getFechaAplicacion());
                }
                if (prueba.getResultado() != null) {
                    existingPrueba.setResultado(prueba.getResultado());
                }
                if (prueba.getRetroalimentacion() != null) {
                    existingPrueba.setRetroalimentacion(prueba.getRetroalimentacion());
                }

                return existingPrueba;
            })
            .map(pruebaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prueba.getId().toString())
        );
    }

    /**
     * {@code GET  /pruebas} : get all the pruebas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pruebas in body.
     */
    @GetMapping("/pruebas")
    public List<Prueba> getAllPruebas() {
        log.debug("REST request to get all Pruebas");
        return pruebaRepository.findAll();
    }

    /**
     * {@code GET  /pruebas/:id} : get the "id" prueba.
     *
     * @param id the id of the prueba to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the prueba, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pruebas/{id}")
    public ResponseEntity<Prueba> getPrueba(@PathVariable Long id) {
        log.debug("REST request to get Prueba : {}", id);
        Optional<Prueba> prueba = pruebaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(prueba);
    }

    /**
     * {@code DELETE  /pruebas/:id} : delete the "id" prueba.
     *
     * @param id the id of the prueba to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pruebas/{id}")
    public ResponseEntity<Void> deletePrueba(@PathVariable Long id) {
        log.debug("REST request to delete Prueba : {}", id);
        pruebaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
