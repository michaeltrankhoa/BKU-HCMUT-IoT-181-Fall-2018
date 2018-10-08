package com.galarzaa.androidthings.samples;

import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.galarzaa.androidthings.Rc522;
import com.galarzaa.androidthings.samples.MVVM.View.NPNHomeView;
import com.google.android.things.pio.Gpio;
import com.google.android.things.pio.PeripheralManager;
import com.google.android.things.pio.SpiDevice;

import java.io.IOException;

import com.galarzaa.androidthings.samples.MVVM.VM.NPNHomeViewModel;

public class MainActivity extends AppCompatActivity implements NPNHomeView {
    private static final String SPI_PORT = "SPI0.0";
    private static final String PIN_RESET = "BCM25";
    static int countR = 0;
    static int countG = 0;
    RfidTask mRfidTask;
    String resultsText = "";
    PeripheralManager pioService = PeripheralManager.getInstance();
    private String[] uidList = {"241-153-204-115-215", "86-190-249-31-14"};
    private Rc522 mRc522;
    private TextView mTagDetectedView;
    private TextView mTagUidView;
    private TextView mTagResultsView;
    private Button button;
    private SpiDevice spiDevice;
    private Gpio gpioReset;
    private Handler mHandler;
    private Gpio mLedGpioR;
    private boolean mLedStateR = true;
    private Gpio mLedGpioG;
    private boolean mLedStateG = true;

