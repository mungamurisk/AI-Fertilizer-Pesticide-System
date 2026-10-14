
package fertilizer_pesticide_system.service;

import fertilizer_pesticide_system.FarmerAccount;
import fertilizer_pesticide_system.repository.FarmerAccountRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class FarmerAccountService {

    private final FarmerAccountRepository farmerRepository;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public FarmerAccountService(
            FarmerAccountRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }

    public FarmerAccount registerFarmer(
            String fullName,
            String email,
            String phone,
            String village,
            String password) {

        if (fullName == null || fullName.isBlank()
                || email == null || email.isBlank()
                || phone == null || !phone.matches("\\d{10}")
                || village == null || village.isBlank()
                || password == null || password.length() < 8) {
            throw new IllegalArgumentException(
                    "Enter valid details. Phone must contain 10 digits "
                    + "and password must have at least 8 characters.");
        }

        String normalizedEmail = email.trim().toLowerCase();

        if (farmerRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists.");
        }

        FarmerAccount farmer = new FarmerAccount();
        farmer.setFullName(fullName.trim());
        farmer.setEmail(normalizedEmail);
        farmer.setPhone(phone);
        farmer.setVillage(village.trim());

        // Store the BCrypt hash, never the original password.
        farmer.setPasswordHash(passwordEncoder.encode(password));

        return farmerRepository.save(farmer);
    }

    public FarmerAccount loginFarmer(
            String email, String password) {

        if (email == null || password == null) {
            throw new IllegalArgumentException(
                    "Email and password are required.");
        }

        FarmerAccount farmer = farmerRepository
                .findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid email or password."));

        if (!passwordEncoder.matches(
                password, farmer.getPasswordHash())) {
            throw new IllegalArgumentException(
                    "Invalid email or password.");
        }

        return farmer;
    }
}
