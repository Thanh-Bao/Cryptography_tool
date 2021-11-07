package CORE.Controller;

import CORE.DTO.CryptoDTO;
import CORE.DTO.GetKeyDTO;
import CORE.DTO.ResponseDTO;
import CORE.ENV;
import CORE.Utility;
import CORE.cipher.Symmetric;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
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
        String encrypted = Symmetric.doCryptoText(payload.getMode(), payload.getKey(),
                payload.getModeOperation(), payload.getPadding()
                , payload.getAlgorithm(),payload.getData());
        ResponseDTO res = new ResponseDTO("base64", encrypted);
        return new ResponseEntity<ResponseDTO>(res, HttpStatus.OK);
    }

    @PostMapping(value = "/symmetric/crypto-file")
    public Object cryptoFile(@RequestBody CryptoDTO payload) throws Exception {
System.out.println(payload);
        String fileName = "ENCRYPTED-"+payload.getData();
        Boolean result = Symmetric.doCryptoFile(payload.getMode(),
        payload.getKey(),payload.getModeOperation(), payload.getPadding(),
        payload.getAlgorithm(), new File(ENV.pathMedia+payload.getData()), new File(ENV.pathMedia+ fileName));
        if(result){
            ResponseDTO res = new ResponseDTO("link", "/files/"+fileName);
            return new ResponseEntity<ResponseDTO>(res, HttpStatus.OK);
        } else {
            throw new Exception("Loi ma hoa/ giai ma file");
        }
    }
}

