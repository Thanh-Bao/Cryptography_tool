package CORE.Controller;

import java.io.File;
import java.io.IOException;

import CORE.Utility;
import CORE.cipher.Symmetric;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class FileUploadController {

    @PostMapping("/uploadFile")
    public ResponseEntity<Object> fileUpload(@RequestParam("File") MultipartFile file) throws IOException{
        String messageValidateFile = Utility.storeFile(file);
        if(messageValidateFile!=null){
            return new ResponseEntity<Object>(messageValidateFile, HttpStatus.BAD_REQUEST) ;
        }
        return new ResponseEntity<Object>("Upload thành công!", HttpStatus.OK);
    }

    @PostMapping("/test")
    public  String test(){
        Symmetric.encryptFile("bjJyNXU4eC9BJUQqRy1LYVBkU2dWa1lwM3M2djl5JEI=", new File("C:\\GGG.PNG"),new File("C:\\HHH.PNG"));
        Symmetric.decryptFile("bjJyNXU4eC9BJUQqRy1LYVBkU2dWa1lwM3M2djl5JEI=", new File("C:\\HHH.PNG"),new File("C:\\YYY.PNG"));
        return "TESTING";
    }



}