package b4a.piechartdemo;

import anywheresoftware.b4a.BA;
import anywheresoftware.b4a.BALayout;
import anywheresoftware.b4a.debug.*;

public class charts {
private static charts mostCurrent = new charts();
public static Object getObject() {
    throw new RuntimeException("Code module does not support this method.");
}
 public static class _pieitem{
boolean IsInitialized;
String Name;
float Value;
int Color;
public void Initialize() {
IsInitialized = true;
Name = "";
Value = 0f;
Color = 0;
}
@Override
		public String toString() {
			return BA.TypeToString(this, false);
		}}
public static class _piedata{
boolean IsInitialized;
anywheresoftware.b4a.objects.collections.List Items;
anywheresoftware.b4a.objects.PanelWrapper Target;
anywheresoftware.b4a.objects.drawable.CanvasWrapper Canvas;
int GapDegrees;
float LegendTextSize;
int LegendBackColor;
public void Initialize() {
IsInitialized = true;
Items = new anywheresoftware.b4a.objects.collections.List();
Target = new anywheresoftware.b4a.objects.PanelWrapper();
Canvas = new anywheresoftware.b4a.objects.drawable.CanvasWrapper();
GapDegrees = 0;
LegendTextSize = 0f;
LegendBackColor = 0;
}
@Override
		public String toString() {
			return BA.TypeToString(this, false);
		}}
public static class _graphinternal{
boolean IsInitialized;
int originX;
int zeroY;
int originY;
int maxY;
float intervalX;
int gw;
int gh;
public void Initialize() {
IsInitialized = true;
originX = 0;
zeroY = 0;
originY = 0;
maxY = 0;
intervalX = 0f;
gw = 0;
gh = 0;
}
@Override
		public String toString() {
			return BA.TypeToString(this, false);
		}}
public static class _graph{
boolean IsInitialized;
charts._graphinternal GI;
String Title;
String YAxis;
String XAxis;
float YStart;
float YEnd;
float YInterval;
int AxisColor;
public void Initialize() {
IsInitialized = true;
GI = new charts._graphinternal();
Title = "";
YAxis = "";
XAxis = "";
YStart = 0f;
YEnd = 0f;
YInterval = 0f;
AxisColor = 0;
}
@Override
		public String toString() {
			return BA.TypeToString(this, false);
		}}
public static class _linepoint{
boolean IsInitialized;
String X;
float Y;
float[] YArray;
boolean ShowTick;
public void Initialize() {
IsInitialized = true;
X = "";
Y = 0f;
YArray = new float[0];
;
ShowTick = false;
}
@Override
		public String toString() {
			return BA.TypeToString(this, false);
		}}
public static class _linedata{
boolean IsInitialized;
anywheresoftware.b4a.objects.collections.List Points;
anywheresoftware.b4a.objects.collections.List LinesColors;
anywheresoftware.b4a.objects.PanelWrapper Target;
anywheresoftware.b4a.objects.drawable.CanvasWrapper Canvas;
public void Initialize() {
IsInitialized = true;
Points = new anywheresoftware.b4a.objects.collections.List();
LinesColors = new anywheresoftware.b4a.objects.collections.List();
Target = new anywheresoftware.b4a.objects.PanelWrapper();
Canvas = new anywheresoftware.b4a.objects.drawable.CanvasWrapper();
}
@Override
		public String toString() {
			return BA.TypeToString(this, false);
		}}
public static class _bardata{
boolean IsInitialized;
anywheresoftware.b4a.objects.collections.List Points;
anywheresoftware.b4a.objects.collections.List BarsColors;
anywheresoftware.b4a.objects.PanelWrapper Target;
anywheresoftware.b4a.objects.drawable.CanvasWrapper Canvas;
boolean Stacked;
int BarsWidth;
public void Initialize() {
IsInitialized = true;
Points = new anywheresoftware.b4a.objects.collections.List();
BarsColors = new anywheresoftware.b4a.objects.collections.List();
Target = new anywheresoftware.b4a.objects.PanelWrapper();
Canvas = new anywheresoftware.b4a.objects.drawable.CanvasWrapper();
Stacked = false;
BarsWidth = 0;
}
@Override
		public String toString() {
			return BA.TypeToString(this, false);
		}}
public anywheresoftware.b4a.keywords.Common __c = null;
public main _main = null;
public static String  _addbarcolor(anywheresoftware.b4a.BA _ba,charts._bardata _bd,int _color) throws Exception{
		Debug.PushSubsStack("AddBarColor (charts) ","charts",1,_ba,mostCurrent);
try {
Debug.locals.put("ba", _ba);
Debug.locals.put("BD", _bd);
Debug.locals.put("Color", _color);
 BA.debugLineNum = 35;BA.debugLine="Sub AddBarColor(BD As BarData, Color As Int)";
Debug.ShouldStop(4);
 BA.debugLineNum = 36;BA.debugLine="If BD.BarsColors.IsInitialized = False Then BD.BarsColors.Initialize";
Debug.ShouldStop(8);
if (_bd.BarsColors.IsInitialized()==anywheresoftware.b4a.keywords.Common.False) { 
_bd.BarsColors.Initialize();};
 BA.debugLineNum = 37;BA.debugLine="BD.BarsColors.Add(Color)";
Debug.ShouldStop(16);
_bd.BarsColors.Add((Object)(_color));
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
public static String  _addbarpoint(anywheresoftware.b4a.BA _ba,charts._bardata _bd,String _x,float[] _yarray) throws Exception{
		Debug.PushSubsStack("AddBarPoint (charts) ","charts",1,_ba,mostCurrent);
try {
charts._linepoint _b = null;
Debug.locals.put("ba", _ba);
Debug.locals.put("BD", _bd);
Debug.locals.put("X", _x);
Debug.locals.put("YArray", _yarray);
 BA.debugLineNum = 17;BA.debugLine="Sub AddBarPoint (BD As BarData, X As String, YArray() As Float)";
Debug.ShouldStop(65536);
 BA.debugLineNum = 18;BA.debugLine="If BD.Points.IsInitialized = False Then";
Debug.ShouldStop(131072);
if (_bd.Points.IsInitialized()==anywheresoftware.b4a.keywords.Common.False) { 
 BA.debugLineNum = 19;BA.debugLine="BD.Points.Initialize";
Debug.ShouldStop(262144);
_bd.Points.Initialize();
 BA.debugLineNum = 21;BA.debugLine="Dim b As LinePoint";
Debug.ShouldStop(1048576);
_b = new charts._linepoint();Debug.locals.put("b", _b);
 BA.debugLineNum = 22;BA.debugLine="b.Initialize";
Debug.ShouldStop(2097152);
_b.Initialize();
 BA.debugLineNum = 23;BA.debugLine="b.X = \"\"";
Debug.ShouldStop(4194304);
_b.X = "";Debug.locals.put("b", _b);
 BA.debugLineNum = 24;BA.debugLine="b.ShowTick = False";
Debug.ShouldStop(8388608);
_b.ShowTick = anywheresoftware.b4a.keywords.Common.False;Debug.locals.put("b", _b);
 BA.debugLineNum = 25;BA.debugLine="BD.Points.Add(b)";
Debug.ShouldStop(16777216);
_bd.Points.Add((Object)(_b));
 };
 BA.debugLineNum = 27;BA.debugLine="Dim b As LinePoint 'using the same structure of Line charts";
Debug.ShouldStop(67108864);
_b = new charts._linepoint();Debug.locals.put("b", _b);
 BA.debugLineNum = 28;BA.debugLine="b.Initialize";
Debug.ShouldStop(134217728);
_b.Initialize();
 BA.debugLineNum = 29;BA.debugLine="b.X = X";
Debug.ShouldStop(268435456);
_b.X = _x;Debug.locals.put("b", _b);
 BA.debugLineNum = 30;BA.debugLine="b.YArray = YArray";
Debug.ShouldStop(536870912);
_b.YArray = _yarray;Debug.locals.put("b", _b);
 BA.debugLineNum = 31;BA.debugLine="b.ShowTick = True";
Debug.ShouldStop(1073741824);
_b.ShowTick = anywheresoftware.b4a.keywords.Common.True;Debug.locals.put("b", _b);
 BA.debugLineNum = 32;BA.debugLine="BD.Points.Add(b)";
Debug.ShouldStop(-2147483648);
_bd.Points.Add((Object)(_b));
 BA.debugLineNum = 33;BA.debugLine="End Sub";
Debug.ShouldStop(1);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static String  _addlinecolor(anywheresoftware.b4a.BA _ba,charts._linedata _ld,int _color) throws Exception{
		Debug.PushSubsStack("AddLineColor (charts) ","charts",1,_ba,mostCurrent);
try {
Debug.locals.put("ba", _ba);
Debug.locals.put("LD", _ld);
Debug.locals.put("Color", _color);
 BA.debugLineNum = 183;BA.debugLine="Sub AddLineColor(LD As LineData, Color As Int)";
Debug.ShouldStop(4194304);
 BA.debugLineNum = 184;BA.debugLine="If LD.LinesColors.IsInitialized = False Then LD.LinesColors.Initialize";
Debug.ShouldStop(8388608);
if (_ld.LinesColors.IsInitialized()==anywheresoftware.b4a.keywords.Common.False) { 
_ld.LinesColors.Initialize();};
 BA.debugLineNum = 185;BA.debugLine="LD.LinesColors.Add(Color)";
Debug.ShouldStop(16777216);
_ld.LinesColors.Add((Object)(_color));
 BA.debugLineNum = 186;BA.debugLine="End Sub";
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
public static String  _addlinemultiplepoints(anywheresoftware.b4a.BA _ba,charts._linedata _ld,String _x,float[] _yarray,boolean _showtick) throws Exception{
		Debug.PushSubsStack("AddLineMultiplePoints (charts) ","charts",1,_ba,mostCurrent);
try {
charts._linepoint _p = null;
Debug.locals.put("ba", _ba);
Debug.locals.put("LD", _ld);
Debug.locals.put("X", _x);
Debug.locals.put("YArray", _yarray);
Debug.locals.put("ShowTick", _showtick);
 BA.debugLineNum = 173;BA.debugLine="Sub AddLineMultiplePoints(LD As LineData, X As String, YArray() As Float, ShowTick As Boolean)";
Debug.ShouldStop(4096);
 BA.debugLineNum = 174;BA.debugLine="If LD.Points.IsInitialized = False Then LD.Points.Initialize";
Debug.ShouldStop(8192);
if (_ld.Points.IsInitialized()==anywheresoftware.b4a.keywords.Common.False) { 
_ld.Points.Initialize();};
 BA.debugLineNum = 175;BA.debugLine="Dim p As LinePoint";
Debug.ShouldStop(16384);
_p = new charts._linepoint();Debug.locals.put("p", _p);
 BA.debugLineNum = 176;BA.debugLine="p.Initialize";
Debug.ShouldStop(32768);
_p.Initialize();
 BA.debugLineNum = 177;BA.debugLine="p.X = X";
Debug.ShouldStop(65536);
_p.X = _x;Debug.locals.put("p", _p);
 BA.debugLineNum = 178;BA.debugLine="p.YArray = YArray";
Debug.ShouldStop(131072);
_p.YArray = _yarray;Debug.locals.put("p", _p);
 BA.debugLineNum = 179;BA.debugLine="p.ShowTick = ShowTick";
Debug.ShouldStop(262144);
_p.ShowTick = _showtick;Debug.locals.put("p", _p);
 BA.debugLineNum = 180;BA.debugLine="LD.Points.Add(p)";
Debug.ShouldStop(524288);
_ld.Points.Add((Object)(_p));
 BA.debugLineNum = 181;BA.debugLine="End Sub";
Debug.ShouldStop(1048576);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static String  _addlinepoint(anywheresoftware.b4a.BA _ba,charts._linedata _ld,String _x,float _y,boolean _showtick) throws Exception{
		Debug.PushSubsStack("AddLinePoint (charts) ","charts",1,_ba,mostCurrent);
try {
charts._linepoint _p = null;
Debug.locals.put("ba", _ba);
Debug.locals.put("LD", _ld);
Debug.locals.put("X", _x);
Debug.locals.put("Y", _y);
Debug.locals.put("ShowTick", _showtick);
 BA.debugLineNum = 163;BA.debugLine="Sub AddLinePoint (LD As LineData, X As String, Y As Float, ShowTick As Boolean)";
Debug.ShouldStop(4);
 BA.debugLineNum = 164;BA.debugLine="If LD.Points.IsInitialized = False Then LD.Points.Initialize";
Debug.ShouldStop(8);
if (_ld.Points.IsInitialized()==anywheresoftware.b4a.keywords.Common.False) { 
_ld.Points.Initialize();};
 BA.debugLineNum = 165;BA.debugLine="Dim p As LinePoint";
Debug.ShouldStop(16);
_p = new charts._linepoint();Debug.locals.put("p", _p);
 BA.debugLineNum = 166;BA.debugLine="p.Initialize";
Debug.ShouldStop(32);
_p.Initialize();
 BA.debugLineNum = 167;BA.debugLine="p.X = X";
Debug.ShouldStop(64);
_p.X = _x;Debug.locals.put("p", _p);
 BA.debugLineNum = 168;BA.debugLine="p.Y = Y";
Debug.ShouldStop(128);
_p.Y = _y;Debug.locals.put("p", _p);
 BA.debugLineNum = 169;BA.debugLine="p.ShowTick = ShowTick";
Debug.ShouldStop(256);
_p.ShowTick = _showtick;Debug.locals.put("p", _p);
 BA.debugLineNum = 170;BA.debugLine="LD.Points.Add(p)";
Debug.ShouldStop(512);
_ld.Points.Add((Object)(_p));
 BA.debugLineNum = 171;BA.debugLine="End Sub";
Debug.ShouldStop(1024);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static String  _addpieitem(anywheresoftware.b4a.BA _ba,charts._piedata _pd,String _name,float _value,int _color) throws Exception{
		Debug.PushSubsStack("AddPieItem (charts) ","charts",1,_ba,mostCurrent);
try {
charts._pieitem _i = null;
Debug.locals.put("ba", _ba);
Debug.locals.put("PD", _pd);
Debug.locals.put("Name", _name);
Debug.locals.put("Value", _value);
Debug.locals.put("Color", _color);
 BA.debugLineNum = 238;BA.debugLine="Sub AddPieItem(PD As PieData, Name As String, Value As Float, Color As Int)";
Debug.ShouldStop(8192);
 BA.debugLineNum = 239;BA.debugLine="If PD.Items.IsInitialized = False Then PD.Items.Initialize";
Debug.ShouldStop(16384);
if (_pd.Items.IsInitialized()==anywheresoftware.b4a.keywords.Common.False) { 
_pd.Items.Initialize();};
 BA.debugLineNum = 240;BA.debugLine="If Color = 0 Then Color = Colors.RGB(Rnd(0, 255), Rnd(0, 255), Rnd(0, 255))";
Debug.ShouldStop(32768);
if (_color==0) { 
_color = anywheresoftware.b4a.keywords.Common.Colors.RGB(anywheresoftware.b4a.keywords.Common.Rnd((int)(0),(int)(255)),anywheresoftware.b4a.keywords.Common.Rnd((int)(0),(int)(255)),anywheresoftware.b4a.keywords.Common.Rnd((int)(0),(int)(255)));Debug.locals.put("Color", _color);};
 BA.debugLineNum = 241;BA.debugLine="Dim i As PieItem";
Debug.ShouldStop(65536);
_i = new charts._pieitem();Debug.locals.put("i", _i);
 BA.debugLineNum = 242;BA.debugLine="i.Initialize";
Debug.ShouldStop(131072);
_i.Initialize();
 BA.debugLineNum = 243;BA.debugLine="i.Name = Name";
Debug.ShouldStop(262144);
_i.Name = _name;Debug.locals.put("i", _i);
 BA.debugLineNum = 244;BA.debugLine="i.Value = Value";
Debug.ShouldStop(524288);
_i.Value = _value;Debug.locals.put("i", _i);
 BA.debugLineNum = 245;BA.debugLine="i.Color = Color";
Debug.ShouldStop(1048576);
_i.Color = _color;Debug.locals.put("i", _i);
 BA.debugLineNum = 246;BA.debugLine="PD.Items.Add(i)";
Debug.ShouldStop(2097152);
_pd.Items.Add((Object)(_i));
 BA.debugLineNum = 247;BA.debugLine="End Sub";
Debug.ShouldStop(4194304);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static int  _calcpointtopixel(anywheresoftware.b4a.BA _ba,float _py,charts._graph _g) throws Exception{
		Debug.PushSubsStack("calcPointToPixel (charts) ","charts",1,_ba,mostCurrent);
try {
Debug.locals.put("ba", _ba);
Debug.locals.put("py", _py);
Debug.locals.put("G", _g);
 BA.debugLineNum = 228;BA.debugLine="Sub calcPointToPixel(py As Float, G As Graph) As Int";
Debug.ShouldStop(8);
 BA.debugLineNum = 229;BA.debugLine="If G.YStart < 0 AND G.YEnd > 0 Then";
Debug.ShouldStop(16);
if (_g.YStart<0 && _g.YEnd>0) { 
 BA.debugLineNum = 230;BA.debugLine="Return G.GI.zeroY - (G.GI.originY - G.GI.maxY) * py / (G.YEnd - G.YStart)";
Debug.ShouldStop(32);
if (true) return (int)(_g.GI.zeroY-(_g.GI.originY-_g.GI.maxY)*_py/(double)(_g.YEnd-_g.YStart));
 }else {
 BA.debugLineNum = 232;BA.debugLine="Return G.GI.originY - (G.GI.originY - G.GI.maxY) * (py - G.YStart) / (G.YEnd - G.YStart)";
Debug.ShouldStop(128);
if (true) return (int)(_g.GI.originY-(_g.GI.originY-_g.GI.maxY)*(_py-_g.YStart)/(double)(_g.YEnd-_g.YStart));
 };
 BA.debugLineNum = 234;BA.debugLine="End Sub";
Debug.ShouldStop(512);
return 0;
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static float  _calcslice(anywheresoftware.b4a.BA _ba,anywheresoftware.b4a.objects.drawable.CanvasWrapper _canvas,int _radius,float _startingdegree,float _percent,int _color,int _gapdegrees) throws Exception{
		Debug.PushSubsStack("calcSlice (charts) ","charts",1,_ba,mostCurrent);
try {
float _b = 0f;
int _cx = 0;
int _cy = 0;
anywheresoftware.b4a.objects.drawable.CanvasWrapper.PathWrapper _p = null;
float _gap = 0f;
int _i = 0;
Debug.locals.put("ba", _ba);
Debug.locals.put("Canvas", _canvas);
Debug.locals.put("Radius", _radius);
Debug.locals.put("StartingDegree", _startingdegree);
Debug.locals.put("Percent", _percent);
Debug.locals.put("Color", _color);
Debug.locals.put("GapDegrees", _gapdegrees);
 BA.debugLineNum = 283;BA.debugLine="Sub calcSlice(Canvas As Canvas, Radius As Int, _  		StartingDegree As Float, Percent As Float, Color As Int, GapDegrees As Int) As Float";
Debug.ShouldStop(67108864);
 BA.debugLineNum = 285;BA.debugLine="Dim b As Float";
Debug.ShouldStop(268435456);
_b = 0f;Debug.locals.put("b", _b);
 BA.debugLineNum = 286;BA.debugLine="b = 360 * Percent";
Debug.ShouldStop(536870912);
_b = (float)(360*_percent);Debug.locals.put("b", _b);
 BA.debugLineNum = 288;BA.debugLine="Dim cx, cy As Int";
Debug.ShouldStop(-2147483648);
_cx = 0;Debug.locals.put("cx", _cx);
_cy = 0;Debug.locals.put("cy", _cy);
 BA.debugLineNum = 289;BA.debugLine="cx = Canvas.Bitmap.Width / 2";
Debug.ShouldStop(1);
_cx = (int)(_canvas.getBitmap().getWidth()/(double)2);Debug.locals.put("cx", _cx);
 BA.debugLineNum = 290;BA.debugLine="cy = Canvas.Bitmap.Height / 2";
Debug.ShouldStop(2);
_cy = (int)(_canvas.getBitmap().getHeight()/(double)2);Debug.locals.put("cy", _cy);
 BA.debugLineNum = 291;BA.debugLine="Dim p As Path";
Debug.ShouldStop(4);
_p = new anywheresoftware.b4a.objects.drawable.CanvasWrapper.PathWrapper();Debug.locals.put("p", _p);
 BA.debugLineNum = 292;BA.debugLine="p.Initialize(cx, cy)";
Debug.ShouldStop(8);
_p.Initialize((float)(_cx),(float)(_cy));
 BA.debugLineNum = 293;BA.debugLine="Dim gap As Float";
Debug.ShouldStop(16);
_gap = 0f;Debug.locals.put("gap", _gap);
 BA.debugLineNum = 294;BA.debugLine="gap = Percent * GapDegrees / 2";
Debug.ShouldStop(32);
_gap = (float)(_percent*_gapdegrees/(double)2);Debug.locals.put("gap", _gap);
 BA.debugLineNum = 295;BA.debugLine="For i = StartingDegree + gap To StartingDegree + b - gap Step 10";
Debug.ShouldStop(64);
{
final double step252 = 10;
final double limit252 = (int)(_startingdegree+_b-_gap);
for (_i = (int)(_startingdegree+_gap); (step252 > 0 && _i <= limit252) || (step252 < 0 && _i >= limit252); _i += step252) {
Debug.locals.put("i", _i);
 BA.debugLineNum = 296;BA.debugLine="p.LineTo(cx + 2 * Radius * SinD(i), cy + 2 * Radius * CosD(i))";
Debug.ShouldStop(128);
_p.LineTo((float)(_cx+2*_radius*anywheresoftware.b4a.keywords.Common.SinD(_i)),(float)(_cy+2*_radius*anywheresoftware.b4a.keywords.Common.CosD(_i)));
 }
}Debug.locals.put("i", _i);
;
 BA.debugLineNum = 298;BA.debugLine="p.LineTo(cx + 2 * Radius * SinD(StartingDegree + b - gap), cy + 2 * Radius * CosD(StartingDegree + b - gap))";
Debug.ShouldStop(512);
_p.LineTo((float)(_cx+2*_radius*anywheresoftware.b4a.keywords.Common.SinD(_startingdegree+_b-_gap)),(float)(_cy+2*_radius*anywheresoftware.b4a.keywords.Common.CosD(_startingdegree+_b-_gap)));
 BA.debugLineNum = 299;BA.debugLine="p.LineTo(cx, cy)";
Debug.ShouldStop(1024);
_p.LineTo((float)(_cx),(float)(_cy));
 BA.debugLineNum = 300;BA.debugLine="Canvas.ClipPath(p) 'We are limiting the drawings to the required slice";
Debug.ShouldStop(2048);
_canvas.ClipPath((android.graphics.Path)(_p.getObject()));
 BA.debugLineNum = 301;BA.debugLine="Canvas.DrawCircle(cx, cy, Radius, Color, True, 0)";
Debug.ShouldStop(4096);
_canvas.DrawCircle((float)(_cx),(float)(_cy),(float)(_radius),_color,anywheresoftware.b4a.keywords.Common.True,(float)(0));
 BA.debugLineNum = 302;BA.debugLine="Canvas.RemoveClip";
Debug.ShouldStop(8192);
_canvas.RemoveClip();
 BA.debugLineNum = 303;BA.debugLine="Return b";
Debug.ShouldStop(16384);
if (true) return _b;
 BA.debugLineNum = 304;BA.debugLine="End Sub";
Debug.ShouldStop(32768);
return 0f;
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static anywheresoftware.b4a.objects.drawable.CanvasWrapper.BitmapWrapper  _createlegend(anywheresoftware.b4a.BA _ba,charts._piedata _pd) throws Exception{
		Debug.PushSubsStack("createLegend (charts) ","charts",1,_ba,mostCurrent);
try {
anywheresoftware.b4a.objects.drawable.CanvasWrapper.BitmapWrapper _bmp = null;
float _textheight = 0f;
float _textwidth = 0f;
int _i = 0;
charts._pieitem _it = null;
anywheresoftware.b4a.objects.drawable.CanvasWrapper _c = null;
Debug.locals.put("ba", _ba);
Debug.locals.put("PD", _pd);
 BA.debugLineNum = 306;BA.debugLine="Sub createLegend(PD As PieData) As Bitmap";
Debug.ShouldStop(131072);
 BA.debugLineNum = 307;BA.debugLine="Dim bmp As Bitmap";
Debug.ShouldStop(262144);
_bmp = new anywheresoftware.b4a.objects.drawable.CanvasWrapper.BitmapWrapper();Debug.locals.put("bmp", _bmp);
 BA.debugLineNum = 308;BA.debugLine="If PD.LegendTextSize = 0 Then PD.LegendTextSize = 15";
Debug.ShouldStop(524288);
if (_pd.LegendTextSize==0) { 
_pd.LegendTextSize = (float)(15);Debug.locals.put("PD", _pd);};
 BA.debugLineNum = 309;BA.debugLine="Dim textHeight, textWidth As Float";
Debug.ShouldStop(1048576);
_textheight = 0f;Debug.locals.put("textHeight", _textheight);
_textwidth = 0f;Debug.locals.put("textWidth", _textwidth);
 BA.debugLineNum = 310;BA.debugLine="textHeight = PD.Canvas.MeasureStringHeight(\"M\", Typeface.DEFAULT_BOLD, PD.LegendTextSize)";
Debug.ShouldStop(2097152);
_textheight = _pd.Canvas.MeasureStringHeight("M",anywheresoftware.b4a.keywords.Common.Typeface.DEFAULT_BOLD,_pd.LegendTextSize);Debug.locals.put("textHeight", _textheight);
 BA.debugLineNum = 311;BA.debugLine="For i = 0 To PD.Items.Size - 1";
Debug.ShouldStop(4194304);
{
final double step267 = 1;
final double limit267 = (int)(_pd.Items.getSize()-1);
for (_i = (int)(0); (step267 > 0 && _i <= limit267) || (step267 < 0 && _i >= limit267); _i += step267) {
Debug.locals.put("i", _i);
 BA.debugLineNum = 312;BA.debugLine="Dim it As PieItem";
Debug.ShouldStop(8388608);
_it = new charts._pieitem();Debug.locals.put("it", _it);
 BA.debugLineNum = 313;BA.debugLine="it = PD.Items.Get(i)";
Debug.ShouldStop(16777216);
_it = (charts._pieitem)(_pd.Items.Get(_i));Debug.locals.put("it", _it);
 BA.debugLineNum = 314;BA.debugLine="textWidth = Max(textWidth, PD.Canvas.MeasureStringWidth(it.Name, Typeface.DEFAULT_BOLD, PD.LegendTextSize))";
Debug.ShouldStop(33554432);
_textwidth = (float)(anywheresoftware.b4a.keywords.Common.Max(_textwidth,_pd.Canvas.MeasureStringWidth(_it.Name,anywheresoftware.b4a.keywords.Common.Typeface.DEFAULT_BOLD,_pd.LegendTextSize)));Debug.locals.put("textWidth", _textwidth);
 }
}Debug.locals.put("i", _i);
;
 BA.debugLineNum = 316;BA.debugLine="bmp.InitializeMutable(textWidth + 20dip, 10dip +(textHeight + 10dip) * PD.Items.Size)";
Debug.ShouldStop(134217728);
_bmp.InitializeMutable((int)(_textwidth+anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(20))),(int)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(10))+(_textheight+anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(10)))*_pd.Items.getSize()));
 BA.debugLineNum = 317;BA.debugLine="Dim c As Canvas";
Debug.ShouldStop(268435456);
_c = new anywheresoftware.b4a.objects.drawable.CanvasWrapper();Debug.locals.put("c", _c);
 BA.debugLineNum = 318;BA.debugLine="c.Initialize2(bmp)";
Debug.ShouldStop(536870912);
_c.Initialize2((android.graphics.Bitmap)(_bmp.getObject()));
 BA.debugLineNum = 319;BA.debugLine="c.DrawColor(PD.LegendBackColor)";
Debug.ShouldStop(1073741824);
_c.DrawColor(_pd.LegendBackColor);
 BA.debugLineNum = 320;BA.debugLine="For i = 0 To PD.Items.Size - 1";
Debug.ShouldStop(-2147483648);
{
final double step276 = 1;
final double limit276 = (int)(_pd.Items.getSize()-1);
for (_i = (int)(0); (step276 > 0 && _i <= limit276) || (step276 < 0 && _i >= limit276); _i += step276) {
Debug.locals.put("i", _i);
 BA.debugLineNum = 321;BA.debugLine="Dim it As PieItem";
Debug.ShouldStop(1);
_it = new charts._pieitem();Debug.locals.put("it", _it);
 BA.debugLineNum = 322;BA.debugLine="it = PD.Items.Get(i)";
Debug.ShouldStop(2);
_it = (charts._pieitem)(_pd.Items.Get(_i));Debug.locals.put("it", _it);
 BA.debugLineNum = 323;BA.debugLine="c.DrawText(it.Name, 10dip, (i + 1) * (textHeight + 10dip), Typeface.DEFAULT_BOLD, PD.LegendTextSize, _ 			it.Color, \"LEFT\")";
Debug.ShouldStop(4);
_c.DrawText(_ba,_it.Name,(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(10))),(float)((_i+1)*(_textheight+anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(10)))),anywheresoftware.b4a.keywords.Common.Typeface.DEFAULT_BOLD,_pd.LegendTextSize,_it.Color,BA.getEnumFromString(android.graphics.Paint.Align.class,"LEFT"));
 }
}Debug.locals.put("i", _i);
;
 BA.debugLineNum = 326;BA.debugLine="Return bmp";
Debug.ShouldStop(32);
if (true) return _bmp;
 BA.debugLineNum = 327;BA.debugLine="End Sub";
Debug.ShouldStop(64);
return null;
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static String  _drawbarschart(anywheresoftware.b4a.BA _ba,charts._graph _g,charts._bardata _bd,int _backcolor) throws Exception{
		Debug.PushSubsStack("DrawBarsChart (charts) ","charts",1,_ba,mostCurrent);
try {
charts._linepoint _point = null;
anywheresoftware.b4a.objects.drawable.CanvasWrapper.RectWrapper _rect = null;
int _numberofbars = 0;
int _i = 0;
int _a = 0;
Debug.locals.put("ba", _ba);
Debug.locals.put("G", _g);
Debug.locals.put("BD", _bd);
Debug.locals.put("BackColor", _backcolor);
 BA.debugLineNum = 40;BA.debugLine="Sub DrawBarsChart(G As Graph, BD As BarData, BackColor As Int)";
Debug.ShouldStop(128);
 BA.debugLineNum = 41;BA.debugLine="If BD.Points.Size = 0 Then";
Debug.ShouldStop(256);
if (_bd.Points.getSize()==0) { 
 BA.debugLineNum = 42;BA.debugLine="ToastMessageShow(\"Missing bars points.\", True)";
Debug.ShouldStop(512);
anywheresoftware.b4a.keywords.Common.ToastMessageShow("Missing bars points.",anywheresoftware.b4a.keywords.Common.True);
 BA.debugLineNum = 43;BA.debugLine="Return";
Debug.ShouldStop(1024);
if (true) return "";
 };
 BA.debugLineNum = 45;BA.debugLine="BD.Canvas.Initialize(BD.Target)";
Debug.ShouldStop(4096);
_bd.Canvas.Initialize((android.view.View)(_bd.Target.getObject()));
 BA.debugLineNum = 46;BA.debugLine="BD.Canvas.DrawColor(BackColor)";
Debug.ShouldStop(8192);
_bd.Canvas.DrawColor(_backcolor);
 BA.debugLineNum = 47;BA.debugLine="Dim point As LinePoint";
Debug.ShouldStop(16384);
_point = new charts._linepoint();Debug.locals.put("point", _point);
 BA.debugLineNum = 48;BA.debugLine="point = BD.Points.Get(1)";
Debug.ShouldStop(32768);
_point = (charts._linepoint)(_bd.Points.Get((int)(1)));Debug.locals.put("point", _point);
 BA.debugLineNum = 49;BA.debugLine="If BD.Stacked = False Then";
Debug.ShouldStop(65536);
if (_bd.Stacked==anywheresoftware.b4a.keywords.Common.False) { 
 BA.debugLineNum = 50;BA.debugLine="drawGraph(G, BD.Canvas, BD.Target, BD.Points, True, BD.BarsWidth)";
Debug.ShouldStop(131072);
_drawgraph(_ba,_g,_bd.Canvas,(anywheresoftware.b4a.objects.ConcreteViewWrapper) anywheresoftware.b4a.AbsObjectWrapper.ConvertToWrapper(new anywheresoftware.b4a.objects.ConcreteViewWrapper(), (android.view.View)(_bd.Target.getObject())),_bd.Points,anywheresoftware.b4a.keywords.Common.True,_bd.BarsWidth);
 }else {
 BA.debugLineNum = 53;BA.debugLine="drawGraph(G, BD.Canvas, BD.Target, BD.Points, True, BD.BarsWidth / point.YArray.Length)";
Debug.ShouldStop(1048576);
_drawgraph(_ba,_g,_bd.Canvas,(anywheresoftware.b4a.objects.ConcreteViewWrapper) anywheresoftware.b4a.AbsObjectWrapper.ConvertToWrapper(new anywheresoftware.b4a.objects.ConcreteViewWrapper(), (android.view.View)(_bd.Target.getObject())),_bd.Points,anywheresoftware.b4a.keywords.Common.True,(int)(_bd.BarsWidth/(double)_point.YArray.length));
 };
 BA.debugLineNum = 57;BA.debugLine="Dim Rect As Rect";
Debug.ShouldStop(16777216);
_rect = new anywheresoftware.b4a.objects.drawable.CanvasWrapper.RectWrapper();Debug.locals.put("Rect", _rect);
 BA.debugLineNum = 58;BA.debugLine="Rect.Initialize(0, 0, 0, G.GI.originY)";
Debug.ShouldStop(33554432);
_rect.Initialize((int)(0),(int)(0),(int)(0),_g.GI.originY);
 BA.debugLineNum = 59;BA.debugLine="Dim numberOfBars As Int";
Debug.ShouldStop(67108864);
_numberofbars = 0;Debug.locals.put("numberOfBars", _numberofbars);
 BA.debugLineNum = 60;BA.debugLine="numberOfBars = point.YArray.Length";
Debug.ShouldStop(134217728);
_numberofbars = _point.YArray.length;Debug.locals.put("numberOfBars", _numberofbars);
 BA.debugLineNum = 62;BA.debugLine="For i = 1 To BD.Points.Size - 1";
Debug.ShouldStop(536870912);
{
final double step47 = 1;
final double limit47 = (int)(_bd.Points.getSize()-1);
for (_i = (int)(1); (step47 > 0 && _i <= limit47) || (step47 < 0 && _i >= limit47); _i += step47) {
Debug.locals.put("i", _i);
 BA.debugLineNum = 63;BA.debugLine="point = BD.Points.Get(i)";
Debug.ShouldStop(1073741824);
_point = (charts._linepoint)(_bd.Points.Get(_i));Debug.locals.put("point", _point);
 BA.debugLineNum = 64;BA.debugLine="For a = 0 To numberOfBars - 1";
Debug.ShouldStop(-2147483648);
{
final double step49 = 1;
final double limit49 = (int)(_numberofbars-1);
for (_a = (int)(0); (step49 > 0 && _a <= limit49) || (step49 < 0 && _a >= limit49); _a += step49) {
Debug.locals.put("a", _a);
 BA.debugLineNum = 65;BA.debugLine="If BD.Stacked = False Then";
Debug.ShouldStop(1);
if (_bd.Stacked==anywheresoftware.b4a.keywords.Common.False) { 
 BA.debugLineNum = 66;BA.debugLine="Rect.Left = G.GI.originX + G.GI.intervalX * i + (a - numberOfBars / 2) * BD.BarsWidth";
Debug.ShouldStop(2);
_rect.setLeft((int)(_g.GI.originX+_g.GI.intervalX*_i+(_a-_numberofbars/(double)2)*_bd.BarsWidth));
 BA.debugLineNum = 67;BA.debugLine="Rect.Right = Rect.Left + BD.BarsWidth";
Debug.ShouldStop(4);
_rect.setRight((int)(_rect.getLeft()+_bd.BarsWidth));
 BA.debugLineNum = 68;BA.debugLine="If G.YStart < 0 AND G.YEnd > 0 Then";
Debug.ShouldStop(8);
if (_g.YStart<0 && _g.YEnd>0) { 
 BA.debugLineNum = 69;BA.debugLine="If point.YArray(a) > 0 Then";
Debug.ShouldStop(16);
if (_point.YArray[_a]>0) { 
 BA.debugLineNum = 70;BA.debugLine="Rect.Top = calcPointToPixel(point.YArray(a), G)";
Debug.ShouldStop(32);
_rect.setTop(_calcpointtopixel(_ba,_point.YArray[_a],_g));
 BA.debugLineNum = 71;BA.debugLine="Rect.Bottom = G.GI.zeroY";
Debug.ShouldStop(64);
_rect.setBottom(_g.GI.zeroY);
 }else {
 BA.debugLineNum = 73;BA.debugLine="Rect.Bottom = calcPointToPixel(point.YArray(a), G)";
Debug.ShouldStop(256);
_rect.setBottom(_calcpointtopixel(_ba,_point.YArray[_a],_g));
 BA.debugLineNum = 74;BA.debugLine="Rect.Top = G.GI.zeroY";
Debug.ShouldStop(512);
_rect.setTop(_g.GI.zeroY);
 };
 }else {
 BA.debugLineNum = 77;BA.debugLine="Rect.Top = calcPointToPixel(point.YArray(a), G)";
Debug.ShouldStop(4096);
_rect.setTop(_calcpointtopixel(_ba,_point.YArray[_a],_g));
 BA.debugLineNum = 78;BA.debugLine="Rect.Bottom = G.GI.originY";
Debug.ShouldStop(8192);
_rect.setBottom(_g.GI.originY);
 };
 }else {
 BA.debugLineNum = 81;BA.debugLine="Rect.Left = G.GI.originX + G.GI.intervalX * i - BD.BarsWidth / 2";
Debug.ShouldStop(65536);
_rect.setLeft((int)(_g.GI.originX+_g.GI.intervalX*_i-_bd.BarsWidth/(double)2));
 BA.debugLineNum = 82;BA.debugLine="Rect.Right = Rect.Left + BD.BarsWidth";
Debug.ShouldStop(131072);
_rect.setRight((int)(_rect.getLeft()+_bd.BarsWidth));
 BA.debugLineNum = 83;BA.debugLine="If a = 0 Then";
Debug.ShouldStop(262144);
if (_a==0) { 
 BA.debugLineNum = 84;BA.debugLine="Rect.Top = calcPointToPixel(0, G)";
Debug.ShouldStop(524288);
_rect.setTop(_calcpointtopixel(_ba,(float)(0),_g));
 };
 BA.debugLineNum = 86;BA.debugLine="Rect.Bottom = Rect.Top";
Debug.ShouldStop(2097152);
_rect.setBottom(_rect.getTop());
 BA.debugLineNum = 87;BA.debugLine="Rect.Top = Rect.Bottom + calcPointToPixel(point.YArray(a), G) - G.GI.originY";
Debug.ShouldStop(4194304);
_rect.setTop((int)(_rect.getBottom()+_calcpointtopixel(_ba,_point.YArray[_a],_g)-_g.GI.originY));
 };
 BA.debugLineNum = 89;BA.debugLine="BD.Canvas.DrawRect(Rect, BD.BarsColors.Get(a), True, 1dip)";
Debug.ShouldStop(16777216);
_bd.Canvas.DrawRect((android.graphics.Rect)(_rect.getObject()),(int)(BA.ObjectToNumber(_bd.BarsColors.Get(_a))),anywheresoftware.b4a.keywords.Common.True,(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(1))));
 }
}Debug.locals.put("a", _a);
;
 }
}Debug.locals.put("i", _i);
;
 BA.debugLineNum = 92;BA.debugLine="BD.Target.Invalidate";
Debug.ShouldStop(134217728);
_bd.Target.Invalidate();
 BA.debugLineNum = 93;BA.debugLine="End Sub";
Debug.ShouldStop(268435456);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static String  _drawgraph(anywheresoftware.b4a.BA _ba,charts._graph _g,anywheresoftware.b4a.objects.drawable.CanvasWrapper _canvas,anywheresoftware.b4a.objects.ConcreteViewWrapper _target,anywheresoftware.b4a.objects.collections.List _points,boolean _bars,int _barswidth) throws Exception{
		Debug.PushSubsStack("drawGraph (charts) ","charts",1,_ba,mostCurrent);
try {
charts._graphinternal _gi = null;
charts._linepoint _p = null;
int _i = 0;
int _y = 0;
float _yvalue = 0f;
int _x = 0;
Debug.locals.put("ba", _ba);
Debug.locals.put("G", _g);
Debug.locals.put("Canvas", _canvas);
Debug.locals.put("Target", _target);
Debug.locals.put("Points", _points);
Debug.locals.put("Bars", _bars);
Debug.locals.put("BarsWidth", _barswidth);
 BA.debugLineNum = 97;BA.debugLine="Sub drawGraph (G As Graph, Canvas As Canvas, Target As View, Points As List, Bars As Boolean, BarsWidth As Int)";
Debug.ShouldStop(1);
 BA.debugLineNum = 98;BA.debugLine="Dim GI As GraphInternal";
Debug.ShouldStop(2);
_gi = new charts._graphinternal();Debug.locals.put("GI", _gi);
 BA.debugLineNum = 99;BA.debugLine="G.GI = GI";
Debug.ShouldStop(4);
_g.GI = _gi;Debug.locals.put("G", _g);
 BA.debugLineNum = 100;BA.debugLine="GI.Initialize";
Debug.ShouldStop(8);
_gi.Initialize();
 BA.debugLineNum = 101;BA.debugLine="GI.maxY = 40dip											' top margin";
Debug.ShouldStop(16);
_gi.maxY = anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(40));Debug.locals.put("GI", _gi);
 BA.debugLineNum = 102;BA.debugLine="GI.originX = 50dip									' left margin";
Debug.ShouldStop(32);
_gi.originX = anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(50));Debug.locals.put("GI", _gi);
 BA.debugLineNum = 103;BA.debugLine="GI.originY = Target.Height - 60dip	' 60dip = right margin";
Debug.ShouldStop(64);
_gi.originY = (int)(_target.getHeight()-anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(60)));Debug.locals.put("GI", _gi);
 BA.debugLineNum = 104;BA.debugLine="GI.gw = Target.Width - 70dip				' graph width 70dip = bottom margin";
Debug.ShouldStop(128);
_gi.gw = (int)(_target.getWidth()-anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(70)));Debug.locals.put("GI", _gi);
 BA.debugLineNum = 105;BA.debugLine="GI.gh = GI.originY - GI.maxY				' graph height";
Debug.ShouldStop(256);
_gi.gh = (int)(_gi.originY-_gi.maxY);Debug.locals.put("GI", _gi);
 BA.debugLineNum = 106;BA.debugLine="If G.YStart < 0 AND G.YEnd > 0 Then";
Debug.ShouldStop(512);
if (_g.YStart<0 && _g.YEnd>0) { 
 BA.debugLineNum = 107;BA.debugLine="GI.zeroY = GI.maxY + GI.gh * G.YEnd / (G.YEnd - G.YStart)";
Debug.ShouldStop(1024);
_gi.zeroY = (int)(_gi.maxY+_gi.gh*_g.YEnd/(double)(_g.YEnd-_g.YStart));Debug.locals.put("GI", _gi);
 }else {
 BA.debugLineNum = 109;BA.debugLine="GI.zeroY = GI.originY";
Debug.ShouldStop(4096);
_gi.zeroY = _gi.originY;Debug.locals.put("GI", _gi);
 };
 BA.debugLineNum = 111;BA.debugLine="If Bars Then";
Debug.ShouldStop(16384);
if (_bars) { 
 BA.debugLineNum = 112;BA.debugLine="Dim p As LinePoint";
Debug.ShouldStop(32768);
_p = new charts._linepoint();Debug.locals.put("p", _p);
 BA.debugLineNum = 113;BA.debugLine="p = Points.Get(1)";
Debug.ShouldStop(65536);
_p = (charts._linepoint)(_points.Get((int)(1)));Debug.locals.put("p", _p);
 BA.debugLineNum = 114;BA.debugLine="GI.intervalX = (GI.gw - p.YArray.Length / 2 * BarsWidth) / (Points.Size - 1)";
Debug.ShouldStop(131072);
_gi.intervalX = (float)((_gi.gw-_p.YArray.length/(double)2*_barswidth)/(double)(_points.getSize()-1));Debug.locals.put("GI", _gi);
 }else {
 BA.debugLineNum = 116;BA.debugLine="GI.intervalX = GI.gw / (Points.Size - 1)";
Debug.ShouldStop(524288);
_gi.intervalX = (float)(_gi.gw/(double)(_points.getSize()-1));Debug.locals.put("GI", _gi);
 };
 BA.debugLineNum = 119;BA.debugLine="Canvas.DrawLine(GI.originX, GI.originY + 2dip, GI.originX, GI.maxY - 2dip, G.AxisColor, 2dip)";
Debug.ShouldStop(4194304);
_canvas.DrawLine((float)(_gi.originX),(float)(_gi.originY+anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(2))),(float)(_gi.originX),(float)(_gi.maxY-anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(2))),_g.AxisColor,(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(2))));
 BA.debugLineNum = 120;BA.debugLine="For i = 0 To (G.YEnd - G.YStart) / G.Yinterval + 1";
Debug.ShouldStop(8388608);
{
final double step101 = 1;
final double limit101 = (int)((_g.YEnd-_g.YStart)/(double)_g.YInterval+1);
for (_i = (int)(0); (step101 > 0 && _i <= limit101) || (step101 < 0 && _i >= limit101); _i += step101) {
Debug.locals.put("i", _i);
 BA.debugLineNum = 121;BA.debugLine="Dim y As Int";
Debug.ShouldStop(16777216);
_y = 0;Debug.locals.put("y", _y);
 BA.debugLineNum = 122;BA.debugLine="Dim yValue As Float";
Debug.ShouldStop(33554432);
_yvalue = 0f;Debug.locals.put("yValue", _yvalue);
 BA.debugLineNum = 123;BA.debugLine="yValue = G.YStart + G.YInterval * i";
Debug.ShouldStop(67108864);
_yvalue = (float)(_g.YStart+_g.YInterval*_i);Debug.locals.put("yValue", _yvalue);
 BA.debugLineNum = 124;BA.debugLine="If yValue > G.YEnd Then Continue";
Debug.ShouldStop(134217728);
if (_yvalue>_g.YEnd) { 
if (true) continue;};
 BA.debugLineNum = 125;BA.debugLine="y = calcPointToPixel(yValue, G)";
Debug.ShouldStop(268435456);
_y = _calcpointtopixel(_ba,_yvalue,_g);Debug.locals.put("y", _y);
 BA.debugLineNum = 126;BA.debugLine="Canvas.DrawLine(GI.originX, y, GI.originX - 5dip, y, G.AxisColor, 2dip)";
Debug.ShouldStop(536870912);
_canvas.DrawLine((float)(_gi.originX),(float)(_y),(float)(_gi.originX-anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(5))),(float)(_y),_g.AxisColor,(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(2))));
 BA.debugLineNum = 127;BA.debugLine="If i < (G.YEnd - G.YStart) / G.Yinterval Then";
Debug.ShouldStop(1073741824);
if (_i<(_g.YEnd-_g.YStart)/(double)_g.YInterval) { 
 BA.debugLineNum = 128;BA.debugLine="Canvas.DrawLine(GI.originX, y, GI.originX + GI.gw, y, G.AxisColor, 1dip)";
Debug.ShouldStop(-2147483648);
_canvas.DrawLine((float)(_gi.originX),(float)(_y),(float)(_gi.originX+_gi.gw),(float)(_y),_g.AxisColor,(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(1))));
 }else {
 BA.debugLineNum = 130;BA.debugLine="Canvas.DrawLine(GI.originX, y, GI.originX + GI.gw, y, G.AxisColor, 2dip)";
Debug.ShouldStop(2);
_canvas.DrawLine((float)(_gi.originX),(float)(_y),(float)(_gi.originX+_gi.gw),(float)(_y),_g.AxisColor,(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(2))));
 };
 BA.debugLineNum = 132;BA.debugLine="Canvas.DrawText(NumberFormat(yValue, 1, 2), GI.originX - 8dip, y + 5dip,Typeface.DEFAULT, 12, G.AxisColor, \"RIGHT\")";
Debug.ShouldStop(8);
_canvas.DrawText(_ba,anywheresoftware.b4a.keywords.Common.NumberFormat(_yvalue,(int)(1),(int)(2)),(float)(_gi.originX-anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(8))),(float)(_y+anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(5))),anywheresoftware.b4a.keywords.Common.Typeface.DEFAULT,(float)(12),_g.AxisColor,BA.getEnumFromString(android.graphics.Paint.Align.class,"RIGHT"));
 }
}Debug.locals.put("i", _i);
;
 BA.debugLineNum = 135;BA.debugLine="Canvas.DrawText(G.Title, Target.Width / 2, 30dip, Typeface.DEFAULT_BOLD, 15, G.AxisColor, \"CENTER\")";
Debug.ShouldStop(64);
_canvas.DrawText(_ba,_g.Title,(float)(_target.getWidth()/(double)2),(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(30))),anywheresoftware.b4a.keywords.Common.Typeface.DEFAULT_BOLD,(float)(15),_g.AxisColor,BA.getEnumFromString(android.graphics.Paint.Align.class,"CENTER"));
 BA.debugLineNum = 136;BA.debugLine="Canvas.DrawText(G.XAxis, Target.Width / 2, GI.originY + 45dip, Typeface.DEFAULT, 14, G.AxisColor, \"CENTER\")";
Debug.ShouldStop(128);
_canvas.DrawText(_ba,_g.XAxis,(float)(_target.getWidth()/(double)2),(float)(_gi.originY+anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(45))),anywheresoftware.b4a.keywords.Common.Typeface.DEFAULT,(float)(14),_g.AxisColor,BA.getEnumFromString(android.graphics.Paint.Align.class,"CENTER"));
 BA.debugLineNum = 137;BA.debugLine="Canvas.DrawTextRotated(G.YAxis, 15dip, Target.Height / 2, Typeface.DEFAULT, 14, G.AxisColor, \"CENTER\", -90)";
Debug.ShouldStop(256);
_canvas.DrawTextRotated(_ba,_g.YAxis,(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(15))),(float)(_target.getHeight()/(double)2),anywheresoftware.b4a.keywords.Common.Typeface.DEFAULT,(float)(14),_g.AxisColor,BA.getEnumFromString(android.graphics.Paint.Align.class,"CENTER"),(float)(-90));
 BA.debugLineNum = 139;BA.debugLine="Canvas.DrawLine(GI.originX, GI.originY, GI.originX + GI.gw, GI.originY, G.AxisColor, 2dip)";
