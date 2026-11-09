package com.vozly;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class VozlyApplicationTests {

    @Autowired
    private HealthEndpoint healthEndpoint;

    @Test
    void contextLoads() {
        assertThat(healthEndpoint).isNotNull();
    }

    @Test
    void healthEndpointReportsApplicationAsUp() {
        Health health = healthEndpoint.health();

        assertThat(health.getStatus().getCode()).isEqualTo("UP");
    }
}
