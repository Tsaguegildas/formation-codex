package com.codexformation.phonestore.phone;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PhoneControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldCreateReadUpdateAndDeletePhone() throws Exception {
        String phoneJson = """
                {
                  "brand": "Xiaomi",
                  "model": "Redmi Note 13",
                  "description": "Telephone Android abordable",
                  "price": 249.99,
                  "stockQuantity": 30,
                  "imageUrl": "https://example.com/redmi-note-13.jpg"
                }
                """;

        String location = mockMvc.perform(post("/api/phones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(phoneJson))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.brand").value("Xiaomi"))
                .andReturn()
                .getResponse()
                .getHeader("Location");

        mockMvc.perform(get(location))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.model").value("Redmi Note 13"));

        String updatedPhoneJson = """
                {
                  "brand": "Xiaomi",
                  "model": "Redmi Note 13 Pro",
                  "description": "Telephone Android avec plus de puissance",
                  "price": 329.99,
                  "stockQuantity": 22,
                  "imageUrl": "https://example.com/redmi-note-13-pro.jpg"
                }
                """;

        mockMvc.perform(put(location)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedPhoneJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.model").value("Redmi Note 13 Pro"))
                .andExpect(jsonPath("$.stockQuantity").value(22));

        mockMvc.perform(get("/api/phones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)));

        mockMvc.perform(delete(location))
                .andExpect(status().isNoContent());

        mockMvc.perform(get(location))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldRejectInvalidPhone() throws Exception {
        String invalidPhoneJson = """
                {
                  "brand": "",
                  "model": "",
                  "description": "",
                  "price": -10,
                  "stockQuantity": -1
                }
                """;

        mockMvc.perform(post("/api/phones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPhoneJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.messages", hasSize(5)));
    }
}
