package fahd.play.photo;

public class Photo {
    private int iv1;
    private int iv2;
    private int iv3;
    private int iv4;
 
    public Photo(int iv1, int iv2, int iv3, int iv4) {
                //The constructor takes the ids of three images and initiliases them
        super();
        this.iv1 = iv1;
        this.iv2 = iv2;
        this.iv3 = iv3;
        this.iv4 = iv4;
    }
 
    public int getIv1() {
        return iv1;
    }
 
    public void setIv1(int iv1) {
        this.iv1 = iv1;
    }
 
    public int getIv2() {
        return iv2;
    }
 
    public void setIv2(int iv2) {
        this.iv2 = iv2;
    }
 
    public int getIv3() {
        return iv3;
    }
 
    public void setIv3(int iv3) {
        this.iv3 = iv3;
    }
 
    public int getIv4() {
        return iv4;
    }
 
    public void setIv4(int iv4) {
        this.iv4 = iv4;
    }
 
}