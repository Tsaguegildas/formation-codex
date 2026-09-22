package com.codexformation.phonestore.phone;

import com.codexformation.phonestore.shared.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PhoneService {

    private final PhoneRepository phoneRepository;

    public PhoneService(PhoneRepository phoneRepository) {
        this.phoneRepository = phoneRepository;
    }

    public List<Phone> findAll() {
        return phoneRepository.findAll();
    }

    public Phone findById(Long id) {
        return phoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Telephone introuvable avec l'id " + id));
    }

    public Phone create(Phone phone) {
        phone.setId(null);
        return phoneRepository.save(phone);
    }

    public Phone update(Long id, Phone updatedPhone) {
        Phone phone = findById(id);

        phone.setBrand(updatedPhone.getBrand());
        phone.setModel(updatedPhone.getModel());
        phone.setDescription(updatedPhone.getDescription());
        phone.setPrice(updatedPhone.getPrice());
        phone.setStockQuantity(updatedPhone.getStockQuantity());
        phone.setImageUrl(updatedPhone.getImageUrl());

        return phoneRepository.save(phone);
    }

    public void delete(Long id) {
        Phone phone = findById(id);
        phoneRepository.delete(phone);
    }
}
