The boot sequence differs on the Neato D8 (and presumably D9 / D10).

Shutdown sequence:

Neato LEGO Distro Release 1.7.0-2933_10060147_cfae4f98 Neato-Robot ttymxc1

Neato-Robot login: [[1B][0;32m  OK  [1B][0m] Removed slice [1B][0;1;39msystem-getty.slice[1B][0m.[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mBluetooth[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mMulti-User System[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mLogin Prompts[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mHost and Network Name Lookups[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mSound Card[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mSystem Time Synchronized[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mSystem Time Set[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mTimers[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mDaily Cleanup of Temporary Directories[1B][0m.
[[1B][0;32m  OK  [1B][0m] Closed [1B][0;1;39mLoad/Save RF Kill Switch Status /dev/rfkill Watch[1B][0m.
         Stopping [1B][0;1;39mSave/Restore Sound Card State[1B][0m...
         Stopping [1B][0;1;39mAuto-update Service[1B][0m...
         Stopping [1B][0;1;39mD-Bus System Message Bus[1B][0m...
         Stopping [1B][0;1;39mCheck and fix Bluetooth function periodically[1B][0m...
         Stopping [1B][0;1;39mFlush file cache[1B][0m...
         Stopping [1B][0;1;39mPython OTA Upgrade Service[1B][0m...
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mPlay 1 second silence file[1B][0m.
         Stopping [1B][0;1;39mR         Stopping [1B][0;1;39mSerial Getty on ttymxc1[1B][0m...
         Stopping [1B][0;1;39mLogin Service[1B][0m...
         Stopping [1B][0;1;39mLoad/Save Random Seed[1B][0m...
         Stopping [1B][0;1;39mTEE Supplicant[1B][0m...
         Stopping [1B][0;1;39mUSB gadgets[1B][0m...
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mAuto-update Service[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mD-Bus System Message Bus[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mTEE Supplicant[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mFlush file cache[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mLogin Service[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mCheck and fix Bluetooth function periodically[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mUSB gadgets[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mTron Connectivity[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mSerial Getty on ttymxc1[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mSave/Restore Sound Card State[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mLoad/Save Random Seed[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mBluetooth service[1B][0m.
[[1B][0;32m  OK  [1B][0m] Removed slice [1B][0;1;39msystem-serial\x2dgetty.slice[1B][0m.
         Stopping [1B][0;1;39mPython User Event Scheduler Service[1B][0m...
         Stopping [1B][0;1;39mPermit User Sessions[1B][0m...
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mPython User Event Scheduler Service[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mPython OTA Upgrade Service[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mPermit User Sessions[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mNetwork[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mRemote File Systems[1B][0m.
         Stopping [1B][0;1;39mBattery and Charger Control Service[1B][0m...
         Stopping [1B][0;1;39mNetwork Name Resolution[1B][0m...
[00][00]NOTICE:  BL31: v2.2(release):rel_imx_5.4.47_2.2.0-0-gc949a888e-dirty
NOTICE:  BL31: Built : 08:42:51, Nov  3 2021


Boot Sequence:

Welcome to [1B][1mNXP i.MX Release Distro 5.4-zeus (zeus)[1B][0m!

[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mDispatch Password …ts to Console Directory Watch[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mPaths[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSlices[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSwap[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mProcess Core Dump Socket[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39minitctl Compatibility Named Pipe[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mJournal Socket (/dev/log)[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mJournal Socket[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mNetwork Service Netlink Socket[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mudev Control Socket[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mudev Kernel Socket[1B][0m.
         Mounting [1B][0;1;39mHuge Pages File System[1B][0m...
         Mounting [1B][0;1;39mPOSIX Message Queue File System[1B][0m...
         Mounting [1B][0;1;39mKernel Debug File System[1B][0m...
         Mounting [1B][0;1;39mTemporary Directory (/tmp)[1B][0m...
         Mounting [1B][0;1;39m/var/volatile[1B][0m...
         Starting [1B][0;1;39mJournal Service[1B][0m...
         Mounting [1B][0;1;39mKernel Configuration File System[1B][0m...
         Starting [1B][0;1;39mApply Kernel Variables[1B][0m...
         Starting [1B][0;1;39mCreate Static Device Nodes in /dev[1B][0m...
         Starting [1B][0;1;39mudev Coldplug all Devices[1B][0m...
         Starting [1B][0;1;39mUnlock encrypted root filesystem[1B][0m...
[[1B][0;32m  OK  [1B][0m] Mounted [1B][0;1;39mHuge Pages File System[1B][0m.
[[1B][0;32m  OK  [1B][0m] Mounted [1B][0;1;39mPOSIX Message Queue File System[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mJournal Service[1B][0m.
[[1B][0;32m  OK  [1B][0m] Mounted [1B][0;1;39mKernel Debug File System[1B][0m.
[[1B][0;32m  OK  [1B][0m] Mounted [1B][0;1;39mTemporary Directory (/tmp)[1B][0m.
[[1B][0;32m  OK  [1B][0m] Mounted [1B][0;1;39m/var/volatile[1B][0m.
[[1B][0;32m  OK  [1B][0m] Mounted [1B][0;1;39mKernel Configuration File System[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mApply Kernel Variables[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mCreate Static Device Nodes in /dev[1B][0m.
         Starting [1B][0;1;39mudev Kernel Device Manager[1B][0m...
         Starting [1B][0;1;39mLoad/Save Random Seed[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mudev Kernel Device Manager[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mUnlock encrypted root filesystem[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mInitrd Root Device[1B][0m.
[[1B][0;32m  OK  [1B][0m] Found device [1B][0;1;39m/dev/mapper/encrypted[1B][0m.
         Mounting [1B][0;1;39mMount encrypted root filesystem[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mudev Coldplug all Devices[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mLoad/Save Random Seed[1B][0m.
[[1B][0;32m  OK  [1B][0m] Mounted [1B][0;1;39mMount encrypted root filesystem[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mInitrd Root File System[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mLocal File Systems[1B][0m.
         Starting [1B][0;1;39mReload Configuration from the Real Root[1B][0m...
         Starting [1B][0;1;39mCreate Volatile Files and Directories[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mCreate Volatile Files and Directories[1B][0m.
         Starting [1B][0;1;39mRun pending postinsts[1B][0m...
         Starting [1B][0;1;39mNetwork Time Synchronization[1B][0m...
         Starting [1B][0;1;39mUpdate UTMP about System Boot/Shutdown[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mUpdate UTMP about System Boot/Shutdown[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mReload Configuration from the Real Root[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mRun pending postinsts[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mInitrd File Systems[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mNetwork Time Synchronization[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSystem Initialization[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mDaily Cleanup of Temporary Directories[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSystem Time Set[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSystem Time Synchronized[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mTimers[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mD-Bus System Message Bus Socket[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSockets[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mBasic System[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mInitrd Default Target[1B][0m.
         Starting [1B][0;1;39mCleaning Up and Shutting Down Daemons[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mCleaning Up and Shutting Down Daemons[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mInitrd Default Target[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mInitrd Root Device[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mSystem Time Synchronized[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mSystem Time Set[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mTimers[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mDaily Cleanup of Temporary Directories[1B][0m.
[[1B][0;32m  OK  [1B][0m] Closed [1B][0;1;39mProcess Core Dump Socket[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mBasic System[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mPaths[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mDispatch Password …ts to Console Directory Watch[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mSlices[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mSockets[1B][0m.
[[1B][0;32m  OK  [1B][0m] Closed [1B][0;1;39mD-Bus System Message Bus Socket[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mSystem Initialization[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mSwap[1B][0m.
[[1B][0;32m  OK  [1B][0m] Closed [1B][0;1;39minitctl Compatibility Named Pipe[1B][0m.
[[1B][0;32m  OK  [1B][0m] Closed [1B][0;1;39mNetwork Service Netlink Socket[1B][0m.
         Stopping [1B][0;1;39mLoad/Save Random Seed[1B][0m...
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mApply Kernel Variables[1B][0m.
         Stopping [1B][0;1;39mNetwork Time Synchronization[1B][0m...
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mudev Coldplug all Devices[1B][0m.
         Stopping [1B][0;1;39mudev Kernel Device Manager[1B][0m...
         Stopping [1B][0;1;39mUpdate UTMP about System Boot/Shutdown[1B][0m...
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mNetwork Time Synchronization[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mLoad/Save Random Seed[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mudev Kernel Device Manager[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mUpdate UTMP about System Boot/Shutdown[1B][0m.
[[1B][0;32m  OK  [1B][0m] Closed [1B][0;1;39mudev Control Socket[1B][0m.
[[1B][0;32m  OK  [1B][0m] Closed [1B][0;1;39mudev Kernel Socket[1B][0m.
         Starting [1B][0;1;39mCleanup udevd DB[1B][0m...
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mCreate Static Device Nodes in /dev[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mCreate Volatile Files and Directories[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mLocal File Systems[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mCleanup udevd DB[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSwitch Root[1B][0m.
         Starting [1B][0;1;39mSwitch Root[1B][0m...

Welcome to [1B][1mNXP i.MX Release Distro 5.4-zeus (zeus)[1B][0m!

[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mSwitch Root[1B][0m.
[[1B][0;32m  OK  [1B][0m] Created slice [1B][0;1;39msystem-getty.slice[1B][0m.
[[1B][0;32m  OK  [1B][0m] Created slice [1B][0;1;39msystem-serial\x2dgetty.slice[1B][0m.
[[1B][0;32m  OK  [1B][0m] Created slice [1B][0;1;39msystem-systemd\x2dfsck.slice[1B][0m.
[[1B][0;32m  OK  [1B][0m] Created slice [1B][0;1;39msystem-wpa_supplicant.slice[1B][0m.
[[1B][0;32m  OK  [1B][0m] Created slice [1B][0;1;39mUser and Session Slice[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mDispatch Password …ts to Console Directory Watch[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mForward Password R…uests to Wall Directory Watch[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mSwitch Root[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mInitrd File Systems[1B][0m.
[[1B][0;32m  OK  [1B][0m] Stopped target [1B][0;1;39mInitrd Root File System[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mPaths[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mRemote File Systems[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSlices[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSwap[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mProcess Core Dump Socket[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39minitctl Compatibility Named Pipe[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mNetwork Service Netlink Socket[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mudev Control Socket[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mudev Kernel Socket[1B][0m.
         Starting [1B][0;1;39mCreate list of st…odes for the current kernel[1B][0m...
[[1B][0;32m  OK  [1B][0m] Stopped [1B][0;1;39mJournal Service[1B][0m.
         Starting [1B][0;1;39mJournal Service[1B][0m...
         Starting [1B][0;1;39mLoad Kernel Modules[1B][0m...
         Starting [1B][0;1;39mRemount Root and Kernel File Systems[1B][0m...
         Starting [1B][0;1;39mudev Coldplug all Devices[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mCreate list of sta… nodes for the current kernel[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mJournal Service[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mRemount Root and Kernel File Systems[1B][0m.
         Starting [1B][0;1;39mLoad/Save Random Seed[1B][0m...
         Starting [1B][0;1;39mCreate Static Device Nodes in /dev[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mLoad/Save Random Seed[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mCreate Static Device Nodes in /dev[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mLocal File Systems (Pre)[1B][0m.
         Starting [1B][0;1;39mFile System Check on /dev/mmcblk2p5[1B][0m...
         Starting [1B][0;1;39mudev Kernel Device Manager[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mudev Kernel Device Manager[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mFile System Check on /dev/mmcblk2p5[1B][0m.
         Mounting [1B][0;1;39m/user[1B][0m...
[[1B][0;32m  OK  [1B][0m] Mounted [1B][0;1;39m/user[1B][0m.
[   12.855894] 000: hifDeviceInserted: Dumping clocks (50000000,400000000)
         Mounting [1B][0;1;39m/var/log[1B][0m...
[[1B][0;32m  OK  [1B][0m] Mounted [1B][0;1;39m/var/log[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mLocal File Systems[1B][0m.
         Starting [1B][0;1;39mFlush Journal to Persistent Storage[1B][0m...
[   13.102802] 000: ol_download_firmware: chip_id:0x5020001 board_id:0x0
[   13.124915] 000: __ol_transfer_bin_file: Failed to get :-22
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mudev Coldplug all Devices[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mFlush Journal to Persistent Storage[1B][0m.
[   13.998755] 000: ENTER sme_set_btc_coex_dutycycle = 30
         Starting [1B][0;1;39mCreate Volatile Files and Directories[1B][0m...[   13.998759] 000: ENTER sme_set_btc_coex_dutycycle =30

[   14.106682] 000: debugfs: Directory '30050000.sai' with parent 'tfa9896-audio' already present!
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mLoad Kernel Modules[1B][0m.
         Starting [1B][0;1;39mApply Kernel Variables[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mApply Kernel Variables[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mCreate Volatile Files and Directories[1B][0m.
         Starting [1B][0;1;39mNetwork Service[1B][0m...
         Starting [1B][0;1;39mNetwork Time Synchronization[1B][0m...
         Starting [1B][0;1;39mUpdate UTMP about System Boot/Shutdown[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mUpdate UTMP about System Boot/Shutdown[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mNetwork Service[1B][0m.
         Starting [1B][0;1;39mNetwork Name Resolution[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mNetwork Time Synchronization[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSystem Initialization[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mDaily Cleanup of Temporary Directories[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSystem Time Set[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSystem Time Synchronized[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mTimers[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mD-Bus System Message Bus Socket[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSockets[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mBasic System[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mAuto-update Service[1B][0m.
         Starting [1B][0;1;39mBluetooth service[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mD-Bus System Message Bus[1B][0m.
         Starting [1B][0;1;39mFlush file cache[1B][0m...
         Starting [1B][0;1;39mPlay 1 second silence file[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mUser Space Regulatory Firmware Loading[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mUser Space SDMA Firmware Loading[1B][0m.
         Starting [1B][0;1;39mLogin Service[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mTEE Supplicant[1B][0m.
         Starting [1B][0;1;39mSW upgrade service[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mNetwork Name Resolution[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mFlush file cache[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mPlay 1 second silence file[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mHost and Network Name Lookups[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mSW upgrade service[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mMCU SPI Communication Service[1B][0m.
         Starting [1B][0;1;39mDatabase Files Setup Service[1B][0m...
         Starting [1B][0;1;39mSetup dev permission[1B][0m...
         Starting [1B][0;1;39mSet host name[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mLogin Service[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mSet host name[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mBluetooth service[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mCheck and fix Bluetooth function periodically[1B][0m.
         Mounting [1B][0;1;39mTemporary Directory (/tmp)[1B][0m...
[[1B][0;32m  OK  [1B][0m] Mounted [1B][0;1;39mTemporary Directory (/tmp)[1B][0m.
         Starting [1B][0;1;39mHostname Service[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mHostname Service[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mSetup dev permission[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mLDS Driver Service[1B][0m.
[[1B][0;32m  OK  [1B][0m] Listening on [1B][0;1;39mLoad/Save RF …itch Status /dev/rfkill Watch[1B][0m.
         Starting [1B][0;1;39mLoad/Save RF Kill Switch Status[1B][0m...
         Starting [1B][0;1;39mSave/Restore Sound Card State[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mLoad/Save RF Kill Switch Status[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mBluetooth[1B][0m.
[   26.805560] 000: tfa98xx_set_volume(): tfa98xx_set_volume
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mSave/Restore Sound Card State[1B][0m.
[[1B][0;32m  OK  [1B][0m] Found device [1B][0;1;39m/sys/subsystem/net/devices/wlan0[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mSound Card[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mWPA supplicant dae… (interface-specific version)[1B][0m.
[[1B][0;32m  OK  [1B][0m] Reached target [1B][0;1;39mNetwork[1B][0m.
         Starting [1B][0;1;39mPermit User Sessions[1B][0m...
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mPermit User Sessions[1B][0m.
[[1B][0;32m  OK  [1B][0m] Started [1B][0;1;39mSerial Getty on ttymxc1[1B][0m.
         Starting [1B][0;1;39mUSB gadgets[1B][0m...
[   28.030253] 000: tfa98xx_set_volume(): tfa98xx_set_volume


Neato LEGO Distro Release 1.7.0-2933_10060147_cfae4f98 Neato-Robot ttymxc1

Neato-Robot login: 
