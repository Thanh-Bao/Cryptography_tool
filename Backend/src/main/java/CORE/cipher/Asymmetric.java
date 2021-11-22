package CORE.cipher;

import CORE.DTO.KeyPairDTO;
import CORE.Utility;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class Asymmetric {

    private int cipherMode;
    private Key key;
    private Cipher cipher;

    public Asymmetric(){};

    public Asymmetric(int cipherMode, String publicOrPrivateKeyBase64, String modeOperation, String padding, String algorithm) throws Exception {
        this.cipherMode = cipherMode;
        cipher = Cipher.getInstance(algorithm+"/"+modeOperation+"/"+padding);
         try {
             key = base64ToPrivateKey(publicOrPrivateKeyBase64);
         } catch (Exception e){
             key = base64ToPublicKey(publicOrPrivateKeyBase64);
         }
            cipher.init(cipherMode,  key);
    }

    public static PublicKey base64ToPublicKey(String keyBase64) throws Exception {
            byte[] byteKey = Base64.getDecoder().decode(keyBase64);
            X509EncodedKeySpec X509publicKey = new X509EncodedKeySpec(byteKey);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePublic(X509publicKey);
    }

    public static PrivateKey base64ToPrivateKey(String keyBase64) throws Exception {
        byte[] byteKey = Base64.getDecoder().decode(keyBase64);
        PKCS8EncodedKeySpec ks = new PKCS8EncodedKeySpec(byteKey);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(ks);
    }

    public KeyPairDTO generateKey(int keySize, String algorithm) throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance(algorithm);
        keyGen.initialize(keySize);
        KeyPair keyPair = keyGen.generateKeyPair();
        String publicKey = Utility.keyToBase64(keyPair.getPublic());
        String privateKey = Utility.keyToBase64(keyPair.getPrivate());
        KeyPairDTO keyPairDTO = new KeyPairDTO(publicKey,privateKey);
        return  keyPairDTO;
    }

    public String doCryptoText( String data) throws Exception {
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

    static private Base64.Encoder encoder = Base64.getEncoder();
    static SecureRandom srandom = new SecureRandom();

    static private void processFile(Cipher ci, InputStream in, OutputStream out)
            throws javax.crypto.IllegalBlockSizeException,
            javax.crypto.BadPaddingException,
            IOException
    {
        byte[] ibuf = new byte[1024];
        int len;
        while ((len = in.read(ibuf)) != -1) {
            byte[] obuf = ci.update(ibuf, 0, len);
            if ( obuf != null ) out.write(obuf);
        }
        byte[] obuf = ci.doFinal();
        if ( obuf != null ) out.write(obuf);
    }

    static public void doEncryptRSAWithAES(String publicKeyBase64, File inputFile, File outputFile) throws Exception
    {
        PublicKey publicKey = base64ToPublicKey(publicKeyBase64);

        KeyGenerator kgen = KeyGenerator.getInstance("AES");
        kgen.init(128);
        SecretKey skey = kgen.generateKey();

        byte[] iv = new byte[128/8];
        srandom.nextBytes(iv);
        IvParameterSpec ivspec = new IvParameterSpec(iv);

        try (FileOutputStream out = new FileOutputStream(outputFile)) {
            {
                Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
                cipher.init(Cipher.ENCRYPT_MODE, publicKey );
                byte[] b = cipher.doFinal(skey.getEncoded());
                out.write(b);
            }
            out.write(iv);
            Cipher ci = Cipher.getInstance("AES/CBC/PKCS5Padding");
            ci.init(Cipher.ENCRYPT_MODE, skey, ivspec);
            try (FileInputStream in = new FileInputStream(inputFile)) {
                processFile(ci, in, out);
            }
        }
    }

    static public void doDecryptRSAWithAES(String privateKeyBase64, File inputFile, File outputFile) throws Exception
    {
        PrivateKey privateKey = base64ToPrivateKey(privateKeyBase64);

        try (FileInputStream in = new FileInputStream(inputFile)) {
            SecretKeySpec skey = null;
            {
                Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
                cipher.init(Cipher.DECRYPT_MODE, privateKey);
                byte[] b = new byte[128];
                in.read(b);
                byte[] keyb = cipher.doFinal(b);
                skey = new SecretKeySpec(keyb, "AES");
            }

            byte[] iv = new byte[128/8];
            in.read(iv);
            IvParameterSpec ivspec = new IvParameterSpec(iv);

            Cipher ci = Cipher.getInstance("AES/CBC/PKCS5Padding");
            ci.init(Cipher.DECRYPT_MODE, skey, ivspec);

            try (FileOutputStream out = new FileOutputStream(outputFile)){
                processFile(ci, in, out);
            }
        }
    }
}
