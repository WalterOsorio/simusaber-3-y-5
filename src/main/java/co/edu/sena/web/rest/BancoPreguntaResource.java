package co.edu.sena.web.rest;

import co.edu.sena.domain.BancoPregunta;
import co.edu.sena.repository.BancoPreguntaRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.BancoPregunta}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BancoPreguntaResource {

    private final Logger log = LoggerFactory.getLogger(BancoPreguntaResource.class);

    private static final String ENTITY_NAME = "bancoPregunta";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BancoPreguntaRepository bancoPreguntaRepository;

    public BancoPreguntaResource(BancoPreguntaRepository bancoPreguntaRepository) {
        this.bancoPreguntaRepository = bancoPreguntaRepository;
    }

    /**
     * {@code POST  /banco-preguntas} : Create a new bancoPregunta.
     *
     * @param bancoPregunta the bancoPregunta to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bancoPregunta, or with status {@code 400 (Bad Request)} if the bancoPregunta has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/banco-preguntas")
    public ResponseEntity<BancoPregunta> createBancoPregunta(@Valid @RequestBody BancoPregunta bancoPregunta) throws URISyntaxException {
        log.debug("REST request to save BancoPregunta : {}", bancoPregunta);
        if (bancoPregunta.getId() != null) {
            throw new BadRequestAlertException("A new bancoPregunta cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BancoPregunta result = bancoPreguntaRepository.save(bancoPregunta);
        return ResponseEntity
            .created(new URI("/api/banco-preguntas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /banco-preguntas/:id} : Updates an existing bancoPregunta.
     *
     * @param id the id of the bancoPregunta to save.
     * @param bancoPregunta the bancoPregunta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bancoPregunta,
     * or with status {@code 400 (Bad Request)} if the bancoPregunta is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bancoPregunta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/banco-preguntas/{id}")
    public ResponseEntity<BancoPregunta> updateBancoPregunta(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BancoPregunta bancoPregunta
    ) throws URISyntaxException {
        log.debug("REST request to update BancoPregunta : {}, {}", id, bancoPregunta);
        if (bancoPregunta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bancoPregunta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bancoPreguntaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BancoPregunta result = bancoPreguntaRepository.save(bancoPregunta);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bancoPregunta.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /banco-preguntas/:id} : Partial updates given fields of an existing bancoPregunta, field will ignore if it is null
     *
     * @param id the id of the bancoPregunta to save.
     * @param bancoPregunta the bancoPregunta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bancoPregunta,
     * or with status {@code 400 (Bad Request)} if the bancoPregunta is not valid,
     * or with status {@code 404 (Not Found)} if the bancoPregunta is not found,
     * or with status {@code 500 (Internal Server Error)} if the bancoPregunta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/banco-preguntas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BancoPregunta> partialUpdateBancoPregunta(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BancoPregunta bancoPregunta
    ) throws URISyntaxException {
        log.debug("REST request to partial update BancoPregunta partially : {}, {}", id, bancoPregunta);
        if (bancoPregunta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bancoPregunta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bancoPreguntaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BancoPregunta> result = bancoPreguntaRepository
            .findById(bancoPregunta.getId())
            .map(existingBancoPregunta -> {
                if (bancoPregunta.getDescripcion() != null) {
                    existingBancoPregunta.setDescripcion(bancoPregunta.getDescripcion());
                }
                if (bancoPregunta.getFechaActualizacion() != null) {
                    existingBancoPregunta.setFechaActualizacion(bancoPregunta.getFechaActualizacion());
                }
                if (bancoPregunta.getMateria() != null) {
                    existingBancoPregunta.setMateria(bancoPregunta.getMateria());
                }
                if (bancoPregunta.getNumeroPreguntas() != null) {
                    existingBancoPregunta.setNumeroPreguntas(bancoPregunta.getNumeroPreguntas());
                }
                if (bancoPregunta.getPregunta() != null) {
                    existingBancoPregunta.setPregunta(bancoPregunta.getPregunta());
                }

                return existingBancoPregunta;
            })
            .map(bancoPreguntaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bancoPregunta.getId().toString())
        );
    }

    /**
     * {@code GET  /banco-preguntas} : get all the bancoPreguntas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bancoPreguntas in body.
     */
    @GetMapping("/banco-preguntas")
    public List<BancoPregunta> getAllBancoPreguntas() {
        log.debug("REST request to get all BancoPreguntas");
        return bancoPreguntaRepository.findAll();
    }

    /**
     * {@code GET  /banco-preguntas/:id} : get the "id" bancoPregunta.
     *
     * @param id the id of the bancoPregunta to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bancoPregunta, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/banco-preguntas/{id}")
    public ResponseEntity<BancoPregunta> getBancoPregunta(@PathVariable Long id) {
        log.debug("REST request to get BancoPregunta : {}", id);
        Optional<BancoPregunta> bancoPregunta = bancoPreguntaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bancoPregunta);
    }

    /**
     * {@code DELETE  /banco-preguntas/:id} : delete the "id" bancoPregunta.
     *
     * @param id the id of the bancoPregunta to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/banco-preguntas/{id}")
    public ResponseEntity<Void> deleteBancoPregunta(@PathVariable Long id) {
        log.debug("REST request to delete BancoPregunta : {}", id);
        bancoPreguntaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
