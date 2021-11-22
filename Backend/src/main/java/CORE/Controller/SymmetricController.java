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

@CrossOrigin(origins = "*")
@RestController
public class SymmetricController {


    @PostMapping(value = "/symmetric/generateKey")
    public Object generateKey(@RequestBody GetKeyDTO payload) throws Exception {
        int keySize = payload.getKeySize();
        String algorithm = payload.getAlgorithm();

        Key key = new Symmetric().generateKey(keySize, algorithm);
        String keyBa64 = Utility.keyToBase64(key);
        ResponseDTO res = new ResponseDTO("base64", keyBa64);
        return new ResponseEntity(res, HttpStatus.OK);
    }

    @PostMapping(value = "/symmetric/crypto-text")
    public Object cryptoText(@RequestBody CryptoDTO payload) throws Exception {
        String encrypted = new Symmetric(payload.getMode(), payload.getKey(),
                payload.getModeOperation(), payload.getPadding()
                , payload.getAlgorithm(), payload.getIv()).doCryptoText(payload.getData());
        ResponseDTO res = new ResponseDTO("base64", encrypted);
        return new ResponseEntity(res, HttpStatus.OK);
    }

    @PostMapping(value = "/symmetric/crypto-file")
    public Object cryptoFile(@RequestBody CryptoDTO payload) throws Exception {

        String fileName = null;
        if (payload.getMode() == 1) {
            fileName =  payload.getData()+".ENCRYPTED";
        } else {
            fileName = "DECRYPTED-" + payload.getData();
        }
        new Symmetric(payload.getMode(),
                payload.getKey(),
                payload.getModeOperation(),
                payload.getPadding(),
                payload.getAlgorithm(),
                payload.getIv()).doCryptoFile(new File(ENV.pathMedia + payload.getData()), new File(ENV.pathMedia + fileName));

        ResponseDTO res = new ResponseDTO("link", "/files/" + fileName);
        return new ResponseEntity(res, HttpStatus.OK);

    }
}

