package CORE.Controller;

import CORE.DTO.CryptoDTO;
import CORE.DTO.GetKeyDTO;
import CORE.DTO.ResponseDTO;
import CORE.Utility;
import CORE.cipher.Symmetric;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

@RestController
public class SymmetricControllers {

    //@CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(value = "/symmetric/generateKey", produces = MediaType.APPLICATION_JSON_VALUE)
    public Object generateKey(@RequestBody GetKeyDTO payload) throws NoSuchAlgorithmException {
        int keySize = payload.getKeySize();
        String algorithm = payload.getAlgorithm();

        Key key = Utility.generateKey(keySize, algorithm);
        String keyBa64 = Utility.keyToBase64(key);
        ResponseDTO res = new ResponseDTO("base64", keyBa64);
        return new ResponseEntity<ResponseDTO>(res, HttpStatus.OK);
    }

    @PostMapping(value = "/symmetric/crypto-text")
    public Object cryptoText(@RequestBody CryptoDTO payload) throws Exception {
        String encrypted = Symmetric.doCryptoText(payload.getMode(), payload.getKey(), payload.getData(), payload.getAlgorithm());
        ResponseDTO res = new ResponseDTO("base64", encrypted);
        return new ResponseEntity<ResponseDTO>(res, HttpStatus.OK);
    }
}

