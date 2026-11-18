package bd.sohel.munajat;

import android.Manifest;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import java.io.PrintWriter;
import java.io.StringWriter;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    private static final String PREF = "munajat_diag";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Remember the last native crash so the page can show it in the ⓘ log after restart.
        final Thread.UncaughtExceptionHandler prev = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler((t, e) -> {
            try {
                StringWriter sw = new StringWriter();
                e.printStackTrace(new PrintWriter(sw));
                getSharedPreferences(PREF, MODE_PRIVATE).edit().putString("crash", sw.toString()).commit();
            } catch (Throwable ignored) { }
            if (prev != null) prev.uncaughtException(t, e);
        });
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= 33
                && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[] { Manifest.permission.POST_NOTIFICATIONS }, 7);
        }
        new Handler(Looper.getMainLooper()).postDelayed(this::reportCrash, 3000);
    }

    private void reportCrash() {
        try {
            SharedPreferences p = getSharedPreferences(PREF, MODE_PRIVATE);
            String c = p.getString("crash", null);
            if (c == null) return;
            p.edit().remove("crash").apply();
            WebView w = getBridge().getWebView();
            if (w != null) w.evaluateJavascript("window.__nc=" + JSONObject.quote(c) + ";", null);
        } catch (Throwable e) { Log.w("Munajat", "reportCrash", e); }
    }
}
