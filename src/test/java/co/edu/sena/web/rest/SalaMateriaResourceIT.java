package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.SalaMateria;
import co.edu.sena.repository.SalaMateriaRepository;
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
 * Integration tests for the {@link SalaMateriaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SalaMateriaResourceIT {

    private static final Integer DEFAULT_ID_SALA = 1;
    private static final Integer UPDATED_ID_SALA = 2;

    private static final Integer DEFAULT_ID_MATERIA = 1;
    private static final Integer UPDATED_ID_MATERIA = 2;

    private static final String ENTITY_API_URL = "/api/sala-materias";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SalaMateriaRepository salaMateriaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSalaMateriaMockMvc;

    private SalaMateria salaMateria;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SalaMateria createEntity(EntityManager em) {
        SalaMateria salaMateria = new SalaMateria().idSala(DEFAULT_ID_SALA).idMateria(DEFAULT_ID_MATERIA);
        return salaMateria;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SalaMateria createUpdatedEntity(EntityManager em) {
        SalaMateria salaMateria = new SalaMateria().idSala(UPDATED_ID_SALA).idMateria(UPDATED_ID_MATERIA);
        return salaMateria;
    }

    @BeforeEach
    public void initTest() {
        salaMateria = createEntity(em);
    }

    @Test
    @Transactional
    void createSalaMateria() throws Exception {
        int databaseSizeBeforeCreate = salaMateriaRepository.findAll().size();
        // Create the SalaMateria
        restSalaMateriaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salaMateria)))
            .andExpect(status().isCreated());

        // Validate the SalaMateria in the database
        List<SalaMateria> salaMateriaList = salaMateriaRepository.findAll();
        assertThat(salaMateriaList).hasSize(databaseSizeBeforeCreate + 1);
        SalaMateria testSalaMateria = salaMateriaList.get(salaMateriaList.size() - 1);
        assertThat(testSalaMateria.getIdSala()).isEqualTo(DEFAULT_ID_SALA);
        assertThat(testSalaMateria.getIdMateria()).isEqualTo(DEFAULT_ID_MATERIA);
    }

    @Test
    @Transactional
    void createSalaMateriaWithExistingId() throws Exception {
        // Create the SalaMateria with an existing ID
        salaMateria.setId(1L);

        int databaseSizeBeforeCreate = salaMateriaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSalaMateriaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salaMateria)))
            .andExpect(status().isBadRequest());

        // Validate the SalaMateria in the database
        List<SalaMateria> salaMateriaList = salaMateriaRepository.findAll();
        assertThat(salaMateriaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSalaMaterias() throws Exception {
        // Initialize the database
        salaMateriaRepository.saveAndFlush(salaMateria);

        // Get all the salaMateriaList
        restSalaMateriaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(salaMateria.getId().intValue())))
            .andExpect(jsonPath("$.[*].idSala").value(hasItem(DEFAULT_ID_SALA)))
            .andExpect(jsonPath("$.[*].idMateria").value(hasItem(DEFAULT_ID_MATERIA)));
    }

    @Test
    @Transactional
    void getSalaMateria() throws Exception {
        // Initialize the database
        salaMateriaRepository.saveAndFlush(salaMateria);

        // Get the salaMateria
        restSalaMateriaMockMvc
            .perform(get(ENTITY_API_URL_ID, salaMateria.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(salaMateria.getId().intValue()))
            .andExpect(jsonPath("$.idSala").value(DEFAULT_ID_SALA))
            .andExpect(jsonPath("$.idMateria").value(DEFAULT_ID_MATERIA));
    }

    @Test
    @Transactional
    void getNonExistingSalaMateria() throws Exception {
        // Get the salaMateria
        restSalaMateriaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSalaMateria() throws Exception {
        // Initialize the database
        salaMateriaRepository.saveAndFlush(salaMateria);

        int databaseSizeBeforeUpdate = salaMateriaRepository.findAll().size();

        // Update the salaMateria
        SalaMateria updatedSalaMateria = salaMateriaRepository.findById(salaMateria.getId()).get();
        // Disconnect from session so that the updates on updatedSalaMateria are not directly saved in db
        em.detach(updatedSalaMateria);
        updatedSalaMateria.idSala(UPDATED_ID_SALA).idMateria(UPDATED_ID_MATERIA);

        restSalaMateriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSalaMateria.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSalaMateria))
            )
            .andExpect(status().isOk());

        // Validate the SalaMateria in the database
        List<SalaMateria> salaMateriaList = salaMateriaRepository.findAll();
        assertThat(salaMateriaList).hasSize(databaseSizeBeforeUpdate);
        SalaMateria testSalaMateria = salaMateriaList.get(salaMateriaList.size() - 1);
        assertThat(testSalaMateria.getIdSala()).isEqualTo(UPDATED_ID_SALA);
        assertThat(testSalaMateria.getIdMateria()).isEqualTo(UPDATED_ID_MATERIA);
    }

    @Test
    @Transactional
    void putNonExistingSalaMateria() throws Exception {
        int databaseSizeBeforeUpdate = salaMateriaRepository.findAll().size();
        salaMateria.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalaMateriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, salaMateria.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salaMateria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalaMateria in the database
        List<SalaMateria> salaMateriaList = salaMateriaRepository.findAll();
        assertThat(salaMateriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSalaMateria() throws Exception {
        int databaseSizeBeforeUpdate = salaMateriaRepository.findAll().size();
        salaMateria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalaMateriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salaMateria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalaMateria in the database
        List<SalaMateria> salaMateriaList = salaMateriaRepository.findAll();
        assertThat(salaMateriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSalaMateria() throws Exception {
        int databaseSizeBeforeUpdate = salaMateriaRepository.findAll().size();
        salaMateria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalaMateriaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salaMateria)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SalaMateria in the database
        List<SalaMateria> salaMateriaList = salaMateriaRepository.findAll();
        assertThat(salaMateriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSalaMateriaWithPatch() throws Exception {
        // Initialize the database
        salaMateriaRepository.saveAndFlush(salaMateria);

        int databaseSizeBeforeUpdate = salaMateriaRepository.findAll().size();

        // Update the salaMateria using partial update
        SalaMateria partialUpdatedSalaMateria = new SalaMateria();
        partialUpdatedSalaMateria.setId(salaMateria.getId());

        partialUpdatedSalaMateria.idSala(UPDATED_ID_SALA).idMateria(UPDATED_ID_MATERIA);

        restSalaMateriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSalaMateria.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSalaMateria))
            )
            .andExpect(status().isOk());

        // Validate the SalaMateria in the database
        List<SalaMateria> salaMateriaList = salaMateriaRepository.findAll();
        assertThat(salaMateriaList).hasSize(databaseSizeBeforeUpdate);
        SalaMateria testSalaMateria = salaMateriaList.get(salaMateriaList.size() - 1);
        assertThat(testSalaMateria.getIdSala()).isEqualTo(UPDATED_ID_SALA);
        assertThat(testSalaMateria.getIdMateria()).isEqualTo(UPDATED_ID_MATERIA);
    }

    @Test
    @Transactional
    void fullUpdateSalaMateriaWithPatch() throws Exception {
        // Initialize the database
        salaMateriaRepository.saveAndFlush(salaMateria);

        int databaseSizeBeforeUpdate = salaMateriaRepository.findAll().size();

        // Update the salaMateria using partial update
        SalaMateria partialUpdatedSalaMateria = new SalaMateria();
        partialUpdatedSalaMateria.setId(salaMateria.getId());

        partialUpdatedSalaMateria.idSala(UPDATED_ID_SALA).idMateria(UPDATED_ID_MATERIA);

        restSalaMateriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSalaMateria.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSalaMateria))
            )
            .andExpect(status().isOk());

        // Validate the SalaMateria in the database
        List<SalaMateria> salaMateriaList = salaMateriaRepository.findAll();
        assertThat(salaMateriaList).hasSize(databaseSizeBeforeUpdate);
        SalaMateria testSalaMateria = salaMateriaList.get(salaMateriaList.size() - 1);
        assertThat(testSalaMateria.getIdSala()).isEqualTo(UPDATED_ID_SALA);
        assertThat(testSalaMateria.getIdMateria()).isEqualTo(UPDATED_ID_MATERIA);
    }

    @Test
    @Transactional
    void patchNonExistingSalaMateria() throws Exception {
        int databaseSizeBeforeUpdate = salaMateriaRepository.findAll().size();
        salaMateria.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalaMateriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, salaMateria.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salaMateria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalaMateria in the database
        List<SalaMateria> salaMateriaList = salaMateriaRepository.findAll();
        assertThat(salaMateriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSalaMateria() throws Exception {
        int databaseSizeBeforeUpdate = salaMateriaRepository.findAll().size();
        salaMateria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalaMateriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salaMateria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalaMateria in the database
        List<SalaMateria> salaMateriaList = salaMateriaRepository.findAll();
        assertThat(salaMateriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSalaMateria() throws Exception {
        int databaseSizeBeforeUpdate = salaMateriaRepository.findAll().size();
        salaMateria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalaMateriaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(salaMateria))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SalaMateria in the database
        List<SalaMateria> salaMateriaList = salaMateriaRepository.findAll();
        assertThat(salaMateriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSalaMateria() throws Exception {
        // Initialize the database
        salaMateriaRepository.saveAndFlush(salaMateria);

        int databaseSizeBeforeDelete = salaMateriaRepository.findAll().size();

        // Delete the salaMateria
        restSalaMateriaMockMvc
            .perform(delete(ENTITY_API_URL_ID, salaMateria.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SalaMateria> salaMateriaList = salaMateriaRepository.findAll();
        assertThat(salaMateriaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
