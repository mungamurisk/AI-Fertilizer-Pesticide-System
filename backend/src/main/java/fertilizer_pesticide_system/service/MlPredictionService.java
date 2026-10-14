package fertilizer_pesticide_system.service;

import fertilizer_pesticide_system.dto.MlPredictionRequest;
import fertilizer_pesticide_system.dto.MlPredictionResponse;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MlPredictionService {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String ML_API_URL =
            "http://127.0.0.1:5000/predict";

    public MlPredictionResponse predict(MlPredictionRequest request) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<MlPredictionRequest> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<MlPredictionResponse> response =
                restTemplate.exchange(
                        ML_API_URL,
                        HttpMethod.POST,
                        entity,
                        MlPredictionResponse.class
                );

        return response.getBody();
    }
}