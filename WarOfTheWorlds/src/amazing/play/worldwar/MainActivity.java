package amazing.play.worldwar;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Menu;
import android.webkit.WebView;

public class MainActivity extends Activity {

	WebView myWebView;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		myWebView = (WebView) findViewById(R.id.webView1);
		myWebView.loadUrl("file:///android_asset/webcontent/waroftheworlds.html");
		myWebView.getSettings().setBuiltInZoomControls(true);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if ((keyCode == KeyEvent.KEYCODE_BACK) && myWebView.canGoBack()) {
			myWebView.goBack();
			return true;
		}
		return super.onKeyDown(keyCode, event);
	}

}
