package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Prueba;
import co.edu.sena.repository.PruebaRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PruebaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PruebaResourceIT {

    private static final LocalDate DEFAULT_FECHA_APLICACION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FECHA_APLICACION = LocalDate.now(ZoneId.systemDefault());

    private static final Float DEFAULT_RESULTADO = 1F;
    private static final Float UPDATED_RESULTADO = 2F;

    private static final String DEFAULT_RETROALIMENTACION = "AAAAAAAAAA";
    private static final String UPDATED_RETROALIMENTACION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/pruebas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PruebaRepository pruebaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPruebaMockMvc;

    private Prueba prueba;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Prueba createEntity(EntityManager em) {
        Prueba prueba = new Prueba()
            .fechaAplicacion(DEFAULT_FECHA_APLICACION)
            .resultado(DEFAULT_RESULTADO)
            .retroalimentacion(DEFAULT_RETROALIMENTACION);
        return prueba;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Prueba createUpdatedEntity(EntityManager em) {
        Prueba prueba = new Prueba()
            .fechaAplicacion(UPDATED_FECHA_APLICACION)
            .resultado(UPDATED_RESULTADO)
            .retroalimentacion(UPDATED_RETROALIMENTACION);
        return prueba;
    }

    @BeforeEach
    public void initTest() {
        prueba = createEntity(em);
    }

    @Test
    @Transactional
    void createPrueba() throws Exception {
        int databaseSizeBeforeCreate = pruebaRepository.findAll().size();
        // Create the Prueba
        restPruebaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prueba)))
            .andExpect(status().isCreated());

        // Validate the Prueba in the database
        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeCreate + 1);
        Prueba testPrueba = pruebaList.get(pruebaList.size() - 1);
        assertThat(testPrueba.getFechaAplicacion()).isEqualTo(DEFAULT_FECHA_APLICACION);
        assertThat(testPrueba.getResultado()).isEqualTo(DEFAULT_RESULTADO);
        assertThat(testPrueba.getRetroalimentacion()).isEqualTo(DEFAULT_RETROALIMENTACION);
    }

    @Test
    @Transactional
    void createPruebaWithExistingId() throws Exception {
        // Create the Prueba with an existing ID
        prueba.setId(1L);

        int databaseSizeBeforeCreate = pruebaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPruebaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prueba)))
            .andExpect(status().isBadRequest());

        // Validate the Prueba in the database
        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRetroalimentacionIsRequired() throws Exception {
        int databaseSizeBeforeTest = pruebaRepository.findAll().size();
        // set the field null
        prueba.setRetroalimentacion(null);

        // Create the Prueba, which fails.

        restPruebaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prueba)))
            .andExpect(status().isBadRequest());

        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPruebas() throws Exception {
        // Initialize the database
        pruebaRepository.saveAndFlush(prueba);

        // Get all the pruebaList
        restPruebaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(prueba.getId().intValue())))
            .andExpect(jsonPath("$.[*].fechaAplicacion").value(hasItem(DEFAULT_FECHA_APLICACION.toString())))
            .andExpect(jsonPath("$.[*].resultado").value(hasItem(DEFAULT_RESULTADO.doubleValue())))
            .andExpect(jsonPath("$.[*].retroalimentacion").value(hasItem(DEFAULT_RETROALIMENTACION)));
    }

    @Test
    @Transactional
    void getPrueba() throws Exception {
        // Initialize the database
        pruebaRepository.saveAndFlush(prueba);

        // Get the prueba
        restPruebaMockMvc
            .perform(get(ENTITY_API_URL_ID, prueba.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(prueba.getId().intValue()))
            .andExpect(jsonPath("$.fechaAplicacion").value(DEFAULT_FECHA_APLICACION.toString()))
            .andExpect(jsonPath("$.resultado").value(DEFAULT_RESULTADO.doubleValue()))
            .andExpect(jsonPath("$.retroalimentacion").value(DEFAULT_RETROALIMENTACION));
    }

    @Test
    @Transactional
    void getNonExistingPrueba() throws Exception {
        // Get the prueba
        restPruebaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPrueba() throws Exception {
        // Initialize the database
        pruebaRepository.saveAndFlush(prueba);

        int databaseSizeBeforeUpdate = pruebaRepository.findAll().size();

        // Update the prueba
        Prueba updatedPrueba = pruebaRepository.findById(prueba.getId()).get();
        // Disconnect from session so that the updates on updatedPrueba are not directly saved in db
        em.detach(updatedPrueba);
        updatedPrueba.fechaAplicacion(UPDATED_FECHA_APLICACION).resultado(UPDATED_RESULTADO).retroalimentacion(UPDATED_RETROALIMENTACION);

        restPruebaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPrueba.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPrueba))
            )
            .andExpect(status().isOk());

        // Validate the Prueba in the database
        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeUpdate);
        Prueba testPrueba = pruebaList.get(pruebaList.size() - 1);
        assertThat(testPrueba.getFechaAplicacion()).isEqualTo(UPDATED_FECHA_APLICACION);
        assertThat(testPrueba.getResultado()).isEqualTo(UPDATED_RESULTADO);
        assertThat(testPrueba.getRetroalimentacion()).isEqualTo(UPDATED_RETROALIMENTACION);
    }

    @Test
    @Transactional
    void putNonExistingPrueba() throws Exception {
        int databaseSizeBeforeUpdate = pruebaRepository.findAll().size();
        prueba.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPruebaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, prueba.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(prueba))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prueba in the database
        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPrueba() throws Exception {
        int databaseSizeBeforeUpdate = pruebaRepository.findAll().size();
        prueba.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPruebaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(prueba))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prueba in the database
        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPrueba() throws Exception {
        int databaseSizeBeforeUpdate = pruebaRepository.findAll().size();
        prueba.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPruebaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prueba)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Prueba in the database
        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePruebaWithPatch() throws Exception {
        // Initialize the database
        pruebaRepository.saveAndFlush(prueba);

        int databaseSizeBeforeUpdate = pruebaRepository.findAll().size();

        // Update the prueba using partial update
        Prueba partialUpdatedPrueba = new Prueba();
        partialUpdatedPrueba.setId(prueba.getId());

        partialUpdatedPrueba.retroalimentacion(UPDATED_RETROALIMENTACION);

        restPruebaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPrueba.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPrueba))
            )
            .andExpect(status().isOk());

        // Validate the Prueba in the database
        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeUpdate);
        Prueba testPrueba = pruebaList.get(pruebaList.size() - 1);
        assertThat(testPrueba.getFechaAplicacion()).isEqualTo(DEFAULT_FECHA_APLICACION);
        assertThat(testPrueba.getResultado()).isEqualTo(DEFAULT_RESULTADO);
        assertThat(testPrueba.getRetroalimentacion()).isEqualTo(UPDATED_RETROALIMENTACION);
    }

    @Test
    @Transactional
    void fullUpdatePruebaWithPatch() throws Exception {
        // Initialize the database
        pruebaRepository.saveAndFlush(prueba);

        int databaseSizeBeforeUpdate = pruebaRepository.findAll().size();

        // Update the prueba using partial update
        Prueba partialUpdatedPrueba = new Prueba();
        partialUpdatedPrueba.setId(prueba.getId());

        partialUpdatedPrueba
            .fechaAplicacion(UPDATED_FECHA_APLICACION)
            .resultado(UPDATED_RESULTADO)
            .retroalimentacion(UPDATED_RETROALIMENTACION);

        restPruebaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPrueba.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPrueba))
            )
            .andExpect(status().isOk());

        // Validate the Prueba in the database
        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeUpdate);
        Prueba testPrueba = pruebaList.get(pruebaList.size() - 1);
        assertThat(testPrueba.getFechaAplicacion()).isEqualTo(UPDATED_FECHA_APLICACION);
        assertThat(testPrueba.getResultado()).isEqualTo(UPDATED_RESULTADO);
        assertThat(testPrueba.getRetroalimentacion()).isEqualTo(UPDATED_RETROALIMENTACION);
    }

    @Test
    @Transactional
    void patchNonExistingPrueba() throws Exception {
        int databaseSizeBeforeUpdate = pruebaRepository.findAll().size();
        prueba.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPruebaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, prueba.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(prueba))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prueba in the database
        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPrueba() throws Exception {
        int databaseSizeBeforeUpdate = pruebaRepository.findAll().size();
        prueba.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPruebaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(prueba))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prueba in the database
        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPrueba() throws Exception {
        int databaseSizeBeforeUpdate = pruebaRepository.findAll().size();
        prueba.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPruebaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(prueba)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Prueba in the database
        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePrueba() throws Exception {
        // Initialize the database
        pruebaRepository.saveAndFlush(prueba);

        int databaseSizeBeforeDelete = pruebaRepository.findAll().size();

        // Delete the prueba
        restPruebaMockMvc
            .perform(delete(ENTITY_API_URL_ID, prueba.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Prueba> pruebaList = pruebaRepository.findAll();
        assertThat(pruebaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
