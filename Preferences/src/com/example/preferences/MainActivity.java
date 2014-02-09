package com.example.preferences;

import java.io.ObjectOutputStream.PutField;

import android.os.Bundle;
import android.app.Activity;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.TextView;

public class MainActivity extends Activity implements OnClicklistener {

	private static final String YOUR_COUNT = "Your count is  ";
	private static final String KEY_COUNT = "count";
	private SharedPreferences mPrefs;
	private TextView mTextView;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		Log.d("MainActivity","onCreate billa!"); /* Tag and text*/
		mPrefs=getPreferences(MODE_PRIVATE);
		int count = mPrefs.getInt(KEY_COUNT,0);
		
		count++;
		
		Editor editor = mPrefs.edit();
		editor.putInt(KEY_COUNT, count);
		editor.commit();
		
		
		
		mTextView = new TextView(this);
		mTextView.setTextSize(80);
		mTextView.setText(YOUR_COUNT + count);
		
		Log.d("MainActivity","The new count is " +count); /* Tag and text*/
		
		setContentView(mTextView);
		
		mTextView.setOnClickListener(this.mTextView);
		// setContentView(R.layout.activity_main);
	}


	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}
	
	@Override
	public void onClick(View arg0){
		
		int clickCount = 20 +  mPrefs.getInt("clicked",0); 
		mPrefs.edit().putInt("clicked",clickCount),putBoolean("user",true).commit();
		mTextView.setTextColor(0xff00ff00);
		mTextView.setText("Click! " + clickCount);
		
	}

}
