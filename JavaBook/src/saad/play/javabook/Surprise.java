package saad.play.javabook;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;

public class Surprise extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		Intent intent = new Intent();
		intent.setClass(this, NasaActivity.class);
		if (Math.random() > 0.5) {
			intent.setClass(this, MainActivity.class);
		}
		startActivity(intent);
		finish();
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.surprise, menu);
		return true;
	}

}
