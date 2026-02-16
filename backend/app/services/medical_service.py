import pandas as pd
from pathlib import Path
import math
import numpy as np
from typing import List, Optional

UPLOAD_FOLDER = Path(__file__).parent.parent / "uploads"

def load_signal(filename: str):
    file_path = UPLOAD_FOLDER / filename
    if not file_path.exists():
        raise FileNotFoundError(f"{filename} not found")
    df = pd.read_csv(file_path)
    return df

def get_metadata(filename: str):
    df = load_signal(filename)
    num_channels = df.shape[1]
    length = df.shape[0]
    return {"num_channels": num_channels, "length": length}

def get_slice(filename: str, start_row: int, end_row: int):
    df = load_signal(filename)
    return df.iloc[start_row:end_row].to_dict(orient="list")

def get_channels(filename: str):
    df = load_signal(filename)
    channels = [{"name": col, "color": "#000000", "thickness": 1} for col in df.columns]
    return channels

def get_time_slice(
    filename: str,
    start_time: float,
    window: float,
    sampling_rate: float,
    channels: list[int] | None = None
):
    df = load_signal(filename)

    start_row = int(start_time * sampling_rate)
    end_row = int((start_time + window) * sampling_rate)

    start_row = max(0, start_row)
    end_row = min(len(df), end_row)

    slice_df = df.iloc[start_row:end_row]

    if channels is not None:
        slice_df = slice_df.iloc[:, channels]

    return {
        "start_time": start_time,
        "window": window,
        "data": slice_df.to_dict(orient="list")
    }



def xor_chunks(filename: str, viewer_time: float, sampling_rate: float):
    """
    Divide signal into time chunks and compute XOR overlay.
    Returns number of chunks and normalized XOR overlay.
    """

    import math
    import numpy as np

    df = load_signal(filename)

    if viewer_time <= 0:
        raise ValueError("viewer_time must be positive")

    if sampling_rate <= 0:
        raise ValueError("sampling_rate must be positive")

    num_rows = df.shape[0]
    num_channels = df.shape[1]

    chunk_size = int(viewer_time * sampling_rate)

    if chunk_size <= 0:
        raise ValueError("Chunk size is zero. Check viewer_time and sampling_rate.")

    num_chunks = math.ceil(num_rows / chunk_size)

    # Convert to integer array once
    data = df.to_numpy()

    # If your signals are float → convert safely
    # This preserves relative shape better than raw astype(int)
    data_int = np.round(data).astype(np.int64)

    # Initialize overlay with zeros (safer than first chunk)
    xor_overlay = np.zeros((chunk_size, num_channels), dtype=np.int64)

    for i in range(num_chunks):
        start = i * chunk_size
        end = min(start + chunk_size, num_rows)

        current_chunk = data_int[start:end]

        # Pad last chunk if shorter
        if current_chunk.shape[0] < chunk_size:
            padded = np.zeros((chunk_size, num_channels), dtype=np.int64)
            padded[:current_chunk.shape[0]] = current_chunk
            current_chunk = padded

        xor_overlay = np.bitwise_xor(xor_overlay, current_chunk)

    # -----------------------------
    # Safe normalization to [-1, 1]
    # -----------------------------
    xor_array = xor_overlay.astype(np.float64)

    min_vals = xor_array.min(axis=0)
    max_vals = xor_array.max(axis=0)

    range_vals = max_vals - min_vals

    # Prevent division by zero
    range_vals[range_vals == 0] = 1.0

    normalized = (xor_array - min_vals) / range_vals
    normalized = normalized * 2 - 1  # scale to [-1, 1]

    # -----------------------------

    return {
        "num_chunks": num_chunks,
        "chunk_size_rows": chunk_size,
        "xor_overlay": normalized.tolist()
    }

def polar_signal(
    filename: str,
    viewer_time: float,
    sampling_rate: float,
    cumulative: bool = False,
    channels: Optional[List[int]] = None
):
    """
    Prepare data for a polar graph of the signal.

    Args:
        filename: CSV signal file
        viewer_time: time window length in seconds
        sampling_rate: Hz, samples per second
        cumulative: if True, show cumulative plot
        channels: list of channel indices to include
    Returns:
        dict with keys:
            - 'r': list of magnitudes per channel
            - 'theta': list of time points (seconds)
            - 'channels': list of channel names
    """
    df = load_signal(filename)
    if channels is not None:
        df = df.iloc[:, channels]

    num_rows = df.shape[0]

    if cumulative:
        theta = np.arange(num_rows) / sampling_rate
        r = df.to_numpy()
    else:
        chunk_size = int(viewer_time * sampling_rate)
        start_row = max(0, num_rows - chunk_size)
        theta = np.arange(start_row, num_rows) / sampling_rate
        r = df.iloc[start_row:num_rows].to_numpy()

    return {
        "r": r.tolist(),
        "theta": theta.tolist(),
        "channels": df.columns.tolist()
    }


def recurrence_graph(
    filename: str,
    chX: int,
    chY: int,
    viewer_time: Optional[float] = None,
    sampling_rate: Optional[float] = None
):
    """
    Prepare data for a recurrence/correlation scatter plot between two channels.

    Args:
        filename: CSV signal file
        chX: index of the X channel
        chY: index of the Y channel
        viewer_time: optional time window (seconds) for latest data
        sampling_rate: required if viewer_time is used

    Returns:
        dict with keys:
            - 'x': list of values from channel X
            - 'y': list of values from channel Y
            - 'chX': name of channel X
            - 'chY': name of channel Y
    """
    df = load_signal(filename)
    num_rows = df.shape[0]
    num_channels = df.shape[1]

    if chX >= num_channels or chY >= num_channels:
        raise ValueError(f"Channel indices out of range: {chX}, {chY}")

    # Apply window if requested
    if viewer_time is not None and sampling_rate is not None:
        chunk_size = int(viewer_time * sampling_rate)
        start_row = max(0, num_rows - chunk_size)
        df = df.iloc[start_row:num_rows]

    x = df.iloc[:, chX].to_numpy()
    y = df.iloc[:, chY].to_numpy()

    return {
        "x": x.tolist(),
        "y": y.tolist(),
        "chX": df.columns[chX],
        "chY": df.columns[chY]
    }




