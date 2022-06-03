package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.DocenteMateria;
import co.edu.sena.repository.DocenteMateriaRepository;
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
 * Integration tests for the {@link DocenteMateriaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DocenteMateriaResourceIT {

    private static final Integer DEFAULT_ID_DOCENTE = 1;
    private static final Integer UPDATED_ID_DOCENTE = 2;

    private static final Integer DEFAULT_ID_MATERIA = 1;
    private static final Integer UPDATED_ID_MATERIA = 2;

    private static final String ENTITY_API_URL = "/api/docente-materias";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DocenteMateriaRepository docenteMateriaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDocenteMateriaMockMvc;

    private DocenteMateria docenteMateria;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocenteMateria createEntity(EntityManager em) {
        DocenteMateria docenteMateria = new DocenteMateria().idDocente(DEFAULT_ID_DOCENTE).idMateria(DEFAULT_ID_MATERIA);
        return docenteMateria;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocenteMateria createUpdatedEntity(EntityManager em) {
        DocenteMateria docenteMateria = new DocenteMateria().idDocente(UPDATED_ID_DOCENTE).idMateria(UPDATED_ID_MATERIA);
        return docenteMateria;
    }

    @BeforeEach
    public void initTest() {
        docenteMateria = createEntity(em);
    }

    @Test
    @Transactional
    void createDocenteMateria() throws Exception {
        int databaseSizeBeforeCreate = docenteMateriaRepository.findAll().size();
        // Create the DocenteMateria
        restDocenteMateriaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(docenteMateria))
            )
            .andExpect(status().isCreated());

        // Validate the DocenteMateria in the database
        List<DocenteMateria> docenteMateriaList = docenteMateriaRepository.findAll();
        assertThat(docenteMateriaList).hasSize(databaseSizeBeforeCreate + 1);
        DocenteMateria testDocenteMateria = docenteMateriaList.get(docenteMateriaList.size() - 1);
        assertThat(testDocenteMateria.getIdDocente()).isEqualTo(DEFAULT_ID_DOCENTE);
        assertThat(testDocenteMateria.getIdMateria()).isEqualTo(DEFAULT_ID_MATERIA);
    }

    @Test
    @Transactional
    void createDocenteMateriaWithExistingId() throws Exception {
        // Create the DocenteMateria with an existing ID
        docenteMateria.setId(1L);

        int databaseSizeBeforeCreate = docenteMateriaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocenteMateriaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(docenteMateria))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocenteMateria in the database
        List<DocenteMateria> docenteMateriaList = docenteMateriaRepository.findAll();
        assertThat(docenteMateriaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDocenteMaterias() throws Exception {
        // Initialize the database
        docenteMateriaRepository.saveAndFlush(docenteMateria);

        // Get all the docenteMateriaList
        restDocenteMateriaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(docenteMateria.getId().intValue())))
            .andExpect(jsonPath("$.[*].idDocente").value(hasItem(DEFAULT_ID_DOCENTE)))
            .andExpect(jsonPath("$.[*].idMateria").value(hasItem(DEFAULT_ID_MATERIA)));
    }

    @Test
    @Transactional
    void getDocenteMateria() throws Exception {
        // Initialize the database
        docenteMateriaRepository.saveAndFlush(docenteMateria);

        // Get the docenteMateria
        restDocenteMateriaMockMvc
            .perform(get(ENTITY_API_URL_ID, docenteMateria.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(docenteMateria.getId().intValue()))
            .andExpect(jsonPath("$.idDocente").value(DEFAULT_ID_DOCENTE))
            .andExpect(jsonPath("$.idMateria").value(DEFAULT_ID_MATERIA));
    }

    @Test
    @Transactional
    void getNonExistingDocenteMateria() throws Exception {
        // Get the docenteMateria
        restDocenteMateriaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDocenteMateria() throws Exception {
        // Initialize the database
        docenteMateriaRepository.saveAndFlush(docenteMateria);

        int databaseSizeBeforeUpdate = docenteMateriaRepository.findAll().size();

        // Update the docenteMateria
        DocenteMateria updatedDocenteMateria = docenteMateriaRepository.findById(docenteMateria.getId()).get();
        // Disconnect from session so that the updates on updatedDocenteMateria are not directly saved in db
        em.detach(updatedDocenteMateria);
        updatedDocenteMateria.idDocente(UPDATED_ID_DOCENTE).idMateria(UPDATED_ID_MATERIA);

        restDocenteMateriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDocenteMateria.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDocenteMateria))
            )
            .andExpect(status().isOk());

        // Validate the DocenteMateria in the database
        List<DocenteMateria> docenteMateriaList = docenteMateriaRepository.findAll();
        assertThat(docenteMateriaList).hasSize(databaseSizeBeforeUpdate);
        DocenteMateria testDocenteMateria = docenteMateriaList.get(docenteMateriaList.size() - 1);
        assertThat(testDocenteMateria.getIdDocente()).isEqualTo(UPDATED_ID_DOCENTE);
        assertThat(testDocenteMateria.getIdMateria()).isEqualTo(UPDATED_ID_MATERIA);
    }

    @Test
    @Transactional
    void putNonExistingDocenteMateria() throws Exception {
        int databaseSizeBeforeUpdate = docenteMateriaRepository.findAll().size();
        docenteMateria.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocenteMateriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, docenteMateria.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(docenteMateria))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocenteMateria in the database
        List<DocenteMateria> docenteMateriaList = docenteMateriaRepository.findAll();
        assertThat(docenteMateriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDocenteMateria() throws Exception {
        int databaseSizeBeforeUpdate = docenteMateriaRepository.findAll().size();
        docenteMateria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocenteMateriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(docenteMateria))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocenteMateria in the database
        List<DocenteMateria> docenteMateriaList = docenteMateriaRepository.findAll();
        assertThat(docenteMateriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDocenteMateria() throws Exception {
        int databaseSizeBeforeUpdate = docenteMateriaRepository.findAll().size();
        docenteMateria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocenteMateriaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(docenteMateria)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DocenteMateria in the database
        List<DocenteMateria> docenteMateriaList = docenteMateriaRepository.findAll();
        assertThat(docenteMateriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDocenteMateriaWithPatch() throws Exception {
        // Initialize the database
        docenteMateriaRepository.saveAndFlush(docenteMateria);

        int databaseSizeBeforeUpdate = docenteMateriaRepository.findAll().size();

        // Update the docenteMateria using partial update
        DocenteMateria partialUpdatedDocenteMateria = new DocenteMateria();
        partialUpdatedDocenteMateria.setId(docenteMateria.getId());

        partialUpdatedDocenteMateria.idMateria(UPDATED_ID_MATERIA);

        restDocenteMateriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocenteMateria.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDocenteMateria))
            )
            .andExpect(status().isOk());

        // Validate the DocenteMateria in the database
        List<DocenteMateria> docenteMateriaList = docenteMateriaRepository.findAll();
        assertThat(docenteMateriaList).hasSize(databaseSizeBeforeUpdate);
        DocenteMateria testDocenteMateria = docenteMateriaList.get(docenteMateriaList.size() - 1);
        assertThat(testDocenteMateria.getIdDocente()).isEqualTo(DEFAULT_ID_DOCENTE);
        assertThat(testDocenteMateria.getIdMateria()).isEqualTo(UPDATED_ID_MATERIA);
    }

    @Test
    @Transactional
    void fullUpdateDocenteMateriaWithPatch() throws Exception {
        // Initialize the database
        docenteMateriaRepository.saveAndFlush(docenteMateria);

        int databaseSizeBeforeUpdate = docenteMateriaRepository.findAll().size();

        // Update the docenteMateria using partial update
        DocenteMateria partialUpdatedDocenteMateria = new DocenteMateria();
        partialUpdatedDocenteMateria.setId(docenteMateria.getId());

        partialUpdatedDocenteMateria.idDocente(UPDATED_ID_DOCENTE).idMateria(UPDATED_ID_MATERIA);

        restDocenteMateriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocenteMateria.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDocenteMateria))
            )
            .andExpect(status().isOk());

        // Validate the DocenteMateria in the database
        List<DocenteMateria> docenteMateriaList = docenteMateriaRepository.findAll();
        assertThat(docenteMateriaList).hasSize(databaseSizeBeforeUpdate);
        DocenteMateria testDocenteMateria = docenteMateriaList.get(docenteMateriaList.size() - 1);
        assertThat(testDocenteMateria.getIdDocente()).isEqualTo(UPDATED_ID_DOCENTE);
        assertThat(testDocenteMateria.getIdMateria()).isEqualTo(UPDATED_ID_MATERIA);
    }

    @Test
    @Transactional
    void patchNonExistingDocenteMateria() throws Exception {
        int databaseSizeBeforeUpdate = docenteMateriaRepository.findAll().size();
        docenteMateria.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocenteMateriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, docenteMateria.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(docenteMateria))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocenteMateria in the database
        List<DocenteMateria> docenteMateriaList = docenteMateriaRepository.findAll();
        assertThat(docenteMateriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDocenteMateria() throws Exception {
        int databaseSizeBeforeUpdate = docenteMateriaRepository.findAll().size();
        docenteMateria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocenteMateriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(docenteMateria))
            )
            .andExpect(status().isBadRequest());

        // Validate the DocenteMateria in the database
        List<DocenteMateria> docenteMateriaList = docenteMateriaRepository.findAll();
        assertThat(docenteMateriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDocenteMateria() throws Exception {
        int databaseSizeBeforeUpdate = docenteMateriaRepository.findAll().size();
        docenteMateria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocenteMateriaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(docenteMateria))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DocenteMateria in the database
        List<DocenteMateria> docenteMateriaList = docenteMateriaRepository.findAll();
        assertThat(docenteMateriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDocenteMateria() throws Exception {
        // Initialize the database
        docenteMateriaRepository.saveAndFlush(docenteMateria);

        int databaseSizeBeforeDelete = docenteMateriaRepository.findAll().size();

        // Delete the docenteMateria
        restDocenteMateriaMockMvc
            .perform(delete(ENTITY_API_URL_ID, docenteMateria.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DocenteMateria> docenteMateriaList = docenteMateriaRepository.findAll();
        assertThat(docenteMateriaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
