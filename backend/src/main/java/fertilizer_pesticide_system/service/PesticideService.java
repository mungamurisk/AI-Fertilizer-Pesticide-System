package fertilizer_pesticide_system.service;

import fertilizer_pesticide_system.Pesticide;
import fertilizer_pesticide_system.repository.PesticideRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PesticideService {

    private final PesticideRepository pesticideRepository;

    public PesticideService(PesticideRepository pesticideRepository) {
        this.pesticideRepository = pesticideRepository;
    }

    public Pesticide savePesticide(Pesticide pesticide) {
        return pesticideRepository.save(pesticide);
    }

    public List<Pesticide> getAllPesticides() {
        return pesticideRepository.findAll();
    }
}