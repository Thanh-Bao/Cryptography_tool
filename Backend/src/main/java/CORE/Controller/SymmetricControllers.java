package CORE.Controller;

import CORE.DTO.CryptoDTO;
import CORE.DTO.GetKeyDTO;
import CORE.DTO.ResponseDTO;
import CORE.Utility;
import CORE.cipher.Symmetric;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

@RestController
public class SymmetricControllers {

    @PostMapping(value = "/symmetric/generateKey",produces= MediaType.APPLICATION_JSON_VALUE)
    public Object generateKey(@RequestBody GetKeyDTO payload) throws NoSuchAlgorithmException {
        int keySize =  payload.getKeySize();
        String algorithm = payload.getAlgorithm();

        Key key = Utility.generateKey(keySize,algorithm);
        String keyBa64 = Utility.keyToBase64(key);
        ResponseDTO res = new ResponseDTO("base64", keyBa64 );
        return new ResponseEntity<ResponseDTO>(res, HttpStatus.OK);
    }

    @GetMapping(value = "/symmetric/crypto-text")
    public Object cryptoText(@RequestBody CryptoDTO payload) throws Exception {
        String encrypted = Symmetric.doCryptoText(payload.getMode(),payload.getKey(),payload.getData(),payload.getAlgorithm()) ;
        return new ResponseEntity<String>(encrypted, HttpStatus.OK) ;
    }
}

