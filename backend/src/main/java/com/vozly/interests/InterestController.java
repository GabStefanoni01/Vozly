package com.vozly.interests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interests")
public class InterestController {
    private final InterestService interestService;

    public InterestController(InterestService interestService) {
        this.interestService = interestService;
    }

    @PostMapping
    public ResponseEntity<InterestResponse> register(@Valid @RequestBody InterestRequest request) {
        UUID id = interestService.register(request.company(), request.segment(), request.email());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new InterestResponse(id, "RECEIVED"));
    }

    public record InterestRequest(
            @NotBlank @Size(max = 160) String company,
            @NotBlank
            @Size(max = 24) @Pattern(regexp = "assistencia|clinica|oficina|manutencao|servicos|outros")
            String segment,
            @NotBlank @Email @Size(max = 320) String email) {}

    public record InterestResponse(UUID id, String status) {}
}
