package CORE.cipher;

import CORE.Utility;

import java.io.*;
import java.security.Key;
import javax.crypto.Cipher;

public class Symmetric {

    // Cipher.DECRYPT_MODE=2   Cipher.ENCRYPT_MODE=1
    public static String doCryptoText(int cipherMode, String keyBase64, String modeOperation, String padding, String algorithm,String data) throws Exception {
        Key key = Utility.Base64ToKey(keyBase64, algorithm);
        Cipher c = Cipher.getInstance(algorithm+"/"+modeOperation+"/"+padding);
        c.init(cipherMode, key);

        byte[] encVal = null;
        String result = null;
        if (cipherMode == 1) {
            encVal = c.doFinal(data.getBytes());
            result = Utility.byteArrToBASE64(encVal);
        } else {
            encVal = c.doFinal(Utility.BASE64ToByteArr(data));
            result = new String(encVal);
        }
        return result;
    }

    // Cipher.DECRYPT_MODE=2   Cipher.ENCRYPT_MODE=1
    public static boolean doCryptoFile(int cipherMode, String keyBase64,String modeOperation, String padding, String algorithm, File inputFile, File outputFile){
        try {
            Key key = Utility.Base64ToKey(keyBase64, algorithm);
            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(cipherMode, key);

            FileInputStream fileInputStream = new FileInputStream(inputFile);
            FileOutputStream fileOutputStream = new FileOutputStream(outputFile);
            byte[] inputBytes = new byte[(int) inputFile.length()];
            fileInputStream.read(inputBytes);
            int bytesRead;

            while ((bytesRead = fileInputStream.read(inputBytes)) != -1) {
                byte[] output = cipher.update(inputBytes, 0, bytesRead);
                if (output != null) {
                    fileOutputStream.write(output);
                }
            }
            byte[] outputBytes = cipher.doFinal(inputBytes);
            if (outputBytes != null) {
                fileOutputStream.write(outputBytes);
            }

            fileInputStream.close();
            fileOutputStream.flush();
            fileOutputStream.close();

            return true;
        } catch (Exception e){
            return false;
        }
    }
}

