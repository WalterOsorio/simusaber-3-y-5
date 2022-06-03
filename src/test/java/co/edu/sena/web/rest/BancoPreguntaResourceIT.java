package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.BancoPregunta;
import co.edu.sena.repository.BancoPreguntaRepository;
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
 * Integration tests for the {@link BancoPreguntaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BancoPreguntaResourceIT {

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_FECHA_ACTUALIZACION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FECHA_ACTUALIZACION = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_MATERIA = "AAAAAAAAAA";
    private static final String UPDATED_MATERIA = "BBBBBBBBBB";

    private static final Integer DEFAULT_NUMERO_PREGUNTAS = 1;
    private static final Integer UPDATED_NUMERO_PREGUNTAS = 2;

    private static final String DEFAULT_PREGUNTA = "AAAAAAAAAA";
    private static final String UPDATED_PREGUNTA = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/banco-preguntas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BancoPreguntaRepository bancoPreguntaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBancoPreguntaMockMvc;

    private BancoPregunta bancoPregunta;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BancoPregunta createEntity(EntityManager em) {
        BancoPregunta bancoPregunta = new BancoPregunta()
            .descripcion(DEFAULT_DESCRIPCION)
            .fechaActualizacion(DEFAULT_FECHA_ACTUALIZACION)
            .materia(DEFAULT_MATERIA)
            .numeroPreguntas(DEFAULT_NUMERO_PREGUNTAS)
            .pregunta(DEFAULT_PREGUNTA);
        return bancoPregunta;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BancoPregunta createUpdatedEntity(EntityManager em) {
        BancoPregunta bancoPregunta = new BancoPregunta()
            .descripcion(UPDATED_DESCRIPCION)
            .fechaActualizacion(UPDATED_FECHA_ACTUALIZACION)
            .materia(UPDATED_MATERIA)
            .numeroPreguntas(UPDATED_NUMERO_PREGUNTAS)
            .pregunta(UPDATED_PREGUNTA);
        return bancoPregunta;
    }

    @BeforeEach
    public void initTest() {
        bancoPregunta = createEntity(em);
    }

    @Test
    @Transactional
    void createBancoPregunta() throws Exception {
        int databaseSizeBeforeCreate = bancoPreguntaRepository.findAll().size();
        // Create the BancoPregunta
        restBancoPreguntaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bancoPregunta)))
            .andExpect(status().isCreated());

        // Validate the BancoPregunta in the database
        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeCreate + 1);
        BancoPregunta testBancoPregunta = bancoPreguntaList.get(bancoPreguntaList.size() - 1);
        assertThat(testBancoPregunta.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
        assertThat(testBancoPregunta.getFechaActualizacion()).isEqualTo(DEFAULT_FECHA_ACTUALIZACION);
        assertThat(testBancoPregunta.getMateria()).isEqualTo(DEFAULT_MATERIA);
        assertThat(testBancoPregunta.getNumeroPreguntas()).isEqualTo(DEFAULT_NUMERO_PREGUNTAS);
        assertThat(testBancoPregunta.getPregunta()).isEqualTo(DEFAULT_PREGUNTA);
    }

    @Test
    @Transactional
    void createBancoPreguntaWithExistingId() throws Exception {
        // Create the BancoPregunta with an existing ID
        bancoPregunta.setId(1L);

        int databaseSizeBeforeCreate = bancoPreguntaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBancoPreguntaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bancoPregunta)))
            .andExpect(status().isBadRequest());

        // Validate the BancoPregunta in the database
        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescripcionIsRequired() throws Exception {
        int databaseSizeBeforeTest = bancoPreguntaRepository.findAll().size();
        // set the field null
        bancoPregunta.setDescripcion(null);

        // Create the BancoPregunta, which fails.

        restBancoPreguntaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bancoPregunta)))
            .andExpect(status().isBadRequest());

        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMateriaIsRequired() throws Exception {
        int databaseSizeBeforeTest = bancoPreguntaRepository.findAll().size();
        // set the field null
        bancoPregunta.setMateria(null);

        // Create the BancoPregunta, which fails.

        restBancoPreguntaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bancoPregunta)))
            .andExpect(status().isBadRequest());

        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPreguntaIsRequired() throws Exception {
        int databaseSizeBeforeTest = bancoPreguntaRepository.findAll().size();
        // set the field null
        bancoPregunta.setPregunta(null);

        // Create the BancoPregunta, which fails.

        restBancoPreguntaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bancoPregunta)))
            .andExpect(status().isBadRequest());

        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBancoPreguntas() throws Exception {
        // Initialize the database
        bancoPreguntaRepository.saveAndFlush(bancoPregunta);

        // Get all the bancoPreguntaList
        restBancoPreguntaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bancoPregunta.getId().intValue())))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)))
            .andExpect(jsonPath("$.[*].fechaActualizacion").value(hasItem(DEFAULT_FECHA_ACTUALIZACION.toString())))
            .andExpect(jsonPath("$.[*].materia").value(hasItem(DEFAULT_MATERIA)))
            .andExpect(jsonPath("$.[*].numeroPreguntas").value(hasItem(DEFAULT_NUMERO_PREGUNTAS)))
            .andExpect(jsonPath("$.[*].pregunta").value(hasItem(DEFAULT_PREGUNTA)));
    }

    @Test
    @Transactional
    void getBancoPregunta() throws Exception {
        // Initialize the database
        bancoPreguntaRepository.saveAndFlush(bancoPregunta);

        // Get the bancoPregunta
        restBancoPreguntaMockMvc
            .perform(get(ENTITY_API_URL_ID, bancoPregunta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bancoPregunta.getId().intValue()))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION))
            .andExpect(jsonPath("$.fechaActualizacion").value(DEFAULT_FECHA_ACTUALIZACION.toString()))
            .andExpect(jsonPath("$.materia").value(DEFAULT_MATERIA))
            .andExpect(jsonPath("$.numeroPreguntas").value(DEFAULT_NUMERO_PREGUNTAS))
            .andExpect(jsonPath("$.pregunta").value(DEFAULT_PREGUNTA));
    }

    @Test
    @Transactional
    void getNonExistingBancoPregunta() throws Exception {
        // Get the bancoPregunta
        restBancoPreguntaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBancoPregunta() throws Exception {
        // Initialize the database
        bancoPreguntaRepository.saveAndFlush(bancoPregunta);

        int databaseSizeBeforeUpdate = bancoPreguntaRepository.findAll().size();

        // Update the bancoPregunta
        BancoPregunta updatedBancoPregunta = bancoPreguntaRepository.findById(bancoPregunta.getId()).get();
        // Disconnect from session so that the updates on updatedBancoPregunta are not directly saved in db
        em.detach(updatedBancoPregunta);
        updatedBancoPregunta
            .descripcion(UPDATED_DESCRIPCION)
            .fechaActualizacion(UPDATED_FECHA_ACTUALIZACION)
            .materia(UPDATED_MATERIA)
            .numeroPreguntas(UPDATED_NUMERO_PREGUNTAS)
            .pregunta(UPDATED_PREGUNTA);

        restBancoPreguntaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBancoPregunta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBancoPregunta))
            )
            .andExpect(status().isOk());

        // Validate the BancoPregunta in the database
        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeUpdate);
        BancoPregunta testBancoPregunta = bancoPreguntaList.get(bancoPreguntaList.size() - 1);
        assertThat(testBancoPregunta.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testBancoPregunta.getFechaActualizacion()).isEqualTo(UPDATED_FECHA_ACTUALIZACION);
        assertThat(testBancoPregunta.getMateria()).isEqualTo(UPDATED_MATERIA);
        assertThat(testBancoPregunta.getNumeroPreguntas()).isEqualTo(UPDATED_NUMERO_PREGUNTAS);
        assertThat(testBancoPregunta.getPregunta()).isEqualTo(UPDATED_PREGUNTA);
    }

    @Test
    @Transactional
    void putNonExistingBancoPregunta() throws Exception {
        int databaseSizeBeforeUpdate = bancoPreguntaRepository.findAll().size();
        bancoPregunta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBancoPreguntaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bancoPregunta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bancoPregunta))
            )
            .andExpect(status().isBadRequest());

        // Validate the BancoPregunta in the database
        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBancoPregunta() throws Exception {
        int databaseSizeBeforeUpdate = bancoPreguntaRepository.findAll().size();
        bancoPregunta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBancoPreguntaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bancoPregunta))
            )
            .andExpect(status().isBadRequest());

        // Validate the BancoPregunta in the database
        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBancoPregunta() throws Exception {
        int databaseSizeBeforeUpdate = bancoPreguntaRepository.findAll().size();
        bancoPregunta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBancoPreguntaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bancoPregunta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BancoPregunta in the database
        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBancoPreguntaWithPatch() throws Exception {
        // Initialize the database
        bancoPreguntaRepository.saveAndFlush(bancoPregunta);

        int databaseSizeBeforeUpdate = bancoPreguntaRepository.findAll().size();

        // Update the bancoPregunta using partial update
        BancoPregunta partialUpdatedBancoPregunta = new BancoPregunta();
        partialUpdatedBancoPregunta.setId(bancoPregunta.getId());

        partialUpdatedBancoPregunta.numeroPreguntas(UPDATED_NUMERO_PREGUNTAS).pregunta(UPDATED_PREGUNTA);

        restBancoPreguntaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBancoPregunta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBancoPregunta))
            )
            .andExpect(status().isOk());

        // Validate the BancoPregunta in the database
        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeUpdate);
        BancoPregunta testBancoPregunta = bancoPreguntaList.get(bancoPreguntaList.size() - 1);
        assertThat(testBancoPregunta.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
        assertThat(testBancoPregunta.getFechaActualizacion()).isEqualTo(DEFAULT_FECHA_ACTUALIZACION);
        assertThat(testBancoPregunta.getMateria()).isEqualTo(DEFAULT_MATERIA);
        assertThat(testBancoPregunta.getNumeroPreguntas()).isEqualTo(UPDATED_NUMERO_PREGUNTAS);
        assertThat(testBancoPregunta.getPregunta()).isEqualTo(UPDATED_PREGUNTA);
    }

    @Test
    @Transactional
    void fullUpdateBancoPreguntaWithPatch() throws Exception {
        // Initialize the database
        bancoPreguntaRepository.saveAndFlush(bancoPregunta);

        int databaseSizeBeforeUpdate = bancoPreguntaRepository.findAll().size();

        // Update the bancoPregunta using partial update
        BancoPregunta partialUpdatedBancoPregunta = new BancoPregunta();
        partialUpdatedBancoPregunta.setId(bancoPregunta.getId());

        partialUpdatedBancoPregunta
            .descripcion(UPDATED_DESCRIPCION)
            .fechaActualizacion(UPDATED_FECHA_ACTUALIZACION)
            .materia(UPDATED_MATERIA)
            .numeroPreguntas(UPDATED_NUMERO_PREGUNTAS)
            .pregunta(UPDATED_PREGUNTA);

        restBancoPreguntaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBancoPregunta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBancoPregunta))
            )
            .andExpect(status().isOk());

        // Validate the BancoPregunta in the database
        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeUpdate);
        BancoPregunta testBancoPregunta = bancoPreguntaList.get(bancoPreguntaList.size() - 1);
        assertThat(testBancoPregunta.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testBancoPregunta.getFechaActualizacion()).isEqualTo(UPDATED_FECHA_ACTUALIZACION);
        assertThat(testBancoPregunta.getMateria()).isEqualTo(UPDATED_MATERIA);
        assertThat(testBancoPregunta.getNumeroPreguntas()).isEqualTo(UPDATED_NUMERO_PREGUNTAS);
        assertThat(testBancoPregunta.getPregunta()).isEqualTo(UPDATED_PREGUNTA);
    }

    @Test
    @Transactional
    void patchNonExistingBancoPregunta() throws Exception {
        int databaseSizeBeforeUpdate = bancoPreguntaRepository.findAll().size();
        bancoPregunta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBancoPreguntaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bancoPregunta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bancoPregunta))
            )
            .andExpect(status().isBadRequest());

        // Validate the BancoPregunta in the database
        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBancoPregunta() throws Exception {
        int databaseSizeBeforeUpdate = bancoPreguntaRepository.findAll().size();
        bancoPregunta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBancoPreguntaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bancoPregunta))
            )
            .andExpect(status().isBadRequest());

        // Validate the BancoPregunta in the database
        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBancoPregunta() throws Exception {
        int databaseSizeBeforeUpdate = bancoPreguntaRepository.findAll().size();
        bancoPregunta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBancoPreguntaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bancoPregunta))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BancoPregunta in the database
        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBancoPregunta() throws Exception {
        // Initialize the database
        bancoPreguntaRepository.saveAndFlush(bancoPregunta);

        int databaseSizeBeforeDelete = bancoPreguntaRepository.findAll().size();

        // Delete the bancoPregunta
        restBancoPreguntaMockMvc
            .perform(delete(ENTITY_API_URL_ID, bancoPregunta.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BancoPregunta> bancoPreguntaList = bancoPreguntaRepository.findAll();
        assertThat(bancoPreguntaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
