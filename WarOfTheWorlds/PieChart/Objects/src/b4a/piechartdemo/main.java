package b4a.piechartdemo;

import anywheresoftware.b4a.B4AMenuItem;
import android.app.Activity;
import android.os.Bundle;
import anywheresoftware.b4a.BA;
import anywheresoftware.b4a.BALayout;
import anywheresoftware.b4a.B4AActivity;
import anywheresoftware.b4a.ObjectWrapper;
import anywheresoftware.b4a.objects.ActivityWrapper;
import java.lang.reflect.InvocationTargetException;
import anywheresoftware.b4a.B4AUncaughtException;
import anywheresoftware.b4a.debug.*;
import java.lang.ref.WeakReference;

public class main extends Activity implements B4AActivity{
	public static main mostCurrent;
	static boolean afterFirstLayout;
	static boolean isFirst = true;
    private static boolean processGlobalsRun = false;
	BALayout layout;
	public static BA processBA;
	BA activityBA;
    ActivityWrapper _activity;
    java.util.ArrayList<B4AMenuItem> menuItems;
	private static final boolean fullScreen = false;
	private static final boolean includeTitle = true;
    public static WeakReference<Activity> previousOne;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		if (isFirst) {
			processBA = new BA(this.getApplicationContext(), null, null, "b4a.piechartdemo", "b4a.piechartdemo.main");
			processBA.loadHtSubs(this.getClass());
	        float deviceScale = getApplicationContext().getResources().getDisplayMetrics().density;
	        BALayout.setDeviceScale(deviceScale);
		}
		else if (previousOne != null) {
			Activity p = previousOne.get();
			if (p != null && p != this) {
                anywheresoftware.b4a.keywords.Common.Log("Killing previous instance (main).");
				p.finish();
			}
		}
		if (!includeTitle) {
        	this.getWindow().requestFeature(android.view.Window.FEATURE_NO_TITLE);
        }
        if (fullScreen) {
        	getWindow().setFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN,   
        			android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
        }
		mostCurrent = this;
        processBA.sharedProcessBA.activityBA = null;
		layout = new BALayout(this);
		setContentView(layout);
		afterFirstLayout = false;
		BA.handler.postDelayed(new WaitForLayout(), 5);

	}
	private static class WaitForLayout implements Runnable {
		public void run() {
			if (afterFirstLayout)
				return;
			if (mostCurrent.layout.getWidth() == 0) {
				BA.handler.postDelayed(this, 5);
				return;
			}
			mostCurrent.layout.getLayoutParams().height = mostCurrent.layout.getHeight();
			mostCurrent.layout.getLayoutParams().width = mostCurrent.layout.getWidth();
			afterFirstLayout = true;
			mostCurrent.afterFirstLayout();
		}
	}
	private void afterFirstLayout() {
		activityBA = new BA(this, layout, processBA, "b4a.piechartdemo", "b4a.piechartdemo.main");
        processBA.sharedProcessBA.activityBA = new java.lang.ref.WeakReference<BA>(activityBA);
        anywheresoftware.b4a.objects.ViewWrapper.lastId = 0;
        _activity = new ActivityWrapper(activityBA, "activity");
        anywheresoftware.b4a.Msgbox.isDismissing = false;
        initializeProcessGlobals();		
        initializeGlobals();
        
        anywheresoftware.b4a.keywords.Common.Log("** Activity (main) Create, isFirst = " + isFirst + " **");
        processBA.raiseEvent2(null, true, "activity_create", false, isFirst);
		isFirst = false;
		if (mostCurrent == null || mostCurrent != this)
			return;
        processBA.setActivityPaused(false);
        anywheresoftware.b4a.keywords.Common.Log("** Activity (main) Resume **");
        processBA.raiseEvent(null, "activity_resume");
        if (android.os.Build.VERSION.SDK_INT >= 11) {
			try {
				android.app.Activity.class.getMethod("invalidateOptionsMenu").invoke(this,(Object[]) null);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

	}
	public void addMenuItem(B4AMenuItem item) {
		if (menuItems == null)
			menuItems = new java.util.ArrayList<B4AMenuItem>();
		menuItems.add(item);
	}
	@Override
	public boolean onCreateOptionsMenu(android.view.Menu menu) {
		super.onCreateOptionsMenu(menu);
		if (menuItems == null)
			return false;
		for (B4AMenuItem bmi : menuItems) {
			android.view.MenuItem mi = menu.add(bmi.title);
			if (bmi.drawable != null)
				mi.setIcon(bmi.drawable);
            if (android.os.Build.VERSION.SDK_INT >= 11) {
				try {
                    if (bmi.addToBar) {
				        android.view.MenuItem.class.getMethod("setShowAsAction", int.class).invoke(mi, 1);
                    }
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			mi.setOnMenuItemClickListener(new B4AMenuItemsClickListener(bmi.eventName.toLowerCase(BA.cul)));
		}
		return true;
	}
	private class B4AMenuItemsClickListener implements android.view.MenuItem.OnMenuItemClickListener {
		private final String eventName;
		public B4AMenuItemsClickListener(String eventName) {
			this.eventName = eventName;
		}
		public boolean onMenuItemClick(android.view.MenuItem item) {
			processBA.raiseEvent(item.getTitle(), eventName + "_click");
			return true;
		}
	}
    public static Class<?> getObject() {
		return main.class;
	}
    private Boolean onKeySubExist = null;
    private Boolean onKeyUpSubExist = null;
	@Override
	public boolean onKeyDown(int keyCode, android.view.KeyEvent event) {
		if (onKeySubExist == null)
			onKeySubExist = processBA.subExists("activity_keypress");
		if (onKeySubExist) {
			Boolean res =  (Boolean)processBA.raiseEvent2(_activity, false, "activity_keypress", false, keyCode);
			if (res == null || res == true)
				return true;
            else if (keyCode == anywheresoftware.b4a.keywords.constants.KeyCodes.KEYCODE_BACK) {
				finish();
				return true;
			}
		}
		return super.onKeyDown(keyCode, event);
	}
    @Override
	public boolean onKeyUp(int keyCode, android.view.KeyEvent event) {
		if (onKeyUpSubExist == null)
			onKeyUpSubExist = processBA.subExists("activity_keyup");
		if (onKeyUpSubExist) {
			Boolean res =  (Boolean)processBA.raiseEvent2(_activity, false, "activity_keyup", false, keyCode);
			if (res == null || res == true)
				return true;
		}
		return super.onKeyUp(keyCode, event);
	}
	@Override
	public void onNewIntent(android.content.Intent intent) {
		this.setIntent(intent);
	}
    @Override 
	public void onPause() {
		super.onPause();
        if (_activity == null) //workaround for emulator bug (Issue 2423)
            return;
		anywheresoftware.b4a.Msgbox.dismiss(true);
        anywheresoftware.b4a.keywords.Common.Log("** Activity (main) Pause, UserClosed = " + activityBA.activity.isFinishing() + " **");
        processBA.raiseEvent2(_activity, true, "activity_pause", false, activityBA.activity.isFinishing());		
        processBA.setActivityPaused(true);
        mostCurrent = null;
        if (!activityBA.activity.isFinishing())
			previousOne = new WeakReference<Activity>(this);
        anywheresoftware.b4a.Msgbox.isDismissing = false;
	}

	@Override
	public void onDestroy() {
        super.onDestroy();
		previousOne = null;
	}
    @Override 
	public void onResume() {
		super.onResume();
        mostCurrent = this;
        anywheresoftware.b4a.Msgbox.isDismissing = false;
        if (activityBA != null) { //will be null during activity create (which waits for AfterLayout).
        	ResumeMessage rm = new ResumeMessage(mostCurrent);
        	BA.handler.post(rm);
        }
	}
    private static class ResumeMessage implements Runnable {
    	private final WeakReference<Activity> activity;
    	public ResumeMessage(Activity activity) {
    		this.activity = new WeakReference<Activity>(activity);
    	}
		public void run() {
			if (mostCurrent == null || mostCurrent != activity.get())
				return;
			processBA.setActivityPaused(false);
            anywheresoftware.b4a.keywords.Common.Log("** Activity (main) Resume **");
		    processBA.raiseEvent(mostCurrent._activity, "activity_resume", (Object[])null);
		}
    }
	@Override
	protected void onActivityResult(int requestCode, int resultCode,
	      android.content.Intent data) {
		processBA.onActivityResult(requestCode, resultCode, data);
	}
	private static void initializeGlobals() {
		processBA.raiseEvent2(null, true, "globals", false, (Object[])null);
	}

public anywheresoftware.b4a.keywords.Common __c = null;
public static int _total_sales = 0;
public static double _pq1 = 0;
public static double _pq2 = 0;
public static double _pq3 = 0;
public static double _pq4 = 0;
public anywheresoftware.b4a.objects.PanelWrapper _pnlpie = null;
public anywheresoftware.b4a.objects.ButtonWrapper _cmdback = null;
public anywheresoftware.b4a.objects.EditTextWrapper _txtq1 = null;
public anywheresoftware.b4a.objects.EditTextWrapper _txtq2 = null;
public anywheresoftware.b4a.objects.EditTextWrapper _txtq3 = null;
public anywheresoftware.b4a.objects.EditTextWrapper _txtq4 = null;
public charts _charts = null;
public static String  _activity_create(boolean _firsttime) throws Exception{
		Debug.PushSubsStack("Activity_Create (main) ","main",0,mostCurrent.activityBA,mostCurrent);
try {
Debug.locals.put("FirstTime", _firsttime);
 BA.debugLineNum = 26;BA.debugLine="Sub Activity_Create(FirstTime As Boolean)";
Debug.ShouldStop(33554432);
 BA.debugLineNum = 27;BA.debugLine="Activity.LoadLayout(\"main\")";
Debug.ShouldStop(67108864);
mostCurrent._activity.LoadLayout("main",mostCurrent.activityBA);
 BA.debugLineNum = 28;BA.debugLine="End Sub";
Debug.ShouldStop(134217728);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static String  _activity_pause(boolean _userclosed) throws Exception{
		Debug.PushSubsStack("Activity_Pause (main) ","main",0,mostCurrent.activityBA,mostCurrent);
try {
Debug.locals.put("UserClosed", _userclosed);
 BA.debugLineNum = 36;BA.debugLine="Sub Activity_Pause (UserClosed As Boolean)";
Debug.ShouldStop(8);
 BA.debugLineNum = 38;BA.debugLine="End Sub";
Debug.ShouldStop(32);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static String  _cmdback_click() throws Exception{
		Debug.PushSubsStack("cmdBack_CLick (main) ","main",0,mostCurrent.activityBA,mostCurrent);
try {
 BA.debugLineNum = 29;BA.debugLine="Sub cmdBack_CLick";
Debug.ShouldStop(268435456);
 BA.debugLineNum = 31;BA.debugLine="RemoveView";
Debug.ShouldStop(1073741824);
_removeview();
 BA.debugLineNum = 32;BA.debugLine="Activity.LoadLayout(\"main\")";
Debug.ShouldStop(-2147483648);
mostCurrent._activity.LoadLayout("main",mostCurrent.activityBA);
 BA.debugLineNum = 34;BA.debugLine="End Sub";
Debug.ShouldStop(2);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static String  _cmdcancel_click() throws Exception{
		Debug.PushSubsStack("cmdCancel_Click (main) ","main",0,mostCurrent.activityBA,mostCurrent);
try {
 BA.debugLineNum = 131;BA.debugLine="Sub cmdCancel_Click";
Debug.ShouldStop(4);
 BA.debugLineNum = 132;BA.debugLine="Activity.Finish";
Debug.ShouldStop(8);
mostCurrent._activity.Finish();
 BA.debugLineNum = 133;BA.debugLine="End Sub";
Debug.ShouldStop(16);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static String  _cmdviewchart_click() throws Exception{
		Debug.PushSubsStack("cmdViewChart_Click (main) ","main",0,mostCurrent.activityBA,mostCurrent);
try {
 BA.debugLineNum = 102;BA.debugLine="Sub cmdViewChart_Click";
Debug.ShouldStop(32);
 BA.debugLineNum = 104;BA.debugLine="If txtQ1.Text=\"\" OR txtQ2.Text=\"\" OR txtQ3.Text=\"\" OR txtQ4.Text=\"\" Then";
Debug.ShouldStop(128);
if ((mostCurrent._txtq1.getText()).equals("") || (mostCurrent._txtq2.getText()).equals("") || (mostCurrent._txtq3.getText()).equals("") || (mostCurrent._txtq4.getText()).equals("")) { 
 BA.debugLineNum = 106;BA.debugLine="Msgbox (\"Missing field\",\"Please check!\")";
Debug.ShouldStop(512);
anywheresoftware.b4a.keywords.Common.Msgbox("Missing field","Please check!",mostCurrent.activityBA);
 }else {
 BA.debugLineNum = 109;BA.debugLine="RemoveView";
Debug.ShouldStop(4096);
_removeview();
 BA.debugLineNum = 111;BA.debugLine="Total_sales = txtQ1.Text+txtQ2.Text+txtQ3.Text+txtQ4.Text";
Debug.ShouldStop(16384);
_total_sales = (int)((double)(Double.parseDouble(mostCurrent._txtq1.getText()))+(double)(Double.parseDouble(mostCurrent._txtq2.getText()))+(double)(Double.parseDouble(mostCurrent._txtq3.getText()))+(double)(Double.parseDouble(mostCurrent._txtq4.getText())));
 BA.debugLineNum = 114;BA.debugLine="Pq1 = (txtQ1.Text/Total_sales)*100";
Debug.ShouldStop(131072);
_pq1 = ((double)(Double.parseDouble(mostCurrent._txtq1.getText()))/(double)_total_sales)*100;
 BA.debugLineNum = 115;BA.debugLine="Pq2 = (txtQ2.Text/Total_sales)*100";
Debug.ShouldStop(262144);
_pq2 = ((double)(Double.parseDouble(mostCurrent._txtq2.getText()))/(double)_total_sales)*100;
 BA.debugLineNum = 116;BA.debugLine="Pq3 = (txtQ3.Text/Total_sales)*100";
Debug.ShouldStop(524288);
_pq3 = ((double)(Double.parseDouble(mostCurrent._txtq3.getText()))/(double)_total_sales)*100;
 BA.debugLineNum = 117;BA.debugLine="Pq4 = (txtQ4.Text/Total_sales)*100";
Debug.ShouldStop(1048576);
_pq4 = ((double)(Double.parseDouble(mostCurrent._txtq4.getText()))/(double)_total_sales)*100;
 BA.debugLineNum = 119;BA.debugLine="CreatePieTab";
Debug.ShouldStop(4194304);
_createpietab();
 };
 BA.debugLineNum = 122;BA.debugLine="End Sub";
Debug.ShouldStop(33554432);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static String  _createpietab() throws Exception{
		Debug.PushSubsStack("CreatePieTab (main) ","main",0,mostCurrent.activityBA,mostCurrent);
try {
charts._piedata _pd = null;
anywheresoftware.b4a.objects.drawable.CanvasWrapper.BitmapWrapper _legend = null;
anywheresoftware.b4a.objects.ImageViewWrapper _imageview1 = null;
anywheresoftware.b4a.objects.LabelWrapper _lbltotal = null;
 BA.debugLineNum = 40;BA.debugLine="Sub CreatePieTab";
Debug.ShouldStop(128);
 BA.debugLineNum = 42;BA.debugLine="pnlPie.Initialize(\"pnlPie\")";
Debug.ShouldStop(512);
mostCurrent._pnlpie.Initialize(mostCurrent.activityBA,"pnlPie");
 BA.debugLineNum = 43;BA.debugLine="Activity.AddView(pnlPie, 5%x, 5%y, 90%x, 90%y)";
Debug.ShouldStop(1024);
mostCurrent._activity.AddView((android.view.View)(mostCurrent._pnlpie.getObject()),anywheresoftware.b4a.keywords.Common.PerXToCurrent((float)(5),mostCurrent.activityBA),anywheresoftware.b4a.keywords.Common.PerYToCurrent((float)(5),mostCurrent.activityBA),anywheresoftware.b4a.keywords.Common.PerXToCurrent((float)(90),mostCurrent.activityBA),anywheresoftware.b4a.keywords.Common.PerYToCurrent((float)(90),mostCurrent.activityBA));
 BA.debugLineNum = 46;BA.debugLine="Dim PD As PieData";
Debug.ShouldStop(8192);
_pd = new charts._piedata();Debug.locals.put("PD", _pd);
 BA.debugLineNum = 47;BA.debugLine="PD.Initialize";
Debug.ShouldStop(16384);
_pd.Initialize();
 BA.debugLineNum = 50;BA.debugLine="PD.Target = pnlPie";
Debug.ShouldStop(131072);
_pd.Target = mostCurrent._pnlpie;Debug.locals.put("PD", _pd);
 BA.debugLineNum = 53;BA.debugLine="Charts.AddPieItem(PD, \"Quarter 1: \"&txtQ1.Text&\" ( \"&(Round2(Pq1,2))& \"% )\",txtQ1.Text,0)";
Debug.ShouldStop(1048576);
mostCurrent._charts._addpieitem(mostCurrent.activityBA,_pd,"Quarter 1: "+mostCurrent._txtq1.getText()+" ( "+BA.NumberToString((anywheresoftware.b4a.keywords.Common.Round2(_pq1,(int)(2))))+"% )",(float)(Double.parseDouble(mostCurrent._txtq1.getText())),(int)(0));
 BA.debugLineNum = 54;BA.debugLine="Charts.AddPieItem(PD, \"Quarter 2: \"&txtQ2.Text&\" ( \"&(Round2(Pq2,2))& \"% )\",txtQ2.Text, 0)";
Debug.ShouldStop(2097152);
mostCurrent._charts._addpieitem(mostCurrent.activityBA,_pd,"Quarter 2: "+mostCurrent._txtq2.getText()+" ( "+BA.NumberToString((anywheresoftware.b4a.keywords.Common.Round2(_pq2,(int)(2))))+"% )",(float)(Double.parseDouble(mostCurrent._txtq2.getText())),(int)(0));
 BA.debugLineNum = 55;BA.debugLine="Charts.AddPieItem(PD, \"Quarter 3: \"&txtQ3.Text&\" ( \"&(Round2(Pq3,2))& \"% )\",txtQ3.Text, 0)";
Debug.ShouldStop(4194304);
mostCurrent._charts._addpieitem(mostCurrent.activityBA,_pd,"Quarter 3: "+mostCurrent._txtq3.getText()+" ( "+BA.NumberToString((anywheresoftware.b4a.keywords.Common.Round2(_pq3,(int)(2))))+"% )",(float)(Double.parseDouble(mostCurrent._txtq3.getText())),(int)(0));
 BA.debugLineNum = 56;BA.debugLine="Charts.AddPieItem(PD, \"Quarter 4: \"&txtQ4.Text&\" ( \"&(Round2(Pq4,2))& \"% )\",txtQ4.Text, 0)";
Debug.ShouldStop(8388608);
mostCurrent._charts._addpieitem(mostCurrent.activityBA,_pd,"Quarter 4: "+mostCurrent._txtq4.getText()+" ( "+BA.NumberToString((anywheresoftware.b4a.keywords.Common.Round2(_pq4,(int)(2))))+"% )",(float)(Double.parseDouble(mostCurrent._txtq4.getText())),(int)(0));
 BA.debugLineNum = 59;BA.debugLine="PD.GapDegrees = 0";
Debug.ShouldStop(67108864);
_pd.GapDegrees = (int)(0);Debug.locals.put("PD", _pd);
 BA.debugLineNum = 62;BA.debugLine="PD.LegendBackColor = Colors.Transparent";
Debug.ShouldStop(536870912);
_pd.LegendBackColor = anywheresoftware.b4a.keywords.Common.Colors.Transparent;Debug.locals.put("PD", _pd);
 BA.debugLineNum = 68;BA.debugLine="Dim legend As Bitmap";
Debug.ShouldStop(8);
_legend = new anywheresoftware.b4a.objects.drawable.CanvasWrapper.BitmapWrapper();Debug.locals.put("legend", _legend);
 BA.debugLineNum = 69;BA.debugLine="legend = Charts.DrawPie(PD, Colors.White, True)";
Debug.ShouldStop(16);
_legend = mostCurrent._charts._drawpie(mostCurrent.activityBA,_pd,anywheresoftware.b4a.keywords.Common.Colors.White,anywheresoftware.b4a.keywords.Common.True);Debug.locals.put("legend", _legend);
 BA.debugLineNum = 71;BA.debugLine="If legend.IsInitialized Then";
Debug.ShouldStop(64);
if (_legend.IsInitialized()) { 
 BA.debugLineNum = 73;BA.debugLine="Dim ImageView1 As ImageView";
Debug.ShouldStop(256);
_imageview1 = new anywheresoftware.b4a.objects.ImageViewWrapper();Debug.locals.put("ImageView1", _imageview1);
 BA.debugLineNum = 74;BA.debugLine="ImageView1.Initialize(\"\")";
Debug.ShouldStop(512);
_imageview1.Initialize(mostCurrent.activityBA,"");
 BA.debugLineNum = 75;BA.debugLine="ImageView1.SetBackgroundImage(legend)";
Debug.ShouldStop(1024);
_imageview1.SetBackgroundImage((android.graphics.Bitmap)(_legend.getObject()));
 BA.debugLineNum = 78;BA.debugLine="pnlPie.AddView(ImageView1, 2dip,0dip, legend.Width, legend.Height)";
Debug.ShouldStop(8192);
mostCurrent._pnlpie.AddView((android.view.View)(_imageview1.getObject()),anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(2)),anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(0)),_legend.getWidth(),_legend.getHeight());
 BA.debugLineNum = 81;BA.debugLine="cmdBack.initialize(\"cmdBack\")";
Debug.ShouldStop(65536);
mostCurrent._cmdback.Initialize(mostCurrent.activityBA,"cmdBack");
 BA.debugLineNum = 83;BA.debugLine="pnlPie.AddView(cmdBack,200dip, 290dip,25%x, 12%y)";
Debug.ShouldStop(262144);
mostCurrent._pnlpie.AddView((android.view.View)(mostCurrent._cmdback.getObject()),anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(200)),anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(290)),anywheresoftware.b4a.keywords.Common.PerXToCurrent((float)(25),mostCurrent.activityBA),anywheresoftware.b4a.keywords.Common.PerYToCurrent((float)(12),mostCurrent.activityBA));
 BA.debugLineNum = 84;BA.debugLine="cmdBack.TextSize = 15";
Debug.ShouldStop(524288);
mostCurrent._cmdback.setTextSize((float)(15));
 BA.debugLineNum = 85;BA.debugLine="cmdBack.Text=\"Home\"";
Debug.ShouldStop(1048576);
mostCurrent._cmdback.setText((Object)("Home"));
 BA.debugLineNum = 88;BA.debugLine="Dim lblTotal As Label";
Debug.ShouldStop(8388608);
_lbltotal = new anywheresoftware.b4a.objects.LabelWrapper();Debug.locals.put("lblTotal", _lbltotal);
 BA.debugLineNum = 89;BA.debugLine="lblTotal.initialize(\"\")";
Debug.ShouldStop(16777216);
_lbltotal.Initialize(mostCurrent.activityBA,"");
 BA.debugLineNum = 90;BA.debugLine="pnlPie.AddView(lblTotal,5dip, 290dip, 30%x, 15%y)";
Debug.ShouldStop(33554432);
mostCurrent._pnlpie.AddView((android.view.View)(_lbltotal.getObject()),anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(5)),anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(290)),anywheresoftware.b4a.keywords.Common.PerXToCurrent((float)(30),mostCurrent.activityBA),anywheresoftware.b4a.keywords.Common.PerYToCurrent((float)(15),mostCurrent.activityBA));
 BA.debugLineNum = 92;BA.debugLine="lblTotal.TextSize = 15";
Debug.ShouldStop(134217728);
_lbltotal.setTextSize((float)(15));
 BA.debugLineNum = 93;BA.debugLine="lblTotal.TextColor = Colors.Black";
Debug.ShouldStop(268435456);
_lbltotal.setTextColor(anywheresoftware.b4a.keywords.Common.Colors.Black);
 BA.debugLineNum = 96;BA.debugLine="lblTotal.Text=\"Total Sales: Php \" & Total_sales";
Debug.ShouldStop(-2147483648);
_lbltotal.setText((Object)("Total Sales: Php "+BA.NumberToString(_total_sales)));
 };
 BA.debugLineNum = 100;BA.debugLine="End Sub";
Debug.ShouldStop(8);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}

public static void initializeProcessGlobals() {
    if (mostCurrent != null && mostCurrent.activityBA != null) {
Debug.StartDebugging(mostCurrent.activityBA, 41492, new int[] {5, 11}, "01bc9934-7dd9-43ea-aa4a-44e16ad1c218");}

    if (processGlobalsRun == false) {
	    processGlobalsRun = true;
		try {
		        main._process_globals();
charts._process_globals();
		
        } catch (Exception e) {
			throw new RuntimeException(e);
		}
    }
}

public static boolean isAnyActivityVisible() {
    boolean vis = false;
vis = vis | (main.mostCurrent != null);
return vis;}

public static void killProgram() {
    
            if (main.previousOne != null) {
				Activity a = main.previousOne.get();
				if (a != null)
					a.finish();
			}

}
public static String  _globals() throws Exception{
 //BA.debugLineNum = 16;BA.debugLine="Sub Globals";
 //BA.debugLineNum = 17;BA.debugLine="Dim pnlPie As Panel";
mostCurrent._pnlpie = new anywheresoftware.b4a.objects.PanelWrapper();
 //BA.debugLineNum = 18;BA.debugLine="Dim cmdBack As Button";
mostCurrent._cmdback = new anywheresoftware.b4a.objects.ButtonWrapper();
 //BA.debugLineNum = 19;BA.debugLine="Dim txtQ1 As EditText";
mostCurrent._txtq1 = new anywheresoftware.b4a.objects.EditTextWrapper();
 //BA.debugLineNum = 20;BA.debugLine="Dim txtQ2 As EditText";
mostCurrent._txtq2 = new anywheresoftware.b4a.objects.EditTextWrapper();
 //BA.debugLineNum = 21;BA.debugLine="Dim txtQ3 As EditText";
mostCurrent._txtq3 = new anywheresoftware.b4a.objects.EditTextWrapper();
 //BA.debugLineNum = 22;BA.debugLine="Dim txtQ4 As EditText";
mostCurrent._txtq4 = new anywheresoftware.b4a.objects.EditTextWrapper();
 //BA.debugLineNum = 24;BA.debugLine="End Sub";
return "";
}
public static String  _process_globals() throws Exception{
 //BA.debugLineNum = 11;BA.debugLine="Sub Process_Globals";
 //BA.debugLineNum = 12;BA.debugLine="Dim Total_sales As Int";
_total_sales = 0;
 //BA.debugLineNum = 13;BA.debugLine="Dim Pq1,Pq2,Pq3,Pq4 As Double";
_pq1 = 0;
_pq2 = 0;
_pq3 = 0;
_pq4 = 0;
 //BA.debugLineNum = 14;BA.debugLine="End Sub";
return "";
}
public static String  _removeview() throws Exception{
		Debug.PushSubsStack("RemoveView (main) ","main",0,mostCurrent.activityBA,mostCurrent);
try {
int _i = 0;
 BA.debugLineNum = 123;BA.debugLine="Sub RemoveView";
Debug.ShouldStop(67108864);
 BA.debugLineNum = 124;BA.debugLine="Dim i As Int";
Debug.ShouldStop(134217728);
_i = 0;Debug.locals.put("i", _i);
 BA.debugLineNum = 126;BA.debugLine="For i = Activity.NumberOfViews-1 To 0 Step-1";
Debug.ShouldStop(536870912);
{
final double step67 = -1;
final double limit67 = (int)(0);
for (_i = (int)(mostCurrent._activity.getNumberOfViews()-1); (step67 > 0 && _i <= limit67) || (step67 < 0 && _i >= limit67); _i += step67) {
Debug.locals.put("i", _i);
 BA.debugLineNum = 127;BA.debugLine="Activity.RemoveViewAt (i)";
Debug.ShouldStop(1073741824);
mostCurrent._activity.RemoveViewAt(_i);
 }
}Debug.locals.put("i", _i);
;
 BA.debugLineNum = 130;BA.debugLine="End Sub";
Debug.ShouldStop(2);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
  public Object[] GetGlobals() {
		return new Object[] {"Activity",_activity,"Total_sales",_total_sales,"Pq1",_pq1,"Pq2",_pq2,"Pq3",_pq3,"Pq4",_pq4,"pnlPie",_pnlpie,"cmdBack",_cmdback,"txtQ1",_txtq1,"txtQ2",_txtq2,"txtQ3",_txtq3,"txtQ4",_txtq4,"Charts",Debug.moduleToString(b4a.piechartdemo.charts.class)};
}
}
