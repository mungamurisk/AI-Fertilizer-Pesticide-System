package fertilizer_pesticide_system.service;

import fertilizer_pesticide_system.dto.MlPredictionRequest;
import fertilizer_pesticide_system.dto.MlPredictionResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MlPredictionService {

    private static final Logger logger =
            LoggerFactory.getLogger(MlPredictionService.class);

    private final RestTemplate restTemplate = new RestTemplate();
    private final String mlApiUrl;

    public MlPredictionService(
            @Value("${ml.api.url:http://127.0.0.1:5000/predict}")
            String mlApiUrl) {
        this.mlApiUrl = mlApiUrl;
    }

    public MlPredictionResponse predict(MlPredictionRequest request) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<MlPredictionRequest> entity =
                new HttpEntity<>(request, headers);

        try {
            ResponseEntity<MlPredictionResponse> response =
                    restTemplate.exchange(
                            mlApiUrl,
                            HttpMethod.POST,
                            entity,
                            MlPredictionResponse.class
                    );

            MlPredictionResponse prediction = response.getBody();
            if (prediction == null
                    || prediction.getFertilizer() == null
                    || prediction.getFertilizer().isBlank()) {
                logger.error("ML service returned no fertilizer at {}", mlApiUrl);
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "The fertilizer ML service returned an empty prediction.");
            }

            return prediction;
        } catch (ResourceAccessException exception) {
            logger.error("Could not reach fertilizer ML service at {}", mlApiUrl, exception);
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Fertilizer ML service is unavailable. Start the Python service and retry.",
                    exception);
        } catch (RestClientResponseException exception) {
            logger.error(
                    "Fertilizer ML service at {} returned HTTP {}",
                    mlApiUrl,
                    exception.getStatusCode(),
                    exception);
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Fertilizer ML service rejected the prediction request (HTTP "
                            + exception.getStatusCode().value() + ").",
                    exception);
        } catch (RestClientException exception) {
            logger.error("Fertilizer ML request failed at {}", mlApiUrl, exception);
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Could not process the response from the fertilizer ML service.",
                    exception);
        }
    }
}