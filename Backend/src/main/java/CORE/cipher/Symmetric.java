package CORE.cipher;

import CORE.Utility;

import java.io.*;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;

public class Symmetric {

    // Cipher.DECRYPT_MODE=2   Cipher.ENCRYPT_MODE=1
    public static String doCryptoText(int cipherMode, String keyBase64, String modeOperation, String padding, String algorithm, String iv, String data) throws Exception {
        Key key = Utility.Base64ToKey(keyBase64, algorithm);
        Cipher cipher = Cipher.getInstance(algorithm+"/"+modeOperation+"/"+padding);
        if(modeOperation.equals("ECB")){
            cipher.init(cipherMode, key);
        } else {
            cipher.init(cipherMode, key, new IvParameterSpec(iv.getBytes()));
        }
        byte[] encVal = null;
        String result = null;
        if (cipherMode == 1) {
            encVal = cipher.doFinal(data.getBytes());
            result = Utility.byteArrToBASE64(encVal);
        } else {
            encVal = cipher.doFinal(Utility.BASE64ToByteArr(data));
            result = new String(encVal);
        }
        return result;
    }

    // Cipher.DECRYPT_MODE=2   Cipher.ENCRYPT_MODE=1
    public static boolean doCryptoFile(int cipherMode, String keyBase64,String modeOperation, String padding, String algorithm, String iv, File inputFile, File outputFile) throws Exception {
        FileInputStream fileInputStream = new FileInputStream(inputFile);
        FileOutputStream fileOutputStream = new FileOutputStream(outputFile);
        final byte[] BUFFER = new byte[1024];
        int bytesRead;
        try {
            Key key = Utility.Base64ToKey(keyBase64, algorithm);
            Cipher cipher = Cipher.getInstance(algorithm+"/"+modeOperation+"/"+padding);
            if(modeOperation.equals("ECB")){
                cipher.init(cipherMode, key);
            } else {
                cipher.init(cipherMode, key, new IvParameterSpec(iv.getBytes()));
            }
            while ((bytesRead = fileInputStream.read(BUFFER)) != -1) {
                byte[] output = cipher.update(BUFFER, 0, bytesRead);
                if (output != null) {
                    fileOutputStream.write(output);
                }
            }
            byte[] outputBytes = cipher.doFinal(BUFFER);
            if (outputBytes != null) {
                fileOutputStream.write(outputBytes);
            }
            return true;
        } catch (Exception e){
            e.printStackTrace();
            return false;
        } finally {
            fileInputStream.close();
            fileOutputStream.flush();
            fileOutputStream.close();
        }
    }
}
// cipher.getBlockSize()  RC5, DES, blowfish => blockSize = 8
// cipher.getBlockSize() AES, twofish, serpent => blockSize = 16

