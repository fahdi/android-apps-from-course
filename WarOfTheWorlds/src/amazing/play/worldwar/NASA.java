package amazing.play.worldwar;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.webkit.WebView;

public class NASA extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		WebView myWebView = (WebView) findViewById(R.id.webView1);
		myWebView.loadUrl("file:///android_asset/webcontent/uofi-at-nasa.html");
		myWebView.getSettings().setBuiltInZoomControls(true);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.na, menu);
		return true;
	}

}
