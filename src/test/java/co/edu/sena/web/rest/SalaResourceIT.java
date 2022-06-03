package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Sala;
import co.edu.sena.domain.enumeration.State;
import co.edu.sena.repository.SalaRepository;
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
 * Integration tests for the {@link SalaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SalaResourceIT {

    private static final State DEFAULT_ESTADO = State.Active;
    private static final State UPDATED_ESTADO = State.INACTIVE;

    private static final String DEFAULT_MATERIA = "AAAAAAAAAA";
    private static final String UPDATED_MATERIA = "BBBBBBBBBB";

    private static final Integer DEFAULT_NUMERO_ESTUDIANTES = 1;
    private static final Integer UPDATED_NUMERO_ESTUDIANTES = 2;

    private static final Float DEFAULT_RESULTADOS = 1F;
    private static final Float UPDATED_RESULTADOS = 2F;

    private static final String DEFAULT_RETROALIMENTACION = "AAAAAAAAAA";
    private static final String UPDATED_RETROALIMENTACION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/salas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSalaMockMvc;

    private Sala sala;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sala createEntity(EntityManager em) {
        Sala sala = new Sala()
            .estado(DEFAULT_ESTADO)
            .materia(DEFAULT_MATERIA)
            .numeroEstudiantes(DEFAULT_NUMERO_ESTUDIANTES)
            .resultados(DEFAULT_RESULTADOS)
            .retroalimentacion(DEFAULT_RETROALIMENTACION);
        return sala;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sala createUpdatedEntity(EntityManager em) {
        Sala sala = new Sala()
            .estado(UPDATED_ESTADO)
            .materia(UPDATED_MATERIA)
            .numeroEstudiantes(UPDATED_NUMERO_ESTUDIANTES)
            .resultados(UPDATED_RESULTADOS)
            .retroalimentacion(UPDATED_RETROALIMENTACION);
        return sala;
    }

    @BeforeEach
    public void initTest() {
        sala = createEntity(em);
    }

    @Test
    @Transactional
    void createSala() throws Exception {
        int databaseSizeBeforeCreate = salaRepository.findAll().size();
        // Create the Sala
        restSalaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sala)))
            .andExpect(status().isCreated());

        // Validate the Sala in the database
        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeCreate + 1);
        Sala testSala = salaList.get(salaList.size() - 1);
        assertThat(testSala.getEstado()).isEqualTo(DEFAULT_ESTADO);
        assertThat(testSala.getMateria()).isEqualTo(DEFAULT_MATERIA);
        assertThat(testSala.getNumeroEstudiantes()).isEqualTo(DEFAULT_NUMERO_ESTUDIANTES);
        assertThat(testSala.getResultados()).isEqualTo(DEFAULT_RESULTADOS);
        assertThat(testSala.getRetroalimentacion()).isEqualTo(DEFAULT_RETROALIMENTACION);
    }

    @Test
    @Transactional
    void createSalaWithExistingId() throws Exception {
        // Create the Sala with an existing ID
        sala.setId(1L);

        int databaseSizeBeforeCreate = salaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSalaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sala)))
            .andExpect(status().isBadRequest());

        // Validate the Sala in the database
        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkMateriaIsRequired() throws Exception {
        int databaseSizeBeforeTest = salaRepository.findAll().size();
        // set the field null
        sala.setMateria(null);

        // Create the Sala, which fails.

        restSalaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sala)))
            .andExpect(status().isBadRequest());

        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkRetroalimentacionIsRequired() throws Exception {
        int databaseSizeBeforeTest = salaRepository.findAll().size();
        // set the field null
        sala.setRetroalimentacion(null);

        // Create the Sala, which fails.

        restSalaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sala)))
            .andExpect(status().isBadRequest());

        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSalas() throws Exception {
        // Initialize the database
        salaRepository.saveAndFlush(sala);

        // Get all the salaList
        restSalaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sala.getId().intValue())))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.toString())))
            .andExpect(jsonPath("$.[*].materia").value(hasItem(DEFAULT_MATERIA)))
            .andExpect(jsonPath("$.[*].numeroEstudiantes").value(hasItem(DEFAULT_NUMERO_ESTUDIANTES)))
            .andExpect(jsonPath("$.[*].resultados").value(hasItem(DEFAULT_RESULTADOS.doubleValue())))
            .andExpect(jsonPath("$.[*].retroalimentacion").value(hasItem(DEFAULT_RETROALIMENTACION)));
    }

    @Test
    @Transactional
    void getSala() throws Exception {
        // Initialize the database
        salaRepository.saveAndFlush(sala);

        // Get the sala
        restSalaMockMvc
            .perform(get(ENTITY_API_URL_ID, sala.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sala.getId().intValue()))
            .andExpect(jsonPath("$.estado").value(DEFAULT_ESTADO.toString()))
            .andExpect(jsonPath("$.materia").value(DEFAULT_MATERIA))
            .andExpect(jsonPath("$.numeroEstudiantes").value(DEFAULT_NUMERO_ESTUDIANTES))
            .andExpect(jsonPath("$.resultados").value(DEFAULT_RESULTADOS.doubleValue()))
            .andExpect(jsonPath("$.retroalimentacion").value(DEFAULT_RETROALIMENTACION));
    }

    @Test
    @Transactional
    void getNonExistingSala() throws Exception {
        // Get the sala
        restSalaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSala() throws Exception {
        // Initialize the database
        salaRepository.saveAndFlush(sala);

        int databaseSizeBeforeUpdate = salaRepository.findAll().size();

        // Update the sala
        Sala updatedSala = salaRepository.findById(sala.getId()).get();
        // Disconnect from session so that the updates on updatedSala are not directly saved in db
        em.detach(updatedSala);
        updatedSala
            .estado(UPDATED_ESTADO)
            .materia(UPDATED_MATERIA)
            .numeroEstudiantes(UPDATED_NUMERO_ESTUDIANTES)
            .resultados(UPDATED_RESULTADOS)
            .retroalimentacion(UPDATED_RETROALIMENTACION);

        restSalaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSala.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSala))
            )
            .andExpect(status().isOk());

        // Validate the Sala in the database
        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeUpdate);
        Sala testSala = salaList.get(salaList.size() - 1);
        assertThat(testSala.getEstado()).isEqualTo(UPDATED_ESTADO);
        assertThat(testSala.getMateria()).isEqualTo(UPDATED_MATERIA);
        assertThat(testSala.getNumeroEstudiantes()).isEqualTo(UPDATED_NUMERO_ESTUDIANTES);
        assertThat(testSala.getResultados()).isEqualTo(UPDATED_RESULTADOS);
        assertThat(testSala.getRetroalimentacion()).isEqualTo(UPDATED_RETROALIMENTACION);
    }

    @Test
    @Transactional
    void putNonExistingSala() throws Exception {
        int databaseSizeBeforeUpdate = salaRepository.findAll().size();
        sala.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sala.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sala))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sala in the database
        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSala() throws Exception {
        int databaseSizeBeforeUpdate = salaRepository.findAll().size();
        sala.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sala))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sala in the database
        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSala() throws Exception {
        int databaseSizeBeforeUpdate = salaRepository.findAll().size();
        sala.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sala)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sala in the database
        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSalaWithPatch() throws Exception {
        // Initialize the database
        salaRepository.saveAndFlush(sala);

        int databaseSizeBeforeUpdate = salaRepository.findAll().size();

        // Update the sala using partial update
        Sala partialUpdatedSala = new Sala();
        partialUpdatedSala.setId(sala.getId());

        partialUpdatedSala.resultados(UPDATED_RESULTADOS).retroalimentacion(UPDATED_RETROALIMENTACION);

        restSalaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSala.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSala))
            )
            .andExpect(status().isOk());

        // Validate the Sala in the database
        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeUpdate);
        Sala testSala = salaList.get(salaList.size() - 1);
        assertThat(testSala.getEstado()).isEqualTo(DEFAULT_ESTADO);
        assertThat(testSala.getMateria()).isEqualTo(DEFAULT_MATERIA);
        assertThat(testSala.getNumeroEstudiantes()).isEqualTo(DEFAULT_NUMERO_ESTUDIANTES);
        assertThat(testSala.getResultados()).isEqualTo(UPDATED_RESULTADOS);
        assertThat(testSala.getRetroalimentacion()).isEqualTo(UPDATED_RETROALIMENTACION);
    }

    @Test
    @Transactional
    void fullUpdateSalaWithPatch() throws Exception {
        // Initialize the database
        salaRepository.saveAndFlush(sala);

        int databaseSizeBeforeUpdate = salaRepository.findAll().size();

        // Update the sala using partial update
        Sala partialUpdatedSala = new Sala();
        partialUpdatedSala.setId(sala.getId());

        partialUpdatedSala
            .estado(UPDATED_ESTADO)
            .materia(UPDATED_MATERIA)
            .numeroEstudiantes(UPDATED_NUMERO_ESTUDIANTES)
            .resultados(UPDATED_RESULTADOS)
            .retroalimentacion(UPDATED_RETROALIMENTACION);

        restSalaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSala.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSala))
            )
            .andExpect(status().isOk());

        // Validate the Sala in the database
        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeUpdate);
        Sala testSala = salaList.get(salaList.size() - 1);
        assertThat(testSala.getEstado()).isEqualTo(UPDATED_ESTADO);
        assertThat(testSala.getMateria()).isEqualTo(UPDATED_MATERIA);
        assertThat(testSala.getNumeroEstudiantes()).isEqualTo(UPDATED_NUMERO_ESTUDIANTES);
        assertThat(testSala.getResultados()).isEqualTo(UPDATED_RESULTADOS);
        assertThat(testSala.getRetroalimentacion()).isEqualTo(UPDATED_RETROALIMENTACION);
    }

    @Test
    @Transactional
    void patchNonExistingSala() throws Exception {
        int databaseSizeBeforeUpdate = salaRepository.findAll().size();
        sala.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sala.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sala))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sala in the database
        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSala() throws Exception {
        int databaseSizeBeforeUpdate = salaRepository.findAll().size();
        sala.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sala))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sala in the database
        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSala() throws Exception {
        int databaseSizeBeforeUpdate = salaRepository.findAll().size();
        sala.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sala)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sala in the database
        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSala() throws Exception {
        // Initialize the database
        salaRepository.saveAndFlush(sala);

        int databaseSizeBeforeDelete = salaRepository.findAll().size();

        // Delete the sala
        restSalaMockMvc
            .perform(delete(ENTITY_API_URL_ID, sala.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Sala> salaList = salaRepository.findAll();
        assertThat(salaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
