package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.AdmiBancoP;
import co.edu.sena.repository.AdmiBancoPRepository;
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
 * Integration tests for the {@link AdmiBancoPResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AdmiBancoPResourceIT {

    private static final Integer DEFAULT_ID_ADMINISTRADOR = 1;
    private static final Integer UPDATED_ID_ADMINISTRADOR = 2;

    private static final Integer DEFAULT_ID_BANCO_PREGUNTA = 1;
    private static final Integer UPDATED_ID_BANCO_PREGUNTA = 2;

    private static final String ENTITY_API_URL = "/api/admi-banco-ps";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AdmiBancoPRepository admiBancoPRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdmiBancoPMockMvc;

    private AdmiBancoP admiBancoP;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdmiBancoP createEntity(EntityManager em) {
        AdmiBancoP admiBancoP = new AdmiBancoP().idAdministrador(DEFAULT_ID_ADMINISTRADOR).idBancoPregunta(DEFAULT_ID_BANCO_PREGUNTA);
        return admiBancoP;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdmiBancoP createUpdatedEntity(EntityManager em) {
        AdmiBancoP admiBancoP = new AdmiBancoP().idAdministrador(UPDATED_ID_ADMINISTRADOR).idBancoPregunta(UPDATED_ID_BANCO_PREGUNTA);
        return admiBancoP;
    }

    @BeforeEach
    public void initTest() {
        admiBancoP = createEntity(em);
    }

    @Test
    @Transactional
    void createAdmiBancoP() throws Exception {
        int databaseSizeBeforeCreate = admiBancoPRepository.findAll().size();
        // Create the AdmiBancoP
        restAdmiBancoPMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(admiBancoP)))
            .andExpect(status().isCreated());

        // Validate the AdmiBancoP in the database
        List<AdmiBancoP> admiBancoPList = admiBancoPRepository.findAll();
        assertThat(admiBancoPList).hasSize(databaseSizeBeforeCreate + 1);
        AdmiBancoP testAdmiBancoP = admiBancoPList.get(admiBancoPList.size() - 1);
        assertThat(testAdmiBancoP.getIdAdministrador()).isEqualTo(DEFAULT_ID_ADMINISTRADOR);
        assertThat(testAdmiBancoP.getIdBancoPregunta()).isEqualTo(DEFAULT_ID_BANCO_PREGUNTA);
    }

    @Test
    @Transactional
    void createAdmiBancoPWithExistingId() throws Exception {
        // Create the AdmiBancoP with an existing ID
        admiBancoP.setId(1L);

        int databaseSizeBeforeCreate = admiBancoPRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdmiBancoPMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(admiBancoP)))
            .andExpect(status().isBadRequest());

        // Validate the AdmiBancoP in the database
        List<AdmiBancoP> admiBancoPList = admiBancoPRepository.findAll();
        assertThat(admiBancoPList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAdmiBancoPS() throws Exception {
        // Initialize the database
        admiBancoPRepository.saveAndFlush(admiBancoP);

        // Get all the admiBancoPList
        restAdmiBancoPMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(admiBancoP.getId().intValue())))
            .andExpect(jsonPath("$.[*].idAdministrador").value(hasItem(DEFAULT_ID_ADMINISTRADOR)))
            .andExpect(jsonPath("$.[*].idBancoPregunta").value(hasItem(DEFAULT_ID_BANCO_PREGUNTA)));
    }

    @Test
    @Transactional
    void getAdmiBancoP() throws Exception {
        // Initialize the database
        admiBancoPRepository.saveAndFlush(admiBancoP);

        // Get the admiBancoP
        restAdmiBancoPMockMvc
            .perform(get(ENTITY_API_URL_ID, admiBancoP.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(admiBancoP.getId().intValue()))
            .andExpect(jsonPath("$.idAdministrador").value(DEFAULT_ID_ADMINISTRADOR))
            .andExpect(jsonPath("$.idBancoPregunta").value(DEFAULT_ID_BANCO_PREGUNTA));
    }

    @Test
    @Transactional
    void getNonExistingAdmiBancoP() throws Exception {
        // Get the admiBancoP
        restAdmiBancoPMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAdmiBancoP() throws Exception {
        // Initialize the database
        admiBancoPRepository.saveAndFlush(admiBancoP);

        int databaseSizeBeforeUpdate = admiBancoPRepository.findAll().size();

        // Update the admiBancoP
        AdmiBancoP updatedAdmiBancoP = admiBancoPRepository.findById(admiBancoP.getId()).get();
        // Disconnect from session so that the updates on updatedAdmiBancoP are not directly saved in db
        em.detach(updatedAdmiBancoP);
        updatedAdmiBancoP.idAdministrador(UPDATED_ID_ADMINISTRADOR).idBancoPregunta(UPDATED_ID_BANCO_PREGUNTA);

        restAdmiBancoPMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAdmiBancoP.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAdmiBancoP))
            )
            .andExpect(status().isOk());

        // Validate the AdmiBancoP in the database
        List<AdmiBancoP> admiBancoPList = admiBancoPRepository.findAll();
        assertThat(admiBancoPList).hasSize(databaseSizeBeforeUpdate);
        AdmiBancoP testAdmiBancoP = admiBancoPList.get(admiBancoPList.size() - 1);
        assertThat(testAdmiBancoP.getIdAdministrador()).isEqualTo(UPDATED_ID_ADMINISTRADOR);
        assertThat(testAdmiBancoP.getIdBancoPregunta()).isEqualTo(UPDATED_ID_BANCO_PREGUNTA);
    }

    @Test
    @Transactional
    void putNonExistingAdmiBancoP() throws Exception {
        int databaseSizeBeforeUpdate = admiBancoPRepository.findAll().size();
        admiBancoP.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdmiBancoPMockMvc
            .perform(
                put(ENTITY_API_URL_ID, admiBancoP.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(admiBancoP))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdmiBancoP in the database
        List<AdmiBancoP> admiBancoPList = admiBancoPRepository.findAll();
        assertThat(admiBancoPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAdmiBancoP() throws Exception {
        int databaseSizeBeforeUpdate = admiBancoPRepository.findAll().size();
        admiBancoP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdmiBancoPMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(admiBancoP))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdmiBancoP in the database
        List<AdmiBancoP> admiBancoPList = admiBancoPRepository.findAll();
        assertThat(admiBancoPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAdmiBancoP() throws Exception {
        int databaseSizeBeforeUpdate = admiBancoPRepository.findAll().size();
        admiBancoP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdmiBancoPMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(admiBancoP)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdmiBancoP in the database
        List<AdmiBancoP> admiBancoPList = admiBancoPRepository.findAll();
        assertThat(admiBancoPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAdmiBancoPWithPatch() throws Exception {
        // Initialize the database
        admiBancoPRepository.saveAndFlush(admiBancoP);

        int databaseSizeBeforeUpdate = admiBancoPRepository.findAll().size();

        // Update the admiBancoP using partial update
        AdmiBancoP partialUpdatedAdmiBancoP = new AdmiBancoP();
        partialUpdatedAdmiBancoP.setId(admiBancoP.getId());

        restAdmiBancoPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdmiBancoP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdmiBancoP))
            )
            .andExpect(status().isOk());

        // Validate the AdmiBancoP in the database
        List<AdmiBancoP> admiBancoPList = admiBancoPRepository.findAll();
        assertThat(admiBancoPList).hasSize(databaseSizeBeforeUpdate);
        AdmiBancoP testAdmiBancoP = admiBancoPList.get(admiBancoPList.size() - 1);
        assertThat(testAdmiBancoP.getIdAdministrador()).isEqualTo(DEFAULT_ID_ADMINISTRADOR);
        assertThat(testAdmiBancoP.getIdBancoPregunta()).isEqualTo(DEFAULT_ID_BANCO_PREGUNTA);
    }

    @Test
    @Transactional
    void fullUpdateAdmiBancoPWithPatch() throws Exception {
        // Initialize the database
        admiBancoPRepository.saveAndFlush(admiBancoP);

        int databaseSizeBeforeUpdate = admiBancoPRepository.findAll().size();

        // Update the admiBancoP using partial update
        AdmiBancoP partialUpdatedAdmiBancoP = new AdmiBancoP();
        partialUpdatedAdmiBancoP.setId(admiBancoP.getId());

        partialUpdatedAdmiBancoP.idAdministrador(UPDATED_ID_ADMINISTRADOR).idBancoPregunta(UPDATED_ID_BANCO_PREGUNTA);

        restAdmiBancoPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdmiBancoP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdmiBancoP))
            )
            .andExpect(status().isOk());

        // Validate the AdmiBancoP in the database
        List<AdmiBancoP> admiBancoPList = admiBancoPRepository.findAll();
        assertThat(admiBancoPList).hasSize(databaseSizeBeforeUpdate);
        AdmiBancoP testAdmiBancoP = admiBancoPList.get(admiBancoPList.size() - 1);
        assertThat(testAdmiBancoP.getIdAdministrador()).isEqualTo(UPDATED_ID_ADMINISTRADOR);
        assertThat(testAdmiBancoP.getIdBancoPregunta()).isEqualTo(UPDATED_ID_BANCO_PREGUNTA);
    }

    @Test
    @Transactional
    void patchNonExistingAdmiBancoP() throws Exception {
        int databaseSizeBeforeUpdate = admiBancoPRepository.findAll().size();
        admiBancoP.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdmiBancoPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, admiBancoP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(admiBancoP))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdmiBancoP in the database
        List<AdmiBancoP> admiBancoPList = admiBancoPRepository.findAll();
        assertThat(admiBancoPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAdmiBancoP() throws Exception {
        int databaseSizeBeforeUpdate = admiBancoPRepository.findAll().size();
        admiBancoP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdmiBancoPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(admiBancoP))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdmiBancoP in the database
        List<AdmiBancoP> admiBancoPList = admiBancoPRepository.findAll();
        assertThat(admiBancoPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAdmiBancoP() throws Exception {
        int databaseSizeBeforeUpdate = admiBancoPRepository.findAll().size();
        admiBancoP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdmiBancoPMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(admiBancoP))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdmiBancoP in the database
        List<AdmiBancoP> admiBancoPList = admiBancoPRepository.findAll();
        assertThat(admiBancoPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAdmiBancoP() throws Exception {
        // Initialize the database
        admiBancoPRepository.saveAndFlush(admiBancoP);

        int databaseSizeBeforeDelete = admiBancoPRepository.findAll().size();

        // Delete the admiBancoP
        restAdmiBancoPMockMvc
            .perform(delete(ENTITY_API_URL_ID, admiBancoP.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AdmiBancoP> admiBancoPList = admiBancoPRepository.findAll();
        assertThat(admiBancoPList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
