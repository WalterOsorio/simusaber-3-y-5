package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Administrador;
import co.edu.sena.repository.AdministradorRepository;
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
 * Integration tests for the {@link AdministradorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AdministradorResourceIT {

    private static final Long DEFAULT_NIVEL_ACCESO = 1L;
    private static final Long UPDATED_NIVEL_ACCESO = 2L;

    private static final String ENTITY_API_URL = "/api/administradors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdministradorMockMvc;

    private Administrador administrador;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Administrador createEntity(EntityManager em) {
        Administrador administrador = new Administrador().nivelAcceso(DEFAULT_NIVEL_ACCESO);
        return administrador;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Administrador createUpdatedEntity(EntityManager em) {
        Administrador administrador = new Administrador().nivelAcceso(UPDATED_NIVEL_ACCESO);
        return administrador;
    }

    @BeforeEach
    public void initTest() {
        administrador = createEntity(em);
    }

    @Test
    @Transactional
    void createAdministrador() throws Exception {
        int databaseSizeBeforeCreate = administradorRepository.findAll().size();
        // Create the Administrador
        restAdministradorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(administrador)))
            .andExpect(status().isCreated());

        // Validate the Administrador in the database
        List<Administrador> administradorList = administradorRepository.findAll();
        assertThat(administradorList).hasSize(databaseSizeBeforeCreate + 1);
        Administrador testAdministrador = administradorList.get(administradorList.size() - 1);
        assertThat(testAdministrador.getNivelAcceso()).isEqualTo(DEFAULT_NIVEL_ACCESO);
    }

    @Test
    @Transactional
    void createAdministradorWithExistingId() throws Exception {
        // Create the Administrador with an existing ID
        administrador.setId(1L);

        int databaseSizeBeforeCreate = administradorRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdministradorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(administrador)))
            .andExpect(status().isBadRequest());

        // Validate the Administrador in the database
        List<Administrador> administradorList = administradorRepository.findAll();
        assertThat(administradorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAdministradors() throws Exception {
        // Initialize the database
        administradorRepository.saveAndFlush(administrador);

        // Get all the administradorList
        restAdministradorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(administrador.getId().intValue())))
            .andExpect(jsonPath("$.[*].nivelAcceso").value(hasItem(DEFAULT_NIVEL_ACCESO.intValue())));
    }

    @Test
    @Transactional
    void getAdministrador() throws Exception {
        // Initialize the database
        administradorRepository.saveAndFlush(administrador);

        // Get the administrador
        restAdministradorMockMvc
            .perform(get(ENTITY_API_URL_ID, administrador.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(administrador.getId().intValue()))
            .andExpect(jsonPath("$.nivelAcceso").value(DEFAULT_NIVEL_ACCESO.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingAdministrador() throws Exception {
        // Get the administrador
        restAdministradorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAdministrador() throws Exception {
        // Initialize the database
        administradorRepository.saveAndFlush(administrador);

        int databaseSizeBeforeUpdate = administradorRepository.findAll().size();

        // Update the administrador
        Administrador updatedAdministrador = administradorRepository.findById(administrador.getId()).get();
        // Disconnect from session so that the updates on updatedAdministrador are not directly saved in db
        em.detach(updatedAdministrador);
        updatedAdministrador.nivelAcceso(UPDATED_NIVEL_ACCESO);

        restAdministradorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAdministrador.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAdministrador))
            )
            .andExpect(status().isOk());

        // Validate the Administrador in the database
        List<Administrador> administradorList = administradorRepository.findAll();
        assertThat(administradorList).hasSize(databaseSizeBeforeUpdate);
        Administrador testAdministrador = administradorList.get(administradorList.size() - 1);
        assertThat(testAdministrador.getNivelAcceso()).isEqualTo(UPDATED_NIVEL_ACCESO);
    }

    @Test
    @Transactional
    void putNonExistingAdministrador() throws Exception {
        int databaseSizeBeforeUpdate = administradorRepository.findAll().size();
        administrador.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdministradorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, administrador.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(administrador))
            )
            .andExpect(status().isBadRequest());

        // Validate the Administrador in the database
        List<Administrador> administradorList = administradorRepository.findAll();
        assertThat(administradorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAdministrador() throws Exception {
        int databaseSizeBeforeUpdate = administradorRepository.findAll().size();
        administrador.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdministradorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(administrador))
            )
            .andExpect(status().isBadRequest());

        // Validate the Administrador in the database
        List<Administrador> administradorList = administradorRepository.findAll();
        assertThat(administradorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAdministrador() throws Exception {
        int databaseSizeBeforeUpdate = administradorRepository.findAll().size();
        administrador.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdministradorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(administrador)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Administrador in the database
        List<Administrador> administradorList = administradorRepository.findAll();
        assertThat(administradorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAdministradorWithPatch() throws Exception {
        // Initialize the database
        administradorRepository.saveAndFlush(administrador);

        int databaseSizeBeforeUpdate = administradorRepository.findAll().size();

        // Update the administrador using partial update
        Administrador partialUpdatedAdministrador = new Administrador();
        partialUpdatedAdministrador.setId(administrador.getId());

        partialUpdatedAdministrador.nivelAcceso(UPDATED_NIVEL_ACCESO);

        restAdministradorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdministrador.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdministrador))
            )
            .andExpect(status().isOk());

        // Validate the Administrador in the database
        List<Administrador> administradorList = administradorRepository.findAll();
        assertThat(administradorList).hasSize(databaseSizeBeforeUpdate);
        Administrador testAdministrador = administradorList.get(administradorList.size() - 1);
        assertThat(testAdministrador.getNivelAcceso()).isEqualTo(UPDATED_NIVEL_ACCESO);
    }

    @Test
    @Transactional
    void fullUpdateAdministradorWithPatch() throws Exception {
        // Initialize the database
        administradorRepository.saveAndFlush(administrador);

        int databaseSizeBeforeUpdate = administradorRepository.findAll().size();

        // Update the administrador using partial update
        Administrador partialUpdatedAdministrador = new Administrador();
        partialUpdatedAdministrador.setId(administrador.getId());

        partialUpdatedAdministrador.nivelAcceso(UPDATED_NIVEL_ACCESO);

        restAdministradorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdministrador.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdministrador))
            )
            .andExpect(status().isOk());

        // Validate the Administrador in the database
        List<Administrador> administradorList = administradorRepository.findAll();
        assertThat(administradorList).hasSize(databaseSizeBeforeUpdate);
        Administrador testAdministrador = administradorList.get(administradorList.size() - 1);
        assertThat(testAdministrador.getNivelAcceso()).isEqualTo(UPDATED_NIVEL_ACCESO);
    }

    @Test
    @Transactional
    void patchNonExistingAdministrador() throws Exception {
        int databaseSizeBeforeUpdate = administradorRepository.findAll().size();
        administrador.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdministradorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, administrador.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(administrador))
            )
            .andExpect(status().isBadRequest());

        // Validate the Administrador in the database
        List<Administrador> administradorList = administradorRepository.findAll();
        assertThat(administradorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAdministrador() throws Exception {
        int databaseSizeBeforeUpdate = administradorRepository.findAll().size();
        administrador.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdministradorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(administrador))
            )
            .andExpect(status().isBadRequest());

        // Validate the Administrador in the database
        List<Administrador> administradorList = administradorRepository.findAll();
        assertThat(administradorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAdministrador() throws Exception {
        int databaseSizeBeforeUpdate = administradorRepository.findAll().size();
        administrador.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdministradorMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(administrador))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Administrador in the database
        List<Administrador> administradorList = administradorRepository.findAll();
        assertThat(administradorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAdministrador() throws Exception {
        // Initialize the database
        administradorRepository.saveAndFlush(administrador);

        int databaseSizeBeforeDelete = administradorRepository.findAll().size();

        // Delete the administrador
        restAdministradorMockMvc
            .perform(delete(ENTITY_API_URL_ID, administrador.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Administrador> administradorList = administradorRepository.findAll();
        assertThat(administradorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
