package fertilizer_pesticide_system.service;

import java.util.List;

import org.springframework.stereotype.Service;

import fertilizer_pesticide_system.model.Farmer;
import fertilizer_pesticide_system.repository.FarmerRepository;

@Service
public class FarmerService {

    private final FarmerRepository farmerRepository;

    public FarmerService(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }

    public Farmer saveFarmer(Farmer farmer) {
        return farmerRepository.save(farmer);
    }

    public List<Farmer> getAllFarmers() {
        return farmerRepository.findAll();
    }

    public Farmer getFarmerById(Long id) {
        return farmerRepository.findById(id).orElse(null);
    }

    public void deleteFarmer(Long id) {
        farmerRepository.deleteById(id);
    }
}