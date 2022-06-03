package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.TipoDocumento;
import co.edu.sena.domain.enumeration.State;
import co.edu.sena.repository.TipoDocumentoRepository;
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
 * Integration tests for the {@link TipoDocumentoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TipoDocumentoResourceIT {

    private static final String DEFAULT_INICIALES = "AAAAAAAAAA";
    private static final String UPDATED_INICIALES = "BBBBBBBBBB";

    private static final String DEFAULT_NOMBRE_DOCUMENTO = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_DOCUMENTO = "BBBBBBBBBB";

    private static final State DEFAULT_ESTADO_TIPO_DOCUMENTO = State.Active;
    private static final State UPDATED_ESTADO_TIPO_DOCUMENTO = State.INACTIVE;

    private static final String ENTITY_API_URL = "/api/tipo-documentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TipoDocumentoRepository tipoDocumentoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTipoDocumentoMockMvc;

    private TipoDocumento tipoDocumento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TipoDocumento createEntity(EntityManager em) {
        TipoDocumento tipoDocumento = new TipoDocumento()
            .iniciales(DEFAULT_INICIALES)
            .nombreDocumento(DEFAULT_NOMBRE_DOCUMENTO)
            .estadoTipoDocumento(DEFAULT_ESTADO_TIPO_DOCUMENTO);
        return tipoDocumento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TipoDocumento createUpdatedEntity(EntityManager em) {
        TipoDocumento tipoDocumento = new TipoDocumento()
            .iniciales(UPDATED_INICIALES)
            .nombreDocumento(UPDATED_NOMBRE_DOCUMENTO)
            .estadoTipoDocumento(UPDATED_ESTADO_TIPO_DOCUMENTO);
        return tipoDocumento;
    }

    @BeforeEach
    public void initTest() {
        tipoDocumento = createEntity(em);
    }

    @Test
    @Transactional
    void createTipoDocumento() throws Exception {
        int databaseSizeBeforeCreate = tipoDocumentoRepository.findAll().size();
        // Create the TipoDocumento
        restTipoDocumentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoDocumento)))
            .andExpect(status().isCreated());

        // Validate the TipoDocumento in the database
        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeCreate + 1);
        TipoDocumento testTipoDocumento = tipoDocumentoList.get(tipoDocumentoList.size() - 1);
        assertThat(testTipoDocumento.getIniciales()).isEqualTo(DEFAULT_INICIALES);
        assertThat(testTipoDocumento.getNombreDocumento()).isEqualTo(DEFAULT_NOMBRE_DOCUMENTO);
        assertThat(testTipoDocumento.getEstadoTipoDocumento()).isEqualTo(DEFAULT_ESTADO_TIPO_DOCUMENTO);
    }

    @Test
    @Transactional
    void createTipoDocumentoWithExistingId() throws Exception {
        // Create the TipoDocumento with an existing ID
        tipoDocumento.setId(1L);

        int databaseSizeBeforeCreate = tipoDocumentoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTipoDocumentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoDocumento)))
            .andExpect(status().isBadRequest());

        // Validate the TipoDocumento in the database
        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkInicialesIsRequired() throws Exception {
        int databaseSizeBeforeTest = tipoDocumentoRepository.findAll().size();
        // set the field null
        tipoDocumento.setIniciales(null);

        // Create the TipoDocumento, which fails.

        restTipoDocumentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoDocumento)))
            .andExpect(status().isBadRequest());

        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNombreDocumentoIsRequired() throws Exception {
        int databaseSizeBeforeTest = tipoDocumentoRepository.findAll().size();
        // set the field null
        tipoDocumento.setNombreDocumento(null);

        // Create the TipoDocumento, which fails.

        restTipoDocumentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoDocumento)))
            .andExpect(status().isBadRequest());

        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEstadoTipoDocumentoIsRequired() throws Exception {
        int databaseSizeBeforeTest = tipoDocumentoRepository.findAll().size();
        // set the field null
        tipoDocumento.setEstadoTipoDocumento(null);

        // Create the TipoDocumento, which fails.

        restTipoDocumentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoDocumento)))
            .andExpect(status().isBadRequest());

        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTipoDocumentos() throws Exception {
        // Initialize the database
        tipoDocumentoRepository.saveAndFlush(tipoDocumento);

        // Get all the tipoDocumentoList
        restTipoDocumentoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tipoDocumento.getId().intValue())))
            .andExpect(jsonPath("$.[*].iniciales").value(hasItem(DEFAULT_INICIALES)))
            .andExpect(jsonPath("$.[*].nombreDocumento").value(hasItem(DEFAULT_NOMBRE_DOCUMENTO)))
            .andExpect(jsonPath("$.[*].estadoTipoDocumento").value(hasItem(DEFAULT_ESTADO_TIPO_DOCUMENTO.toString())));
    }

    @Test
    @Transactional
    void getTipoDocumento() throws Exception {
        // Initialize the database
        tipoDocumentoRepository.saveAndFlush(tipoDocumento);

        // Get the tipoDocumento
        restTipoDocumentoMockMvc
            .perform(get(ENTITY_API_URL_ID, tipoDocumento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tipoDocumento.getId().intValue()))
            .andExpect(jsonPath("$.iniciales").value(DEFAULT_INICIALES))
            .andExpect(jsonPath("$.nombreDocumento").value(DEFAULT_NOMBRE_DOCUMENTO))
            .andExpect(jsonPath("$.estadoTipoDocumento").value(DEFAULT_ESTADO_TIPO_DOCUMENTO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTipoDocumento() throws Exception {
        // Get the tipoDocumento
        restTipoDocumentoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTipoDocumento() throws Exception {
        // Initialize the database
        tipoDocumentoRepository.saveAndFlush(tipoDocumento);

        int databaseSizeBeforeUpdate = tipoDocumentoRepository.findAll().size();

        // Update the tipoDocumento
        TipoDocumento updatedTipoDocumento = tipoDocumentoRepository.findById(tipoDocumento.getId()).get();
        // Disconnect from session so that the updates on updatedTipoDocumento are not directly saved in db
        em.detach(updatedTipoDocumento);
        updatedTipoDocumento
            .iniciales(UPDATED_INICIALES)
            .nombreDocumento(UPDATED_NOMBRE_DOCUMENTO)
            .estadoTipoDocumento(UPDATED_ESTADO_TIPO_DOCUMENTO);

        restTipoDocumentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTipoDocumento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTipoDocumento))
            )
            .andExpect(status().isOk());

        // Validate the TipoDocumento in the database
        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeUpdate);
        TipoDocumento testTipoDocumento = tipoDocumentoList.get(tipoDocumentoList.size() - 1);
        assertThat(testTipoDocumento.getIniciales()).isEqualTo(UPDATED_INICIALES);
        assertThat(testTipoDocumento.getNombreDocumento()).isEqualTo(UPDATED_NOMBRE_DOCUMENTO);
        assertThat(testTipoDocumento.getEstadoTipoDocumento()).isEqualTo(UPDATED_ESTADO_TIPO_DOCUMENTO);
    }

    @Test
    @Transactional
    void putNonExistingTipoDocumento() throws Exception {
        int databaseSizeBeforeUpdate = tipoDocumentoRepository.findAll().size();
        tipoDocumento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTipoDocumentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tipoDocumento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tipoDocumento))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoDocumento in the database
        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTipoDocumento() throws Exception {
        int databaseSizeBeforeUpdate = tipoDocumentoRepository.findAll().size();
        tipoDocumento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoDocumentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tipoDocumento))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoDocumento in the database
        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTipoDocumento() throws Exception {
        int databaseSizeBeforeUpdate = tipoDocumentoRepository.findAll().size();
        tipoDocumento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoDocumentoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoDocumento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TipoDocumento in the database
        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTipoDocumentoWithPatch() throws Exception {
        // Initialize the database
        tipoDocumentoRepository.saveAndFlush(tipoDocumento);

        int databaseSizeBeforeUpdate = tipoDocumentoRepository.findAll().size();

        // Update the tipoDocumento using partial update
        TipoDocumento partialUpdatedTipoDocumento = new TipoDocumento();
        partialUpdatedTipoDocumento.setId(tipoDocumento.getId());

        restTipoDocumentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTipoDocumento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTipoDocumento))
            )
            .andExpect(status().isOk());

        // Validate the TipoDocumento in the database
        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeUpdate);
        TipoDocumento testTipoDocumento = tipoDocumentoList.get(tipoDocumentoList.size() - 1);
        assertThat(testTipoDocumento.getIniciales()).isEqualTo(DEFAULT_INICIALES);
        assertThat(testTipoDocumento.getNombreDocumento()).isEqualTo(DEFAULT_NOMBRE_DOCUMENTO);
        assertThat(testTipoDocumento.getEstadoTipoDocumento()).isEqualTo(DEFAULT_ESTADO_TIPO_DOCUMENTO);
    }

    @Test
    @Transactional
    void fullUpdateTipoDocumentoWithPatch() throws Exception {
        // Initialize the database
        tipoDocumentoRepository.saveAndFlush(tipoDocumento);

        int databaseSizeBeforeUpdate = tipoDocumentoRepository.findAll().size();

        // Update the tipoDocumento using partial update
        TipoDocumento partialUpdatedTipoDocumento = new TipoDocumento();
        partialUpdatedTipoDocumento.setId(tipoDocumento.getId());

        partialUpdatedTipoDocumento
            .iniciales(UPDATED_INICIALES)
            .nombreDocumento(UPDATED_NOMBRE_DOCUMENTO)
            .estadoTipoDocumento(UPDATED_ESTADO_TIPO_DOCUMENTO);

        restTipoDocumentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTipoDocumento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTipoDocumento))
            )
            .andExpect(status().isOk());

        // Validate the TipoDocumento in the database
        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeUpdate);
        TipoDocumento testTipoDocumento = tipoDocumentoList.get(tipoDocumentoList.size() - 1);
        assertThat(testTipoDocumento.getIniciales()).isEqualTo(UPDATED_INICIALES);
        assertThat(testTipoDocumento.getNombreDocumento()).isEqualTo(UPDATED_NOMBRE_DOCUMENTO);
        assertThat(testTipoDocumento.getEstadoTipoDocumento()).isEqualTo(UPDATED_ESTADO_TIPO_DOCUMENTO);
    }

    @Test
    @Transactional
    void patchNonExistingTipoDocumento() throws Exception {
        int databaseSizeBeforeUpdate = tipoDocumentoRepository.findAll().size();
        tipoDocumento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTipoDocumentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tipoDocumento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tipoDocumento))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoDocumento in the database
        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTipoDocumento() throws Exception {
        int databaseSizeBeforeUpdate = tipoDocumentoRepository.findAll().size();
        tipoDocumento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoDocumentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tipoDocumento))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoDocumento in the database
        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTipoDocumento() throws Exception {
        int databaseSizeBeforeUpdate = tipoDocumentoRepository.findAll().size();
        tipoDocumento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoDocumentoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tipoDocumento))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TipoDocumento in the database
        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTipoDocumento() throws Exception {
        // Initialize the database
        tipoDocumentoRepository.saveAndFlush(tipoDocumento);

        int databaseSizeBeforeDelete = tipoDocumentoRepository.findAll().size();

        // Delete the tipoDocumento
        restTipoDocumentoMockMvc
            .perform(delete(ENTITY_API_URL_ID, tipoDocumento.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TipoDocumento> tipoDocumentoList = tipoDocumentoRepository.findAll();
        assertThat(tipoDocumentoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
