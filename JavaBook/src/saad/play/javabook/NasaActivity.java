package saad.play.javabook;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;
import android.webkit.WebView;

public class NasaActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		//Find that webView1
				WebView myWebView = (WebView) findViewById(R.id.webView1);
				//Now we open asset/index.html
				myWebView.loadUrl("file:///android_asset/nasa.htm");
				myWebView.getSettings().setBuiltInZoomControls(true);
//			    Currently we didn't use any scripting
		// So,	myWebView.getSettings().setJavaScriptEnabled(true);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.nasa, menu);
		return true;
	}

}
