package com.codexformation.phonestore.phone;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/phones")
public class PhoneController {

    private final PhoneService phoneService;

    public PhoneController(PhoneService phoneService) {
        this.phoneService = phoneService;
    }

    @GetMapping
    public List<Phone> findAll() {
        return phoneService.findAll();
    }

    @GetMapping("/{id}")
    public Phone findById(@PathVariable Long id) {
        return phoneService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Phone> create(@Valid @RequestBody Phone phone) {
        Phone createdPhone = phoneService.create(phone);
        return ResponseEntity
                .created(URI.create("/api/phones/" + createdPhone.getId()))
                .body(createdPhone);
    }

    @PutMapping("/{id}")
    public Phone update(@PathVariable Long id, @Valid @RequestBody Phone phone) {
        return phoneService.update(id, phone);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        phoneService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
