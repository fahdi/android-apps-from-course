package amazing.play.worldwar;

import android.os.Bundle;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.Menu;
import android.webkit.WebView;

@SuppressLint("SetJavaScriptEnabled")
public class Roundball extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_roundball);

		WebView myWebView = (WebView) findViewById(R.id.webView1);
		myWebView.loadUrl("file:///android_asset/webcontent/roundball/roundball.html");
		myWebView.getSettings().setBuiltInZoomControls(true);
		myWebView.getSettings().setJavaScriptEnabled(true);
		myWebView.getSettings().setDomStorageEnabled(true);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.roundball, menu);
		return true;
	}

}
