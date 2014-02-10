package fahd.play.photo;

import java.util.ArrayList;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
 
public class PhotoAdapter extends BaseAdapter {
    private ArrayList<Photo> list;
    private LayoutInflater mInflater;
 
    public PhotoAdapter(Context context, ArrayList<Photo> list) {
        this.list = list;
        this.mInflater = LayoutInflater.from(context);
    }
 
    @Override
    public int getCount() {
        return list.size();
    }
 
    @Override
    public Object getItem(int position) {
        return list.get(position);
    }
 
    @Override
    public long getItemId(int position) {
        return position;
    }
 
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder;
        if (convertView == null) {
            convertView = mInflater.inflate(R.layout.row_photo, null);
            holder = new ViewHolder();
            holder.iv1 = (ImageView) convertView.findViewById(R.id.iv1);
            holder.iv2 = (ImageView) convertView.findViewById(R.id.iv2);
            holder.iv3 = (ImageView) convertView.findViewById(R.id.iv3);
            holder.iv4 = (ImageView) convertView.findViewById(R.id.iv4);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }
        holder.iv1.setImageResource(list.get(position).getIv1());
        holder.iv2.setImageResource(list.get(position).getIv2());
        holder.iv3.setImageResource(list.get(position).getIv3());
        holder.iv4.setImageResource(list.get(position).getIv4());
        return convertView;
    }
 
    private static class ViewHolder {
        private ImageView iv1, iv2, iv3, iv4;
    }
}