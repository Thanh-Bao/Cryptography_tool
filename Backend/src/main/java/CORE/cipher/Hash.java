package CORE.cipher;

import CORE.Utility;

import javax.xml.bind.DatatypeConverter;

import java.io.*;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Hash {

    public static String hashText(String data, String algorithm) throws Exception {
        String hashValue = null;
        MessageDigest messageDigest = MessageDigest.getInstance(algorithm);
        byte[] outputBytes = messageDigest.digest(data.getBytes());
        hashValue = DatatypeConverter.printHexBinary(outputBytes).toLowerCase();
        return hashValue;
    }

    public static String hashFile( File file, String algorithm) throws Exception {
        FileInputStream fileInputStream = new FileInputStream(file);
        MessageDigest digest = MessageDigest.getInstance(algorithm);
        DigestInputStream dis = new DigestInputStream(fileInputStream,digest);

        final byte[] BUFFER = new byte[1024];

        int bytesRead = dis.read(BUFFER);
        try {
            while (bytesRead != -1) {
                bytesRead = dis.read(BUFFER);
            }
            return DatatypeConverter.printHexBinary(dis.getMessageDigest().digest()).toLowerCase();
        } catch (Exception e) {
            throw new Exception("Loi hash file");
        } finally {
            fileInputStream.close();
        }
    }
}
