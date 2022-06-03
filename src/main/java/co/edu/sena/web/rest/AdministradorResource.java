package co.edu.sena.web.rest;

import co.edu.sena.domain.Administrador;
import co.edu.sena.repository.AdministradorRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.Administrador}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AdministradorResource {

    private final Logger log = LoggerFactory.getLogger(AdministradorResource.class);

    private static final String ENTITY_NAME = "administrador";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdministradorRepository administradorRepository;

    public AdministradorResource(AdministradorRepository administradorRepository) {
        this.administradorRepository = administradorRepository;
    }

    /**
     * {@code POST  /administradors} : Create a new administrador.
     *
     * @param administrador the administrador to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new administrador, or with status {@code 400 (Bad Request)} if the administrador has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/administradors")
    public ResponseEntity<Administrador> createAdministrador(@RequestBody Administrador administrador) throws URISyntaxException {
        log.debug("REST request to save Administrador : {}", administrador);
        if (administrador.getId() != null) {
            throw new BadRequestAlertException("A new administrador cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Administrador result = administradorRepository.save(administrador);
        return ResponseEntity
            .created(new URI("/api/administradors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /administradors/:id} : Updates an existing administrador.
     *
     * @param id the id of the administrador to save.
     * @param administrador the administrador to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated administrador,
     * or with status {@code 400 (Bad Request)} if the administrador is not valid,
     * or with status {@code 500 (Internal Server Error)} if the administrador couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/administradors/{id}")
    public ResponseEntity<Administrador> updateAdministrador(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Administrador administrador
    ) throws URISyntaxException {
        log.debug("REST request to update Administrador : {}, {}", id, administrador);
        if (administrador.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, administrador.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!administradorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Administrador result = administradorRepository.save(administrador);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, administrador.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /administradors/:id} : Partial updates given fields of an existing administrador, field will ignore if it is null
     *
     * @param id the id of the administrador to save.
     * @param administrador the administrador to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated administrador,
     * or with status {@code 400 (Bad Request)} if the administrador is not valid,
     * or with status {@code 404 (Not Found)} if the administrador is not found,
     * or with status {@code 500 (Internal Server Error)} if the administrador couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/administradors/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Administrador> partialUpdateAdministrador(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Administrador administrador
    ) throws URISyntaxException {
        log.debug("REST request to partial update Administrador partially : {}, {}", id, administrador);
        if (administrador.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, administrador.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!administradorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Administrador> result = administradorRepository
            .findById(administrador.getId())
            .map(existingAdministrador -> {
                if (administrador.getNivelAcceso() != null) {
                    existingAdministrador.setNivelAcceso(administrador.getNivelAcceso());
                }

                return existingAdministrador;
            })
            .map(administradorRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, administrador.getId().toString())
        );
    }

    /**
     * {@code GET  /administradors} : get all the administradors.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of administradors in body.
     */
    @GetMapping("/administradors")
    public List<Administrador> getAllAdministradors() {
        log.debug("REST request to get all Administradors");
        return administradorRepository.findAll();
    }

    /**
     * {@code GET  /administradors/:id} : get the "id" administrador.
     *
     * @param id the id of the administrador to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the administrador, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/administradors/{id}")
    public ResponseEntity<Administrador> getAdministrador(@PathVariable Long id) {
        log.debug("REST request to get Administrador : {}", id);
        Optional<Administrador> administrador = administradorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(administrador);
    }

    /**
     * {@code DELETE  /administradors/:id} : delete the "id" administrador.
     *
     * @param id the id of the administrador to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/administradors/{id}")
    public ResponseEntity<Void> deleteAdministrador(@PathVariable Long id) {
        log.debug("REST request to delete Administrador : {}", id);
        administradorRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
