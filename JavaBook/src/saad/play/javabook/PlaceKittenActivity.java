package saad.play.javabook;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;

public class PlaceKittenActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.place_kitten);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.place_kitten, menu);
		return true;
	}

}
