package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.EstudianteSala;
import co.edu.sena.repository.EstudianteSalaRepository;
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
 * Integration tests for the {@link EstudianteSalaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EstudianteSalaResourceIT {

    private static final Integer DEFAULT_ID_ESTUDIANTE = 1;
    private static final Integer UPDATED_ID_ESTUDIANTE = 2;

    private static final Integer DEFAULT_ID_SALA = 1;
    private static final Integer UPDATED_ID_SALA = 2;

    private static final String ENTITY_API_URL = "/api/estudiante-salas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EstudianteSalaRepository estudianteSalaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEstudianteSalaMockMvc;

    private EstudianteSala estudianteSala;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EstudianteSala createEntity(EntityManager em) {
        EstudianteSala estudianteSala = new EstudianteSala().idEstudiante(DEFAULT_ID_ESTUDIANTE).idSala(DEFAULT_ID_SALA);
        return estudianteSala;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EstudianteSala createUpdatedEntity(EntityManager em) {
        EstudianteSala estudianteSala = new EstudianteSala().idEstudiante(UPDATED_ID_ESTUDIANTE).idSala(UPDATED_ID_SALA);
        return estudianteSala;
    }

    @BeforeEach
    public void initTest() {
        estudianteSala = createEntity(em);
    }

    @Test
    @Transactional
    void createEstudianteSala() throws Exception {
        int databaseSizeBeforeCreate = estudianteSalaRepository.findAll().size();
        // Create the EstudianteSala
        restEstudianteSalaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estudianteSala))
            )
            .andExpect(status().isCreated());

        // Validate the EstudianteSala in the database
        List<EstudianteSala> estudianteSalaList = estudianteSalaRepository.findAll();
        assertThat(estudianteSalaList).hasSize(databaseSizeBeforeCreate + 1);
        EstudianteSala testEstudianteSala = estudianteSalaList.get(estudianteSalaList.size() - 1);
        assertThat(testEstudianteSala.getIdEstudiante()).isEqualTo(DEFAULT_ID_ESTUDIANTE);
        assertThat(testEstudianteSala.getIdSala()).isEqualTo(DEFAULT_ID_SALA);
    }

    @Test
    @Transactional
    void createEstudianteSalaWithExistingId() throws Exception {
        // Create the EstudianteSala with an existing ID
        estudianteSala.setId(1L);

        int databaseSizeBeforeCreate = estudianteSalaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEstudianteSalaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estudianteSala))
            )
            .andExpect(status().isBadRequest());

        // Validate the EstudianteSala in the database
        List<EstudianteSala> estudianteSalaList = estudianteSalaRepository.findAll();
        assertThat(estudianteSalaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEstudianteSalas() throws Exception {
        // Initialize the database
        estudianteSalaRepository.saveAndFlush(estudianteSala);

        // Get all the estudianteSalaList
        restEstudianteSalaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(estudianteSala.getId().intValue())))
            .andExpect(jsonPath("$.[*].idEstudiante").value(hasItem(DEFAULT_ID_ESTUDIANTE)))
            .andExpect(jsonPath("$.[*].idSala").value(hasItem(DEFAULT_ID_SALA)));
    }

    @Test
    @Transactional
    void getEstudianteSala() throws Exception {
        // Initialize the database
        estudianteSalaRepository.saveAndFlush(estudianteSala);

        // Get the estudianteSala
        restEstudianteSalaMockMvc
            .perform(get(ENTITY_API_URL_ID, estudianteSala.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(estudianteSala.getId().intValue()))
            .andExpect(jsonPath("$.idEstudiante").value(DEFAULT_ID_ESTUDIANTE))
            .andExpect(jsonPath("$.idSala").value(DEFAULT_ID_SALA));
    }

    @Test
    @Transactional
    void getNonExistingEstudianteSala() throws Exception {
        // Get the estudianteSala
        restEstudianteSalaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEstudianteSala() throws Exception {
        // Initialize the database
        estudianteSalaRepository.saveAndFlush(estudianteSala);

        int databaseSizeBeforeUpdate = estudianteSalaRepository.findAll().size();

        // Update the estudianteSala
        EstudianteSala updatedEstudianteSala = estudianteSalaRepository.findById(estudianteSala.getId()).get();
        // Disconnect from session so that the updates on updatedEstudianteSala are not directly saved in db
        em.detach(updatedEstudianteSala);
        updatedEstudianteSala.idEstudiante(UPDATED_ID_ESTUDIANTE).idSala(UPDATED_ID_SALA);

        restEstudianteSalaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEstudianteSala.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEstudianteSala))
            )
            .andExpect(status().isOk());

        // Validate the EstudianteSala in the database
        List<EstudianteSala> estudianteSalaList = estudianteSalaRepository.findAll();
        assertThat(estudianteSalaList).hasSize(databaseSizeBeforeUpdate);
        EstudianteSala testEstudianteSala = estudianteSalaList.get(estudianteSalaList.size() - 1);
        assertThat(testEstudianteSala.getIdEstudiante()).isEqualTo(UPDATED_ID_ESTUDIANTE);
        assertThat(testEstudianteSala.getIdSala()).isEqualTo(UPDATED_ID_SALA);
    }

    @Test
    @Transactional
    void putNonExistingEstudianteSala() throws Exception {
        int databaseSizeBeforeUpdate = estudianteSalaRepository.findAll().size();
        estudianteSala.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstudianteSalaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, estudianteSala.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(estudianteSala))
            )
            .andExpect(status().isBadRequest());

        // Validate the EstudianteSala in the database
        List<EstudianteSala> estudianteSalaList = estudianteSalaRepository.findAll();
        assertThat(estudianteSalaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEstudianteSala() throws Exception {
        int databaseSizeBeforeUpdate = estudianteSalaRepository.findAll().size();
        estudianteSala.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudianteSalaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(estudianteSala))
            )
            .andExpect(status().isBadRequest());

        // Validate the EstudianteSala in the database
        List<EstudianteSala> estudianteSalaList = estudianteSalaRepository.findAll();
        assertThat(estudianteSalaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEstudianteSala() throws Exception {
        int databaseSizeBeforeUpdate = estudianteSalaRepository.findAll().size();
        estudianteSala.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudianteSalaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estudianteSala)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EstudianteSala in the database
        List<EstudianteSala> estudianteSalaList = estudianteSalaRepository.findAll();
        assertThat(estudianteSalaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEstudianteSalaWithPatch() throws Exception {
        // Initialize the database
        estudianteSalaRepository.saveAndFlush(estudianteSala);

        int databaseSizeBeforeUpdate = estudianteSalaRepository.findAll().size();

        // Update the estudianteSala using partial update
        EstudianteSala partialUpdatedEstudianteSala = new EstudianteSala();
        partialUpdatedEstudianteSala.setId(estudianteSala.getId());

        partialUpdatedEstudianteSala.idEstudiante(UPDATED_ID_ESTUDIANTE).idSala(UPDATED_ID_SALA);

        restEstudianteSalaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstudianteSala.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEstudianteSala))
            )
            .andExpect(status().isOk());

        // Validate the EstudianteSala in the database
        List<EstudianteSala> estudianteSalaList = estudianteSalaRepository.findAll();
        assertThat(estudianteSalaList).hasSize(databaseSizeBeforeUpdate);
        EstudianteSala testEstudianteSala = estudianteSalaList.get(estudianteSalaList.size() - 1);
        assertThat(testEstudianteSala.getIdEstudiante()).isEqualTo(UPDATED_ID_ESTUDIANTE);
        assertThat(testEstudianteSala.getIdSala()).isEqualTo(UPDATED_ID_SALA);
    }

    @Test
    @Transactional
    void fullUpdateEstudianteSalaWithPatch() throws Exception {
        // Initialize the database
        estudianteSalaRepository.saveAndFlush(estudianteSala);

        int databaseSizeBeforeUpdate = estudianteSalaRepository.findAll().size();

        // Update the estudianteSala using partial update
        EstudianteSala partialUpdatedEstudianteSala = new EstudianteSala();
        partialUpdatedEstudianteSala.setId(estudianteSala.getId());

        partialUpdatedEstudianteSala.idEstudiante(UPDATED_ID_ESTUDIANTE).idSala(UPDATED_ID_SALA);

        restEstudianteSalaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstudianteSala.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEstudianteSala))
            )
            .andExpect(status().isOk());

        // Validate the EstudianteSala in the database
        List<EstudianteSala> estudianteSalaList = estudianteSalaRepository.findAll();
        assertThat(estudianteSalaList).hasSize(databaseSizeBeforeUpdate);
        EstudianteSala testEstudianteSala = estudianteSalaList.get(estudianteSalaList.size() - 1);
        assertThat(testEstudianteSala.getIdEstudiante()).isEqualTo(UPDATED_ID_ESTUDIANTE);
        assertThat(testEstudianteSala.getIdSala()).isEqualTo(UPDATED_ID_SALA);
    }

    @Test
    @Transactional
    void patchNonExistingEstudianteSala() throws Exception {
        int databaseSizeBeforeUpdate = estudianteSalaRepository.findAll().size();
        estudianteSala.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstudianteSalaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, estudianteSala.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(estudianteSala))
            )
            .andExpect(status().isBadRequest());

        // Validate the EstudianteSala in the database
        List<EstudianteSala> estudianteSalaList = estudianteSalaRepository.findAll();
        assertThat(estudianteSalaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEstudianteSala() throws Exception {
        int databaseSizeBeforeUpdate = estudianteSalaRepository.findAll().size();
        estudianteSala.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudianteSalaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(estudianteSala))
            )
            .andExpect(status().isBadRequest());

        // Validate the EstudianteSala in the database
        List<EstudianteSala> estudianteSalaList = estudianteSalaRepository.findAll();
        assertThat(estudianteSalaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEstudianteSala() throws Exception {
        int databaseSizeBeforeUpdate = estudianteSalaRepository.findAll().size();
        estudianteSala.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudianteSalaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(estudianteSala))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EstudianteSala in the database
        List<EstudianteSala> estudianteSalaList = estudianteSalaRepository.findAll();
        assertThat(estudianteSalaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEstudianteSala() throws Exception {
        // Initialize the database
        estudianteSalaRepository.saveAndFlush(estudianteSala);

        int databaseSizeBeforeDelete = estudianteSalaRepository.findAll().size();

        // Delete the estudianteSala
        restEstudianteSalaMockMvc
            .perform(delete(ENTITY_API_URL_ID, estudianteSala.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EstudianteSala> estudianteSalaList = estudianteSalaRepository.findAll();
        assertThat(estudianteSalaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
