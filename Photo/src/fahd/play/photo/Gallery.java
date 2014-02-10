package fahd.play.photo;

import java.util.ArrayList;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ListView;

public class Gallery extends Activity{

   ListView gallery;
   ArrayList<Photo> row = new ArrayList<Photo>();

   protected void onCreate(Bundle icicle){
       super.onCreate(icicle);
       setContentView(R.layout.gallery);
        
       gallery = (ListView) findViewById(R.id.lvdata);
        
       init();
        
       gallery.setAdapter(new PhotoAdapter(getBaseContext(), row));
   }
    
   private void init(){
        
       Photo p1 = new Photo(R.drawable.p1, R.drawable.p2, R.drawable.p3, R.drawable.p4);
       Photo p2 = new Photo(R.drawable.p5, R.drawable.p6, R.drawable.p7, R.drawable.p8);
       Photo p3 = new Photo(R.drawable.p9, R.drawable.p10, R.drawable.p11, R.drawable.p12);
        
       row.add(p1);
       row.add(p2);
       row.add(p3);
       row.add(p2);
       row.add(p1);
       row.add(p3);
       row.add(p2);
        
        
   }
}