Debug.ShouldStop(1024);
_canvas.DrawLine((float)(_gi.originX),(float)(_gi.originY),(float)(_gi.originX+_gi.gw),(float)(_gi.originY),_g.AxisColor,(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(2))));
 BA.debugLineNum = 140;BA.debugLine="For i = 0 To Points.Size - 1";
Debug.ShouldStop(2048);
{
final double step119 = 1;
final double limit119 = (int)(_points.getSize()-1);
for (_i = (int)(0); (step119 > 0 && _i <= limit119) || (step119 < 0 && _i >= limit119); _i += step119) {
Debug.locals.put("i", _i);
 BA.debugLineNum = 141;BA.debugLine="Dim p As LinePoint";
Debug.ShouldStop(4096);
_p = new charts._linepoint();Debug.locals.put("p", _p);
 BA.debugLineNum = 142;BA.debugLine="p = Points.Get(i)";
Debug.ShouldStop(8192);
_p = (charts._linepoint)(_points.Get(_i));Debug.locals.put("p", _p);
 BA.debugLineNum = 143;BA.debugLine="If p.ShowTick Then";
Debug.ShouldStop(16384);
if (_p.ShowTick) { 
 BA.debugLineNum = 144;BA.debugLine="Dim x As Int";
Debug.ShouldStop(32768);
_x = 0;Debug.locals.put("x", _x);
 BA.debugLineNum = 145;BA.debugLine="x = GI.originX + i * GI.intervalX";
Debug.ShouldStop(65536);
_x = (int)(_gi.originX+_i*_gi.intervalX);Debug.locals.put("x", _x);
 BA.debugLineNum = 146;BA.debugLine="Canvas.DrawLine(x, GI.originY, x, GI.originY + 5dip, G.AxisColor, 2dip)";
Debug.ShouldStop(131072);
_canvas.DrawLine((float)(_x),(float)(_gi.originY),(float)(_x),(float)(_gi.originY+anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(5))),_g.AxisColor,(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(2))));
 BA.debugLineNum = 147;BA.debugLine="If Bars = False Then";
Debug.ShouldStop(262144);
if (_bars==anywheresoftware.b4a.keywords.Common.False) { 
 BA.debugLineNum = 148;BA.debugLine="If i < Points.Size - 1 Then";
Debug.ShouldStop(524288);
if (_i<_points.getSize()-1) { 
 BA.debugLineNum = 149;BA.debugLine="Canvas.DrawLine(x, GI.originY, x, GI.maxY, G.AxisColor, 1dip) 'vertical lines";
Debug.ShouldStop(1048576);
_canvas.DrawLine((float)(_x),(float)(_gi.originY),(float)(_x),(float)(_gi.maxY),_g.AxisColor,(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(1))));
 }else {
 BA.debugLineNum = 151;BA.debugLine="Canvas.DrawLine(x, GI.originY, x, GI.maxY, G.AxisColor, 2dip) 'last vertical line";
Debug.ShouldStop(4194304);
_canvas.DrawLine((float)(_x),(float)(_gi.originY),(float)(_x),(float)(_gi.maxY),_g.AxisColor,(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(2))));
 };
 };
 BA.debugLineNum = 154;BA.debugLine="If p.x.Length > 0 Then";
