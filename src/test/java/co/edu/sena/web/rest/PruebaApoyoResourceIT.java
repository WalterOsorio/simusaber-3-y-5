package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.PruebaApoyo;
import co.edu.sena.repository.PruebaApoyoRepository;
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
 * Integration tests for the {@link PruebaApoyoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PruebaApoyoResourceIT {

    private static final String DEFAULT_MATERIA = "AAAAAAAAAA";
    private static final String UPDATED_MATERIA = "BBBBBBBBBB";

    private static final String DEFAULT_PREGUNTA = "AAAAAAAAAA";
    private static final String UPDATED_PREGUNTA = "BBBBBBBBBB";

    private static final Float DEFAULT_RESULTADO = 1F;
    private static final Float UPDATED_RESULTADO = 2F;

    private static final String DEFAULT_RETROALIMENTACION = "AAAAAAAAAA";
    private static final String UPDATED_RETROALIMENTACION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/prueba-apoyos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PruebaApoyoRepository pruebaApoyoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPruebaApoyoMockMvc;

    private PruebaApoyo pruebaApoyo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PruebaApoyo createEntity(EntityManager em) {
        PruebaApoyo pruebaApoyo = new PruebaApoyo()
            .materia(DEFAULT_MATERIA)
            .pregunta(DEFAULT_PREGUNTA)
            .resultado(DEFAULT_RESULTADO)
            .retroalimentacion(DEFAULT_RETROALIMENTACION);
        return pruebaApoyo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PruebaApoyo createUpdatedEntity(EntityManager em) {
        PruebaApoyo pruebaApoyo = new PruebaApoyo()
            .materia(UPDATED_MATERIA)
            .pregunta(UPDATED_PREGUNTA)
            .resultado(UPDATED_RESULTADO)
            .retroalimentacion(UPDATED_RETROALIMENTACION);
        return pruebaApoyo;
    }

    @BeforeEach
    public void initTest() {
        pruebaApoyo = createEntity(em);
    }

    @Test
    @Transactional
    void createPruebaApoyo() throws Exception {
        int databaseSizeBeforeCreate = pruebaApoyoRepository.findAll().size();
        // Create the PruebaApoyo
        restPruebaApoyoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pruebaApoyo)))
            .andExpect(status().isCreated());

        // Validate the PruebaApoyo in the database
        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeCreate + 1);
        PruebaApoyo testPruebaApoyo = pruebaApoyoList.get(pruebaApoyoList.size() - 1);
        assertThat(testPruebaApoyo.getMateria()).isEqualTo(DEFAULT_MATERIA);
        assertThat(testPruebaApoyo.getPregunta()).isEqualTo(DEFAULT_PREGUNTA);
        assertThat(testPruebaApoyo.getResultado()).isEqualTo(DEFAULT_RESULTADO);
        assertThat(testPruebaApoyo.getRetroalimentacion()).isEqualTo(DEFAULT_RETROALIMENTACION);
    }

    @Test
    @Transactional
    void createPruebaApoyoWithExistingId() throws Exception {
        // Create the PruebaApoyo with an existing ID
        pruebaApoyo.setId(1L);

        int databaseSizeBeforeCreate = pruebaApoyoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPruebaApoyoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pruebaApoyo)))
            .andExpect(status().isBadRequest());

        // Validate the PruebaApoyo in the database
        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkMateriaIsRequired() throws Exception {
        int databaseSizeBeforeTest = pruebaApoyoRepository.findAll().size();
        // set the field null
        pruebaApoyo.setMateria(null);

        // Create the PruebaApoyo, which fails.

        restPruebaApoyoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pruebaApoyo)))
            .andExpect(status().isBadRequest());

        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPreguntaIsRequired() throws Exception {
        int databaseSizeBeforeTest = pruebaApoyoRepository.findAll().size();
        // set the field null
        pruebaApoyo.setPregunta(null);

        // Create the PruebaApoyo, which fails.

        restPruebaApoyoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pruebaApoyo)))
            .andExpect(status().isBadRequest());

        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkRetroalimentacionIsRequired() throws Exception {
        int databaseSizeBeforeTest = pruebaApoyoRepository.findAll().size();
        // set the field null
        pruebaApoyo.setRetroalimentacion(null);

        // Create the PruebaApoyo, which fails.

        restPruebaApoyoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pruebaApoyo)))
            .andExpect(status().isBadRequest());

        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPruebaApoyos() throws Exception {
        // Initialize the database
        pruebaApoyoRepository.saveAndFlush(pruebaApoyo);

        // Get all the pruebaApoyoList
        restPruebaApoyoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pruebaApoyo.getId().intValue())))
            .andExpect(jsonPath("$.[*].materia").value(hasItem(DEFAULT_MATERIA)))
            .andExpect(jsonPath("$.[*].pregunta").value(hasItem(DEFAULT_PREGUNTA)))
            .andExpect(jsonPath("$.[*].resultado").value(hasItem(DEFAULT_RESULTADO.doubleValue())))
            .andExpect(jsonPath("$.[*].retroalimentacion").value(hasItem(DEFAULT_RETROALIMENTACION)));
    }

    @Test
    @Transactional
    void getPruebaApoyo() throws Exception {
        // Initialize the database
        pruebaApoyoRepository.saveAndFlush(pruebaApoyo);

        // Get the pruebaApoyo
        restPruebaApoyoMockMvc
            .perform(get(ENTITY_API_URL_ID, pruebaApoyo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pruebaApoyo.getId().intValue()))
            .andExpect(jsonPath("$.materia").value(DEFAULT_MATERIA))
            .andExpect(jsonPath("$.pregunta").value(DEFAULT_PREGUNTA))
            .andExpect(jsonPath("$.resultado").value(DEFAULT_RESULTADO.doubleValue()))
            .andExpect(jsonPath("$.retroalimentacion").value(DEFAULT_RETROALIMENTACION));
    }

    @Test
    @Transactional
    void getNonExistingPruebaApoyo() throws Exception {
        // Get the pruebaApoyo
        restPruebaApoyoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPruebaApoyo() throws Exception {
        // Initialize the database
        pruebaApoyoRepository.saveAndFlush(pruebaApoyo);

        int databaseSizeBeforeUpdate = pruebaApoyoRepository.findAll().size();

        // Update the pruebaApoyo
        PruebaApoyo updatedPruebaApoyo = pruebaApoyoRepository.findById(pruebaApoyo.getId()).get();
        // Disconnect from session so that the updates on updatedPruebaApoyo are not directly saved in db
        em.detach(updatedPruebaApoyo);
        updatedPruebaApoyo
            .materia(UPDATED_MATERIA)
            .pregunta(UPDATED_PREGUNTA)
            .resultado(UPDATED_RESULTADO)
            .retroalimentacion(UPDATED_RETROALIMENTACION);

        restPruebaApoyoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPruebaApoyo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPruebaApoyo))
            )
            .andExpect(status().isOk());

        // Validate the PruebaApoyo in the database
        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeUpdate);
        PruebaApoyo testPruebaApoyo = pruebaApoyoList.get(pruebaApoyoList.size() - 1);
        assertThat(testPruebaApoyo.getMateria()).isEqualTo(UPDATED_MATERIA);
        assertThat(testPruebaApoyo.getPregunta()).isEqualTo(UPDATED_PREGUNTA);
        assertThat(testPruebaApoyo.getResultado()).isEqualTo(UPDATED_RESULTADO);
        assertThat(testPruebaApoyo.getRetroalimentacion()).isEqualTo(UPDATED_RETROALIMENTACION);
    }

    @Test
    @Transactional
    void putNonExistingPruebaApoyo() throws Exception {
        int databaseSizeBeforeUpdate = pruebaApoyoRepository.findAll().size();
        pruebaApoyo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPruebaApoyoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pruebaApoyo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pruebaApoyo))
            )
            .andExpect(status().isBadRequest());

        // Validate the PruebaApoyo in the database
        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPruebaApoyo() throws Exception {
        int databaseSizeBeforeUpdate = pruebaApoyoRepository.findAll().size();
        pruebaApoyo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPruebaApoyoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pruebaApoyo))
            )
            .andExpect(status().isBadRequest());

        // Validate the PruebaApoyo in the database
        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPruebaApoyo() throws Exception {
        int databaseSizeBeforeUpdate = pruebaApoyoRepository.findAll().size();
        pruebaApoyo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPruebaApoyoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pruebaApoyo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PruebaApoyo in the database
        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePruebaApoyoWithPatch() throws Exception {
        // Initialize the database
        pruebaApoyoRepository.saveAndFlush(pruebaApoyo);

        int databaseSizeBeforeUpdate = pruebaApoyoRepository.findAll().size();

        // Update the pruebaApoyo using partial update
        PruebaApoyo partialUpdatedPruebaApoyo = new PruebaApoyo();
        partialUpdatedPruebaApoyo.setId(pruebaApoyo.getId());

        partialUpdatedPruebaApoyo.materia(UPDATED_MATERIA).pregunta(UPDATED_PREGUNTA);

        restPruebaApoyoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPruebaApoyo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPruebaApoyo))
            )
            .andExpect(status().isOk());

        // Validate the PruebaApoyo in the database
        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeUpdate);
        PruebaApoyo testPruebaApoyo = pruebaApoyoList.get(pruebaApoyoList.size() - 1);
        assertThat(testPruebaApoyo.getMateria()).isEqualTo(UPDATED_MATERIA);
        assertThat(testPruebaApoyo.getPregunta()).isEqualTo(UPDATED_PREGUNTA);
        assertThat(testPruebaApoyo.getResultado()).isEqualTo(DEFAULT_RESULTADO);
        assertThat(testPruebaApoyo.getRetroalimentacion()).isEqualTo(DEFAULT_RETROALIMENTACION);
    }

    @Test
    @Transactional
    void fullUpdatePruebaApoyoWithPatch() throws Exception {
        // Initialize the database
        pruebaApoyoRepository.saveAndFlush(pruebaApoyo);

        int databaseSizeBeforeUpdate = pruebaApoyoRepository.findAll().size();

        // Update the pruebaApoyo using partial update
        PruebaApoyo partialUpdatedPruebaApoyo = new PruebaApoyo();
        partialUpdatedPruebaApoyo.setId(pruebaApoyo.getId());

        partialUpdatedPruebaApoyo
            .materia(UPDATED_MATERIA)
            .pregunta(UPDATED_PREGUNTA)
            .resultado(UPDATED_RESULTADO)
            .retroalimentacion(UPDATED_RETROALIMENTACION);

        restPruebaApoyoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPruebaApoyo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPruebaApoyo))
            )
            .andExpect(status().isOk());

        // Validate the PruebaApoyo in the database
        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeUpdate);
        PruebaApoyo testPruebaApoyo = pruebaApoyoList.get(pruebaApoyoList.size() - 1);
        assertThat(testPruebaApoyo.getMateria()).isEqualTo(UPDATED_MATERIA);
        assertThat(testPruebaApoyo.getPregunta()).isEqualTo(UPDATED_PREGUNTA);
        assertThat(testPruebaApoyo.getResultado()).isEqualTo(UPDATED_RESULTADO);
        assertThat(testPruebaApoyo.getRetroalimentacion()).isEqualTo(UPDATED_RETROALIMENTACION);
    }

    @Test
    @Transactional
    void patchNonExistingPruebaApoyo() throws Exception {
        int databaseSizeBeforeUpdate = pruebaApoyoRepository.findAll().size();
        pruebaApoyo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPruebaApoyoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pruebaApoyo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pruebaApoyo))
            )
            .andExpect(status().isBadRequest());

        // Validate the PruebaApoyo in the database
        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPruebaApoyo() throws Exception {
        int databaseSizeBeforeUpdate = pruebaApoyoRepository.findAll().size();
        pruebaApoyo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPruebaApoyoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pruebaApoyo))
            )
            .andExpect(status().isBadRequest());

        // Validate the PruebaApoyo in the database
        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPruebaApoyo() throws Exception {
        int databaseSizeBeforeUpdate = pruebaApoyoRepository.findAll().size();
        pruebaApoyo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPruebaApoyoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(pruebaApoyo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PruebaApoyo in the database
        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePruebaApoyo() throws Exception {
        // Initialize the database
        pruebaApoyoRepository.saveAndFlush(pruebaApoyo);

        int databaseSizeBeforeDelete = pruebaApoyoRepository.findAll().size();

        // Delete the pruebaApoyo
        restPruebaApoyoMockMvc
            .perform(delete(ENTITY_API_URL_ID, pruebaApoyo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PruebaApoyo> pruebaApoyoList = pruebaApoyoRepository.findAll();
        assertThat(pruebaApoyoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
