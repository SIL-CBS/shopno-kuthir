package bd.sohel.munajat;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= 33
                && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[] { Manifest.permission.POST_NOTIFICATIONS }, 7);
        }
    }

    // Keep the WebView (audio + timers) running when the screen locks or the app goes to the background.
    private void keepAlive() {
        try {
            WebView w = getBridge().getWebView();
            if (w != null) { w.onResume(); w.resumeTimers(); }
        } catch (Exception ignored) { }
    }

    @Override
    public void onPause() { super.onPause(); keepAlive(); }

    @Override
    public void onStop() { super.onStop(); keepAlive(); }
}
