package com.vozly.interests;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class InterestServiceIntegrationTests {
    @Autowired
    InterestService interestService;

    @Autowired
    JdbcTemplate jdbc;

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @BeforeEach
    void prepareSchema() {
        jdbc.execute("CREATE SCHEMA IF NOT EXISTS vozly");
        jdbc.execute("DROP TABLE IF EXISTS vozly.interest_submissions");
        jdbc.execute("""
                CREATE TABLE vozly.interest_submissions (
                    id UUID PRIMARY KEY,
                    company TEXT NOT NULL,
                    segment VARCHAR(30) NOT NULL,
                    email TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """);
    }

    @Test
    void storesTheCompanySegmentAndEmailSubmittedByLandingPage() {
        var id = interestService.register("Empresa Exemplo", "assistencia", "contato@empresa.com");

        assertThat(jdbc.queryForObject(
                "SELECT company FROM vozly.interest_submissions WHERE id = ?",
                String.class, id)).isEqualTo("Empresa Exemplo");
        assertThat(jdbc.queryForObject(
                "SELECT segment FROM vozly.interest_submissions WHERE id = ?",
                String.class, id)).isEqualTo("assistencia");
        assertThat(jdbc.queryForObject(
                "SELECT email FROM vozly.interest_submissions WHERE id = ?",
                String.class, id)).isEqualTo("contato@empresa.com");
    }

    @Test
    void acceptsOnlyTheSegmentValuesPresentInTheFrontend() {
        var valid = new InterestController.InterestRequest(
                "Empresa Exemplo", "clinica", "contato@empresa.com");
        var invalid = new InterestController.InterestRequest(
                "Empresa Exemplo", "segmento-inventado", "contato@empresa.com");

        assertThat(validator.validate(valid)).isEmpty();
        assertThat(validator.validate(invalid))
                .anySatisfy(error -> assertThat(error.getPropertyPath().toString()).isEqualTo("segment"));
    }

    @Test
    void requiresTheSameThreeFieldsDisplayedByTheFrontend() {
        var invalid = new InterestController.InterestRequest("", "assistencia", "email-invalido");

        assertThat(validator.validate(invalid))
                .extracting(error -> error.getPropertyPath().toString())
                .contains("company", "email");
    }
}
