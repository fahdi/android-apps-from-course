/*
Copyright (c) 2014 Lawrence Angrave

Dual licensed under Apache2.0 and MIT Open Source License (included below): 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
package apps101.Imagen;

import android.app.Activity;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.TextView;

public class MainActivity extends Activity implements OnClickListener {

	private static final String CLICK = "Click!";
	private static final String TAG = MainActivity.class.getSimpleName();
	// A preference key
	private static final String KEY_COUNT = "count";
	
	private SharedPreferences mPrefs;
	private TextView tv; 

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		Log.d(TAG, "onCreate!");
		mPrefs = getPreferences(MODE_PRIVATE);
		int count = mPrefs.getInt(KEY_COUNT, 0);

		count = count + 1;
		Editor editor = mPrefs.edit();
		editor.putInt(KEY_COUNT, count);
		editor.commit();

		tv = new TextView(this);
		tv.setTextSize(80);
		tv.setText(String.valueOf(count)); // Kutte da puttar!
		Log.d(TAG, "Count is " + count);
		setContentView(tv);
		// setContentView(R.layout.activity_main);

		tv.setOnClickListener(this);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public void onClick(View arg0) {
		
		// SystemClock.sleep(2000); // Never do this!
		// Any long-running method will slow down
		// the whole look and feel of Android and
		// make your app very unresponsive and sluggish
		
		Runnable adder = new Runnable() {
			@Override
			public void run() {
				
				//Todo: Can you refactor these keys into a constants?
				int clickCount = 20 + mPrefs.getInt("clicked", 0);
				mPrefs.edit().putInt("clicked", clickCount).putBoolean("user", true).commit();
				getPreferences(MODE_PRIVATE).edit().putString("flavor","chocolate").commit();
				// The hexadecimal value 0xff00ff00 is
				// opaque green. Why?
				
				tv.setTextColor(0xff00ff00);
				tv.setText(CLICK + clickCount);
				
			}
		};
		
		// Run the adder code in 2000 milliseconds time
		// i.e. 2 seconds
		tv.postDelayed(adder, 2000);
		
	}

	
}