    private Runnable mBlinkRunnableR = new Runnable() {
        @Override
        public void run() {
            if (countR < 10) {
                try {
                    BlinkLED();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                countR++;
                mHandler.postDelayed(mBlinkRunnableR, 200);
            } else {
                countR = 0;
                mHandler.removeCallbacksAndMessages(null);
            }
        }
    };

    private Runnable mBlinkRunnableG = new Runnable() {
        @Override
        public void run() {
            if (countG < 2) {
                try {
                    mLedStateG = !mLedStateG;
                    mLedGpioG.setValue(mLedStateG);
                    Log.d("Green - ", mLedStateG + "");
                } catch (IOException e) {
                    e.printStackTrace();
                }
                countG++;
                mHandler.postDelayed(mBlinkRunnableG, 500);
            } else {
                countG = 0;
                mHandler.removeCallbacksAndMessages(null);
            }
        }
    };

    private void newRfidTask() {
        mRfidTask = new RfidTask(mRc522);
        mRfidTask.execute();
    }

    NPNHomeViewModel mHomeViewModel; //Request server object

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mTagDetectedView = (TextView) findViewById(R.id.tag_read);
        mTagUidView = (TextView) findViewById(R.id.tag_uid);
        mTagResultsView = (TextView) findViewById(R.id.tag_results);
        mHandler = new Handler();
        button = findViewById(R.id.button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                newRfidTask();
            }
        });

        mHomeViewModel = new NPNHomeViewModel();
        mHomeViewModel.attach(this, this);

        try {
            spiDevice = pioService.openSpiDevice(SPI_PORT);
            mLedGpioG = pioService.openGpio("BCM19");
            mLedGpioR = pioService.openGpio("BCM26");
            mLedGpioR.setDirection(Gpio.DIRECTION_OUT_INITIALLY_HIGH);
            mLedGpioG.setDirection(Gpio.DIRECTION_OUT_INITIALLY_HIGH);

            gpioReset = pioService.openGpio(PIN_RESET);
            mRc522 = new Rc522(spiDevice, gpioReset);
            mRc522.setDebugging(true);
            newRfidTask();
        } catch (IOException e) {
            Toast.makeText(this, e.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        try {
            if (spiDevice != null) {
                spiDevice.close();
            }
            if (gpioReset != null) {
                gpioReset.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    void BlinkLED() throws IOException {
        mLedStateR = !mLedStateR;
        mLedGpioR.setValue(mLedStateR);
        Log.d("Red - ", mLedStateR + "");
    }

    private class RfidTask extends AsyncTask<Object, Object, Boolean> {
        private static final String TAG = "RfidTask";
        private Rc522 rc522;

        RfidTask(Rc522 rc522) {
            this.rc522 = rc522;
        }

        @Override
        protected void onPreExecute() {
            button.setEnabled(false);

        }

        @Override
        protected Boolean doInBackground(Object... params) {
            rc522.stopCrypto();
            while (true) {
                try {
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    return null;
                }
                //Check if a RFID tag has been found
                if (!rc522.request()) {
                    continue;
                }
                //Check for collision errors
                if (!rc522.antiCollisionDetect()) {
                    continue;
                }
                byte[] uuid = rc522.getUid();
                return rc522.selectTag(uuid);
            }
        }

        @Override
        protected void onPostExecute(Boolean success) {
            if (!success) {
                mTagResultsView.setText(R.string.unknown_error);
                return;
            }
            // Try to avoid doing any non RC522 operations until you're done communicating with it.
            byte address0 = Rc522.getBlockAddress(2, 0);
            byte address1 = Rc522.getBlockAddress(2, 1);
            byte address2 = Rc522.getBlockAddress(2, 2);
            // Mifare's card default key A and key B, the key may have been changed previously
            byte[] key = {(byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF};
            // Each sector holds 16 bytes
            // Data that will be written to sector 2, block 0
            // Data that will be written to sector 2, block 1
            // Data that will be written to sector 2, block 2
            //byte[] name = {'K', 'H', 'O', 'A', ' ', 'T', 'R', 'A', 'N', 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
            //byte[] dob = {'2', '5', '-', 'S', 'E', 'P', '.', '-', '1', '9', '9', '7', 0x00, 0x00, 0x00, 0x00};
            //byte[] id = {'1', '5', '5', '2', '1', '7', '5', 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
            byte[] name = {'M', 'I', 'C', 'H', 'A', 'E', 'L', ' ', 'D', 'A', 'N', 'G', 0x00, 0x00, 0x00, 0x00};
            byte[] dob = {'2', '8', '-', 'M', 'A', 'R', '.', '-', '1', '9', '9', '7', 0x00, 0x00, 0x00, 0x00};
            byte[] id = {'1', '5', '5', '2', '4', '0', '6', 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
            // In this case, Rc522.AUTH_A or Rc522.AUTH_B can be used
            try {
                // We need to authenticate the card, each sector can have a different key
                boolean result0 = rc522.authenticateCard(Rc522.AUTH_A, address0, key);
                boolean result1, result2;
                if (!result0) {
                    mTagResultsView.setText(R.string.authetication_error);
                    return;
                }
//                result0 = rc522.writeBlock(address0, name);
//                result1 = rc522.writeBlock(address1, dob);
//                result2 = rc522.writeBlock(address2, id);
//                if ((!result0) && (!result1) && (!result2)) {
//                    mTagResultsView.setText(R.string.write_error);
//                    return;
//                }
//                resultsText += "Sector written successfully";
                byte[] buffer0 = new byte[16];
                byte[] buffer1 = new byte[16];
                byte[] buffer2 = new byte[16];
                // Since we're still using the same block, we don't need to authenticate again
                result0 = rc522.readBlock(address0, buffer0);
                result1 = rc522.readBlock(address1, buffer1);
                result2 = rc522.readBlock(address2, buffer2);

                if ((!result0) && (!result1) && (!result2)) {
                    mTagResultsView.setText(R.string.read_error);
                    mHandler.post(mBlinkRunnableR);
                    return;
                }
                String uuid = rc522.getUidString();

                boolean flag = false;
                for (String uid : uidList) {
                    if (uid.equals(uuid)) {
                        flag = true;
                        mHandler.post(mBlinkRunnableG);
                        break;
                    }
                }
                if (!flag) {
                    mHandler.post(mBlinkRunnableR);
                }

                resultsText += "Sector read successfully";
                //resultsText += "\nSector read successfully: " + Rc522.dataToHexString(buffer);
                resultsText += "\nName: " + new String(buffer0);
                resultsText += "\nDOB: " + new String(buffer1);
                resultsText += "\nStudent ID: " + new String(buffer2);
                rc522.stopCrypto();
                mTagResultsView.setText(resultsText);

                //Update to server
                String p_uid = String.valueOf(uuid).replaceAll("-", "");
                String url = "http://demo1.chipfc.com/SensorValue/update?sensorid=7&sensorvalue=" + p_uid;

                Log.d("Success - ", "Read UID successful "+ p_uid);
                mHomeViewModel.updateToServer(url);
            } finally {
                //button.setEnabled(true);
                //button.setText(R.string.start);

                mTagResultsView.setVisibility(View.GONE);
                mTagDetectedView.setVisibility(View.GONE);
                mTagUidView.setVisibility(View.GONE);
                resultsText = "";
                mTagUidView.setText(getString(R.string.tag_uid, rc522.getUidString()));
                mTagResultsView.setVisibility(View.VISIBLE);
                mTagDetectedView.setVisibility(View.VISIBLE);
                mTagUidView.setVisibility(View.VISIBLE);
                newRfidTask();
            }
        }
    }

    @Override
    public void onSuccessUpdateServer(String message) {
        Log.d("Success - ", "Request server is successful");
    }

    @Override
    public void onErrorUpdateServer(String message) {

        Log.d("Err - ", "Request server is fail");

    }
}
