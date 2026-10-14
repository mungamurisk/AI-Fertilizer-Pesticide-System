package fertilizer_pesticide_system.service;

import java.util.List;

import org.springframework.stereotype.Service;

import fertilizer_pesticide_system.Fertilizer;
import fertilizer_pesticide_system.repository.FertilizerRepository;

@Service
public class FertilizerService {

    private final FertilizerRepository fertilizerRepository;

    public FertilizerService(FertilizerRepository fertilizerRepository) {
        this.fertilizerRepository = fertilizerRepository;
    }

    public Fertilizer saveFertilizer(Fertilizer fertilizer) {
        return fertilizerRepository.save(fertilizer);
    }

    public List<Fertilizer> getAllFertilizers() {
        return fertilizerRepository.findAll();
    }
}