package fertilizer_pesticide_system.controller;

import fertilizer_pesticide_system.Pesticide;
import fertilizer_pesticide_system.service.PesticideService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pesticides")
@CrossOrigin(origins = "*")
public class PesticideController {

    private final PesticideService pesticideService;

    public PesticideController(PesticideService pesticideService) {
        this.pesticideService = pesticideService;
    }

    @PostMapping
    public Pesticide addPesticide(@RequestBody Pesticide pesticide) {
        return pesticideService.savePesticide(pesticide);
    }

    @GetMapping
    public List<Pesticide> getAllPesticides() {
        return pesticideService.getAllPesticides();
    }
}