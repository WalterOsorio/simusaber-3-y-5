package co.edu.sena.web.rest;

import co.edu.sena.domain.AdmiBancoP;
import co.edu.sena.repository.AdmiBancoPRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.AdmiBancoP}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AdmiBancoPResource {

    private final Logger log = LoggerFactory.getLogger(AdmiBancoPResource.class);

    private static final String ENTITY_NAME = "admiBancoP";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdmiBancoPRepository admiBancoPRepository;

    public AdmiBancoPResource(AdmiBancoPRepository admiBancoPRepository) {
        this.admiBancoPRepository = admiBancoPRepository;
    }

    /**
     * {@code POST  /admi-banco-ps} : Create a new admiBancoP.
     *
     * @param admiBancoP the admiBancoP to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new admiBancoP, or with status {@code 400 (Bad Request)} if the admiBancoP has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/admi-banco-ps")
    public ResponseEntity<AdmiBancoP> createAdmiBancoP(@RequestBody AdmiBancoP admiBancoP) throws URISyntaxException {
        log.debug("REST request to save AdmiBancoP : {}", admiBancoP);
        if (admiBancoP.getId() != null) {
            throw new BadRequestAlertException("A new admiBancoP cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AdmiBancoP result = admiBancoPRepository.save(admiBancoP);
        return ResponseEntity
            .created(new URI("/api/admi-banco-ps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /admi-banco-ps/:id} : Updates an existing admiBancoP.
     *
     * @param id the id of the admiBancoP to save.
     * @param admiBancoP the admiBancoP to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated admiBancoP,
     * or with status {@code 400 (Bad Request)} if the admiBancoP is not valid,
     * or with status {@code 500 (Internal Server Error)} if the admiBancoP couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/admi-banco-ps/{id}")
    public ResponseEntity<AdmiBancoP> updateAdmiBancoP(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AdmiBancoP admiBancoP
    ) throws URISyntaxException {
        log.debug("REST request to update AdmiBancoP : {}, {}", id, admiBancoP);
        if (admiBancoP.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, admiBancoP.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!admiBancoPRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AdmiBancoP result = admiBancoPRepository.save(admiBancoP);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, admiBancoP.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /admi-banco-ps/:id} : Partial updates given fields of an existing admiBancoP, field will ignore if it is null
     *
     * @param id the id of the admiBancoP to save.
     * @param admiBancoP the admiBancoP to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated admiBancoP,
     * or with status {@code 400 (Bad Request)} if the admiBancoP is not valid,
     * or with status {@code 404 (Not Found)} if the admiBancoP is not found,
     * or with status {@code 500 (Internal Server Error)} if the admiBancoP couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/admi-banco-ps/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AdmiBancoP> partialUpdateAdmiBancoP(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AdmiBancoP admiBancoP
    ) throws URISyntaxException {
        log.debug("REST request to partial update AdmiBancoP partially : {}, {}", id, admiBancoP);
        if (admiBancoP.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, admiBancoP.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!admiBancoPRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AdmiBancoP> result = admiBancoPRepository
            .findById(admiBancoP.getId())
            .map(existingAdmiBancoP -> {
                if (admiBancoP.getIdAdministrador() != null) {
                    existingAdmiBancoP.setIdAdministrador(admiBancoP.getIdAdministrador());
                }
                if (admiBancoP.getIdBancoPregunta() != null) {
                    existingAdmiBancoP.setIdBancoPregunta(admiBancoP.getIdBancoPregunta());
                }

                return existingAdmiBancoP;
            })
            .map(admiBancoPRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, admiBancoP.getId().toString())
        );
    }

    /**
     * {@code GET  /admi-banco-ps} : get all the admiBancoPS.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of admiBancoPS in body.
     */
    @GetMapping("/admi-banco-ps")
    public List<AdmiBancoP> getAllAdmiBancoPS() {
        log.debug("REST request to get all AdmiBancoPS");
        return admiBancoPRepository.findAll();
    }

    /**
     * {@code GET  /admi-banco-ps/:id} : get the "id" admiBancoP.
     *
     * @param id the id of the admiBancoP to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the admiBancoP, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/admi-banco-ps/{id}")
    public ResponseEntity<AdmiBancoP> getAdmiBancoP(@PathVariable Long id) {
        log.debug("REST request to get AdmiBancoP : {}", id);
        Optional<AdmiBancoP> admiBancoP = admiBancoPRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(admiBancoP);
    }

    /**
     * {@code DELETE  /admi-banco-ps/:id} : delete the "id" admiBancoP.
     *
     * @param id the id of the admiBancoP to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/admi-banco-ps/{id}")
    public ResponseEntity<Void> deleteAdmiBancoP(@PathVariable Long id) {
        log.debug("REST request to delete AdmiBancoP : {}", id);
        admiBancoPRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