Debug.ShouldStop(33554432);
if (_p.X.length()>0) { 
 BA.debugLineNum = 155;BA.debugLine="Canvas.DrawTextRotated(p.x, x, GI.originY + 12dip, Typeface.DEFAULT, 12, G.AxisColor, \"RIGHT\", -45)";
Debug.ShouldStop(67108864);
_canvas.DrawTextRotated(_ba,_p.X,(float)(_x),(float)(_gi.originY+anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(12))),anywheresoftware.b4a.keywords.Common.Typeface.DEFAULT,(float)(12),_g.AxisColor,BA.getEnumFromString(android.graphics.Paint.Align.class,"RIGHT"),(float)(-45));
 };
 };
 }
}Debug.locals.put("i", _i);
;
 BA.debugLineNum = 159;BA.debugLine="End Sub";
Debug.ShouldStop(1073741824);
return "";
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static String  _drawlinechart(anywheresoftware.b4a.BA _ba,charts._graph _g,charts._linedata _ld,int _backcolor) throws Exception{
		Debug.PushSubsStack("DrawLineChart (charts) ","charts",1,_ba,mostCurrent);
try {
charts._linepoint _point = null;
float[] _py2 = null;
int _i = 0;
int _a = 0;
float _py = 0f;
Debug.locals.put("ba", _ba);
Debug.locals.put("G", _g);
Debug.locals.put("LD", _ld);
Debug.locals.put("BackColor", _backcolor);
 BA.debugLineNum = 188;BA.debugLine="Sub DrawLineChart(G As Graph, LD As LineData, BackColor As Int)";
Debug.ShouldStop(134217728);
 BA.debugLineNum = 189;BA.debugLine="If LD.Points.Size = 0 Then";
Debug.ShouldStop(268435456);
if (_ld.Points.getSize()==0) { 
 BA.debugLineNum = 190;BA.debugLine="ToastMessageShow(\"Missing line points.\", True)";
Debug.ShouldStop(536870912);
anywheresoftware.b4a.keywords.Common.ToastMessageShow("Missing line points.",anywheresoftware.b4a.keywords.Common.True);
 BA.debugLineNum = 191;BA.debugLine="Return";
Debug.ShouldStop(1073741824);
if (true) return "";
 };
 BA.debugLineNum = 193;BA.debugLine="LD.Canvas.Initialize(LD.Target)";
Debug.ShouldStop(1);
_ld.Canvas.Initialize((android.view.View)(_ld.Target.getObject()));
 BA.debugLineNum = 194;BA.debugLine="LD.Canvas.DrawColor(BackColor)";
Debug.ShouldStop(2);
_ld.Canvas.DrawColor(_backcolor);
 BA.debugLineNum = 195;BA.debugLine="drawGraph(G, LD.Canvas, LD.Target, LD.Points, False, 0)";
Debug.ShouldStop(4);
_drawgraph(_ba,_g,_ld.Canvas,(anywheresoftware.b4a.objects.ConcreteViewWrapper) anywheresoftware.b4a.AbsObjectWrapper.ConvertToWrapper(new anywheresoftware.b4a.objects.ConcreteViewWrapper(), (android.view.View)(_ld.Target.getObject())),_ld.Points,anywheresoftware.b4a.keywords.Common.False,(int)(0));
 BA.debugLineNum = 197;BA.debugLine="Dim point As LinePoint";
Debug.ShouldStop(16);
_point = new charts._linepoint();Debug.locals.put("point", _point);
 BA.debugLineNum = 198;BA.debugLine="point = LD.Points.Get(0)";
Debug.ShouldStop(32);
_point = (charts._linepoint)(_ld.Points.Get((int)(0)));Debug.locals.put("point", _point);
 BA.debugLineNum = 199;BA.debugLine="If point.YArray.Length > 0 Then";
Debug.ShouldStop(64);
if (_point.YArray.length>0) { 
 BA.debugLineNum = 201;BA.debugLine="Dim py2(point.YArray.Length) As Float";
Debug.ShouldStop(256);
_py2 = new float[_point.YArray.length];
;Debug.locals.put("py2", _py2);
 BA.debugLineNum = 203;BA.debugLine="For i = 0 To py2.Length - 1";
Debug.ShouldStop(1024);
{
final double step173 = 1;
final double limit173 = (int)(_py2.length-1);
for (_i = (int)(0); (step173 > 0 && _i <= limit173) || (step173 < 0 && _i >= limit173); _i += step173) {
Debug.locals.put("i", _i);
 BA.debugLineNum = 204;BA.debugLine="py2(i) = point.YArray(i)";
Debug.ShouldStop(2048);
_py2[_i] = _point.YArray[_i];Debug.locals.put("py2", _py2);
 }
}Debug.locals.put("i", _i);
;
 BA.debugLineNum = 207;BA.debugLine="For i = 1 To LD.Points.Size - 1";
Debug.ShouldStop(16384);
{
final double step176 = 1;
final double limit176 = (int)(_ld.Points.getSize()-1);
for (_i = (int)(1); (step176 > 0 && _i <= limit176) || (step176 < 0 && _i >= limit176); _i += step176) {
Debug.locals.put("i", _i);
 BA.debugLineNum = 208;BA.debugLine="point = LD.Points.Get(i)";
Debug.ShouldStop(32768);
_point = (charts._linepoint)(_ld.Points.Get(_i));Debug.locals.put("point", _point);
 BA.debugLineNum = 209;BA.debugLine="For a = 0 To py2.Length - 1";
Debug.ShouldStop(65536);
{
final double step178 = 1;
final double limit178 = (int)(_py2.length-1);
for (_a = (int)(0); (step178 > 0 && _a <= limit178) || (step178 < 0 && _a >= limit178); _a += step178) {
Debug.locals.put("a", _a);
 BA.debugLineNum = 210;BA.debugLine="LD.Canvas.DrawLine(G.GI.originX + G.GI.intervalX * (i - 1), calcPointToPixel(py2(a), G), G.GI.originX + G.GI.intervalX * i, calcPointToPixel(point.YArray(a), G), LD.LinesColors.Get(a), 2dip)";
Debug.ShouldStop(131072);
_ld.Canvas.DrawLine((float)(_g.GI.originX+_g.GI.intervalX*(_i-1)),(float)(_calcpointtopixel(_ba,_py2[_a],_g)),(float)(_g.GI.originX+_g.GI.intervalX*_i),(float)(_calcpointtopixel(_ba,_point.YArray[_a],_g)),(int)(BA.ObjectToNumber(_ld.LinesColors.Get(_a))),(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(2))));
 BA.debugLineNum = 211;BA.debugLine="py2(a) = point.YArray(a)";
Debug.ShouldStop(262144);
_py2[_a] = _point.YArray[_a];Debug.locals.put("py2", _py2);
 }
}Debug.locals.put("a", _a);
;
 }
}Debug.locals.put("i", _i);
;
 }else {
 BA.debugLineNum = 216;BA.debugLine="Dim py As Float";
Debug.ShouldStop(8388608);
_py = 0f;Debug.locals.put("py", _py);
 BA.debugLineNum = 217;BA.debugLine="py = point.Y";
Debug.ShouldStop(16777216);
_py = _point.Y;Debug.locals.put("py", _py);
 BA.debugLineNum = 218;BA.debugLine="For i = 1 To LD.Points.Size - 1";
Debug.ShouldStop(33554432);
{
final double step186 = 1;
final double limit186 = (int)(_ld.Points.getSize()-1);
for (_i = (int)(1); (step186 > 0 && _i <= limit186) || (step186 < 0 && _i >= limit186); _i += step186) {
Debug.locals.put("i", _i);
 BA.debugLineNum = 219;BA.debugLine="point = LD.Points.Get(i)";
Debug.ShouldStop(67108864);
_point = (charts._linepoint)(_ld.Points.Get(_i));Debug.locals.put("point", _point);
 BA.debugLineNum = 220;BA.debugLine="LD.Canvas.DrawLine(G.GI.originX + G.GI.intervalX * (i - 1), calcPointToPixel(py, G) _ 				, G.GI.originX + G.GI.intervalX * i, calcPointToPixel(point.Y, G), LD.LinesColors.Get(0), 2dip)";
Debug.ShouldStop(134217728);
_ld.Canvas.DrawLine((float)(_g.GI.originX+_g.GI.intervalX*(_i-1)),(float)(_calcpointtopixel(_ba,_py,_g)),(float)(_g.GI.originX+_g.GI.intervalX*_i),(float)(_calcpointtopixel(_ba,_point.Y,_g)),(int)(BA.ObjectToNumber(_ld.LinesColors.Get((int)(0)))),(float)(anywheresoftware.b4a.keywords.Common.DipToCurrent((int)(2))));
 BA.debugLineNum = 222;BA.debugLine="py = point.Y";
Debug.ShouldStop(536870912);
_py = _point.Y;Debug.locals.put("py", _py);
 }
}Debug.locals.put("i", _i);
;
 };
 BA.debugLineNum = 225;BA.debugLine="LD.Target.Invalidate";
Debug.ShouldStop(1);
_ld.Target.Invalidate();
 BA.debugLineNum = 226;BA.debugLine="End Sub";
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
public static anywheresoftware.b4a.objects.drawable.CanvasWrapper.BitmapWrapper  _drawpie(anywheresoftware.b4a.BA _ba,charts._piedata _pd,int _backcolor,boolean _createlegendbitmap) throws Exception{
		Debug.PushSubsStack("DrawPie (charts) ","charts",1,_ba,mostCurrent);
try {
int _radius = 0;
int _total = 0;
int _i = 0;
charts._pieitem _it = null;
float _startingangle = 0f;
int _gapdegrees = 0;
Debug.locals.put("ba", _ba);
Debug.locals.put("PD", _pd);
Debug.locals.put("BackColor", _backcolor);
Debug.locals.put("CreateLegendBitmap", _createlegendbitmap);
 BA.debugLineNum = 249;BA.debugLine="Sub DrawPie (PD As PieData, BackColor As Int, CreateLegendBitmap As Boolean) As Bitmap";
Debug.ShouldStop(16777216);
 BA.debugLineNum = 250;BA.debugLine="If PD.Items.Size = 0 Then";
Debug.ShouldStop(33554432);
if (_pd.Items.getSize()==0) { 
 BA.debugLineNum = 251;BA.debugLine="ToastMessageShow(\"Missing pie values.\", True)";
Debug.ShouldStop(67108864);
anywheresoftware.b4a.keywords.Common.ToastMessageShow("Missing pie values.",anywheresoftware.b4a.keywords.Common.True);
 BA.debugLineNum = 252;BA.debugLine="Return";
Debug.ShouldStop(134217728);
if (true) return null;
 };
 BA.debugLineNum = 254;BA.debugLine="PD.Canvas.Initialize(PD.Target)";
Debug.ShouldStop(536870912);
_pd.Canvas.Initialize((android.view.View)(_pd.Target.getObject()));
 BA.debugLineNum = 255;BA.debugLine="PD.Canvas.DrawColor(BackColor)";
Debug.ShouldStop(1073741824);
_pd.Canvas.DrawColor(_backcolor);
 BA.debugLineNum = 256;BA.debugLine="Dim Radius As Int";
Debug.ShouldStop(-2147483648);
_radius = 0;Debug.locals.put("Radius", _radius);
 BA.debugLineNum = 257;BA.debugLine="Radius = Min(PD.Canvas.Bitmap.Width, PD.Canvas.Bitmap.Height) * 0.8 / 2";
Debug.ShouldStop(1);
_radius = (int)(anywheresoftware.b4a.keywords.Common.Min(_pd.Canvas.getBitmap().getWidth(),_pd.Canvas.getBitmap().getHeight())*0.8/(double)2);Debug.locals.put("Radius", _radius);
 BA.debugLineNum = 258;BA.debugLine="Dim total As Int";
Debug.ShouldStop(2);
_total = 0;Debug.locals.put("total", _total);
 BA.debugLineNum = 259;BA.debugLine="For i = 0 To PD.Items.Size - 1";
Debug.ShouldStop(4);
{
final double step221 = 1;
final double limit221 = (int)(_pd.Items.getSize()-1);
for (_i = (int)(0); (step221 > 0 && _i <= limit221) || (step221 < 0 && _i >= limit221); _i += step221) {
Debug.locals.put("i", _i);
 BA.debugLineNum = 260;BA.debugLine="Dim it As PieItem";
Debug.ShouldStop(8);
_it = new charts._pieitem();Debug.locals.put("it", _it);
 BA.debugLineNum = 261;BA.debugLine="it = PD.Items.Get(i)";
Debug.ShouldStop(16);
_it = (charts._pieitem)(_pd.Items.Get(_i));Debug.locals.put("it", _it);
 BA.debugLineNum = 262;BA.debugLine="total = total + it.Value";
Debug.ShouldStop(32);
_total = (int)(_total+_it.Value);Debug.locals.put("total", _total);
 }
}Debug.locals.put("i", _i);
;
 BA.debugLineNum = 264;BA.debugLine="Dim startingAngle As Float";
Debug.ShouldStop(128);
_startingangle = 0f;Debug.locals.put("startingAngle", _startingangle);
 BA.debugLineNum = 265;BA.debugLine="startingAngle = 0";
Debug.ShouldStop(256);
_startingangle = (float)(0);Debug.locals.put("startingAngle", _startingangle);
 BA.debugLineNum = 266;BA.debugLine="Dim GapDegrees As Int";
Debug.ShouldStop(512);
_gapdegrees = 0;Debug.locals.put("GapDegrees", _gapdegrees);
 BA.debugLineNum = 267;BA.debugLine="If PD.Items.Size = 1 Then GapDegrees = 0 Else GapDegrees = PD.GapDegrees";
Debug.ShouldStop(1024);
if (_pd.Items.getSize()==1) { 
_gapdegrees = (int)(0);Debug.locals.put("GapDegrees", _gapdegrees);}
else {
_gapdegrees = _pd.GapDegrees;Debug.locals.put("GapDegrees", _gapdegrees);};
 BA.debugLineNum = 268;BA.debugLine="For i = 0 To PD.Items.Size - 1";
Debug.ShouldStop(2048);
{
final double step230 = 1;
final double limit230 = (int)(_pd.Items.getSize()-1);
for (_i = (int)(0); (step230 > 0 && _i <= limit230) || (step230 < 0 && _i >= limit230); _i += step230) {
Debug.locals.put("i", _i);
 BA.debugLineNum = 269;BA.debugLine="Dim it As PieItem";
Debug.ShouldStop(4096);
_it = new charts._pieitem();Debug.locals.put("it", _it);
 BA.debugLineNum = 270;BA.debugLine="it = PD.Items.Get(i)";
Debug.ShouldStop(8192);
_it = (charts._pieitem)(_pd.Items.Get(_i));Debug.locals.put("it", _it);
 BA.debugLineNum = 271;BA.debugLine="startingAngle = startingAngle + _  			calcSlice(PD.Canvas, Radius, startingAngle, it.Value / total, it.Color, GapDegrees)";
Debug.ShouldStop(16384);
_startingangle = (float)(_startingangle+_calcslice(_ba,_pd.Canvas,_radius,_startingangle,(float)(_it.Value/(double)_total),_it.Color,_gapdegrees));Debug.locals.put("startingAngle", _startingangle);
 }
}Debug.locals.put("i", _i);
;
 BA.debugLineNum = 274;BA.debugLine="PD.Target.Invalidate";
Debug.ShouldStop(131072);
_pd.Target.Invalidate();
 BA.debugLineNum = 275;BA.debugLine="If CreateLegendBitmap Then";
Debug.ShouldStop(262144);
if (_createlegendbitmap) { 
 BA.debugLineNum = 276;BA.debugLine="Return createLegend(PD)";
Debug.ShouldStop(524288);
if (true) return _createlegend(_ba,_pd);
 }else {
 BA.debugLineNum = 278;BA.debugLine="Return Null";
Debug.ShouldStop(2097152);
if (true) return (anywheresoftware.b4a.objects.drawable.CanvasWrapper.BitmapWrapper) anywheresoftware.b4a.AbsObjectWrapper.ConvertToWrapper(new anywheresoftware.b4a.objects.drawable.CanvasWrapper.BitmapWrapper(), (android.graphics.Bitmap)(anywheresoftware.b4a.keywords.Common.Null));
 };
 BA.debugLineNum = 280;BA.debugLine="End Sub";
Debug.ShouldStop(8388608);
return null;
}
catch (Exception e) {
			Debug.ErrorCaught(e);
			throw e;
		} 
finally {
			Debug.PopSubsStack();
		}}
public static String  _process_globals() throws Exception{
 //BA.debugLineNum = 2;BA.debugLine="Sub Process_Globals";
 //BA.debugLineNum = 4;BA.debugLine="Type PieItem (Name As String, Value As Float, Color As Int)";
;
 //BA.debugLineNum = 5;BA.debugLine="Type PieData (Items As List, Target As Panel, Canvas As Canvas, GapDegrees As Int, _ 		LegendTextSize As Float, LegendBackColor As Int)";
;
 //BA.debugLineNum = 8;BA.debugLine="Type GraphInternal (originX As Int, zeroY As Int, originY As Int, maxY As Int, intervalX As Float, gw As Int, gh As Int)";
;
 //BA.debugLineNum = 9;BA.debugLine="Type Graph (GI As GraphInternal, Title As String, YAxis As String, XAxis As String, YStart As Float, _  		YEnd As Float, YInterval As Float, AxisColor As Int)";
;
 //BA.debugLineNum = 11;BA.debugLine="Type LinePoint (X As String, Y As Float, YArray() As Float, ShowTick As Boolean)";
;
 //BA.debugLineNum = 12;BA.debugLine="Type LineData (Points As List, LinesColors As List, Target As Panel, Canvas As Canvas)";
;
 //BA.debugLineNum = 13;BA.debugLine="Type BarData (Points As List, BarsColors As List, Target As Panel, Canvas As Canvas, Stacked As Boolean, BarsWidth As Int)";
;
 //BA.debugLineNum = 14;BA.debugLine="End Sub";
return "";
}
  public Object[] GetGlobals() {
		return new Object[] {"Main",Debug.moduleToString(b4a.piechartdemo.main.class)};
}
}
