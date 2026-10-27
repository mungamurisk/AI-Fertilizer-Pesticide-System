package fertilizer_pesticide_system.controller;

import fertilizer_pesticide_system.dto.MlPredictionRequest;
import fertilizer_pesticide_system.dto.MlPredictionResponse;
import fertilizer_pesticide_system.service.MlPredictionService;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/ml")
public class MlPredictionController {

    private final MlPredictionService mlPredictionService;

    public MlPredictionController(
            MlPredictionService mlPredictionService) {
        this.mlPredictionService = mlPredictionService;
    }

    @PostMapping("/predict")
    public MlPredictionResponse predict(
            @RequestBody MlPredictionRequest request) {
        return mlPredictionService.predict(request);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handlePredictionError(
            ResponseStatusException exception) {
        return ResponseEntity
                .status(exception.getStatusCode())
                .body(Map.of(
                        "message",
                        exception.getReason() != null
                                ? exception.getReason()
                                : "Fertilizer prediction failed."));
    }
}
