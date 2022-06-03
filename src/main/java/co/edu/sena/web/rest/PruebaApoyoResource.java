package co.edu.sena.web.rest;

import co.edu.sena.domain.PruebaApoyo;
import co.edu.sena.repository.PruebaApoyoRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.PruebaApoyo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PruebaApoyoResource {

    private final Logger log = LoggerFactory.getLogger(PruebaApoyoResource.class);

    private static final String ENTITY_NAME = "pruebaApoyo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PruebaApoyoRepository pruebaApoyoRepository;

    public PruebaApoyoResource(PruebaApoyoRepository pruebaApoyoRepository) {
        this.pruebaApoyoRepository = pruebaApoyoRepository;
    }

    /**
     * {@code POST  /prueba-apoyos} : Create a new pruebaApoyo.
     *
     * @param pruebaApoyo the pruebaApoyo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pruebaApoyo, or with status {@code 400 (Bad Request)} if the pruebaApoyo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/prueba-apoyos")
    public ResponseEntity<PruebaApoyo> createPruebaApoyo(@Valid @RequestBody PruebaApoyo pruebaApoyo) throws URISyntaxException {
        log.debug("REST request to save PruebaApoyo : {}", pruebaApoyo);
        if (pruebaApoyo.getId() != null) {
            throw new BadRequestAlertException("A new pruebaApoyo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PruebaApoyo result = pruebaApoyoRepository.save(pruebaApoyo);
        return ResponseEntity
            .created(new URI("/api/prueba-apoyos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /prueba-apoyos/:id} : Updates an existing pruebaApoyo.
     *
     * @param id the id of the pruebaApoyo to save.
     * @param pruebaApoyo the pruebaApoyo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pruebaApoyo,
     * or with status {@code 400 (Bad Request)} if the pruebaApoyo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pruebaApoyo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/prueba-apoyos/{id}")
    public ResponseEntity<PruebaApoyo> updatePruebaApoyo(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PruebaApoyo pruebaApoyo
    ) throws URISyntaxException {
        log.debug("REST request to update PruebaApoyo : {}, {}", id, pruebaApoyo);
        if (pruebaApoyo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pruebaApoyo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pruebaApoyoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PruebaApoyo result = pruebaApoyoRepository.save(pruebaApoyo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pruebaApoyo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /prueba-apoyos/:id} : Partial updates given fields of an existing pruebaApoyo, field will ignore if it is null
     *
     * @param id the id of the pruebaApoyo to save.
     * @param pruebaApoyo the pruebaApoyo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pruebaApoyo,
     * or with status {@code 400 (Bad Request)} if the pruebaApoyo is not valid,
     * or with status {@code 404 (Not Found)} if the pruebaApoyo is not found,
     * or with status {@code 500 (Internal Server Error)} if the pruebaApoyo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/prueba-apoyos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PruebaApoyo> partialUpdatePruebaApoyo(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PruebaApoyo pruebaApoyo
    ) throws URISyntaxException {
        log.debug("REST request to partial update PruebaApoyo partially : {}, {}", id, pruebaApoyo);
        if (pruebaApoyo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pruebaApoyo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pruebaApoyoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PruebaApoyo> result = pruebaApoyoRepository
            .findById(pruebaApoyo.getId())
            .map(existingPruebaApoyo -> {
                if (pruebaApoyo.getMateria() != null) {
                    existingPruebaApoyo.setMateria(pruebaApoyo.getMateria());
                }
                if (pruebaApoyo.getPregunta() != null) {
                    existingPruebaApoyo.setPregunta(pruebaApoyo.getPregunta());
                }
                if (pruebaApoyo.getResultado() != null) {
                    existingPruebaApoyo.setResultado(pruebaApoyo.getResultado());
                }
                if (pruebaApoyo.getRetroalimentacion() != null) {
                    existingPruebaApoyo.setRetroalimentacion(pruebaApoyo.getRetroalimentacion());
                }

                return existingPruebaApoyo;
            })
            .map(pruebaApoyoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pruebaApoyo.getId().toString())
        );
    }

    /**
     * {@code GET  /prueba-apoyos} : get all the pruebaApoyos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pruebaApoyos in body.
     */
    @GetMapping("/prueba-apoyos")
    public List<PruebaApoyo> getAllPruebaApoyos() {
        log.debug("REST request to get all PruebaApoyos");
        return pruebaApoyoRepository.findAll();
    }

    /**
     * {@code GET  /prueba-apoyos/:id} : get the "id" pruebaApoyo.
     *
     * @param id the id of the pruebaApoyo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pruebaApoyo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/prueba-apoyos/{id}")
    public ResponseEntity<PruebaApoyo> getPruebaApoyo(@PathVariable Long id) {
        log.debug("REST request to get PruebaApoyo : {}", id);
        Optional<PruebaApoyo> pruebaApoyo = pruebaApoyoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pruebaApoyo);
    }

    /**
     * {@code DELETE  /prueba-apoyos/:id} : delete the "id" pruebaApoyo.
     *
     * @param id the id of the pruebaApoyo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/prueba-apoyos/{id}")
    public ResponseEntity<Void> deletePruebaApoyo(@PathVariable Long id) {
        log.debug("REST request to delete PruebaApoyo : {}", id);
        pruebaApoyoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
