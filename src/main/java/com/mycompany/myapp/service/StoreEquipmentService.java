package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.StoreEquipment;
import com.mycompany.myapp.repository.StoreEquipmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;

/**
 * Service Implementation for managing {@link StoreEquipment}.
 */
@Service
@Transactional
public class StoreEquipmentService {

    private final Logger log = LoggerFactory.getLogger(StoreEquipmentService.class);

    private final StoreEquipmentRepository storeEquipmentRepository;

    public StoreEquipmentService(StoreEquipmentRepository storeEquipmentRepository) {
        this.storeEquipmentRepository = storeEquipmentRepository;
    }

    /**
     * Save a storeEquipment.
     *
     * @param storeEquipment the entity to save.
     * @return the persisted entity.
     */
    public StoreEquipment save(StoreEquipment storeEquipment) {
        log.debug("Request to save StoreEquipment : {}", storeEquipment);
        if(storeEquipment.getEquipmentName().equals("Ar Condicionado Central")){
            List<StoreEquipment> equipments = storeEquipmentRepository.findAll();
            for(StoreEquipment se : equipments){
                if(se.getEquipmentName().equals("Ar Condicionado Central") && se.getId() == storeEquipment.getStore().getId()){
                    throw new BadRequestAlertException("Somente um equipamento com nome Ar Condicionado Central permitido", "storeEquipment", "equipmentnameinuse");
                }
            }
        }
        return storeEquipmentRepository.save(storeEquipment);
    }

    /**
     * Get all the storeEquipments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<StoreEquipment> findAll(Pageable pageable) {
        log.debug("Request to get all StoreEquipments");
        return storeEquipmentRepository.findAll(pageable);
    }


    /**
     * Get one storeEquipment by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<StoreEquipment> findOne(Long id) {
        log.debug("Request to get StoreEquipment : {}", id);
        return storeEquipmentRepository.findById(id);
    }

    /**
     * Delete the storeEquipment by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete StoreEquipment : {}", id);
        storeEquipmentRepository.deleteById(id);
    }
}
