package amazing.play.worldwar;

import android.app.Activity;
import android.content.Intent;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.WebView;

public class Jabberwocky extends Activity {
	MediaPlayer scary;
	WebView myWebView;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_jabberwocky);
		myWebView = (WebView) findViewById(R.id.webView1);
		myWebView.loadUrl("file:///android_asset/webcontent/jabberwocky.html");
		myWebView.getSettings().setBuiltInZoomControls(true);
	}

	// For mp3 file

	@Override
	protected void onResume() {

		scary = MediaPlayer.create(this, R.raw.scary);
		scary.setLooping(true);
		scary.start();
		super.onResume();
	}

	@Override
	protected void onPause() {
		scary.stop();
		super.onPause();
	}

	// For Buttons

	public void openPIC(View v) {
		WebView webview = (WebView) findViewById(R.id.webView1);
		webview.getSettings().setBuiltInZoomControls(true);
		webview.loadUrl("file:///android_asset/jabberwocky.jpg");
	}

	public void openWP(View v) {
		String url = "http://en.wikipedia.org/wiki/Jabberwocky";
		Intent i = new Intent(Intent.ACTION_VIEW);
		i.setData(Uri.parse(url));
		startActivity(i);
	}

	// For back button

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if ((keyCode == KeyEvent.KEYCODE_BACK) && myWebView.canGoBack()) {
			myWebView.goBack();
			return true;
		}
		return super.onKeyDown(keyCode, event);
	}

}
