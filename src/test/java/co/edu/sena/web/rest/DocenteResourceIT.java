package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Docente;
import co.edu.sena.repository.DocenteRepository;
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
 * Integration tests for the {@link DocenteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DocenteResourceIT {

    private static final String DEFAULT_COLEGIO = "AAAAAAAAAA";
    private static final String UPDATED_COLEGIO = "BBBBBBBBBB";

    private static final String DEFAULT_MATERIA = "AAAAAAAAAA";
    private static final String UPDATED_MATERIA = "BBBBBBBBBB";

    private static final String DEFAULT_CIUDAD = "AAAAAAAAAA";
    private static final String UPDATED_CIUDAD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/docentes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDocenteMockMvc;

    private Docente docente;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Docente createEntity(EntityManager em) {
        Docente docente = new Docente().colegio(DEFAULT_COLEGIO).materia(DEFAULT_MATERIA).ciudad(DEFAULT_CIUDAD);
        return docente;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Docente createUpdatedEntity(EntityManager em) {
        Docente docente = new Docente().colegio(UPDATED_COLEGIO).materia(UPDATED_MATERIA).ciudad(UPDATED_CIUDAD);
        return docente;
    }

    @BeforeEach
    public void initTest() {
        docente = createEntity(em);
    }

    @Test
    @Transactional
    void createDocente() throws Exception {
        int databaseSizeBeforeCreate = docenteRepository.findAll().size();
        // Create the Docente
        restDocenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(docente)))
            .andExpect(status().isCreated());

        // Validate the Docente in the database
        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeCreate + 1);
        Docente testDocente = docenteList.get(docenteList.size() - 1);
        assertThat(testDocente.getColegio()).isEqualTo(DEFAULT_COLEGIO);
        assertThat(testDocente.getMateria()).isEqualTo(DEFAULT_MATERIA);
        assertThat(testDocente.getCiudad()).isEqualTo(DEFAULT_CIUDAD);
    }

    @Test
    @Transactional
    void createDocenteWithExistingId() throws Exception {
        // Create the Docente with an existing ID
        docente.setId(1L);

        int databaseSizeBeforeCreate = docenteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(docente)))
            .andExpect(status().isBadRequest());

        // Validate the Docente in the database
        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkColegioIsRequired() throws Exception {
        int databaseSizeBeforeTest = docenteRepository.findAll().size();
        // set the field null
        docente.setColegio(null);

        // Create the Docente, which fails.

        restDocenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(docente)))
            .andExpect(status().isBadRequest());

        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMateriaIsRequired() throws Exception {
        int databaseSizeBeforeTest = docenteRepository.findAll().size();
        // set the field null
        docente.setMateria(null);

        // Create the Docente, which fails.

        restDocenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(docente)))
            .andExpect(status().isBadRequest());

        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCiudadIsRequired() throws Exception {
        int databaseSizeBeforeTest = docenteRepository.findAll().size();
        // set the field null
        docente.setCiudad(null);

        // Create the Docente, which fails.

        restDocenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(docente)))
            .andExpect(status().isBadRequest());

        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDocentes() throws Exception {
        // Initialize the database
        docenteRepository.saveAndFlush(docente);

        // Get all the docenteList
        restDocenteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(docente.getId().intValue())))
            .andExpect(jsonPath("$.[*].colegio").value(hasItem(DEFAULT_COLEGIO)))
            .andExpect(jsonPath("$.[*].materia").value(hasItem(DEFAULT_MATERIA)))
            .andExpect(jsonPath("$.[*].ciudad").value(hasItem(DEFAULT_CIUDAD)));
    }

    @Test
    @Transactional
    void getDocente() throws Exception {
        // Initialize the database
        docenteRepository.saveAndFlush(docente);

        // Get the docente
        restDocenteMockMvc
            .perform(get(ENTITY_API_URL_ID, docente.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(docente.getId().intValue()))
            .andExpect(jsonPath("$.colegio").value(DEFAULT_COLEGIO))
            .andExpect(jsonPath("$.materia").value(DEFAULT_MATERIA))
            .andExpect(jsonPath("$.ciudad").value(DEFAULT_CIUDAD));
    }

    @Test
    @Transactional
    void getNonExistingDocente() throws Exception {
        // Get the docente
        restDocenteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDocente() throws Exception {
        // Initialize the database
        docenteRepository.saveAndFlush(docente);

        int databaseSizeBeforeUpdate = docenteRepository.findAll().size();

        // Update the docente
        Docente updatedDocente = docenteRepository.findById(docente.getId()).get();
        // Disconnect from session so that the updates on updatedDocente are not directly saved in db
        em.detach(updatedDocente);
        updatedDocente.colegio(UPDATED_COLEGIO).materia(UPDATED_MATERIA).ciudad(UPDATED_CIUDAD);

        restDocenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDocente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDocente))
            )
            .andExpect(status().isOk());

        // Validate the Docente in the database
        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeUpdate);
        Docente testDocente = docenteList.get(docenteList.size() - 1);
        assertThat(testDocente.getColegio()).isEqualTo(UPDATED_COLEGIO);
        assertThat(testDocente.getMateria()).isEqualTo(UPDATED_MATERIA);
        assertThat(testDocente.getCiudad()).isEqualTo(UPDATED_CIUDAD);
    }

    @Test
    @Transactional
    void putNonExistingDocente() throws Exception {
        int databaseSizeBeforeUpdate = docenteRepository.findAll().size();
        docente.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, docente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(docente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Docente in the database
        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDocente() throws Exception {
        int databaseSizeBeforeUpdate = docenteRepository.findAll().size();
        docente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(docente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Docente in the database
        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDocente() throws Exception {
        int databaseSizeBeforeUpdate = docenteRepository.findAll().size();
        docente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocenteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(docente)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Docente in the database
        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDocenteWithPatch() throws Exception {
        // Initialize the database
        docenteRepository.saveAndFlush(docente);

        int databaseSizeBeforeUpdate = docenteRepository.findAll().size();

        // Update the docente using partial update
        Docente partialUpdatedDocente = new Docente();
        partialUpdatedDocente.setId(docente.getId());

        partialUpdatedDocente.colegio(UPDATED_COLEGIO);

        restDocenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDocente))
            )
            .andExpect(status().isOk());

        // Validate the Docente in the database
        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeUpdate);
        Docente testDocente = docenteList.get(docenteList.size() - 1);
        assertThat(testDocente.getColegio()).isEqualTo(UPDATED_COLEGIO);
        assertThat(testDocente.getMateria()).isEqualTo(DEFAULT_MATERIA);
        assertThat(testDocente.getCiudad()).isEqualTo(DEFAULT_CIUDAD);
    }

    @Test
    @Transactional
    void fullUpdateDocenteWithPatch() throws Exception {
        // Initialize the database
        docenteRepository.saveAndFlush(docente);

        int databaseSizeBeforeUpdate = docenteRepository.findAll().size();

        // Update the docente using partial update
        Docente partialUpdatedDocente = new Docente();
        partialUpdatedDocente.setId(docente.getId());

        partialUpdatedDocente.colegio(UPDATED_COLEGIO).materia(UPDATED_MATERIA).ciudad(UPDATED_CIUDAD);

        restDocenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDocente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDocente))
            )
            .andExpect(status().isOk());

        // Validate the Docente in the database
        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeUpdate);
        Docente testDocente = docenteList.get(docenteList.size() - 1);
        assertThat(testDocente.getColegio()).isEqualTo(UPDATED_COLEGIO);
        assertThat(testDocente.getMateria()).isEqualTo(UPDATED_MATERIA);
        assertThat(testDocente.getCiudad()).isEqualTo(UPDATED_CIUDAD);
    }

    @Test
    @Transactional
    void patchNonExistingDocente() throws Exception {
        int databaseSizeBeforeUpdate = docenteRepository.findAll().size();
        docente.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, docente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(docente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Docente in the database
        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDocente() throws Exception {
        int databaseSizeBeforeUpdate = docenteRepository.findAll().size();
        docente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(docente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Docente in the database
        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDocente() throws Exception {
        int databaseSizeBeforeUpdate = docenteRepository.findAll().size();
        docente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDocenteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(docente)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Docente in the database
        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDocente() throws Exception {
        // Initialize the database
        docenteRepository.saveAndFlush(docente);

        int databaseSizeBeforeDelete = docenteRepository.findAll().size();

        // Delete the docente
        restDocenteMockMvc
            .perform(delete(ENTITY_API_URL_ID, docente.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Docente> docenteList = docenteRepository.findAll();
        assertThat(docenteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
