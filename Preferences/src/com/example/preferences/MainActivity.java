package com.example.preferences;

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

	private static final String TAG = MainActivity.class.getSimpleName();

	private static final String KEY_COUNT = "count";
	private SharedPreferences mPrefs;
	private TextView mTextView;

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

		mTextView = new TextView(this);
		mTextView.setTextSize(80);
		mTextView.setText("Count : " + count);
		Log.d(TAG, "Count is " + count);
		setContentView(mTextView);
		// setContentView(R.layout.activity_main);

		mTextView.setOnClickListener(this);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public void onClick(View arg0) {
		//Todo: Can you refactor these keys into a constants?
		int clickCount = 20 + mPrefs.getInt("clicked", 0);
		mPrefs.edit().putInt("clicked", clickCount).putBoolean("user", true).commit();
		// The hexadecimal value 0xff00ff00 is
		// opaque green. Why?
		
		mTextView.setTextColor(0xff00ff00);
		mTextView.setText("Click!" + clickCount);
	}
}
