package CORE.Controller;

import CORE.DTO.CryptoDTO;
import CORE.DTO.GetKeyDTO;
import CORE.DTO.KeyPairDTO;
import CORE.DTO.ResponseDTO;
import CORE.ENV;
import CORE.Utility;
import CORE.cipher.Asymmetric;
import CORE.cipher.Symmetric;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.security.Key;

@CrossOrigin(origins = "*")
@RestController
public class AsymmetricController {

    @PostMapping(value = "/asymmetric/generateKey")
    public Object generateKey(@RequestBody GetKeyDTO payload) throws Exception {
        int keySize = payload.getKeySize();
        String algorithm = payload.getAlgorithm();
        KeyPairDTO key = new Asymmetric().generateKey(keySize,algorithm);
        return new ResponseEntity(key, HttpStatus.OK);
    }

    @PostMapping(value = "/asymmetric/crypto-text")
    public Object cryptoText(@RequestBody CryptoDTO payload) throws Exception {
        String encrypted = new Asymmetric(payload.getMode(), payload.getKey(),
                payload.getModeOperation(), payload.getPadding()
                , payload.getAlgorithm()).doCryptoText(payload.getData());
        ResponseDTO res = new ResponseDTO("base64", encrypted);
        return new ResponseEntity(res, HttpStatus.OK);
    }

    @PostMapping(value = "/asymmetric/encrypt-file")
    public Object encryptFile(@RequestBody CryptoDTO payload) throws Exception {
        String fileName =  payload.getData()+"._ENCRYPTED_";
        Asymmetric.doEncryptRSAWithAES(payload.getKey(),new File(ENV.pathMedia + payload.getData()), new File(ENV.pathMedia + fileName));
        ResponseDTO res = new ResponseDTO("link", "/files/" + fileName);
        return new ResponseEntity(res, HttpStatus.OK);
    }

    @PostMapping(value = "/asymmetric/decrypt-file")
    public Object decryptFile(@RequestBody CryptoDTO payload) throws Exception {
        String fileName = "DECRYPTED-"+payload.getData();
        Asymmetric.doDecryptRSAWithAES(payload.getKey(),new File(ENV.pathMedia + payload.getData()), new File(ENV.pathMedia + fileName));
        ResponseDTO res = new ResponseDTO("link", "/files/" + fileName);
        return new ResponseEntity(res, HttpStatus.OK);
    }
}
