
package fertilizer_pesticide_system.controller;

import fertilizer_pesticide_system.FarmerAccount;
import fertilizer_pesticide_system.service.FarmerAccountService;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/farmers")
@CrossOrigin(
    origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    },
    allowCredentials = "true"
)
public class FarmerAccountController {

    private final FarmerAccountService farmerService;

    public FarmerAccountController(
            FarmerAccountService farmerService) {
        this.farmerService = farmerService;
    }

    public record SignupRequest(
            String fullName,
            String email,
            String phone,
            String village,
            String password) {
    }

    public record LoginRequest(
            String email,
            String password) {
    }

    public record FarmerResponse(
            Long id,
            String fullName,
            String email,
            String phone,
            String village) {

        public static FarmerResponse from(FarmerAccount farmer) {
            return new FarmerResponse(
                    farmer.getId(),
                    farmer.getFullName(),
                    farmer.getEmail(),
                    farmer.getPhone(),
                    farmer.getVillage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody SignupRequest request) {
        try {
            FarmerAccount farmer = farmerService.registerFarmer(
                    request.fullName(),
                    request.email(),
                    request.phone(),
                    request.village(),
                    request.password());

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Account created successfully.",
                            "farmer", FarmerResponse.from(farmer)));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpSession session) {
        try {
            FarmerAccount farmer = farmerService.loginFarmer(
                    request.email(),
                    request.password());

            // Store the verified farmer ID on the server.
            session.setAttribute("farmerId", farmer.getId());
            System.out.println("LOGIN SESSION ID: " + session.getId());
            System.out.println("LOGIN FARMER ID: " + session.getAttribute("farmerId")); 

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Login successful.",
                            "farmer", FarmerResponse.from(farmer)));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentFarmer(HttpSession session) {
        Object farmerId = session.getAttribute("farmerId");
        System.out.println("CHECK SESSION ID: " + session.getId());
        System.out.println("CHECK FARMER ID: " + farmerId);

        if (farmerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("message", "Please log in first."));
        }

        return ResponseEntity.ok(
                Map.of("farmerId", farmerId));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully."));
    }
}