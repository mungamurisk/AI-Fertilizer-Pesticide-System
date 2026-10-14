package fertilizer_pesticide_system.controller;

import fertilizer_pesticide_system.Fertilizer;
import fertilizer_pesticide_system.service.FertilizerService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fertilizers")
public class FertilizerController {

    private final FertilizerService fertilizerService;

    public FertilizerController(FertilizerService fertilizerService) {
        this.fertilizerService = fertilizerService;
    }

    @PostMapping
    public Fertilizer addFertilizer(@RequestBody Fertilizer fertilizer) {
        return fertilizerService.saveFertilizer(fertilizer);
    }

    @GetMapping
    public List<Fertilizer> getAllFertilizers() {
        return fertilizerService.getAllFertilizers();
    }
}