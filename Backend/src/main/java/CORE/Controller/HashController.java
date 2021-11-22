package CORE.Controller;

import CORE.DTO.CryptoDTO;
import CORE.DTO.ResponseDTO;
import CORE.cipher.Hash;
import CORE.cipher.Symmetric;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
public class HashController {
    @PostMapping(value = "/hash-text")
    public Object cryptoText(@RequestBody CryptoDTO payload) throws Exception {
        String hashValue = Hash.hashText(payload.getData(),payload.getAlgorithm());
        ResponseDTO res = new ResponseDTO("base64", hashValue);
        return new ResponseEntity<ResponseDTO>(res, HttpStatus.OK);
    }
}
