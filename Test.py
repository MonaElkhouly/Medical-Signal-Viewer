import wfdb
import matplotlib.pyplot as plt
import numpy as np

# Full path to the record (no pn_dir)
record_path = r"M:\Dataset\mit-bih-arrhythmia-database-1.0.0\100"

# Load record
record = wfdb.rdrecord(record_path)

# First channel
signal = record.p_signal[:, 0]
fs = record.fs

print("Sampling rate:", fs)
print("Signal shape:", signal.shape)

# Plot first 10 seconds
t = np.arange(len(signal)) / fs
plt.figure(figsize=(10,4))
plt.plot(t[:10*fs], signal[:10*fs])
plt.xlabel("Time (s)")
plt.ylabel("Amplitude (mV)")
plt.title("Raw ECG - Record 100")
plt.show()
