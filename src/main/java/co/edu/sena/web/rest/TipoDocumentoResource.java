package co.edu.sena.web.rest;

import co.edu.sena.domain.TipoDocumento;
import co.edu.sena.repository.TipoDocumentoRepository;
import co.edu.sena.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
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
 * REST controller for managing {@link co.edu.sena.domain.TipoDocumento}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TipoDocumentoResource {

    private final Logger log = LoggerFactory.getLogger(TipoDocumentoResource.class);

    private static final String ENTITY_NAME = "tipoDocumento";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TipoDocumentoRepository tipoDocumentoRepository;

    public TipoDocumentoResource(TipoDocumentoRepository tipoDocumentoRepository) {
        this.tipoDocumentoRepository = tipoDocumentoRepository;
    }

    /**
     * {@code POST  /tipo-documentos} : Create a new tipoDocumento.
     *
     * @param tipoDocumento the tipoDocumento to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tipoDocumento, or with status {@code 400 (Bad Request)} if the tipoDocumento has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tipo-documentos")
    public ResponseEntity<TipoDocumento> createTipoDocumento(@Valid @RequestBody TipoDocumento tipoDocumento) throws URISyntaxException {
        log.debug("REST request to save TipoDocumento : {}", tipoDocumento);
        if (tipoDocumento.getId() != null) {
            throw new BadRequestAlertException("A new tipoDocumento cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TipoDocumento result = tipoDocumentoRepository.save(tipoDocumento);
        return ResponseEntity
            .created(new URI("/api/tipo-documentos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tipo-documentos/:id} : Updates an existing tipoDocumento.
     *
     * @param id the id of the tipoDocumento to save.
     * @param tipoDocumento the tipoDocumento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tipoDocumento,
     * or with status {@code 400 (Bad Request)} if the tipoDocumento is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tipoDocumento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tipo-documentos/{id}")
    public ResponseEntity<TipoDocumento> updateTipoDocumento(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TipoDocumento tipoDocumento
    ) throws URISyntaxException {
        log.debug("REST request to update TipoDocumento : {}, {}", id, tipoDocumento);
        if (tipoDocumento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tipoDocumento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tipoDocumentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TipoDocumento result = tipoDocumentoRepository.save(tipoDocumento);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tipoDocumento.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tipo-documentos/:id} : Partial updates given fields of an existing tipoDocumento, field will ignore if it is null
     *
     * @param id the id of the tipoDocumento to save.
     * @param tipoDocumento the tipoDocumento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tipoDocumento,
     * or with status {@code 400 (Bad Request)} if the tipoDocumento is not valid,
     * or with status {@code 404 (Not Found)} if the tipoDocumento is not found,
     * or with status {@code 500 (Internal Server Error)} if the tipoDocumento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tipo-documentos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TipoDocumento> partialUpdateTipoDocumento(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TipoDocumento tipoDocumento
    ) throws URISyntaxException {
        log.debug("REST request to partial update TipoDocumento partially : {}, {}", id, tipoDocumento);
        if (tipoDocumento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tipoDocumento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tipoDocumentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TipoDocumento> result = tipoDocumentoRepository
            .findById(tipoDocumento.getId())
            .map(existingTipoDocumento -> {
                if (tipoDocumento.getIniciales() != null) {
                    existingTipoDocumento.setIniciales(tipoDocumento.getIniciales());
                }
                if (tipoDocumento.getNombreDocumento() != null) {
                    existingTipoDocumento.setNombreDocumento(tipoDocumento.getNombreDocumento());
                }
                if (tipoDocumento.getEstadoTipoDocumento() != null) {
                    existingTipoDocumento.setEstadoTipoDocumento(tipoDocumento.getEstadoTipoDocumento());
                }

                return existingTipoDocumento;
            })
            .map(tipoDocumentoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tipoDocumento.getId().toString())
        );
    }

    /**
     * {@code GET  /tipo-documentos} : get all the tipoDocumentos.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tipoDocumentos in body.
     */
    @GetMapping("/tipo-documentos")
    public List<TipoDocumento> getAllTipoDocumentos(@RequestParam(required = false) String filter) {
        if ("userdata-is-null".equals(filter)) {
            log.debug("REST request to get all TipoDocumentos where userData is null");
            return StreamSupport
                .stream(tipoDocumentoRepository.findAll().spliterator(), false)
                .filter(tipoDocumento -> tipoDocumento.getUserData() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all TipoDocumentos");
        return tipoDocumentoRepository.findAll();
    }

    /**
     * {@code GET  /tipo-documentos/:id} : get the "id" tipoDocumento.
     *
     * @param id the id of the tipoDocumento to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tipoDocumento, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tipo-documentos/{id}")
    public ResponseEntity<TipoDocumento> getTipoDocumento(@PathVariable Long id) {
        log.debug("REST request to get TipoDocumento : {}", id);
        Optional<TipoDocumento> tipoDocumento = tipoDocumentoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tipoDocumento);
    }

    /**
     * {@code DELETE  /tipo-documentos/:id} : delete the "id" tipoDocumento.
     *
     * @param id the id of the tipoDocumento to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tipo-documentos/{id}")
    public ResponseEntity<Void> deleteTipoDocumento(@PathVariable Long id) {
        log.debug("REST request to delete TipoDocumento : {}", id);
        tipoDocumentoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
